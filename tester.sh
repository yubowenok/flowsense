#!/bin/bash
# Run under the sempre directory.
# Assume smartflow is a sibling directory of sempre.

java -cp libsempre/*:lib/* -ea edu.stanford.nlp.sempre.Main -Grammar.inPaths ../basic.grammar -Dataset.inPaths test:../test/examples.test > test_result
verdict=`cat test_result | grep "Stats for .*: correct=1"`
if [ "$verdict" != "" ]; then
  echo "Correct!"
  exit 0
else
  echo "Incorrect (see test_result for errors)"
  exit 1
fi

