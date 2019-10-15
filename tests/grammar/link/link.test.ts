import { runQuery, injectedValue } from '../util';
import { LINK_OF, DEFAULT_SOURCE, SELECTION } from '@src/def';

describe('constant extraction', () => {
  const injectedName = injectedValue('name');
  const injectedOrigin = injectedValue('origin');
  const injectedChart = injectedValue('chart-1');
  const injectedFilter = injectedValue('filter-1');
  const injectedScatterplot = injectedValue('scatterplot');

  runQuery(
    'link the cars by name',
    `link:${injectedName}`,
    {
      link: {
        extractColumn: injectedName,
      },
    },
  );

  runQuery(
    'link the cars with a same name',
    `link:${injectedName}`,
    {
      link: {
        extractColumn: injectedName,
      },
    },
  );

  runQuery(
    'link the cars by name from chart-1',
    `link:${injectedName};source:${injectedChart}`,
    {
      link: {
        extractColumn: injectedName,
      },
      source: [
        { id: injectedChart },
      ],
    },
  );

  runQuery(
    'link by name with chart-1',
    `link:${injectedName}:_link_of:${injectedChart}`,
    {
      link: {
        extractColumn: injectedName,
      },
      source: [
        { id: injectedChart },
      ],
    },
  );

  runQuery(
    'link the cars by name from chart-1 scatterplot',
    `link:${injectedName};source:${injectedChart}`,
    {
      link: {
        extractColumn: injectedName,
      },
      source: [
        { id: injectedChart },
      ],
    },
    'node label immediately followed by node type',
  );

  runQuery(
    'link the cars by name from chart-1 and filter-1',
    `link:${injectedName};source:${injectedChart}:${injectedFilter}`,
    {
      link: {
        extractColumn: injectedName,
      },
      source: [
        { id: injectedChart },
        { id: injectedFilter },
      ],
    },
  );

  runQuery(
    'link the selected cars by name',
    `link:${SELECTION}:${injectedName}`,
    {
      link: {
        extractColumn: injectedName,
      },
      source: [
        { id: DEFAULT_SOURCE, isSelection: true },
      ],
    },
  );

  runQuery(
    'link the cars by name from chart-1 and filter-1 into a scatterplot',
    `link:${injectedName};source:${injectedChart}:${injectedFilter};target:${injectedScatterplot}`,
    {
      link: {
        extractColumn: injectedName,
      },
      source: [
        { id: injectedChart },
        { id: injectedFilter },
      ],
      target: [ { id: injectedScatterplot, isCreate: true } ],
    },
  );

  runQuery(
    'link name of chart-1 with origin of filter-1',
    `link:${injectedName}:${LINK_OF}:${injectedChart}:${injectedOrigin}:${LINK_OF}:${injectedFilter}`,
    {
      link: {
        extractColumn: injectedName,
        filterColumn: injectedOrigin,
      },
      source: [
        { id: injectedChart },
        { id: injectedFilter },
      ],
    },
  );
});
