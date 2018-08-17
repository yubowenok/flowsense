#!/bin/bash
# Run under the sempre directory.
# The directory structure should be:
#     flowsense/
#         src/grammar/* (grammar files)
#         tests/**/* (test files)
#         sempre/ (cloned sempre repository, tests are run under this folder)

main_grammar="../src/grammar/main.grammar"
test_grammar="../src/grammar/main_test.grammar"

cp $main_grammar $test_grammar
echo "(include test.grammar)" >> $test_grammar

# Run Sempre web server
screen -d -m java -cp libsempre/*:lib/* -ea edu.stanford.nlp.sempre.Main\
    -languageAnalyzer corenlp.CoreNLPAnalyzer\
    -Grammar.inPaths $test_grammar\
    -FeatureExtractor.featureDomains rule\
    -Learner.maxTrainIters 3\
    -server true\
    -Dataset.inPaths\
     train:../data/train.examples

# Wait for Sempre to launch and train
while [ 1 ]
do
  curl -I http://localhost:8400/sempre &> /dev/null
  if [ $? -eq 0 ]; then break; fi
  sleep 1
done

# Run tests via jest
yarn test

# Kill the screen that runs sempre
screen -X -S $(screen -ls | grep '[0-9]*.*(Detached)' | sed 's/\.\..*//') quit
