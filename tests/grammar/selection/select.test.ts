import _ from 'lodash';

import { checkQuery, injectedValue } from '../util';

describe('interactive selection and selection port', () => {
  const injectedMpg = injectedValue('mpg');
  const injectedName = injectedValue('name');

  it('select with range condition', done => {
    checkQuery('select cars with mpg greater than 15', done,
      `select;filter:${injectedMpg}:>=:15.0`, {
        select: true,
        filters: [{
          column: injectedMpg,
          range: {
            min: '15.0',
          },
        }],
      });
  });

  it('select with pattern condition', done => {
    checkQuery('select cars with a name of buick', done,
      `select;filter:${injectedName}:=:buick`, {
        select: true,
        filters: [{
          column: injectedName,
          pattern: 'buick',
        }],
      });
  });
});
