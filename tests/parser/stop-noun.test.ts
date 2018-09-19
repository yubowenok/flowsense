import _ from 'lodash';
import { sanitizeQuery, sendQuery } from '@src/parser';

describe('stop nouns', () => {
  it('singular: car', done => {
    sendQuery('car', (err, sempreRes) => {
      sanitizeQuery(sempreRes.body).then(sanitized => {
        expect(sanitized).toBe('car');
        done();
      });
    });
  });

  it('plural: cars', done => {
    sendQuery('cars', (err, sempreRes) => {
      sanitizeQuery(sempreRes.body).then(sanitized => {
        expect(sanitized).toBe('car');
        done();
      });
    });
  });

  it('visual property (exact)', done => {
    sendQuery('opacity', (err, sempreRes) => {
      sanitizeQuery(sempreRes.body).then(sanitized => {
        expect(sanitized).toBe('opacity');
        done();
      });
    });
  });

  it('visual property (variant)', done => {
    sendQuery('transparency', (err, sempreRes) => {
      sanitizeQuery(sempreRes.body).then(sanitized => {
        expect(sanitized).toBe('transparency');
        done();
      });
    });
  });

  it('set operator', done => {
    sendQuery('union', (err, sempreRes) => {
      sanitizeQuery(sempreRes.body).then(sanitized => {
        expect(sanitized).toBe('union');
        done();
      });
    });
  });

  it('verb that can be noun: show', done => {
    sendQuery('show', (err, sempreRes) => {
      sanitizeQuery(sempreRes.body).then(sanitized => {
        expect(sanitized).toBe('r_chart');
        done();
      });
    });
  });

  it('verb that can be noun: map', done => {
    sendQuery('map', (err, sempreRes) => {
      sanitizeQuery(sempreRes.body).then(sanitized => {
        expect(sanitized).toBe('map');
        done();
      });
    });
  });

  it('verb that can be noun: increase', done => {
    sendQuery('increase', (err, sempreRes) => {
      sanitizeQuery(sempreRes.body).then(sanitized => {
        expect(sanitized).toBe('increase');
        done();
      });
    });
  });

  it('sample', done => {
    sendQuery('sample', (err, sempreRes) => {
      sanitizeQuery(sempreRes.body).then(sanitized => {
        expect(sanitized).toBe('r_filter');
        done();
      });
    });
  });

  it('sampling', done => {
    sendQuery('sampling', (err, sempreRes) => {
      sanitizeQuery(sempreRes.body).then(sanitized => {
        expect(sanitized).toBe('r_filter');
        done();
      });
    });
  });
});
