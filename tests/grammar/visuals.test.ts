import _ from 'lodash';

import { checkQuery, injectedValue } from './util';

describe('visuals assignment', () => {
  const colorAnswer = {
    visuals: [{
      assignment: {
        color: 'blue',
      },
    }],
  };
  it('set color', done => {
    checkQuery('set blue color', done, colorAnswer);
  });
  it('set color', done => {
    checkQuery('color by blue', done, colorAnswer);
  });

  it('change opacity', done => {
    checkQuery('change opacity to 0.5', done, {
      visuals: [{
        assignment: {
          opacity: .5,
        },
      }],
    });
  });

  const increaseAnswer = {
    visuals: [{
      assignment: {
        width: '+',
      },
    }],
  };
  it('increase', done => {
    checkQuery('increase width', done, increaseAnswer);
  });
  it('increase', done => {
    checkQuery('make width larger', done, increaseAnswer);
  });

  it('decrease', done => {
    checkQuery('decrease opacity', done, {
      visuals: [{
        assignment: {
          opacity: '-',
        },
      }],
    });
  });

  it('set multiple visuals', done => {
    checkQuery('set width 5 and opacity 1', done, {
      visuals: [{
        assignment: {
          width: 5,
          opacity: 1,
        },
      }],
    });
  });
});

describe('visuals encoding', () => {
  const colorScaleAnswer = {
    visuals: [{
      encoding: {
        column: injectedValue('mpg'),
        type: 'color',
        scale: 'red-green',
      },
    }],
  };

  it('color scale', done => {
    checkQuery('encode mpg by red green color scale', done, colorScaleAnswer);
  });
  it('color scale', done => {
    checkQuery('map mpg to red green color', done, colorScaleAnswer);
  });

  it('color scale default scale', done => {
    checkQuery('color encode mpg', done, colorScaleAnswer);
  });

  // The raw received value from Sempre is a range of two strings "5:6" because
  // NumberFn cannot parse "from ... to ...".
  it('numerical scale', done => {
    checkQuery('map mpg to size from 5 to 6', done, {
      visuals: [{
        encoding: {
          column: injectedValue('mpg'),
          type: 'size',
          scale: [5, 6],
        },
      }],
    });
  });

  it('numerical scale default range', done => {
    checkQuery('mpg by size', done, {
      visuals: [{
        encoding: {
          column: injectedValue('mpg'),
          type: 'size',
          scale: [1, 10],
        },
      }],
    });
  });
});
