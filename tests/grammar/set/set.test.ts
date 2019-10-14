import { runQuery, injectedValue } from '../util';

const injectedScatterplot = injectedValue('scatterplot');
const injectedHistogram = injectedValue('histogram');

describe('set operator', () => {
  runQuery(
    'union chart-1 and filter-1',
    `set:union:${injectedValue('chart-1')}:${injectedValue('filter-1')}`,
    {
      setOperator: {
        type: 'union',
        nodes: [
          { id: injectedValue('chart-1') },
          { id: injectedValue('filter-1') },
        ],
      },
    },
  );

  runQuery(
    'union the scatterplot with the histogram',
    `set:union:${injectedScatterplot}:${injectedHistogram}`,
    {
      setOperator: {
        type: 'union',
        nodes: [
          { id: injectedScatterplot },
          { id: injectedHistogram },
        ],
      },
    },
  );

  runQuery(
    'find difference between chart-1 and filter-1',
    `set:difference:${injectedValue('chart-1')}:${injectedValue('filter-1')}`,
    {
      setOperator: {
        type: 'difference',
        nodes: [
          { id: injectedValue('chart-1') },
          { id: injectedValue('filter-1') },
        ],
      },
    },
  );

  runQuery(
    'find shared elements between chart-1 and filter-1',
    `set:intersection:${injectedValue('chart-1')}:${injectedValue('filter-1')}`,
    {
      setOperator: {
        type: 'intersection',
        nodes: [
          { id: injectedValue('chart-1') },
          { id: injectedValue('filter-1') },
        ],
      },
    },
  );

  runQuery(
    'merge with cars from chart-1',
    `set:union:${injectedValue('chart-1')}`,
    {
      setOperator: {
        type: 'union',
        nodes: [
          { id: injectedValue('chart-1') },
        ],
      },
    },
  );

  runQuery(
    'merge cars of chart-1 with cars of filter-1',
    `set:union:${injectedValue('chart-1')}:${injectedValue('filter-1')}`,
    {
      setOperator: {
        type: 'union',
        nodes: [
          { id: injectedValue('chart-1') },
          { id: injectedValue('filter-1') },
        ],
      },
    },
  );

  // TODO: see if this needs to be changed to target=chart-1.
  runQuery(
    'merge into chart-1',
    `set:union:${injectedValue('chart-1')}`,
    {
      setOperator: {
        type: 'union',
        nodes: [
          { id: injectedValue('chart-1') },
        ],
      },
    },
  );

  runQuery(
    'find common cars among chart-1 and filter-1',
    `set:intersection:${injectedValue('chart-1')}:${injectedValue('filter-1')}`,
    {
      setOperator: {
        type: 'intersection',
        nodes: [
          { id: injectedValue('chart-1') },
          { id: injectedValue('filter-1') },
        ],
      },
    },
  );

  runQuery(
    'find different cars from chart-1',
    `set:difference:${injectedValue('chart-1')}`,
    {
      setOperator: {
        type: 'difference',
        nodes: [
          { id: injectedValue('chart-1') },
        ],
      },
    },
  );

  runQuery(
    'merge',
    'set:union',
    {
      setOperator: {
        type: 'union',
        nodes: [],
      },
    },
  );
});
