import { Response, Request, NextFunction } from 'express';
import _ from 'lodash';
import fs from 'fs';

import { sendQuery, parseSempreResult } from './parser';

const MAX_SUGGESTIONS = 10;

/**
 * Checks each suggestion in order.
 */
const checkSuggestions = (query: string, index: number, groupIndex: number,
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
  const suffix = suggestions[index][groupIndex];
  // Check if suggestion can be accepted
  sendQuery(query + ' ' + suffix, (err, sempreRes) => {
    if (err) {
      res.status(500).send('unexpected server error occurred when generating suggestions');
      return;
    }
    const result = parseSempreResult(sempreRes.body);
    if (result.success && valid.indexOf(suffix) === -1) { // avoid duplication
      valid.push(suffix);
      // Only generate one suggestion for each group of suffixes.
      checkSuggestions(query, index + 1, 0, suggestions, valid, res);
    } else {
      checkSuggestions(query, index, groupIndex + 1, suggestions, valid, res);
    }
  });
};

/**
 * Provides query auto completion based on template queries.
 */
export const autoComplete = (req: Request, res: Response, next: NextFunction) => {
  const query = req.body.sanitizedQuery;
  console.log('sanitized query:', query, '/', req.body.query);
  if (typeof query !== 'string') {
    // Fatal unknown error
    res.status(500).send('cannot sanitize query');
    return;
  }
  const templates = JSON.parse(fs.readFileSync('data/templates.json').toString());
  const suggestions: string[][] = [];

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
  checkSuggestions(query, 0, 0, suggestions, [], res);
};
