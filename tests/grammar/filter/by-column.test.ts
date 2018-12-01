import { checkQuery, injectedValue } from '../util';

describe('attribute filter: by column', () => {
  it('filter by column #1', done => {
    checkQuery('filter by mpg', done,
    `filter:${injectedValue('mpg')}`, {
      filters: [{
        column: injectedValue('mpg'),
      }],
    });
  });

  it('filter by column #2', done => {
    checkQuery('filter mpg', done,
    `filter:${injectedValue('mpg')}`, {
      filters: [{
        column: injectedValue('mpg'),
      }],
    });
  });

  it('filter by column #3', done => {
    checkQuery('filter the cars by mpg', done,
    `filter:${injectedValue('mpg')}`, {
      filters: [{
        column: injectedValue('mpg'),
      }],
    });
  });
});
