import * as template from './template-def';

/**
 * Generates data item operation templates.
 *   data_item_verb data_item_operand [condition] [source] [target]
 */
const dataItemTemplates = (): string[] => {
  const examples = [];
  for (const verb of template.DATA_ITEMS_VERBS) {
    for (const operand of template.DATA_ITEMS_OPERANDS) {
      for (const condition of template.CONDITIONS) {
        for (const source of template.SOURCES) {
          for (const target of template.TARGETS) {
            examples.push([
              verb,
              operand,
              condition,
              source,
              target,
            ].join(' ').replace(/\s+/g, ' '));
          }
        }
      }
    }
  }
  return examples;
};

/**
 * Generates column operation templates.
 *   column_verb column_operand [source] [target]
 */
const columnTemplates = (): string[] => {
  const examples = [];
  for (const verb of template.COLUMN_VERBS) {
    for (const operand of template.COLUMN_OPERANDS) {
      for (const source of template.SOURCES) {
        for (const target of template.TARGETS) {
          examples.push([
            verb,
            operand,
            source,
            target,
          ].join(' ').replace(/\s+/g, ' '));
        }
      }
    }
  }
  return examples;
};

/**
 * Generates node operation temlpates.
 *   node_verb node_operand
 */
const nodeTemplates = (): string[] => {
  const examples = [];
  for (const verb of template.NODE_VERBS) {
    for (const operand of template.NODE_OPERANDS) {
      examples.push(verb + ' ' + operand);
    }
  }
  return examples;
};

/**
 * Generates standalone templates.
 *   standalone_command
 */
const standaloneTemplates = (): string[] => {
  return template.STANDALONE_COMMANDS.concat();
};

/**
 * Generates all templates.
 */
export const allTemplates = (): string[] => {
  const groups = [
    dataItemTemplates(),
    columnTemplates(),
    standaloneTemplates(),
    nodeTemplates(),
  ];
  // Mix the groups
  const templates = [];
  let done = false;
  while (!done) {
    done = true;
    for (const group of groups) {
      if (group.length) {
        templates.push(group.shift());
        done = false;
      }
    }
  }
  return templates;
};
