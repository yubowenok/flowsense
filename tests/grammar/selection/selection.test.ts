import { checkQuery, injectedValue } from '../util';
import { SELECTION, DEFAULT_SOURCE, DEFAULT_CHART_TYPE } from '@src/def';

describe('interactive selection and selection port', () => {
  const injectedScatterplot = injectedValue('scatterplot');
  const injectedHistogram = injectedValue('histogram');
  const injectedMpg = injectedValue('mpg');

  it('highlight selection', done => {
    checkQuery('highlight the selected data', done, `highlight;source:${SELECTION}`, {
      highlight: true,
      source: [{
        id: DEFAULT_SOURCE,
        isSelection: true,
      }],
    });
  });

  it('highlight selection in a new chart #1', done => {
    checkQuery('highlight the selected cars in a scatterplot', done,
      `highlight;source:${SELECTION};target:${injectedScatterplot}`, {
        highlight: true,
        source: [{
          id: DEFAULT_SOURCE,
          isSelection: true,
        }],
        target: [{
          id: injectedScatterplot,
          isCreate: true,
        }],
      });
  });

  it('highlight selection in a new chart #2', done => {
    checkQuery('highlight selection in a histogram', done,
      `highlight;source:${SELECTION};target:${injectedHistogram}`, {
        highlight: true,
        source: [{
          id: DEFAULT_SOURCE,
          isSelection: true,
        }],
        target: [{
          id: injectedHistogram,
          isCreate: true,
        }],
      });
  });

  it('highlight selection from a chart', done => {
    checkQuery('highlight the selected cars from the scatterplot', done,
      `highlight;source:${injectedScatterplot}:${SELECTION}`, {
        highlight: true,
        source: [{
          id: injectedScatterplot,
          isSelection: true,
        }],
      });
  });

  it('highlight selection with source and target', done => {
    checkQuery('highlight selection from the scatterplot in a histogram plot', done,
      `highlight;source:${injectedScatterplot}:${SELECTION};target:${injectedHistogram}`, {
        highlight: true,
        source: [{
          id: injectedScatterplot,
          isSelection: true,
        }],
        target: [{
          id: injectedHistogram,
          isCreate: true,
        }],
      });
  });

  it('show selection', done => {
    checkQuery('show selection', done,
      `target:${DEFAULT_CHART_TYPE};source:${SELECTION}`, {
        source: [{
          id: DEFAULT_SOURCE,
          isSelection: true,
        }],
        target: [{
          id: DEFAULT_CHART_TYPE,
          isCreate: true,
        }],
      });
  });

  it('show selection with chart target', done => {
    checkQuery('show selection in a histogram', done,
      `target:${injectedHistogram};source:${SELECTION}`, {
        source: [{
          id: DEFAULT_SOURCE,
          isSelection: true,
        }],
        target: [{
          id: injectedHistogram,
          isCreate: true,
        }],
      });
  });

  it('show columns for selection', done => {
    checkQuery('show mpg of the selection', done,
      `target:${DEFAULT_CHART_TYPE};columns:${injectedMpg};source:${SELECTION}`, {
        columns: [injectedMpg],
        source: [{
          id: DEFAULT_SOURCE,
          isSelection: true,
        }],
        target: [{
          id: DEFAULT_CHART_TYPE,
          isCreate: true,
        }],
      });
  });

  it('show columns for selection with chart target', done => {
    checkQuery('show mpg of the selected cars in a histogram', done,
    `target:${injectedHistogram};columns:${injectedMpg}:${SELECTION}`, {
        columns: [injectedMpg],
        source: [{
          id: DEFAULT_SOURCE,
          isSelection: true,
        }],
        target: [{
          id: injectedHistogram,
          isCreate: true,
        }],
      });
  });
});
