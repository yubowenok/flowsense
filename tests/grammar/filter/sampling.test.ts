import _ from 'lodash';

import { checkQuery, injectedValue } from '../util';

/*
This query is so far not supported because 5% by mpg is not a well-defined action.
(example
  (utterance "find 5 percent of cars by mpg")
  (targetValue (string "filter:mpg:sampling:0.05_%"))
)
*/

describe('attribute filter: sampling', () => {
  it('sample with percentage and grouping', done => {
    checkQuery('find 5 percent of cars by mpg group by origin', done,
      `filter:${injectedValue('mpg')}:sampling:0.05_%:group_by:${injectedValue('origin')}`,
      {
        filters: [{
          column: injectedValue('mpg'),
        sampling: 'random',
          amount: 5,
          amountType: 'percentage',
        }],
        groupByColumn: injectedValue('origin'),
      });
  });

  it('sample with percentage', done => {
    checkQuery('sample 5 percent of cars', done,
      'filter:_index:sampling:0.05_%',
      {
        filters: [{
          column: '_index',
          sampling: 'random',
          amount: 5,
          amountType: 'percentage',
        }],
      });
  });

  it('sample percentage and group', done => {
    checkQuery('sample 5 percent of cars group by origin', done,
      `filter:_index:sampling:0.05_%:group_by:${injectedValue('origin')}`,
      {
        filters: [{
          column: '_index',
          sampling: 'random',
          amount: 5,
          amountType: 'percentage',
        }],
        groupByColumn: injectedValue('origin'),
      });
  });
});
