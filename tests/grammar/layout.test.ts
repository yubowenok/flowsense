import _ from 'lodash';

import { checkQuery } from './util';

describe('automatic layout', () => {
  it('should adjust layout', done => {
    checkQuery('adjust the diagram layout', done, 'auto-layout', {
      autoLayout: true,
    });
  });

  it('should auto layout', done => {
    checkQuery('auto layout', done, 'auto-layout', {
      autoLayout: true,
    });
  });

  it('should layout with keyword "layout"', done => {
    checkQuery('layout the graph', done, 'auto-layout', {
      autoLayout: true,
    });
  });
});
