#!/bin/bash
# Run under the sempre directory.
# Assume smartflow is a sibling directory of sempre.

if [ ! -d test_result ]; then
  mkdir test_result
fi

errors=false
for testfile in ../test/*.examples; do
  file=$(basename "$testfile")
  java -cp libsempre/*:lib/* -ea edu.stanford.nlp.sempre.Main\
       -languageAnalyzer corenlp.CoreNLPAnalyzer\
       -Grammar.inPaths ../main.grammar\
       -FeatureExtractor.featureDomains rule\
       -Learner.maxTrainIters 3\
       -Dataset.inPaths\
         train:../data/plot.examples\
         test:$testfile > test_result/$file
  verdict=`cat test_result/$file | grep "Stats for .*: correct=1"`
  echo -n "[$file] "
  if [ "$verdict" != "" ]; then
    echo "Correct!"
  else
    echo "Incorrect"
    cat test_result/$file
    errors=true
  fi
done

if $errors; then
  echo "Some of the tests had errors. See test_result for details."
fi

