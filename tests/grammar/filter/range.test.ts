import { checkQuery, injectedValue } from '../util';
import { DEFAULT_CHART_TYPE } from '@src/def';

describe('attribute filter: range filter', () => {
  it('range with one side', done => {
    checkQuery('show only cars with mpg greater than 15', done,
      `target:${DEFAULT_CHART_TYPE};filter:${injectedValue('mpg')}:>=:15.0`, {
        filters: [{
          column: injectedValue('mpg'),
          range: { min: '15.0' },
        }],
        target: [{
          id: DEFAULT_CHART_TYPE,
          isCreate: true,
        }],
      });
  });

  // The current range filter does not distinguish equality in inequality. So this includes equality too.
  it('greater than an equal to', done => {
    checkQuery('find cars with mpg smaller than or equal to 15', done,
      `filter:${injectedValue('mpg')}:<=:15.0`, {
        filters: [{
          column: injectedValue('mpg'),
          range: { max: '15.0' },
        }],
      });
  });

  const betweenRangeStringAnswer = `filter:${injectedValue('mpg')}:[]:10:15`;
  const betweenRangeAnswer = {
    filters: [{
      column: injectedValue('mpg'),
      range: { min: '10', max: '15' },
    }],
  };
  it('range by between/and #1', done => {
    checkQuery('cars with mpg between 10 and 15', done, betweenRangeStringAnswer, betweenRangeAnswer);
  });
  it('range by between/and #2', done => {
    // As NumberFn cannot parse a range specified by "between ... and ...",
    // string values are returned as range endpoints.
    checkQuery('search for cars with mpg between 10 and 15', done, betweenRangeStringAnswer, betweenRangeAnswer);
  });

  it('range by two greater/smaller than clauses', done => {
    checkQuery('find cars with mpg greater than 13 and smaller than 15', done,
      `filter:${injectedValue('mpg')}:>=:13.0:<=:15.0`,
      {
        filters: [{
          column: injectedValue('mpg'),
          range: { min: '13.0', max: '15.0' },
        }],
      },
    );
  });
});
