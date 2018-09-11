import request, { RequestCallback } from 'request';
import { Response, Request, NextFunction } from 'express';
import _ from 'lodash';

import { SEMPRE_URL, WUP_URL } from './env';
import { parseQueryValue, QueryValue } from './query-value';
import * as def from './def';

export interface SempreResult {
  success: boolean;
  query: string;
  tokens: string[];
  lemmatizedTokens: string[];
  posTags: string[];
  nerTags: string[];
  nerValues: string[];
  stringValue: string;
  value: QueryValue;
}

/**
 * Injected tokens begin with "r_", e.g. "r_column_1".
 */
const isInjectedToken = (token: string): boolean => {
  return token.match(/^r_/) !== null;
};

/**
 * Parses Sempre parsing result in HTML.
 */
export const parseSempreResult = (html: string): SempreResult | null => {
  const pre = html.match(/<pre>([\S\s]*)<\/pre>/)[1];
  const success = pre.match(/ 0 candidates/) === null;
  const matchedQuery = pre.match(/Example:\s(.*)\s{/);
  if (matchedQuery === null) {
    // Sempre server errored.
    return null;
  }
  const query = matchedQuery[1];
  const example = pre.match(success ? /Example:.*{([\S\s]*)}[\S\s]*Pred features/ : /Example:.*{([\S\s]*)}[\S\s]*/)[1];
  const tokens = example.match(/Tokens: \[(.*)\]\n/)[1].split(', ');
  const lemmatizedTokens = example.match(/Lemmatized tokens: \[(.*)\]\n/)[1].split(', ');
  const posTags = example.match(/POS tags: \[(.*)\]\n/)[1].split(', ');
  const nerTags = example.match(/NER tags: \[(.*)\]\n/)[1].split(', ');
  const nerValues = example.match(/NER values: \[(.*)\]\n/)[1].split(', ');
  const value = success ? pre.match(/Top value[\S\s]*\(string (.*)\)\n/)[1] : '';
  return {
    success,
    query,
    tokens,
    lemmatizedTokens,
    posTags,
    nerTags,
    nerValues,
    stringValue: value,
    value: {},
  };
};

/**
 * Checks if a token is a stop token and should be removed.
 */
export const isStopToken = (token: string, posTag: string): boolean => {
  if (def.STOP_TOKENS.indexOf(token) !== -1) {
    return true;
  }
  if (isInjectedToken(token)) {
    // Injected tokens are never stop tokens.
    return false;
  }
  if (def.STOP_TOKEN_POS_EXCEPTIONS.indexOf(token) !== -1) {
    return false;
  }
  if (def.STOP_TOKEN_POS_TAGS.indexOf(posTag) === -1) {
    // POS tag is not a stop word's tag.
    return false;
  }
  return true;
};

/**
 * Checks if a word is verb. Note that some verbs do not have VB tags.
 */
export const isVerb = (token: string, posTag: string): boolean => {
  if (def.VERB_POS_TAGS.indexOf(posTag) !== -1) {
    return true;
  }
  return def.SPECIAL_VERBS.indexOf(token) !== -1;
};

/**
 * Checks if a token is likely to be a stop noun. A token is a stop noun if
 * - It has a stop noun's POS tag.
 * - It is not an NN verb (special verbs that may be considered verbs).
 */
export const isProbablyStopNoun = (token: string, posTag: string): boolean => {
  return def.STOP_NOUN_POS_TAGS.indexOf(posTag) !== -1 && def.SPECIAL_VERBS.indexOf(token) === -1;
};

/**
 * Based on first pass parsing, generates a sanitized query that does not contain stop words.
 */
export const sanitizeQuery = (html: string): Promise<string> => {
  const result = parseSempreResult(html);
  if (result === null) {
    return Promise.reject('sempre server returns no result');
  }

  const tokens: Array<string | null> = [];
  result.lemmatizedTokens.forEach((token, index) => {
    if (isStopToken(token, result.posTags[index])) {
      tokens.push(null);
      return;
    }
    tokens.push(token);
  });

  return new Promise((resolve, reject) => {
    let asyncCount = 0;
    let hasRequest = false;
    const addRequest = () => {
      asyncCount++;
      hasRequest = true;
    };
    const done = () => {
      if (--asyncCount <= 0) {
        // All http WUP queries are handled. Return the sanitized query by concatenating the remaining tokens.
        resolve(tokens.filter(token => token !== null).join(' '));
      }
    };

    tokens.forEach((token: string | null, index: number) => {
      if (token == null || isInjectedToken(token)) {
        return;
      }
      token = result.lemmatizedTokens[index];
      const posTag = result.posTags[index];

      // If a verb is close to a special word, replace it by special token.
      if (isVerb(token, posTag)) {
        addRequest();
        let verbAsyncCount = 0;
        let maxVerbSimilarity = 0;
        let mostSimilarMarker = '';

        const doneVerb = () => {
          if (--verbAsyncCount === 0) {
            if (mostSimilarMarker !== '') {
              tokens[index] = mostSimilarMarker;
            }
            done();
          }
        };
        _.each(def.SPECIAL_MARKER_VERBS, (verbs: string[], marker: string) => {
          verbAsyncCount++;
          request.get(`${WUP_URL}/${token}/${verbs.join(',')}`, (err, res) => {
            if (err) {
              return reject(err);
            }
            const similarity: { wup: number, lch: number } = JSON.parse(res.body);
            if (similarity.wup >= def.VERB_WUP_THRESHOLD && similarity.wup > maxVerbSimilarity) {
              maxVerbSimilarity = similarity.wup;
              mostSimilarMarker = marker;
            }
            doneVerb();
          });
        });
      }

      // Remove a stop noun if it is not close to any meaningful nouns.
      if (isProbablyStopNoun(token, posTag)) {
        addRequest();
        request.get(`${WUP_URL}/${token}/${def.SPECIAL_NOUNS.join(',')}`, (err, res) => {
          if (err) {
            return reject(err);
          }
          const similarity = JSON.parse(res.body);
          // Verb check may have processed this token. Avoid overwriting. Verb check has higher priority.
          if (similarity.wup < def.STOP_NOUN_WUP_THRESHOLD && tokens[index] === token) {
            tokens[index] = null;
          }
          done();
        });
      }
    });

    if (!hasRequest) {
      done();
    }
  });
};

/**
 * Preprocesses the query to remove stop words and irrelevant tokens.
 */
export const preParse = (req: Request, res: Response, next: NextFunction) => {
  const query = req.body.query;
  if (!query) {
    // Missing query
    res.status(400).send('no query');
    return;
  }
  sendQuery(query, (err, sempreRes) => {
    if (err) {
      next(err);
      return;
    }
    sanitizeQuery(sempreRes.body)
      .then(sanitizedQuery => {
        req.body.sanitizedQuery = sanitizedQuery;
        next();
      })
      .catch((sanitizeErr: string) => res.status(500).send('cannot sanitize query: ' + sanitizeErr));
  });
};

/**
 * Uses Sempre to parse the sanitized query.
 */
export const parse = (req: Request, res: Response, next: NextFunction) => {
  const query = req.body.sanitizedQuery;
  console.log('sanitized query:', query, '/', req.body.query);
  if (typeof query !== 'string') {
    // Fatal unknown error
    res.status(500).send('cannot sanitize query');
    return;
  }
  sendQuery(query, (err, sempreRes) => {
    if (err) {
      next(err);
      return;
    }
    const result = parseSempreResult(sempreRes.body);
    console.log('sempre value:', result.stringValue);
    const value = parseQueryValue(result.stringValue as string);
    // Replace value by parsed JSON
    res.json(_.extend(result, { value }));
  });
};

/**
 * Sends a text query to sempre web server.
 * The query is sanitized as URL before sent.
 * [Note] Be careful that sempre server is single threaded. If multiple requests are sent concurrently it will break!
 */
export const sendQuery = (query: string, callback: RequestCallback) => {
  // Replace all spaces by plus signs, as URL does not accept spaces.
  const urlQuery = query.replace(/\s+/g, '+');
  request.get(`${SEMPRE_URL}?q=${urlQuery}`, callback);
};
