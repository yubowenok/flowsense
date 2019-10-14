import { runQuery, injectedValue } from '../util';
import { DEFAULT_CHART_TYPE } from '@src/def';

describe('attribute filter: range filter', () => {
  runQuery(
    'show only cars with mpg greater than 15',
    `target:${DEFAULT_CHART_TYPE};filter:${injectedValue('mpg')}:>=:15.0`,
    {
      filters: [{
        column: injectedValue('mpg'),
        range: { min: '15.0' },
      }],
      target: [{
        id: DEFAULT_CHART_TYPE,
        isCreate: true,
      }],
    },
  );

  // The current range filter does not distinguish equality in inequality. So this includes equality too.
  runQuery(
    'find cars with mpg smaller than or equal to 15',
    `filter:${injectedValue('mpg')}:<=:15.0`,
    {
      filters: [{
        column: injectedValue('mpg'),
        range: { max: '15.0' },
      }],
    },
  );

  const betweenRangeStringAnswer = `filter:${injectedValue('mpg')}:[]:10:15`;
  const betweenRangeAnswer = {
    filters: [{
      column: injectedValue('mpg'),
      range: { min: '10', max: '15' },
    }],
  };
  runQuery('cars with mpg between 10 and 15', betweenRangeStringAnswer, betweenRangeAnswer);
  // As NumberFn cannot parse a range specified by "between ... and ...",
  // string values are returned as range endpoints.
  runQuery('search for cars with mpg between 10 and 15', betweenRangeStringAnswer, betweenRangeAnswer);

  runQuery(
    'find cars with mpg greater than 13 and smaller than 15',
    `filter:${injectedValue('mpg')}:>=:13.0:<=:15.0`,
    {
      filters: [{
        column: injectedValue('mpg'),
        range: { min: '13.0', max: '15.0' },
      }],
    },
  );
});
