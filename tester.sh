#!/bin/bash
# Run under the sempre directory.
# Assume smartflow is a sibling directory of sempre.

if [ ! -d test_result ]; then
  mkdir test_result
fi

for testfile in ../test/*.test; do
  file=$(basename "$testfile")
  java -cp libsempre/*:lib/* -ea edu.stanford.nlp.sempre.Main\
       -languageAnalyzer corenlp.CoreNLPAnalyzer\
       -Grammar.inPaths ../main.grammar\
       -FeatureExtractor.featureDomains rule\
       -Learner.maxTrainIters 3\
       -Dataset.inPaths\
         train:../data/train.examples\
         test:$testfile > test_result/$file
done

python ../checker.py test_result
exit $?
