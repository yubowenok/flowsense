import { checkQuery, injectedValue } from './util';
import { DEFAULT_CHART_TYPE } from '@src/def';

const injectedMpg = injectedValue('mpg');
const injectedCylinders = injectedValue('cylinders');

describe('command with punctuation', () => {
  it('should render chart with period', done => {
    checkQuery('show a plot.', done, `target:${DEFAULT_CHART_TYPE}`, {
      target: [
        { id: DEFAULT_CHART_TYPE, isCreate: true },
      ],
    });
  });

  it('should render multiple columns separated by commas', done => {
    checkQuery('show mpg, cylinders', done,
      `target:${DEFAULT_CHART_TYPE};columns:${injectedMpg}&${injectedCylinders}`, {
      columns: [injectedMpg, injectedCylinders],
      target: [
        { id: DEFAULT_CHART_TYPE, isCreate: true },
      ],
    });
  });

  it('should render multiple columns separated by commas', done => {
    checkQuery('show mpg, cylinders', done,
      `target:${DEFAULT_CHART_TYPE};columns:${injectedMpg}&${injectedCylinders}`, {
      columns: [injectedMpg, injectedCylinders],
      target: [
        { id: DEFAULT_CHART_TYPE, isCreate: true },
      ],
    });
  });

  it('should create filter with a question-like query', done => {
    checkQuery('could you find the cars with mpg greater than 10?', done,
      `filter:${injectedMpg}:>=:10.0`, {
      filters: [
        { column: injectedMpg, range: { min: '10.0' } },
      ],
    });
  });
});
