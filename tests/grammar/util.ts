import _ from 'lodash';
import request from 'supertest';
import app from '@src/app';

import { SempreResult } from '@src/parser';
import { QueryValue } from '@/query-value';

const INJECT_VALUES: { [w: string]: string } = {
  // chart types
  'scatterplot': 'r_node_type_1',
  'histogram': 'r_node_type_2',
  'heatmap': 'r_node_type_3',
  'line chart': 'r_node_type_4',
  // columns
  'mpg': 'r_column_1',
  'cylinders': 'r_column_2',
  'origin': 'r_column_3',
  'name': 'r_column_4',
  'horsepower': 'r_column_5',
  'model.year': 'r_column_6',
  // nodes
  'node-1': 'r_node_label_1',
  'chart-1': 'r_node_label_2',
  'filter-1': 'r_node_label_3',
  // datasets:
  'iris': 'r_dataset_1',
};

/**
 * Test only: Inject special utterances by their unique placeholders.
 * In production, the injection is performed at the frontend with user assistance.
 */
export const injectTestValues = (query: string): string => {
  _.each(INJECT_VALUES, (v, w) => {
    query = query.replace(RegExp(w, 'g'), v);
  });
  return query;
};

/**
 * Gets the injected value for a token.
 */
export const injectedValue = (token: string): string => {
  return INJECT_VALUES[token];
};

/**
 * Sends a query and checks its return value.
 */
export const checkQuery = (query: string, done: jest.DoneCallback, stringAnswer: string, answer: QueryValue) => {
  query = injectTestValues(query);
  request(app).post('/')
    .send({ query })
    .expect((res: { body: SempreResult }) => {
      expect(res.body.stringValue).toEqual(stringAnswer);
      expect(res.body.value).toEqual(answer);
    })
    .expect(200, done);
};
