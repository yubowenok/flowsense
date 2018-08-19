"""
Runs a simple HTTP server that computes the maximum wup similarity between any pair of words
from two comma-separated word lists X and Y.
Usage: http://localhost:7473/{X[0],X[1],...}/{Y[0],Y[1],...}
"""
import nltk
nltk.download('all-corpora')

from nltk.corpus import wordnet as wn
from flask import Flask, jsonify
from flask_restful import Resource, Api
import sys

# Load resources immediately from wordnet (otherwise they are lazy loaded till the first http request)
synsets, wup_similarity = wn.synsets, wn.wup_similarity

app = Flask(__name__)
api = Api(app)

def wup(x_sets, y_sets, x, y):
  similarity = 0
  for x_word in x_sets:
    if x_word.name().find(x) != 0: continue
    for y_word in y_sets:
      if y_word.name().find(y) != 0: continue
      similarity = max(similarity, wup_similarity(x_word, y_word))
  return similarity

class Wup(Resource):
  def get(self, X, Y):
    result = 0
    split_X, split_Y = X.split(','), Y.split(',')
    for x in split_X:
      x_sets = synsets(x)
      if x_sets == None: continue
      for y in split_Y:
        y_sets = synsets(y)
        if y_sets == None: continue
        result = max(result, wup(x_sets, y_sets, x, y))
    print X, Y, result
    return jsonify(result)

api.add_resource(Wup, '/<X>/<Y>')

if __name__ == '__main__':
  # Unfortunately nltk does not work well with threaded mode.
  # Error: AttributeError: 'WordNetCorpusReader' object has no attribute '_LazyCorpusLoader__args'
  # Possibly related: https://github.com/nltk/nltk/issues/947
  app.run(port=7473, threaded=False)
