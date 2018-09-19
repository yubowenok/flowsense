import { checkQuery, injectedValue } from '../util';
import { SELECTION, DEFAULT_SOURCE, DEFAULT_CHART_TYPE } from '@src/def';

describe('apply filter on interactive selection', () => {
  const injectedScatterplot = injectedValue('scatterplot');
  const injectedMpg = injectedValue('mpg');
  const injectedCylinders = injectedValue('cylinders');

  it('create filter for selection', done => {
    checkQuery('find selected cars with mpg greater than 5', done,
      `source:${SELECTION};filter:${injectedMpg}:>=:5.0`, {
        source: [{
          id: DEFAULT_SOURCE,
          isSelection: true,
        }],
        filters: [{
          column: injectedMpg,
          range: {
            min: '5.0',
          },
        }],
      });
  });

  it('chart selection with filter', done => {
    checkQuery('show selected cars with mpg greater than 5', done,
      `target:${DEFAULT_CHART_TYPE};source:${SELECTION};filter:${injectedMpg}:>=:5.0`, {
        target: [{
          id: DEFAULT_CHART_TYPE,
          isCreate: true,
        }],
        source: [{
          id: DEFAULT_SOURCE,
          isSelection: true,
        }],
        filters: [{
          column: injectedMpg,
          range: {
            min: '5.0',
          },
        }],
      });
  });

  it('chart with columns, range filter, and target chart type', done => {
    checkQuery('show mpg and cylinders of selected cars with mpg greater than 5 in a scatterplot', done,
      `target:${DEFAULT_CHART_TYPE};columns:${injectedMpg}&${injectedCylinders};` +
      `source:${SELECTION};filter:${injectedMpg}:>=:5.0;target:${injectedScatterplot}`, {
        target: [{
          id: injectedScatterplot,
          isCreate: true,
        }],
        source: [{
          id: DEFAULT_SOURCE,
          isSelection: true,
        }],
        filters: [{
          column: injectedMpg,
          range: {
            min: '5.0',
          },
        }],
        columns: [injectedMpg, injectedCylinders],
      });
  });
});