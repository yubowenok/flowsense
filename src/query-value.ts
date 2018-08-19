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
  type: string;
  range?: [number | string, number | string];
}

interface SetOperatorSpecification {
  type: string; // union, intersection, difference
  nodes: string[]; // node labels
}

interface QueryValue {
  loadDataset?: string;
  columns?: string[];
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
}

/**
 * Adds a filter specification to the result.
 */
const addFilter = (result: QueryValue, values: string[]) => {
  if (!result.filters) {
    result.filters = [];
  }
  const type = values[1] === 'pattern' ? 'pattern' : 'range';
  result.filters.push({
    column: values[0],
    type,
    range: type === 'range' ? [values[1], values[2]] : undefined,
  });
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
  result.source.push({
    id: values[0],
    isSelection: values[1] === 'selection',
  });
};

/**
 * Adds a target node specification to the result.
 */
const addTarget = (result: QueryValue, values: string[]) => {
  if (!result.target) {
    result.target = [];
  }
  result.target.push({
    id: values[0],
    isCreate: values[1] === 'create',
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
      case 'columns':
        if (result[key]) {
          console.error(`duplicate configuration of result property "${key}"`);
        }
        result[key] = values;
        break;
    }
  }
  return result;
};
