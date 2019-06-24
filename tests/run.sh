#!/bin/bash
# Run under the sempre directory.
# The directory structure should be:
#     flowsense/
#         src/grammar/* (grammar files)
#         tests/**/* (test files)
#         sempre/ (cloned sempre repository, tests are run under this folder)

main_grammar="../src/grammar/main.grammar"
test_grammar="../src/grammar/main_test.grammar"
similarity_server="../src/script/similarity.py"
similarity_server_addr="http://localhost:7473"

cp $main_grammar $test_grammar
echo "(include test.grammar)" >> $test_grammar

# Run Sempre web server
screen -d -m java -cp libsempre/*:lib/* -ea edu.stanford.nlp.sempre.Main\
    -languageAnalyzer corenlp.CoreNLPAnalyzer\
    -Grammar.inPaths $test_grammar\
    -FeatureExtractor.featureDomains rule\
    -Builder.inParamsPath ../data/params.txt\
    -server true

semprePid=$(screen -ls | grep '[0-9]*.*(Detached)' | sed 's/\.\..*//')

screen -d -m python2 $similarity_server

# Wait for Sempre to launch and train
echo 'waiting for sempre initialization'
while [ 1 ]
do
  curl -I http://localhost:8400/sempre &> /dev/null
  if [ $? -eq 0 ]; then break; fi
  sleep 1
done
# Call sempre server once. This blocks before CoreNLP is loaded.
curl http://localhost:8400/sempre &> /dev/null
echo 'sempre is ready'

# Wait for similarity server to import nltk
echo 'waiting for similarity server initialization'
while [ 1 ]
do
  curl -I $similarity_server_addr'/x/y' &> /dev/null
  if [ $? -eq 0 ]; then break; fi
  sleep 1
done
echo 'similarity server is ready'

# Run tests via jest
yarn test
test_result=$?

# Kill the screen that runs sempre
screen -X -S $semprePid quit
# Kill the screen that runs similarity server
screen -X -S $(screen -ls | grep '[0-9]*.*(Detached)' | sed 's/\.\..*//') quit

exit $test_result
