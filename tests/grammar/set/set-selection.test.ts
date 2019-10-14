import { runQuery, injectedValue } from '../util';
import { SELECTION } from '@src/def';

describe('set operator on selection', () => {
  runQuery(
    'union the selection of chart-1 with the selection of filter-1',
    `set:union:${injectedValue('chart-1')}:${SELECTION}:${injectedValue('filter-1')}:${SELECTION}`,
    {
      setOperator: {
        type: 'union',
        nodes: [
          { id: injectedValue('chart-1'), isSelection: true },
          { id: injectedValue('filter-1'), isSelection: true },
        ],
      },
    },
  );
});
