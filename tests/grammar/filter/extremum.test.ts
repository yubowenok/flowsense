import { runQuery, injectedValue } from '../util';

describe('attribute filter: pattern matching', () => {
  runQuery(
    'find cars with max mpg',
    `filter:${injectedValue('mpg')}:extremum:max:1`,
    {
      filters: [{
        column: injectedValue('mpg'),
        extremum: 'maximum',
        amount: 1,
        amountType: 'count',
      }],
    },
  );

  runQuery(
    'find 5 cars with minimum mpg',
    `filter:${injectedValue('mpg')}:extremum:min:5.0`,
    {
      filters: [{
        column: injectedValue('mpg'),
        extremum: 'minimum',
        amount: 5,
        amountType: 'count',
      }],
    },
  );

  runQuery(
    'get 5 percent of cars with maximum mpg',
    `filter:${injectedValue('mpg')}:extremum:max:0.05_%`,
    {
      filters: [{
        column: injectedValue('mpg'),
        extremum: 'maximum',
        amount: 5,
        amountType: 'percentage',
      }],
    },
  );
});
