import _ from 'lodash';
import { sanitizeQuery, sendQuery } from '@src/parser';

describe('sanitize query', () => {
  it('should remove DT "a", "the"', (done) => {
    sendQuery('add a plot in the diagram', (err, sempreRes) => {
      const sanitized = sanitizeQuery(sempreRes.body);
      expect(sanitized).toBe('add plot in diagram');
      done();
    });
  });

  it('should remove irrelevant NN "car", "cars"', (done) => {
    sendQuery('show the cars', (err, sempreRes) => {
      const sanitized = sanitizeQuery(sempreRes.body);
      expect(sanitized).toBe('show cars');
      done();
    });
  });

  it('should remove special stop word VB "please" and PRP', (done) => {
    sendQuery('please show it', (err, sempreRes) => {
      const sanitized = sanitizeQuery(sempreRes.body);
      expect(sanitized).toBe('show');
      done();
    });
  });

  it('should keep injected tokens r_*', (done) => {
    sendQuery('draw r_column_1 and r_column_2 in a plot', (err, sempreRes) => {
      const sanitized = sanitizeQuery(sempreRes.body);
      expect(sanitized).toBe('draw r_column_1 and r_column_2 in plot');
      done();
    });
  });
});
