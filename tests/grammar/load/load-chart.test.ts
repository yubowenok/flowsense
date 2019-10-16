import { runQuery, injectedValue } from '../util';
import { DEFAULT_CHART_TYPE } from '@src/def';

describe('load dataset and draw charts', () => {
  const injectedIris = injectedValue('iris');
  const injectedScatterplot = injectedValue('scatterplot');

  runQuery(
    'load iris dataset and show scatterplot',
    `load:${injectedIris};target:${injectedScatterplot}`,
    {
      loadDataset: injectedIris,
      target: [{
        id: injectedScatterplot,
        isCreate: true,
      }],
    },
  );

  runQuery(
    'show iris plot',
    `load:${injectedIris};target:${DEFAULT_CHART_TYPE}`,
    {
      loadDataset: injectedIris,
      target: [{
        id: DEFAULT_CHART_TYPE,
        isCreate: true,
      }],
    },
  );

  runQuery(
    'show iris scatterplot',
    `load:${injectedIris};target:${injectedScatterplot}`,
    {
      loadDataset: injectedIris,
      target: [{
        id: injectedScatterplot,
        isCreate: true,
      }],
    },
  );
});
