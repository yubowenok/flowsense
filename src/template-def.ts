/**
 * Templates:
 * - data_item_verb data_item_operand [condition] [source] [target]
 * - column_verb column_operand [source] [target]
 * - node_verb node_operand
 * - standalone_command
 */

export const DATA_ITEMS_VERBS = [
  'r_chart',
  'r_select',
  'r_filter',
  'r_highlight',
  'r_link',
];

export const COLUMN_VERBS = [
  'r_extract',
  'r_chart',
  'r_select',
  'r_filter',
  'r_highlight',
  'r_link',
];

export const NODE_VERBS = [
  'union',
  'merge',
  'r_filter',
];

export const DATA_ITEMS_OPERANDS = [
  'the data',
  'the elements',
  'the selected elements',
];

export const COLUMN_OPERANDS = [
  'r_column_1',
  'r_column_1 and r_column_2',
  'r_column_1 of the elements',
  'r_column_1 of the selection',
];

export const NODE_OPERANDS = [
  'r_node_label_1',
  'r_node_label_1 and r_node_label_2',
  'r_node_label_1 with r_node_label_2',
  'union of r_node_label_1 and r_node_label_2',
  'difference between r_node_label_1 and r_node_label_2',
];

export const CONDITIONS = [
  '',
  'with a r_column_1 that contains r_string',
  'with a r_column_1 of r_string',
  'with a r_column_1 between r_number and r_number',
  'with a r_column_1 greater than r_number',
  'by r_column_1',
];

export const SOURCES = [
  '',
  'from r_node_label_1',
];

export const TARGETS = [
  '',
  'in a r_node_type_1',
];

export const STANDALONE_COMMANDS = [
  'set blue color',
  'color by blue',
  'change opacity to r_number',
  'set width r_number and opacity r_number',
  'encode r_column_1 by red green color scale',
  'map r_column_1 to red green color',
  'color encode r_column_1',
  'encode r_column_1 by size',
  'map r_column_1 to size from r_number to r_number',
  'layout the diagram',
  'load r_dataset_1 dataset',
  'r_chart distribution of r_column_1',
  'r_chart series of r_column_1 over r_column_2',
];
