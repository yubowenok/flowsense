import { runQuery, injectedValue } from './util';
import { DEFAULT_CHART_TYPE } from '@src/def';

const injectedMpg = injectedValue('mpg');
const injectedCylinders = injectedValue('cylinders');

describe('command with punctuation', () => {
  runQuery(
    'show a plot.',
    `target:${DEFAULT_CHART_TYPE}`,
    {
      target: [
        { id: DEFAULT_CHART_TYPE, isCreate: true },
      ],
    },
  );

  runQuery(
    'show mpg, cylinders',
    `target:${DEFAULT_CHART_TYPE};columns:${injectedMpg}&${injectedCylinders}`,
    {
      columns: [injectedMpg, injectedCylinders],
      target: [
        { id: DEFAULT_CHART_TYPE, isCreate: true },
      ],
    },
  );

  runQuery(
    'show mpg, cylinders',
    `target:${DEFAULT_CHART_TYPE};columns:${injectedMpg}&${injectedCylinders}`,
    {
      columns: [injectedMpg, injectedCylinders],
      target: [
        { id: DEFAULT_CHART_TYPE, isCreate: true },
      ],
    },
  );

  runQuery(
    'could you find the cars with mpg greater than 10?',
    `filter:${injectedMpg}:>=:10.0`,
    {
      filters: [
        { column: injectedMpg, range: { min: '10.0' } },
      ],
    },
  );
});
