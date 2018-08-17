import request, { RequestCallback } from 'request';
import { Response, Request, NextFunction } from 'express';

import { SEMPRE_URL } from './env';

interface SempreResult {
  success: boolean;
  query: string;
  tokens: string[];
  lemmatizedTokens: string[];
  posTags: string[];
  nerTags: string[];
  nerValues: string[];
  value: string;
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
export const parseSempreResult = (html: string): SempreResult => {
  const pre = html.match(/<pre>([\S\s]*)<\/pre>/)[1];
  const success = pre.match(/0 candidates/) === null;
  const query = pre.match(/Example:\s(.*)\s{/)[1];
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
    value,
  };
};

/**
 * WRB: why, where, how
 * WDT: what
 * WP: who
 * VBD-AUX: am, are
 * RB: only
 * PRP: it, they
 * UH: hi, hello
 * DT: a, the
 */
const STOP_TOKEN_POS_TAGS = [
  'WRB',
  'WDT',
  'VBD-AUX',
  'WP',
  'PRP',
  'RB',
  'UH',
  'DT',
];

/**
 * Special words that have stop token POS tags but are useful.
 */
const STOP_TOKEN_POS_EXCEPTIONS = [
  'all',
];

/**
 * Special tokens that are always filtered.
 */
const STOP_TOKENS = [
  'please',
];

/**
 * Checks if a token is a stop token and should be removed.
 */
export const isStopToken = (token: string, posTag: string): boolean => {
  if (STOP_TOKENS.indexOf(token) !== -1) {
    return true;
  }
  if (isInjectedToken(token)) {
    // Injected tokens are never stop tokens.
    return false;
  }
  if (STOP_TOKEN_POS_TAGS.indexOf(posTag) === -1) {
    // POS tag is not a stop word's tag.
    return false;
  }
  if (STOP_TOKEN_POS_EXCEPTIONS.indexOf(token) !== -1) {
    return false;
  }
  return true;
};

/**
 * Based on first pass parsing, generates a sanitized query that does not contain stop words.
 */
export const sanitizeQuery = (html: string): string => {
  const result = parseSempreResult(html);
  const tokens: string[] = [];
  result.tokens.forEach((token, index) => {
    if (isStopToken(token, result.posTags[index])) {
      return;
    }
    tokens.push(token);
  });
  return tokens.join(' ');
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
    const sanitizedQuery = sanitizeQuery(sempreRes.body);
    req.body.sanitizedQuery = sanitizedQuery;
    next();
  });
};

/**
 * Uses Sempre to parse the sanitized query.
 */
export const parse = (req: Request, res: Response, next: NextFunction) => {
  console.log('sanitized', req.body.sanitizedQuery);
  res.status(200).end();
};

/**
 * Sends a text query to sempre web server.
 * The query is sanitized as URL before sent.
 */
export const sendQuery = (query: string, callback: RequestCallback) => {
  // Replace all spaces by plus signs, as URL does not accept spaces.
  const urlQuery = query.replace(/\s+/g, '+');
  request.get(`${SEMPRE_URL}?q=${urlQuery}`, callback);
};
