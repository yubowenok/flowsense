import _ from 'lodash';

const SELECTION = '_selection';
const DEFAULT_SOURCE = '_default_source';
const DEFAULT_CHART_TYPE = '_default_chart_type';

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

export interface QueryValue {
  loadDataset?: string;
  autoLayout?: boolean;
  columns?: string[];
  seriesColumn?: string;
  groupByColumn?: string;
  visuals?: VisualsSpecification[];
  filters?: FilterSpecification[];
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
  if (values[0] === SELECTION) {
    result.source.push({
      id: DEFAULT_SOURCE,
      isSelection: true,
    });
  } else {
    result.source.push({
      id: values[0],
      isSelection: values[1] === SELECTION,
    });
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
    }
  }

  // If there are columns set but no target, the default action is to fill in a chart creation.
  if (result.columns && !result.target) {
    result.target = [{
      id: DEFAULT_CHART_TYPE,
      isCreate: true,
    }];
  }

  return result;
};
