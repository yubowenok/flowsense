import { checkQuery, injectedValue } from '../util';
import { SELECTION, DEFAULT_SOURCE } from '@src/def';

describe('constant extraction', () => {
  const injectedMpg = injectedValue('mpg');
  const injectedCylinders = injectedValue('cylinders');

  it('extract column #1', done => {
    checkQuery('extract mpg', done,
      `extract:${injectedMpg}`, {
        extract: {
          column: injectedMpg,
        },
      });
  });

  it('extract column #2', done => {
    checkQuery('retrieve the values of mpg', done,
      `extract:${injectedMpg}`, {
        extract: {
          column: injectedMpg,
        },
      });
  });

  it('extract column from selection #1', done => {
    checkQuery('extract mpg from selected cars', done,
      `extract:${injectedMpg}:${SELECTION}`, {
        source: [{
          id: DEFAULT_SOURCE,
          isSelection: true,
        }],
        extract: {
          column: injectedMpg,
        },
      });
  });

  it('extract column from selection #2', done => {
    checkQuery('extract selected cars\' mpg', done,
      `extract:${injectedMpg}:${SELECTION}`, {
        source: [{
          id: DEFAULT_SOURCE,
          isSelection: true,
        }],
        extract: {
          column: injectedMpg,
        },
      });
  });

  it('extract column from selection #3', done => {
    checkQuery('extract mpg of the selection', done,
      `extract:${injectedMpg}:${SELECTION}`, {
        source: [{
          id: DEFAULT_SOURCE,
          isSelection: true,
        }],
        extract: {
          column: injectedMpg,
        },
      });
  });
});
