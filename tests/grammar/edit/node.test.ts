import { runQuery, injectedValue } from '../util';

const injectedScatterplot = injectedValue('scatterplot');
const injectedChart = injectedValue('chart-1');

describe('remove nodes', () => {
  runQuery(
    'remove chart-1',
    `node:remove:${injectedChart}`,
    {
      node: {
        type: 'remove',
        nodes: [
          { id: injectedChart },
        ],
      },
    },
  );

  runQuery(
    'remove the scatterplot',
    `node:remove:${injectedScatterplot}`,
    {
      node: {
        type: 'remove',
        nodes: [
          { id: injectedScatterplot },
        ],
      },
    },
  );

  runQuery(
    'remove chart-1 and the scatterplot',
    `node:remove:${injectedChart}:${injectedScatterplot}`,
    {
      node: {
        type: 'remove',
        nodes: [
          { id: injectedChart },
          { id: injectedScatterplot },
        ],
      },
    },
  );
});
