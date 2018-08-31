import _ from 'lodash';
import { sanitizeQuery, sendQuery } from '@src/parser';

describe('sanitize query', () => {
  it('should remove DT "a", "the"', done => {
    sendQuery('add a plot in the diagram', (err, sempreRes) => {
      sanitizeQuery(sempreRes.body).then(sanitized => {
        expect(sanitized).toBe('add plot in diagram');
        done();
      });
    });
  });

  it('should remove irrelevant NN "car", "cars"', done => {
    sendQuery('show the cars', (err, sempreRes) => {
      sanitizeQuery(sempreRes.body).then(sanitized => {
        expect(sanitized).toBe('r_chart');
        done();
      });
    });
  });

  it('should keep colors', done => {
    sendQuery('color by blue', (err, sempreRes) => {
      sanitizeQuery(sempreRes.body).then(sanitized => {
        expect(sanitized).toBe('color by blue');
        done();
      });
    });
  });

  it('should keep verb and preps', done => {
    sendQuery('merge cars of r_node_1 with cars of r_node_2', (err, sempreRes) => {
      sanitizeQuery(sempreRes.body).then(sanitized => {
        expect(sanitized).toBe('merge of r_node_1 with of r_node_2');
        done();
      });
    });
  });

  it('should remove special stop word VB "please" and PRP', done => {
    sendQuery('please show it', (err, sempreRes) => {
      sanitizeQuery(sempreRes.body).then(sanitized => {
        expect(sanitized).toBe('r_chart');
        done();
      });
    });
  });

  it('should keep injected tokens r_*', done => {
    sendQuery('draw r_column_1 and r_column_2 in a plot', (err, sempreRes) => {
      sanitizeQuery(sempreRes.body).then(sanitized => {
        expect(sanitized).toBe('r_chart r_column_1 and r_column_2 in plot');
        done();
      });
    });
  });

  it('select -> r_select', done => {
    sendQuery('show r_column_1 of the selected cars in a r_chart_type_2', (err, sempreRes) => {
      sanitizeQuery(sempreRes.body).then(sanitized => {
        expect(sanitized).toBe('r_chart r_column_1 of r_select in r_chart_type_2');
        done();
      });
    });
  });

  it('filter -> r_filter, group -> r_group', done => {
    sendQuery('filter 5 percent of cars grouped by r_column_1', (err, sempreRes) => {
      sanitizeQuery(sempreRes.body).then(sanitized => {
        expect(sanitized).toBe('r_filter 5 percent of r_group by r_column_1');
        done();
      });
    });
  });

  it('should keep inverse token', done => {
    sendQuery('show cars with r_column_1 no larger than 15', (err, sempreRes) => {
      sanitizeQuery(sempreRes.body).then(sanitized => {
        expect(sanitized).toBe('r_chart with r_column_1 no larger than 15');
        done();
      });
    });
  });
});
