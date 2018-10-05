import { Response, Request, NextFunction } from 'express';
import _ from 'lodash';
import fs from 'fs';

import { allTemplates } from './template';
import { sendQuery, parseSempreResult, SempreResult } from './parser';

const MAX_SUGGESTIONS = 10;

/**
 * Checks if a POS tag is not allowed to appear consecutively.
 */
const isNonConsecutivePos = (tag: string | undefined): boolean => {
  if (tag === undefined) {
    return false;
  }
  if (tag === 'IN' || tag === 'TO') {
    return true;
  }
  return false;
};

/**
 * Checks if a parsed sentence is grammatically valid.
 * As there is no precise grammar check, we only scan for a few obvious errors.
 */
const isProbablyValid = (result: SempreResult): boolean => {
  let isValid = true;
  result.posTags.forEach((tag, index) => {
    if (isNonConsecutivePos(result.posTags[index]) && isNonConsecutivePos(result.posTags[index + 1])) {
      // Avoid consecutive IN's.
      isValid = false;
    }
  });
  return isValid;
};

/**
 * Checks if a suggestion token is compatible with a query token.
 * A query token must be the suggestion token's prefix, or they are the same type of markers.
 */
const matchSuggestionToken = (suggestionToken: string, queryToken: string): boolean => {
  const matchedSuggestionMarker = suggestionToken.match(/^r_(.*)_\d+$/);
  const matchedQueryMarker = queryToken.match(/^r_(.*)_\d+$/);
  if (matchedSuggestionMarker && matchedQueryMarker) {
    return matchedQueryMarker[1] === matchedQueryMarker[1];
  }
  return suggestionToken.indexOf(queryToken) === 0;
};

/**
 * Checks if a suggestion is compatible with a query.
 * A query must be the suggestion's prefix.
 */
const matchSuggestion = (suggestion: string, query: string): boolean => {
  const suggestionTokens = suggestion.split(' ');
  const queryTokens = query.split(' ');
  if (queryTokens.length > suggestionTokens.length) {
    return false;
  }
  for (let i = 0; i < queryTokens.length; i++) {
    if (!matchSuggestionToken(suggestionTokens[i], queryTokens[i])) {
      return false;
    }
  }
  return true;
};

/**
 * Replaces the injected prefix tokens by their text values in the raw query.
 * For example, "show a plot" is suggested as "r_chart a plot" and "r_chart" is ejected to "show".
 */
const ejectQueryFromSuggestion = (suggestion: string, query: string, rawQuery: string): string => {
  const suggestionTokens = suggestion.split(' ');
  const queryTokens = query.split(' ');
  const rawQueryTokens = rawQuery.split(' ');
  const tokens = [];
  for (let i = 0; i < suggestionTokens.length; i++) {
    if (i >= queryTokens.length || queryTokens[i].match(/^r_/) === null) {
      tokens.push(suggestionTokens[i]);
    } else {
      tokens.push(rawQueryTokens[i]);
    }
  }
  return tokens.join(' ');
};

/**
 * Checks each suggestion in order.
 */
const checkSuggestions = (query: string, rawQuery: string, index: number, groupIndex: number,
                          suggestions: string[][], valid: string[], res: Response) => {
  if (index < suggestions.length && groupIndex >= suggestions[index].length) {
    groupIndex = 0;
    index++;
  }
  if (index === suggestions.length || valid.length === MAX_SUGGESTIONS) {
    // All suggestions have been checked, or we have reached the #suggestions threshold.
    res.json(valid);
    return;
  }
  const suggestion = suggestions[index][groupIndex];
  if (!matchSuggestion(suggestion, query)) {
    // The suggestion is incompatible with the query. Skip to the next suggestion.
    checkSuggestions(query, rawQuery, index, groupIndex + 1, suggestions, valid, res);
    return;
  }
  // Check if suggestion can be accepted
  sendQuery(suggestion, (err, sempreRes) => {
    if (err) {
      res.status(500).send('unexpected server error occurred when generating suggestions');
      return;
    }
    const result = parseSempreResult(sempreRes.body);
    if (result.success && valid.indexOf(suggestion) === -1 && // avoid duplication
      isProbablyValid(result)) {
      valid.push(ejectQueryFromSuggestion(suggestion, query, rawQuery));
      // Only generate one suggestion for each group of suffixes.
      checkSuggestions(query, rawQuery, index + 1, 0, suggestions, valid, res);
    } else {
      checkSuggestions(query, rawQuery, index, groupIndex + 1, suggestions, valid, res);
    }
  });
};


/**
 * Provides query auto completion based on template queries.
 */
export const autoComplete = (req: Request, res: Response, next: NextFunction) => {
  const query = req.body.sanitizedQuery;
  const rawQuery = req.body.query;
  console.log('sanitized query:', query, '/', req.body.query);
  if (typeof query !== 'string') {
    // Fatal unknown error
    res.status(500).send('cannot sanitize query');
    return;
  }

  const templates = allTemplates();
  const suggestions: string[][] = [];
  for (const template of templates) {
    suggestions.push([template]);
  }
  /*
  for (const template of templates) {
    if (suggestions.length >= MAX_SUGGESTIONS) {
      break;
    }
    const tokens = template.split(' ');
    const suffixes: string[] = [];
    // Start from the shortest suffix and end at the longest suffix.
    for (let index = tokens.length - 1; index >= 0; index--) {
      // Enumerate a suffix of the tokens to be the completed part of the query.
      suffixes.push(tokens.slice(index).join(' '));
    }
    // All suffixes belong to a single group.
    suggestions.push(suffixes);
  }
  */
  checkSuggestions(query, rawQuery, 0, 0, suggestions, [], res);
};
