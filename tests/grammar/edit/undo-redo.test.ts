import { runQuery } from '../util';

describe('undo/redo', () => {
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
