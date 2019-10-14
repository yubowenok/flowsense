import { runQuery, injectedValue } from '../util';
import { SELECTION, DEFAULT_SOURCE, DEFAULT_CHART_TYPE } from '@src/def';

describe('interactive selection and selection port', () => {
  const injectedScatterplot = injectedValue('scatterplot');
  const injectedHistogram = injectedValue('histogram');
  const injectedMpg = injectedValue('mpg');

  runQuery(
    'highlight the selected data',
    `highlight;source:${SELECTION}`,
    {
      highlight: true,
      source: [{
        id: DEFAULT_SOURCE,
        isSelection: true,
      }],
    },
  );

  runQuery(
    'highlight the selected cars in a scatterplot',
    `highlight;source:${SELECTION};target:${injectedScatterplot}`,
    {
      highlight: true,
      source: [{
        id: DEFAULT_SOURCE,
        isSelection: true,
      }],
      target: [{
        id: injectedScatterplot,
        isCreate: true,
      }],
    },
  );

  runQuery(
    'highlight selection in a histogram',
    `highlight;source:${SELECTION};target:${injectedHistogram}`,
    {
      highlight: true,
      source: [{
        id: DEFAULT_SOURCE,
        isSelection: true,
      }],
      target: [{
        id: injectedHistogram,
        isCreate: true,
      }],
    },
  );

  runQuery(
    'highlight the selected cars from the scatterplot',
    `highlight;source:${injectedScatterplot}:${SELECTION}`,
    {
      highlight: true,
      source: [{
        id: injectedScatterplot,
        isSelection: true,
      }],
    },
  );

  runQuery(
    'highlight selection from the scatterplot in a histogram plot',
    `highlight;source:${injectedScatterplot}:${SELECTION};target:${injectedHistogram}`,
    {
      highlight: true,
      source: [{
        id: injectedScatterplot,
        isSelection: true,
      }],
      target: [{
        id: injectedHistogram,
        isCreate: true,
      }],
    },
  );

  runQuery(
    'show selection',
    `target:${DEFAULT_CHART_TYPE};source:${SELECTION}`,
    {
      source: [{
        id: DEFAULT_SOURCE,
        isSelection: true,
      }],
      target: [{
        id: DEFAULT_CHART_TYPE,
        isCreate: true,
      }],
    },
  );

  runQuery(
    'show selection in a histogram',
    `target:${DEFAULT_CHART_TYPE};source:${SELECTION};target:${injectedHistogram}`,
    {
      source: [{
        id: DEFAULT_SOURCE,
        isSelection: true,
      }],
      target: [{
        id: injectedHistogram,
        isCreate: true,
      }],
    },
  );

  runQuery(
    'show mpg of the selection',
    `target:${DEFAULT_CHART_TYPE};columns:${injectedMpg};source:${SELECTION}`,
    {
      columns: [injectedMpg],
      source: [{
        id: DEFAULT_SOURCE,
        isSelection: true,
      }],
      target: [{
        id: DEFAULT_CHART_TYPE,
        isCreate: true,
      }],
    },
  );

  runQuery(
    'show mpg of the selected cars in a histogram',
      [
      `target:${injectedHistogram};columns:${injectedMpg};source:${SELECTION}`,
      `target:${DEFAULT_CHART_TYPE};columns:${injectedMpg};source:${SELECTION};target:${injectedHistogram}`,
    ],
    {
      columns: [injectedMpg],
      source: [{
        id: DEFAULT_SOURCE,
        isSelection: true,
      }],
      target: [{
        id: injectedHistogram,
        isCreate: true,
      }],
    },
  );

  runQuery(
    'show selected cars from the scatterplot in a histogram',
    [
      `target:${DEFAULT_CHART_TYPE};source:${injectedScatterplot}:${SELECTION};target:${injectedHistogram}`,
      `target:${DEFAULT_CHART_TYPE};source:${SELECTION};source:${injectedScatterplot};target:${injectedHistogram}`,
    ],
    {
      source: [{
        id: injectedScatterplot,
        isSelection: true,
      }],
      target: [{
        id: injectedHistogram,
        isCreate: true,
      }],
    },
  );
});
