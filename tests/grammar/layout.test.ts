import { runQuery } from './util';

describe('automatic layout', () => {
  runQuery(
    'adjust the diagram layout',
    'auto-layout',
    {
      autoLayout: true,
    },
  );

  runQuery(
    'auto layout',
    'auto-layout',
    {
      autoLayout: true,
    },
  );

  runQuery(
    'layout the graph',
    'auto-layout',
    {
      autoLayout: true,
    },
  );
});
