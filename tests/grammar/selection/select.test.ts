import { runQuery, injectedValue } from '../util';

describe('interactive selection and selection port', () => {
  const injectedMpg = injectedValue('mpg');
  const injectedName = injectedValue('name');

  runQuery(
    'select cars with mpg greater than 15',
    `select;filter:${injectedMpg}:>=:15.0`,
    {
      select: true,
      filters: [{
        column: injectedMpg,
        range: {
          min: '15.0',
        },
      }],
    },
  );

  runQuery(
    'select cars with a name of buick',
    `select;filter:${injectedName}:=:buick`,
    {
      select: true,
      filters: [{
        column: injectedName,
        pattern: 'buick',
      }],
    },
  );
});
