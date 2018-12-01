import _ from 'lodash';
import { SELECTION, DEFAULT_SOURCE, DEFAULT_CHART_TYPE, LINK_OF } from './def';

interface VisualsSpecification {
  assignment?: { [prop: string]: string | number };
  encoding?: {
    column: string;
    type: string; // which visual property
    scale: string | number[]; // color scale id or numerical scale range
  };
}

interface FilterSpecification {
  column: string;
  // Filter type is inferred by which of the following properties is present.
  pattern?: string;
  sampling?: 'random';
  extremum?: 'minimum' | 'maximum';
  range?: {
    min?: number | string;
    max?: number | string;
  };
  amount?: number;
  amountType?: 'percentage' | 'count';
}

interface SetOperatorSpecification {
  type: string; // union, intersection, difference
  nodes: string[]; // node labels
}

interface ExtractSpecification {
  column: string;
}

interface LinkSpecification {
  extractColumn?: string;
  filterColumn?: string;
}

export interface QueryValue {
  loadDataset?: string;
  autoLayout?: boolean;
  columns?: string[];
  seriesColumn?: string;
  groupByColumn?: string;
  visuals?: VisualsSpecification[];
  filters?: FilterSpecification[];
  extract?: ExtractSpecification;
  link?: LinkSpecification;
  setOperator?: SetOperatorSpecification;
  source?: Array<{
    id: string; // node label or node type
    isSelection?: boolean;
  }>;
  target?: Array<{
    id: string; // node label or node type
    isCreate: boolean;
  }>;

  // special operation flags
  highlight?: boolean;
  select?: boolean;
  undo?: boolean;
  redo?: boolean;
}

/**
 * Parses an amount string, i.e. count or percentage.
 */
const parseAmount = (value: string): { amount: number, amountType: 'count' | 'percentage' } => {
  const amountStr = value;
  let amount: number;
  let amountType: 'percentage' | 'count' = 'percentage';
  if (amountStr.match(/_\%$/)) {
    // The value is a percentage value between [0, 1].
    amount = +amountStr.match(/^(.*)_\%$/)[1] * 100;
  } else if (amountStr.match(/\%$/)) {
    // The value is a percentage between [0, 100].
    amount = +amountStr.match(/^(.*)\%$/)[1];
  } else {
    // Count, not percentage.
    amount = +amountStr;
    amountType = 'count';
  }
  return { amount, amountType };
};

/**
 * Adds a series column specification to the result.
 */
const addSeriesColumn = (result: QueryValue, values: string[]) => {
  result.seriesColumn = values[0];
};

/**
 * Adds a group by column specification to the result.
 */
const addGroupByColumn = (result: QueryValue, values: string[]) => {
  result.groupByColumn = values[0];
};

/**
 * Adds a filter specification to the result.
 */
const addFilter = (result: QueryValue, values: string[]) => {
  if (!result.filters) {
    result.filters = [];
  }
  const type = values[1];
  const spec: FilterSpecification = {
    column: values[0],
  };
  if (type === undefined) { // only column is given, no filter type
    result.filters.push(spec);
    return;
  }
  values = values.slice(2);
  if (type === 'pattern' || type === '=') { // '=' is pattern matching
    spec.pattern = values[0];
  } else if (type === 'range' || type === '[]' || type.indexOf('=') !== -1) { // '<=', '>=' are range matching
    if (type === 'range' || type === '[]') {
      spec.range = { min: values[0], max: values[1] };
    } else { // setting min and max separately.
      spec.range = {};
      values = [type].concat(values);
      while (values.length) {
        if (values[0] === '>=') {
          spec.range.min = values[1];
        } else if (values[0] === '<=') {
          spec.range.max = values[1];
        }
        values = values.slice(2);
      }
    }
  } else if (type === 'extremum' || type === 'sampling') {
    if (type === 'extremum') {
      spec.extremum = values[0] === 'min' ? 'minimum' : 'maximum'; // min or max
      values.shift();
    } else {
      spec.sampling = 'random';
    }
    _.extend(spec, parseAmount(values[0]));
    values.shift();
    if (values[0] === 'group_by') {
      addGroupByColumn(result, values.slice(1));
    }
  }
  result.filters.push(spec);
};

/**
 * Adds visuals configuration to the result.
 */
const addVisuals = (result: QueryValue, values: string[]) => {
  if (!result.visuals) {
    result.visuals = [];
  }
  let entry: VisualsSpecification = {};
  if (values[0] === 'assignment') {
    const visuals: { [prop: string]: string | number } = {};
    for (let index = 1; index < values.length; index += 2) {
      const prop = values[index];
      const value = values[index + 1];
      if (value === '+' || value === '-' || // increase and decrease
        prop === 'color' || prop === 'border') {
        visuals[prop] = value;
      } else {
        visuals[prop] = +value; // numerical property
      }
    }
    entry = { assignment: visuals };
  } else if (values[0] === 'encoding') {
    entry = {
      encoding: {
        column: values[1],
        type: values[2],
        scale: values[4] !== undefined ? [+values[3], +values[4]] : values[3],
      },
    };
  } else {
    console.error('cannot parse visuals values', values);
  }
  result.visuals.push(entry);
};

/**
 * Adds a source node specification to the result.
 */
const addSource = (result: QueryValue, values: string[]) => {
  if (!result.source) {
    result.source = [];
  }
  const id = values[0] === SELECTION ? DEFAULT_SOURCE : values[0];
  const isSelection = values[0] === SELECTION || values[1] === SELECTION;
  result.source.push({ id, isSelection });
  values = values.slice(values[1] === SELECTION ? 2 : 1);
  if (values.length) {
    addSource(result, values);
  }
};

/**
 * Adds a target node specification to the result.
 */
const addTarget = (result: QueryValue, values: string[]) => {
  if (!result.target) {
    result.target = [];
  }
  const isCreate = values[1] !== 'no_create';
  if (values[0] !== DEFAULT_CHART_TYPE) {
    // If the value is not default chart type, and a default chart type is present.
    // We replace it with a more specific chart type.
    for (const target of result.target) {
      if (target.id === DEFAULT_CHART_TYPE) {
        target.id = values[0];
        return;
      }
    }
  }
  result.target.push({
    id: values[0],
    isCreate,
  });
};

/**
 * Adds set operator specification to the result.
 */
const addSetOperator = (result: QueryValue, values: string[]) => {
  result.setOperator = {
    type: values[0],
    nodes: values.slice(1),
  };
};

/**
 * Adds a list of columns to the result.
 * The column specification may contain series and groupBy column specifications.
 */
const addColumns = (result: QueryValue, values: string[]) => {
  if (result.columns) {
    console.error('duplicate configuration of columns');
  }
  result.columns = values[0].split('&');
  values = values.slice(1);
  while (values.length) {
    if (values[0] === 'series') {
      addSeriesColumn(result, values.slice(1));
    } else if (values[0] === 'group_by') {
      addGroupByColumn(result, values.slice(1));
    } else if (values[0] === SELECTION) {
      addSource(result, [SELECTION]);
    } else {
      console.error(`unknown columns specification ${values[0]}`);
      break;
    }
    values = values.slice(2);
  }
};

/**
 * Turns on highlight flag in the result.
 */
const addHighlight = (result: QueryValue, values: string[]) => {
  result.highlight = true;
};

/**
 * Turns on select flag in the result.
 */
const addSelect = (result: QueryValue, values: string[]) => {
  result.select = true;
};

/**
 * Adds constant extraction to the result.
 */
const addExtract = (result: QueryValue, values: string[]) => {
  result.extract = {
    column: values[0],
  };
  if (values[1] === SELECTION) {
    addSource(result, [SELECTION]);
  }
};

/**
 * Adds node linking to the result.
 */
const addLink = (result: QueryValue, values: string[]) => {
  let extractColumn: string = '';
  let filterColumn: string = '';
  const columns: string[] = [];
  while (values.length) {
    if (values[0] === SELECTION) {
      addSource(result, [values[0]]);
      values.shift();
    } else {
      const column: string = values[0];
      if (values.length >= 3 && values[1] === LINK_OF) {
        addSource(result, [values[2]]);
        values = values.slice(3);
      } else {
        values.shift();
      }
      columns.push(column);
    }
  }
  if (columns.length >= 2) {
    extractColumn = columns[0];
    filterColumn = columns[1];
  } else {
    extractColumn = columns[0];
    filterColumn = undefined;
  }
  result.link = { extractColumn, filterColumn };
};

/**
 * Parses the query value (string) into a JSON object.
 */
export const parseQueryValue = (value: string): QueryValue => {
  const pairStrings = value.replace(/\s+/, '').split(';');
  const result: QueryValue = {};
  for (const str of pairStrings) {
    const tokens = str.split(':');
    const key = tokens[0];
    const values = tokens.slice(1);
    switch (key) {
      case 'set':
        addSetOperator(result, values);
        break;
      case 'filter':
        addFilter(result, values);
        break;
      case 'visuals':
        addVisuals(result, values);
        break;
      case 'source':
        addSource(result, values);
        break;
      case 'target':
        addTarget(result, values);
        break;
      case 'load':
        result.loadDataset = values[0];
        break;
      case 'auto-layout':
        result.autoLayout = true;
        break;
      case 'columns':
        addColumns(result, values);
        break;
      case 'series':
        addSeriesColumn(result, values);
        break;
      case 'group_by':
        addGroupByColumn(result, values);
        break;
      case 'highlight':
        addHighlight(result, values);
        break;
      case 'select':
        addSelect(result, values);
        break;
      case 'extract':
        addExtract(result, values);
        break;
      case 'link':
        addLink(result, values);
        break;
      case 'undo':
        result.undo = true;
        break;
      case 'redo':
        result.redo = true;
        break;
    }
  }
  return result;
};
