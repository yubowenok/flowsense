import { runQuery } from '../util';

describe('attribute filter: default', () => {
  runQuery(
    'filter',
    'filter:',
    {
      filters: [{
        column: '',
      }],
    },
  );

  runQuery(
    'add a filter',
    'filter:',
    {
      filters: [{
        column: '',
      }],
    },
  );
});
