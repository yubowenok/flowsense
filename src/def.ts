/**
 * @fileoverview Lists special tags and POS tags.
 */

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
export const STOP_TOKEN_POS_TAGS = ['WRB', 'WDT', 'VBD-AUX', 'WP', 'PRP', 'RB', 'UH', 'DT'];

/**
 * Stop nouns are removed if they are not close to any special words by wup similarity.
 * In particular, proper nouns are excluded from stop nouns, e.g. blue, US.
 * NN: car
 * NNS: cars
 * PRP: I, you, we
 */
export const STOP_NOUN_POS_TAGS = ['NN', 'NNS', 'PRP', 'PRP$'];

/**
 * POS tags of verbs.
 */
export const VERB_POS_TAGS = ['VB', 'VBN', 'VBP'];

/**
 * Special words that have stop token POS tags but are useful.
 */
export const STOP_TOKEN_POS_EXCEPTIONS = [
  'all',
];


/**
 * Special tokens that are always filtered.
 */
export const STOP_TOKENS = [
  'please',
];

/**
 * A list of special nouns. A noun is a stop noun if it is not close to any noun in this list.
 */
export const SPECIAL_NOUNS = [
  'plot',
  'chart',
  'diagram',
  'node',
  'color',
  'border',
  'size',
  'width',
  'opacity',
  'union',
  'intersection',
  'difference',
];
export const STOP_NOUN_WUP_THRESHOLD = 0.75;


/**
 * A list of special verbs. A verb will be replaced to the special verb marker if it is close to it.
 */
export const SPECIAL_MARKER_VERBS = {
  r_load: ['load', 'open'],
  r_chart: ['show', 'draw', 'visualize'],
  r_filter: ['filter', 'find', 'search'],
};
export const VERB_WUP_THRESHOLD = 0.81;


/** A list of verbs that may be recognized as NN, JJ. */
export const SPECIAL_VERBS = [
  'show',
  'load',
  'open',
];
