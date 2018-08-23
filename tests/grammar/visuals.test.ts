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
    checkQuery('set blue color', done, 'visuals:assignment:color:blue', colorAnswer);
  });
  it('set color', done => {
    checkQuery('color by blue', done, 'visuals:assignment:color:blue', colorAnswer);
  });

  it('change opacity', done => {
    checkQuery('change opacity to 0.5', done, 'visuals:assignment:opacity:0.5', {
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
  const increaseStringAnswer = 'visuals:assignment:width:+';
  it('increase #1', done => {
    checkQuery('increase width', done, increaseStringAnswer, increaseAnswer);
  });
  it('increase #2', done => {
    checkQuery('make width larger', done, increaseStringAnswer, increaseAnswer);
  });

  it('decrease', done => {
    checkQuery('decrease opacity', done, 'visuals:assignment:opacity:-', {
      visuals: [{
        assignment: {
          opacity: '-',
        },
      }],
    });
  });

  it('set multiple visuals', done => {
    checkQuery('set width 5 and opacity 1', done, 'visuals:assignment:width:5.0:opacity:1.0', {
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
  const colorScaleStringAnswer = `visuals:encoding:${injectedValue('mpg')}:color:red-green`;
  it('color scale #1', done => {
    checkQuery('encode mpg by red green color scale', done, colorScaleStringAnswer, colorScaleAnswer);
  });
  it('color scale #2', done => {
    checkQuery('map mpg to red green color', done, colorScaleStringAnswer, colorScaleAnswer);
  });
  it('color scale default scale', done => {
    checkQuery('color encode mpg', done, colorScaleStringAnswer, colorScaleAnswer);
  });

  // The raw received value from Sempre is a range of two strings "5:6" because
  // NumberFn cannot parse "from ... to ...".
  it('numerical scale', done => {
    checkQuery('map mpg to size from 5 to 6', done, `visuals:encoding:${injectedValue('mpg')}:size:5:6`, {
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
    checkQuery('mpg by size', done, `visuals:encoding:${injectedValue('mpg')}:size:1:10`, {
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
