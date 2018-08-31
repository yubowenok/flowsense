import { checkQuery, injectedValue } from '../util';
import { DEFAULT_CHART_TYPE, ALL_COLUMNS } from '@src/def';

describe('charts with filters', () => {
  const injectedMpg = injectedValue('mpg');
  const injectedName = injectedValue('name');
  const injectedScatterplot = injectedValue('scatterplot');

  it('chart with pattern filter #1', done => {
    checkQuery('show cars with name containing buick', done,
      `target:${DEFAULT_CHART_TYPE};filter:${injectedName}:pattern:buick`, {
        target: [{
          id: DEFAULT_CHART_TYPE,
          isCreate: true,
        }],
        filters: [{
          column: injectedName,
          pattern: 'buick',
        }],
      });
  });

  it('chart with pattern filter #2', done => {
    checkQuery('show cars with a name that contains buick', done,
      `target:${DEFAULT_CHART_TYPE};filter:${injectedName}:pattern:buick`, {
        target: [{
          id: DEFAULT_CHART_TYPE,
          isCreate: true,
        }],
        filters: [{
          column: injectedName,
          pattern: 'buick',
        }],
      });
  });

  it('chart with filter equality', done => {
    checkQuery('show cars with an mpg of 15', done,
      `target:${DEFAULT_CHART_TYPE};filter:${injectedMpg}:=:15`, {
        target: [{
          id: DEFAULT_CHART_TYPE,
          isCreate: true,
        }],
        filters: [{
          column: injectedMpg,
          pattern: '15',
        }],
      });
  });

  it('chart with filter equality and target chart type', done => {
    checkQuery('show a scatterplot of cars with mpg equal to 15', done,
      `target:${injectedScatterplot};filter:${injectedMpg}:=:15.0`, {
        target: [{
          id: injectedScatterplot,
          isCreate: true,
        }],
        filters: [{
          column: injectedMpg,
          pattern: '15.0',
        }],
      });
  });

  it('chart with range filter and target chart type', done => {
    checkQuery('show cars with mpg no larger than 15 in a scatterplot', done,
      `target:${DEFAULT_CHART_TYPE};filter:${injectedMpg}:<=:15.0;target:${injectedScatterplot}`, {
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
      });
  });
});
