#!/bin/bash
# Run under the sempre directory.
# Assume smartflow is a sibling directory of sempre.

allresult="../all.result"
alltest="../all.test"

if [ -f $allresult ]; then rm $allresult; fi
if [ -f $alltest ]; then rm $alltest; fi

for testfile in ../test/*.test; do
  file=$(basename "$testfile")
  echo "### FILE ($file)" >> $alltest
  cat $testfile >> $alltest
done

java -cp libsempre/*:lib/* -ea edu.stanford.nlp.sempre.Main\
    -languageAnalyzer corenlp.CoreNLPAnalyzer\
    -Grammar.inPaths ../main.grammar\
    -FeatureExtractor.featureDomains rule\
    -Learner.maxTrainIters 3\
    -Dataset.inPaths\
     train:../data/train.examples\
     test:$alltest > $allresult

python ../checker.py $allresult $alltest
exit $?
