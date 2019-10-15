import { runQuery, injectedValue } from '../util';

describe('attribute filter: sampling', () => {
  runQuery(
    'find 5 percent of cars by mpg group by origin',
    `filter:${injectedValue('mpg')}:sampling:0.05_%:group_by:${injectedValue('origin')}`,
    {
      filters: [{
        column: injectedValue('mpg'),
      sampling: 'random',
        amount: 5,
        amountType: 'percentage',
      }],
      groupByColumn: injectedValue('origin'),
    },
  );

  runQuery(
    'sample 5 percent of cars',
    'filter:_index:sampling:0.05_%',
    {
      filters: [{
        column: '_index',
        sampling: 'random',
        amount: 5,
        amountType: 'percentage',
      }],
    },
  );

  runQuery(
    'sample 5 percent of cars group by origin',
    `filter:_index:sampling:0.05_%:group_by:${injectedValue('origin')}`,
    {
      filters: [{
        column: '_index',
        sampling: 'random',
        amount: 5,
        amountType: 'percentage',
      }],
      groupByColumn: injectedValue('origin'),
    },
  );
});

/*
TODO: This query is so far not supported because 5% by mpg is not a well-defined action.
(example
  (utterance "find 5 percent of cars by mpg")
  (targetValue (string "filter:mpg:sampling:0.05_%"))
)
*/
