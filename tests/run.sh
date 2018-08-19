#!/bin/bash
# Run under the sempre directory.
# The directory structure should be:
#     flowsense/
#         src/grammar/* (grammar files)
#         tests/**/* (test files)
#         sempre/ (cloned sempre repository, tests are run under this folder)

main_grammar="../src/grammar/main.grammar"
test_grammar="../src/grammar/main_test.grammar"
wup_server="../src/script/wup.py"
wup_server_addr="http://localhost:7473"

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

semprePid=$(screen -ls | grep '[0-9]*.*(Detached)' | sed 's/\.\..*//')

screen -d -m python $wup_server

# Wait for Sempre to launch and train
echo 'waiting for sempre initialization'
while [ 1 ]
do
  curl -I http://localhost:8400/sempre &> /dev/null
  if [ $? -eq 0 ]; then break; fi
  sleep 1
done
echo 'sempre is ready'

# Wait for wup server to import nltk
echo 'waiting for wup server initialization'
while [ 1 ]
do
  curl -I $wup_server_addr'/x/y' &> /dev/null
  if [ $? -eq 0 ]; then break; fi
  sleep 1
done
echo 'wup server is ready'

# Run tests via jest
yarn test

# Kill the screen that runs sempre
screen -X -S $semprePid quit
# Kill the screen that runs wup_server
screen -X -S $(screen -ls | grep '[0-9]*.*(Detached)' | sed 's/\.\..*//') quit
