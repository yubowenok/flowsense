import { runQuery, injectedValue } from '../util';
import { SELECTION } from '@src/def';

const injectedScatterplot = injectedValue('scatterplot');
const injectedHistogram = injectedValue('histogram');

describe('connect and disconnect', () => {
  runQuery(
    'connect chart-1 and filter-1',
    `edge:connect:${injectedValue('chart-1')}:${injectedValue('filter-1')}`,
    {
      edge: {
        type: 'connect',
        nodes: [
          { id: injectedValue('chart-1') },
          { id: injectedValue('filter-1') },
        ],
      },
    },
  );

  runQuery(
    'connect the scatterplot and the histogram',
    `edge:connect:${injectedScatterplot}:${injectedHistogram}`,
    {
      edge: {
        type: 'connect',
        nodes: [
          { id: injectedScatterplot },
          { id: injectedHistogram },
        ],
      },
    },
  );

  runQuery(
    'connect the selection of chart-1 with filter-1',
    `edge:connect:${injectedValue('chart-1')}:${SELECTION}:${injectedValue('filter-1')}`,
      {
      edge: {
        type: 'connect',
        nodes: [
          { id: injectedValue('chart-1'), isSelection: true },
          { id: injectedValue('filter-1') },
        ],
      },
    },
  );

  runQuery(
    'connect the selection of the scatterplot with the histogram',
    `edge:connect:${injectedScatterplot}:${SELECTION}:${injectedHistogram}`,
    {
      edge: {
        type: 'connect',
        nodes: [
          { id: injectedScatterplot, isSelection: true },
          { id: injectedHistogram },
        ],
      },
    },
  );

  runQuery(
    'disconnect chart-1 and filter-1',
    `edge:disconnect:${injectedValue('chart-1')}:${injectedValue('filter-1')}`,
    {
      edge: {
        type: 'disconnect',
        nodes: [
          { id: injectedValue('chart-1') },
          { id: injectedValue('filter-1') },
        ],
      },
    },
  );

  runQuery(
    'disconnect the selection of chart-1 from filter-1',
    `edge:disconnect:${injectedValue('chart-1')}:${SELECTION}:${injectedValue('filter-1')}`,
    {
      edge: {
        type: 'disconnect',
        nodes: [
          { id: injectedValue('chart-1'), isSelection: true },
          { id: injectedValue('filter-1') },
        ],
      },
    },
  );
});
