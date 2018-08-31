import { checkQuery, injectedValue } from '../util';

describe('attribute filter: pattern matching', () => {
  it('maximum column value', done => {
    checkQuery('find cars with max mpg', done, `filter:${injectedValue('mpg')}:extremum:max:1`, {
      filters: [{
        column: injectedValue('mpg'),
        extremum: 'maximum',
        amount: 1,
        amountType: 'count',
      }],
    });
  });

  it('minimum column value with count', done => {
    checkQuery('find 5 cars with minimum mpg', done, `filter:${injectedValue('mpg')}:extremum:min:5.0`, {
      filters: [{
        column: injectedValue('mpg'),
        extremum: 'minimum',
        amount: 5,
        amountType: 'count',
      }],
    });
  });

  it('maximum column value with percentage', done => {
    checkQuery('get 5 percent of cars with maximum mpg', done, `filter:${injectedValue('mpg')}:extremum:max:0.05_%`, {
      filters: [{
        column: injectedValue('mpg'),
        extremum: 'maximum',
        amount: 5,
        amountType: 'percentage',
      }],
    });
  });
});
