import _ from 'lodash';
import { parseSempreResult, sendQuery } from '@src/parser';

describe('parse sempre result', () => {
  it('accepted query', (done) => {
    sendQuery('show the cars in red color', (err, sempreRes) => {
      const result = parseSempreResult(sempreRes.body);
      expect(result).toEqual(expect.objectContaining({
        success: true,
        query: 'show the cars in red color',
        tokens: ['show', 'the', 'cars', 'in', 'red', 'color'],
        lemmatizedTokens: ['show', 'the', 'car', 'in', 'red', 'color'],
        posTags: ['VB', 'DT', 'NNS', 'IN', 'JJ', 'NN'],
        nerTags: ['O', 'O', 'O', 'O', 'O', 'O'],
        nerValues: ['null', 'null', 'null', 'null', 'null', 'null'],
      }));
      done();
    });
  });

  it('single-word accepted query', (done) => {
    sendQuery('show', (err, sempreRes) => {
      const result = parseSempreResult(sempreRes.body);
      expect(result).toEqual(expect.objectContaining({
        success: true,
        query: 'show',
        tokens: ['show'],
        lemmatizedTokens: ['show'],
        posTags: ['NN'],
        nerTags: ['O'],
        nerValues: ['null'],
      }));
      done();
    });
  });

  it('query with NER tags', (done) => {
    sendQuery('cars with r_column_1 from 1 to 10', (err, sempreRes) => {
      const result = parseSempreResult(sempreRes.body);
      expect(result).toEqual(expect.objectContaining({
        success: true,
        nerTags: ['O', 'O', 'O', 'O', 'NUMBER', 'NUMBER', 'NUMBER'],
        nerValues: ['null', 'null', 'null', 'null', '1.0-10.0', '1.0-10.0', '1.0-10.0'],
      }));
      done();
    });
  });

  it('rejected query', (done) => {
    sendQuery('hello world', (err, sempreRes) => {
      const result = parseSempreResult(sempreRes.body);
      expect(result).toEqual({
        success: false,
        query: 'hello world',
        tokens: ['hello', 'world'],
        lemmatizedTokens: ['hello', 'world'],
        posTags: ['UH', 'NN'],
        nerTags: ['O', 'O'],
        nerValues: ['null', 'null'],
        stringValue: '',
        value: {},
      });
      done();
    });
  });
});
