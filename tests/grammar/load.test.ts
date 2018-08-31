import { checkQuery, injectedValue } from './util';

describe('load dataset', () => {
  it('should load dataset with stop noun "dataset"', done => {
    checkQuery('load iris dataset', done, `load:${injectedValue('iris')}`, {
      loadDataset: injectedValue('iris'),
    });
  });

  it('should load dataset only with dataset name', done => {
    checkQuery('open iris', done, `load:${injectedValue('iris')}`, {
      loadDataset: injectedValue('iris'),
    });
  });
});
