import { checkQuery, injectedValue } from '../util';
import { DEFAULT_CHART_TYPE } from '@src/def';

describe('attribute filter: pattern matching', () => {
  it('equality using "equal"', done => {
    checkQuery('find name equals buick', done,
    `filter:${injectedValue('name')}:=:buick`, {
      filters: [{
        column: injectedValue('name'),
        pattern: 'buick',
      }],
    });
  });

  const equalityStringAnswer = `target:${DEFAULT_CHART_TYPE};filter:${injectedValue('name')}:=:buick`;
  const equalityAnswer = {
    filters: [{
      column: injectedValue('name'),
      pattern: 'buick',
    }],
    target: [{
      id: DEFAULT_CHART_TYPE,
      isCreate: true,
    }],
  };
  it('equality using "being"', done => {
    checkQuery('draw only name being buick', done, equalityStringAnswer, equalityAnswer);
  });
  it('equality using "a value of"', done => {
    checkQuery('show cars with a name of buick', done, equalityStringAnswer, equalityAnswer);
  });
});
