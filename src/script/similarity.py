"""
Runs a simple HTTP server that computes the maximum wup similarity between any pair of words
from two comma-separated word lists X and Y.
Usage: http://localhost:7473/{X[0],X[1],...}/{Y[0],Y[1],...}
"""
import nltk
nltk.download('wordnet')

from nltk.corpus import wordnet as wn
from flask import Flask, jsonify
from flask_restful import Resource, Api
import sys

# Load resources immediately from wordnet (otherwise they are lazy loaded till the first http request)
synsets = wn.synsets

app = Flask(__name__)
api = Api(app)

def similarity(x_sets, y_sets, x, y):
  wup, lch = 0, 0
  x_has_self, y_has_self = False, False
  for x_word in x_sets:
    if x_word.name().find(x) == 0:
      x_has_self = True
      break
  for y_word in y_sets:
    if y_word.name().find(y) == 0:
      y_has_self = True
      break
  for x_word in x_sets:
    if x_has_self and x_word.name().find(x) != 0: continue
    for y_word in y_sets:
      if y_has_self and y_word.name().find(y) != 0: continue
      if x_word.pos() != y_word.pos(): continue
      wup = max(wup, wn.wup_similarity(x_word, y_word))
      #lch = max(lch, wn.lch_similarity(x_word, y_word))
  return {
    'wup': wup,
    'lch': lch,
  }

class Similarity(Resource):
  def get(self, X, Y):
    wup, lch = 0, 0
    split_X, split_Y = X.split(','), Y.split(',')
    for x in split_X:
      x_sets = synsets(x)
      if x_sets == None: continue
      for y in split_Y:
        y_sets = synsets(y)
        if y_sets == None: continue
        result = similarity(x_sets, y_sets, x, y)
        wup = max(wup, result['wup'])
        lch = max(lch, result['lch'])
    final_result = {
      'wup': wup,
      'lch': lch,
    }
    print X, Y, final_result
    return jsonify(final_result)

api.add_resource(Similarity, '/<X>/<Y>')

if __name__ == '__main__':
  # Unfortunately nltk does not work well with threaded mode.
  # Error: AttributeError: 'WordNetCorpusReader' object has no attribute '_LazyCorpusLoader__args'
  # Possibly related: https://github.com/nltk/nltk/issues/947
  app.run(port=7473, threaded=False)
