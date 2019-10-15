import { runQuery, injectedValue } from '../util';

describe('attribute filter: default', () => {
  const injectedChart = injectedValue('chart-1');

  runQuery(
    'filter',
    'filter:',
    {
      filters: [{
        column: '',
      }],
    },
  );

  runQuery(
    'add a filter',
    'filter:',
    {
      filters: [{
        column: '',
      }],
    },
  );

  runQuery(
    'filter chart-1',
    `filter:;source:${injectedChart}`,
    {
      filters: [{
        column: '',
      }],
      source: [
        { id: injectedChart },
      ],
    },
  );
});
