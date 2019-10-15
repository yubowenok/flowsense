import { runQuery, injectedValue } from '../util';
import { DEFAULT_CHART_TYPE, ALL_COLUMNS, SERIES_CHART_TYPE } from '@src/def';

describe('line charts', () => {
  const injectedMpg = injectedValue('mpg');
  const injectedOrigin = injectedValue('origin');
  const injectedModelYear = injectedValue('model.year');
  const injectedLineChart = injectedValue('line chart');

  runQuery(
    'show mpg over model.year grouped by origin in a line chart',
    [
      `target:${injectedLineChart};columns:${injectedMpg}:series:${injectedModelYear}:group_by:${injectedOrigin}`,
      `target:${DEFAULT_CHART_TYPE};columns:${injectedMpg}:series:${injectedModelYear}:group_by:${injectedOrigin};` +
        `target:${injectedLineChart}`,
    ],
    {
      target: [{
        id: injectedLineChart,
        isCreate: true,
      }],
      columns: [injectedMpg],
      groupByColumn: injectedOrigin,
      seriesColumn: injectedModelYear,
    },
  );

  runQuery(
    'show mpg series over model.year',
    `target:${DEFAULT_CHART_TYPE};columns:${injectedMpg}:series:${injectedModelYear}`,
    {
      target: [{
        id: DEFAULT_CHART_TYPE,
        isCreate: true,
      }],
      columns: [injectedMpg],
      seriesColumn: injectedModelYear,
    },
  );

  runQuery(
    'show mpg series over model.year for each origin',
    `target:${DEFAULT_CHART_TYPE};columns:${injectedMpg}:series:${injectedModelYear}:group_by:${injectedOrigin}`,
    {
      target: [{
        id: DEFAULT_CHART_TYPE,
        isCreate: true,
      }],
      columns: [injectedMpg],
      seriesColumn: injectedModelYear,
      groupByColumn: injectedOrigin,
    },
  );
});
