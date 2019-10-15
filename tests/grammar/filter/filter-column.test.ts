import { runQuery, injectedValue } from '../util';

describe('attribute filter: by column', () => {
  runQuery(
    'filter by mpg',
    `filter:${injectedValue('mpg')}`,
    {
      filters: [{
        column: injectedValue('mpg'),
      }],
    },
  );

  runQuery(
    'filter mpg',
    `filter:${injectedValue('mpg')}`,
    {
      filters: [{
        column: injectedValue('mpg'),
      }],
    },
  );

  runQuery(
    'filter the cars by mpg',
    `filter:${injectedValue('mpg')}`, {
      filters: [{
        column: injectedValue('mpg'),
      }],
    },
  );
});
