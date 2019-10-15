import { runQuery, injectedValue } from '../util';

describe('visuals assignment', () => {
  const colorAnswer = {
    visuals: [{
      assignment: {
        color: 'blue',
      },
    }],
  };
  runQuery('set blue color', 'visuals:assignment:color:blue', colorAnswer);
  runQuery('color by blue', 'visuals:assignment:color:blue', colorAnswer);

  runQuery(
    'change opacity to 0.5',
    'visuals:assignment:opacity:0.5',
    {
      visuals: [{
        assignment: {
          opacity: .5,
        },
      }],
    },
  );

  const increaseAnswer = {
    visuals: [{
      assignment: {
        width: '+',
      },
    }],
  };
  const increaseStringAnswer = 'visuals:assignment:width:+';
  runQuery('increase width', increaseStringAnswer, increaseAnswer);
  runQuery('make width larger', increaseStringAnswer, increaseAnswer);

  runQuery(
    'decrease opacity',
    'visuals:assignment:opacity:-',
    {
      visuals: [{
        assignment: {
          opacity: '-',
        },
      }],
    },
  );

  runQuery(
    'set width 5 and opacity 1',
    'visuals:assignment:width:5.0:opacity:1.0',
    {
      visuals: [{
        assignment: {
          width: 5,
          opacity: 1,
        },
      }],
    },
  );
});
