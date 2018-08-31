import { checkQuery, injectedValue } from '../util';
import { SELECTION, DEFAULT_SOURCE, LINK_OF } from '@src/def';

describe('constant extraction', () => {
  const injectedName = injectedValue('name');
  const injectedOrigin = injectedValue('origin');
  const injectedChart = injectedValue('chart-1');
  const injectedFilter = injectedValue('filter-1');
  const injectedScatterplot = injectedValue('scatterplot');

  it('link by a column #1', done => {
    checkQuery('link the cars by name', done,
      `link:${injectedName}`, {
        link: {
          extractColumn: injectedName,
          filterColumn: injectedName,
        },
      });
  });

  it('link by a column #2', done => {
    checkQuery('link the cars with a same name', done,
      `link:${injectedName}`, {
        link: {
          extractColumn: injectedName,
          filterColumn: injectedName,
        },
      });
  });

  it('link by a column #2', done => {
    checkQuery('link the cars with a same name', done,
      `link:${injectedName}`, {
        link: {
          extractColumn: injectedName,
          filterColumn: injectedName,
        },
      });
  });

  it('link with source node', done => {
    checkQuery('link the cars by name from chart-1', done,
      `link:${injectedName};source:${injectedChart}`, {
        link: {
          extractColumn: injectedName,
          filterColumn: injectedName,
        },
        source: [
          { id: injectedChart, isSelection: false },
        ],
      });
  });

  it('link with source nodes', done => {
    checkQuery('link the cars by name from chart-1 and filter-1', done,
      `link:${injectedName};source:${injectedChart}:${injectedFilter}`, {
        link: {
          extractColumn: injectedName,
          filterColumn: injectedName,
        },
        source: [
          { id: injectedChart, isSelection: false },
          { id: injectedFilter, isSelection: false },
        ],
      });
  });

  it('link with source nodes and target node', done => {
    checkQuery('link the cars by name from chart-1 and filter-1 into a scatterplot', done,
      `link:${injectedName};source:${injectedChart}:${injectedFilter};target:${injectedScatterplot}`, {
        link: {
          extractColumn: injectedName,
          filterColumn: injectedName,
        },
        source: [
          { id: injectedChart, isSelection: false },
          { id: injectedFilter, isSelection: false },
        ],
        target: [ { id: injectedScatterplot, isCreate: true } ],
      });
  });

  it('link with extract and filter columns', done => {
    checkQuery('link name of chart-1 with origin of filter-1', done,
      `link:${injectedName}:${LINK_OF}:${injectedChart}:${injectedOrigin}:${LINK_OF}:${injectedFilter}`, {
        link: {
          extractColumn: injectedName,
          filterColumn: injectedOrigin,
        },
        source: [
          { id: injectedChart, isSelection: false },
          { id: injectedFilter, isSelection: false },
        ],
      });
  });
});
