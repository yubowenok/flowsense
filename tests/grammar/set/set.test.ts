import { checkQuery, injectedValue } from '../util';

const injectedScatterplot = injectedValue('scatterplot');
const injectedHistogram = injectedValue('histogram');

describe('set operator', () => {
  it('union with node labels', done => {
    checkQuery('union chart-1 and filter-1', done,
      `set:union:${injectedValue('chart-1')}:${injectedValue('filter-1')}`,
      {
        setOperator: {
          type: 'union',
          nodes: [
            { id: injectedValue('chart-1') },
            { id: injectedValue('filter-1') },
          ],
        },
      });
  });

  it('union with node types', done => {
    checkQuery('union the scatterplot with the histogram', done,
      `set:union:${injectedScatterplot}:${injectedHistogram}`,
      {
        setOperator: {
          type: 'union',
          nodes: [
            { id: injectedScatterplot },
            { id: injectedHistogram },
          ],
        },
      });
  });

  it('difference with node labels', done => {
    checkQuery('find difference between chart-1 and filter-1', done,
      `set:difference:${injectedValue('chart-1')}:${injectedValue('filter-1')}`,
      {
        setOperator: {
          type: 'difference',
          nodes: [
            { id: injectedValue('chart-1') },
            { id: injectedValue('filter-1') },
          ],
        },
      });
  });

  it('intersection with node labels', done => {
    checkQuery('find shared elements between chart-1 and filter-1', done,
      `set:intersection:${injectedValue('chart-1')}:${injectedValue('filter-1')}`,
      {
        setOperator: {
          type: 'intersection',
          nodes: [
            { id: injectedValue('chart-1') },
            { id: injectedValue('filter-1') },
          ],
        },
      });
  });

  it('union with a node given label', done => {
    checkQuery('merge with cars from chart-1', done,
      `set:union:${injectedValue('chart-1')}`,
      {
        setOperator: {
          type: 'union',
          nodes: [
            { id: injectedValue('chart-1') },
          ],
        },
      });
  });

  it('union with stop nouns and node labels', done => {
    checkQuery('merge cars of chart-1 with cars of filter-1', done,
      `set:union:${injectedValue('chart-1')}:${injectedValue('filter-1')}`,
      {
        setOperator: {
          type: 'union',
          nodes: [
            { id: injectedValue('chart-1') },
            { id: injectedValue('filter-1') },
          ],
        },
      });
  });

  it('union with target', done => {
    // TODO: see if this needs to be changed to target=chart-1.
    checkQuery('merge into chart-1', done, `set:union:${injectedValue('chart-1')}`, {
      setOperator: {
        type: 'union',
        nodes: [
          { id: injectedValue('chart-1') },
        ],
      },
    });
  });

  it('intersection with node labels', done => {
    checkQuery('find common cars among chart-1 and filter-1', done,
      `set:intersection:${injectedValue('chart-1')}:${injectedValue('filter-1')}`,
      {
        setOperator: {
          type: 'intersection',
          nodes: [
            { id: injectedValue('chart-1') },
            { id: injectedValue('filter-1') },
          ],
        },
      });
  });

  it('difference with node label', done => {
    checkQuery('find different cars from chart-1', done, `set:difference:${injectedValue('chart-1')}`, {
      setOperator: {
        type: 'difference',
        nodes: [
          { id: injectedValue('chart-1') },
        ],
      },
    });
  });

  it('union without node specification', done => {
    checkQuery('merge', done, 'set:union', {
      setOperator: {
        type: 'union',
        nodes: [],
      },
    });
  });
});