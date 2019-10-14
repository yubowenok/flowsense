import { runQuery, injectedValue } from '../util';
import { DEFAULT_CHART_TYPE, ALL_COLUMNS } from '@src/def';

describe('charts with filters', () => {
  const injectedMpg = injectedValue('mpg');
  const injectedName = injectedValue('name');
  const injectedScatterplot = injectedValue('scatterplot');

  runQuery(
    'show cars with name containing buick',
    `target:${DEFAULT_CHART_TYPE};filter:${injectedName}:pattern:buick`,
    {
      target: [{
        id: DEFAULT_CHART_TYPE,
        isCreate: true,
      }],
      filters: [{
        column: injectedName,
        pattern: 'buick',
      }],
    },
  );

  runQuery(
    'show cars with a name that contains buick',
    `target:${DEFAULT_CHART_TYPE};filter:${injectedName}:pattern:buick`,
    {
      target: [{
        id: DEFAULT_CHART_TYPE,
        isCreate: true,
      }],
      filters: [{
        column: injectedName,
        pattern: 'buick',
      }],
    },
  );

  runQuery(
    'show cars with an mpg of 15',
    `target:${DEFAULT_CHART_TYPE};filter:${injectedMpg}:=:15`,
    {
      target: [{
        id: DEFAULT_CHART_TYPE,
        isCreate: true,
      }],
      filters: [{
        column: injectedMpg,
        pattern: '15',
      }],
    },
  );

  runQuery(
    'show a scatterplot of cars with mpg equal to 15',
    `target:${injectedScatterplot};filter:${injectedMpg}:=:15.0`,
    {
      target: [{
        id: injectedScatterplot,
        isCreate: true,
      }],
      filters: [{
        column: injectedMpg,
        pattern: '15.0',
      }],
    },
  );

  runQuery(
    'show cars with mpg no larger than 15 in a scatterplot',
    `target:${DEFAULT_CHART_TYPE};filter:${injectedMpg}:<=:15.0;target:${injectedScatterplot}`,
    {
      target: [{
        id: injectedScatterplot,
        isCreate: true,
      }],
      filters: [{
        column: injectedMpg,
        range: {
          max: '15.0',
        },
      }],
    },
  );
});
