import { checkQuery } from './util';

describe('diagram edit', () => {
  it('should undo #1', done => {
    checkQuery('undo', done, 'undo', {
      undo: true,
    });
  });

  it('should undo #2', done => {
    checkQuery('cancel', done, 'undo', {
      undo: true,
    });
  });

  it('should redo', done => {
    checkQuery('redo', done, 'redo', {
      redo: true,
    });
  });
});
