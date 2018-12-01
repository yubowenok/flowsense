cd sempre
./run @mode=simple\
  -languageAnalyzer corenlp.CoreNLPAnalyzer\
  -Grammar.inPaths ../src/grammar/main.grammar\
  -FeatureExtractor.featureDomains rule\
  -Builder.inParamsPath ../data/params.txt\
  -server true
