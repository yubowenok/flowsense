import { runQuery, injectedValue } from '../util';
import { SELECTION, DEFAULT_SOURCE } from '@src/def';

describe('constant extraction', () => {
  const injectedMpg = injectedValue('mpg');
  const injectedCylinders = injectedValue('cylinders');

  runQuery(
    'extract mpg',
    `extract:${injectedMpg}`,
    {
      extract: {
        column: injectedMpg,
      },
    },
  );

  runQuery(
    'retrieve the values of mpg',
    `extract:${injectedMpg}`,
    {
      extract: {
        column: injectedMpg,
      },
    },
  );

  runQuery(
    'extract mpg of the cars',
    `extract:${injectedMpg}`,
    {
      extract: {
        column: injectedMpg,
      },
    },
  );

  runQuery(
    'extract mpg from selected cars',
    `extract:${injectedMpg};source:${SELECTION}`,
    {
      source: [{
        id: DEFAULT_SOURCE,
        isSelection: true,
      }],
      extract: {
        column: injectedMpg,
      },
    },
  );

  runQuery(
    'extract selected cars\' mpg',
    `extract:${injectedMpg};source:${SELECTION}`,
    {
      source: [{
        id: DEFAULT_SOURCE,
        isSelection: true,
      }],
      extract: {
        column: injectedMpg,
      },
    },
  );

  runQuery(
    'extract mpg of the selection',
    `extract:${injectedMpg};source:${SELECTION}`,
    {
      source: [{
        id: DEFAULT_SOURCE,
        isSelection: true,
      }],
      extract: {
        column: injectedMpg,
      },
    },
  );
});
