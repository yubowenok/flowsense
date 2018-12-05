import { checkQuery, injectedValue } from './util';
import { SELECTION } from '@src/def';

const injectedScatterplot = injectedValue('scatterplot');
const injectedHistogram = injectedValue('histogram');

describe('connect and disconnect', () => {
  it('connect using node labels', done => {
    checkQuery('connect chart-1 and filter-1', done,
      `edge:connect:${injectedValue('chart-1')}:${injectedValue('filter-1')}`,
      {
        edge: {
          type: 'connect',
          nodes: [
            { id: injectedValue('chart-1') },
            { id: injectedValue('filter-1') },
          ],
        },
      });
  });

  it('connect using node types', done => {
    checkQuery('connect the scatterplot and the histogram', done,
      `edge:connect:${injectedScatterplot}:${injectedHistogram}`,
      {
        edge: {
          type: 'connect',
          nodes: [
            { id: injectedScatterplot },
            { id: injectedHistogram },
          ],
        },
      });
  });

  it('connect selection using node labels', done => {
    checkQuery('connect the selection of chart-1 with filter-1', done,
      `edge:connect:${injectedValue('chart-1')}:${SELECTION}:${injectedValue('filter-1')}`,
      {
        edge: {
          type: 'connect',
          nodes: [
            { id: injectedValue('chart-1'), isSelection: true },
            { id: injectedValue('filter-1') },
          ],
        },
      });
  });

  it('connect selection using node types', done => {
    checkQuery('connect the selection of the scatterplot with the histogram', done,
      `edge:connect:${injectedScatterplot}:${SELECTION}:${injectedHistogram}`,
      {
        edge: {
          type: 'connect',
          nodes: [
            { id: injectedScatterplot, isSelection: true },
            { id: injectedHistogram },
          ],
        },
      });
  });

  it('disconnect using node labels', done => {
    checkQuery('disconnect chart-1 and filter-1', done,
      `edge:disconnect:${injectedValue('chart-1')}:${injectedValue('filter-1')}`,
      {
        edge: {
          type: 'disconnect',
          nodes: [
            { id: injectedValue('chart-1') },
            { id: injectedValue('filter-1') },
          ],
        },
      });
  });

  it('disconnect selection from input', done => {
    checkQuery('disconnect the selection of chart-1 from filter-1', done,
      `edge:disconnect:${injectedValue('chart-1')}:${SELECTION}:${injectedValue('filter-1')}`,
      {
        edge: {
          type: 'disconnect',
          nodes: [
            { id: injectedValue('chart-1'), isSelection: true },
            { id: injectedValue('filter-1') },
          ],
        },
      });
  });
});
