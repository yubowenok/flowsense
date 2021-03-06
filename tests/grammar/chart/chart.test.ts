import { runQuery, injectedValue } from '../util';
import { DEFAULT_CHART_TYPE, ALL_COLUMNS, SERIES_CHART_TYPE } from '@src/def';

const injectedMpg = injectedValue('mpg');
const injectedHorsepower = injectedValue('horsepower');
const injectedOrigin = injectedValue('origin');
const injectedScatterplot = injectedValue('scatterplot');
const injectedChart = injectedValue('chart-1');

describe('charts', () => {
  runQuery(
    'show the cars',
    `target:${DEFAULT_CHART_TYPE}`,
    {
      target: [{
        id: DEFAULT_CHART_TYPE,
        isCreate: true,
      }],
    },
  );

  runQuery(
    'scatterplot of mpg',
    `target:${injectedScatterplot};columns:${injectedMpg}`,
    {
      target: [{
        id: injectedScatterplot,
        isCreate: true,
      }],
      columns: [injectedMpg],
    },
  );

  runQuery(
    'scatterplot mpg and horsepower',
    `target:${injectedScatterplot};columns:${injectedMpg}&${injectedHorsepower}`,
    {
      target: [{
        id: injectedScatterplot,
        isCreate: true,
      }],
      columns: [injectedMpg, injectedHorsepower],
    },
  );

  runQuery(
    'draw a plot of mpg',
    `target:${DEFAULT_CHART_TYPE};columns:${injectedMpg}`,
    {
      columns: [injectedMpg],
      target: [{
        id: DEFAULT_CHART_TYPE,
        isCreate: true,
      }],
    },
  );

  runQuery(
    'show a plot',
    `target:${DEFAULT_CHART_TYPE}`,
    {
      target: [{
        id: DEFAULT_CHART_TYPE,
        isCreate: true,
      }],
    },
  );

  runQuery(
    'create a heatmap with mpg, horsepower and cylinders',
    `target:${injectedValue('heatmap')};columns:${injectedMpg}&${injectedHorsepower}&${injectedValue('cylinders')}`,
    {
      target: [{
        id: injectedValue('heatmap'),
        isCreate: true,
      }],
      columns: [injectedMpg, injectedHorsepower, injectedValue('cylinders')],
    },
  );

  runQuery(
    'show all columns',
    `target:${DEFAULT_CHART_TYPE};columns:${ALL_COLUMNS}`,
    {
      target: [{
        id: DEFAULT_CHART_TYPE,
        isCreate: true,
      }],
      columns: [ALL_COLUMNS],
    },
  );

  runQuery(
    'visualize all dimensions in a heatmap',
    [
      `target:${injectedValue('heatmap')};columns:${ALL_COLUMNS}`,
      `target:${DEFAULT_CHART_TYPE};columns:${ALL_COLUMNS};target:${injectedValue('heatmap')}`,
    ],
    {
      target: [{
        id: injectedValue('heatmap'),
        isCreate: true,
      }],
      columns: [ALL_COLUMNS],
    },
  );

  runQuery(
    'show mpg',
    `target:${DEFAULT_CHART_TYPE};columns:${injectedMpg}`,
    {
      target: [{
        id: DEFAULT_CHART_TYPE,
        isCreate: true,
      }],
      columns: [injectedMpg],
    },
  );

  runQuery(
    'show',
    `target:${DEFAULT_CHART_TYPE}`,
    {
      target: [{
        id: DEFAULT_CHART_TYPE,
        isCreate: true,
      }],
    },
  );

  runQuery(
    'mpg horsepower scatterplot',
    `target:${injectedScatterplot};columns:${injectedMpg}&${injectedHorsepower}`,
    {
      target: [{
        id: injectedScatterplot,
        isCreate: true,
      }],
      columns: [injectedMpg, injectedHorsepower],
    },
  );

  runQuery(
    'mpg distribution',
    `target:histogram;columns:${injectedMpg}`,
    {
      target: [{
        id: 'histogram',
        isCreate: true,
      }],
      columns: [injectedMpg],
    },
  );

  runQuery(
    'show mpg series',
    `target:${SERIES_CHART_TYPE};columns:${injectedMpg}`,
    {
      target: [{
        id: SERIES_CHART_TYPE,
        isCreate: true,
      }],
      columns: [injectedMpg],
    },
  );

  runQuery(
    'compare mpg against horsepower',
    `target:${DEFAULT_CHART_TYPE};columns:${injectedMpg}&${injectedHorsepower}`,
    {
      target: [{
        id: DEFAULT_CHART_TYPE,
        isCreate: true,
      }],
      columns: [injectedMpg, injectedHorsepower],
    },
  );

  runQuery(
    'show mpg from chart-1 in a scatterplot',
    `target:${DEFAULT_CHART_TYPE};columns:${injectedMpg};source:${injectedChart};target:${injectedScatterplot}`,
    {
      columns: [injectedMpg],
      source: [
        { id: injectedChart },
      ],
      target: [
        { id: injectedScatterplot, isCreate: true },
      ],
    },
  );

  runQuery(
    'list origin',
    `target:${DEFAULT_CHART_TYPE};columns:${injectedOrigin}`,
    {
      target: [{
        id: DEFAULT_CHART_TYPE,
        isCreate: true,
      }],
      columns: [injectedOrigin],
    },
  );
});
