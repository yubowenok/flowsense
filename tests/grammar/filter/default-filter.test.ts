import { runQuery, injectedValue } from '../util';

describe('attribute filter: default', () => {
  const injectedChart = injectedValue('chart-1');
  const injectedScatterplot = injectedValue('scatterplot');

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

  runQuery(
    'filter the scatterplot',
    `filter:;source:${injectedScatterplot}`,
    {
      filters: [{
        column: '',
      }],
      source: [
        { id: injectedScatterplot },
      ],
    },
  );
});
