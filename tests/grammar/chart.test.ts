import _ from 'lodash';

import { checkQuery, injectedValue } from './util';

const CHART_TYPE_DEFAULT = '_chart_type_default';

describe('charts', () => {
  const injectedMpg = injectedValue('mpg');
  const injectedOrigin = injectedValue('origin');
  const injectedHorsepower = injectedValue('horsepower');
  const injectedScatterplot = injectedValue('scatterplot');
  const injectedModelYear = injectedValue('model.year');
  const injectedLineChart = injectedValue('line chart');

  it('specified chart type with one column', done => {
    checkQuery('scatterplot of mpg', done,
      `target:${injectedScatterplot};columns:${injectedMpg}`, {
        target: [{
          id: injectedScatterplot,
          isCreate: true,
        }],
        columns: [injectedMpg],
      });
  });

  it('specified chart type with columns', done => {
    checkQuery('scatterplot mpg and horsepower', done,
      `target:${injectedScatterplot};columns:${injectedMpg}&${injectedHorsepower}`, {
        target: [{
          id: injectedScatterplot,
          isCreate: true,
        }],
        columns: [injectedMpg, injectedHorsepower],
      });
  });

  it('default chart with a column', done => {
    checkQuery('draw a plot of mpg', done, `target:${CHART_TYPE_DEFAULT};columns:${injectedMpg}`, {
      columns: [injectedMpg],
      target: [{
        id: CHART_TYPE_DEFAULT,
        isCreate: true,
      }],
    });
  });

  it('default chart', done => {
    checkQuery('show a plot', done, `target:${CHART_TYPE_DEFAULT}`, {
      target: [{
        id: CHART_TYPE_DEFAULT,
        isCreate: true,
      }],
    });
  });

  it('chart with multiple columns', done => {
    checkQuery('create a heatmap with mpg, horsepower and cylinders', done,
      `target:${injectedValue('heatmap')};` +
      `columns:${injectedMpg}&${injectedHorsepower}&${injectedValue('cylinders')}`, {
        target: [{
          id: injectedValue('heatmap'),
          isCreate: true,
        }],
        columns: [injectedMpg, injectedHorsepower, injectedValue('cylinders')],
      });
  });

  it('all columns', done => {
    checkQuery('visualize all dimensions in a heatmap', done,
      `columns:_all_columns;target:${injectedValue('heatmap')}`, {
        target: [{
          id: injectedValue('heatmap'),
          isCreate: true,
        }],
        columns: ['_all_columns'],
      });
  });

  it('only columns', done => {
    checkQuery('mpg and horsepower', done,
    `columns:${injectedMpg}&${injectedHorsepower}`, {
      target: [{
        id: CHART_TYPE_DEFAULT,
        isCreate: true,
      }],
      columns: [injectedMpg, injectedHorsepower],
    });
  });

  it('columns as adjective for chart', done => {
    checkQuery('mpg horsepower scatterplot', done,
    `target:${injectedScatterplot};columns:${injectedMpg}&${injectedHorsepower}`, {
      target: [{
        id: injectedScatterplot,
        isCreate: true,
      }],
      columns: [injectedMpg, injectedHorsepower],
    });
  });

  it('map histogram for distribution', done => {
    checkQuery('mpg distribution', done,
    `target:histogram;columns:${injectedMpg}`, {
      target: [{
        id: 'histogram',
        isCreate: true,
      }],
      columns: [injectedMpg],
    });
  });

  it('draw series', done => {
    checkQuery('show mpg series', done,
    `target:${CHART_TYPE_DEFAULT};columns:${injectedMpg}`, {
      target: [{
        id: CHART_TYPE_DEFAULT,
        isCreate: true,
      }],
      columns: [injectedMpg],
    });
  });

  it('specify series with group by column and chart type', done => {
    checkQuery('show mpg over model.year group by origin in a line chart', done,
      `columns:${injectedMpg}:series:${injectedModelYear}:group_by:${injectedOrigin};` +
      `target:${injectedLineChart}`, {
        target: [{
          id: injectedLineChart,
          isCreate: true,
        }],
        columns: [injectedMpg],
        groupByColumn: injectedOrigin,
        seriesColumn: injectedModelYear,
      });
  });

  it('specify series without chart type', done => {
    checkQuery('show mpg series over model.year', done,
      `columns:${injectedMpg}:series:${injectedModelYear}`, {
        target: [{
          id: CHART_TYPE_DEFAULT,
          isCreate: true,
        }],
        columns: [injectedMpg],
        seriesColumn: injectedModelYear,
      });
  });

  it('specify series with group by column, without chart type', done => {
    checkQuery('show mpg series over model.year for each origin', done,
      `columns:${injectedMpg}:series:${injectedModelYear}:group_by:${injectedOrigin}`, {
        target: [{
          id: CHART_TYPE_DEFAULT,
          isCreate: true,
        }],
        columns: [injectedMpg],
        seriesColumn: injectedModelYear,
        groupByColumn: injectedOrigin,
      });
  });
});
