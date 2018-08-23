import _ from 'lodash';

import { checkQuery, injectedValue } from '../util';

describe('attribute filter: pattern matching', () => {
  const equalityStringAnswer = `filter:${injectedValue('name')}:=:buick`;
  const equalityAnswer = {
    filters: [{
      column: injectedValue('name'),
      pattern: 'buick',
    }],
  };
  it('equality using "equal"', done => {
    checkQuery('find name equals buick', done, equalityStringAnswer, equalityAnswer);
  });
  it('equality using "being"', done => {
    checkQuery('draw only name being buick', done, equalityStringAnswer, equalityAnswer);
  });
  it('equality using "a value of"', done => {
    checkQuery('show cars with a name of buick', done, equalityStringAnswer, equalityAnswer);
  });
});
