import { runQuery, injectedValue } from '../util';

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
  runQuery('encode mpg by red green color scale', colorScaleStringAnswer, colorScaleAnswer);
  runQuery('map mpg to red green color', colorScaleStringAnswer, colorScaleAnswer);
  runQuery('color encode mpg', colorScaleStringAnswer, colorScaleAnswer);

  runQuery(
    'add a color scale',
    'visuals:encoding::color:red-green',
    {
      visuals: [{
        encoding: {
          column: '',
          type: 'color',
          scale: 'red-green',
        },
      }],
    },
  );

  const categoricalScaleAnswer = {
    visuals: [{
      encoding: {
        column: injectedValue('mpg'),
        type: 'color',
        scale: 'categorical',
      },
    }],
  };
  const categoricalScaleStringAnswer = `visuals:encoding:${injectedValue('mpg')}:color:categorical`;
  runQuery('encode mpg by categorical colors', categoricalScaleStringAnswer, categoricalScaleAnswer);

  // The raw received value from Sempre is a range of two strings "5:6" because
  // NumberFn cannot parse "from ... to ...".
  runQuery(
    'map mpg to size from 5 to 6', `visuals:encoding:${injectedValue('mpg')}:size:5:6`,
    {
      visuals: [{
        encoding: {
          column: injectedValue('mpg'),
          type: 'size',
          scale: [5, 6],
        },
      }],
    },
  );

  // The verb "map" sometimes gets incorrectly injected by frontend if not enforced by the user.
  // This case is fixed using special rule.
  runQuery(
    'r_node_type_1 mpg to size from 5 to 6', `visuals:encoding:${injectedValue('mpg')}:size:5:6`,
    {
      visuals: [{
        encoding: {
          column: injectedValue('mpg'),
          type: 'size',
          scale: [5, 6],
        },
      }],
    },
  );
  
  runQuery(
    'r_node_type_1 mpg to size',
    `visuals:encoding:${injectedValue('mpg')}:size:1:10`,
    {
      visuals: [{
        encoding: {
          column: injectedValue('mpg'),
          type: 'size',
          scale: [1, 10],
        },
      }],
    },
  );

  runQuery(
    'encode mpg by size',
    `visuals:encoding:${injectedValue('mpg')}:size:1:10`,
    {
      visuals: [{
        encoding: {
          column: injectedValue('mpg'),
          type: 'size',
          scale: [1, 10],
        },
      }],
    },
  );
});
