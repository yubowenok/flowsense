import { runQuery } from './util';

describe('diagram edit', () => {
  runQuery(
    'undo',
    'undo',
    {
      undo: true,
    },
  );

  runQuery(
    'cancel',
    'undo',
    {
      undo: true,
    },
  );

  runQuery(
    'redo',
    'redo',
    {
      redo: true,
    },
  );
});
