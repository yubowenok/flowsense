import { runQuery, injectedValue } from '../util';
import { DEFAULT_CHART_TYPE } from '@src/def';

describe('attribute filter: pattern matching', () => {
  runQuery(
    'find name equals buick',
    `filter:${injectedValue('name')}:=:buick`,
    {
      filters: [{
        column: injectedValue('name'),
        pattern: 'buick',
      }],
    },
  );

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
  runQuery('draw only name being buick', equalityStringAnswer, equalityAnswer);
  runQuery('show cars with a name of buick', equalityStringAnswer, equalityAnswer);
});
