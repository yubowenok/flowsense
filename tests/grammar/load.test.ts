import { runQuery, injectedValue } from './util';

describe('load dataset', () => {
  runQuery(
    'load iris dataset',
    `load:${injectedValue('iris')}`,
    {
      loadDataset: injectedValue('iris'),
    },
  );

  runQuery(
    'open iris',
    `load:${injectedValue('iris')}`,
    {
      loadDataset: injectedValue('iris'),
    },
  );

  runQuery(
    'show iris',
    `load:${injectedValue('iris')}`,
    {
      loadDataset: injectedValue('iris'),
    },
  );
});
