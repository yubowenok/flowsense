#!/usr/bin/python

import sys, os, re

if len(sys.argv) < 2:
  print 'no test_result path specified'
  sys.exit(1)
  
test_result_path = sys.argv[1]

incorrect = 0

for dirname, dirnames, filenames in os.walk(test_result_path):
  for filename in filenames:
    filepath = os.path.join(dirname, filename)
    f = open(filepath, 'r')
    lines = f.readlines()
    num_lines = len(lines)
    for i in xrange(num_lines):
      line = lines[i].strip()
      if re.match('iter=3.test: example', line) != None:
        query = re.match('Example: (.*) {', lines[i + 1].strip()).group(1)
        j = i + 2
        while j < num_lines:
          cur_line = lines[j].strip()
          result = re.match('Current: correct=(.*) oracle', cur_line)
          if result != None:
            correct = float(result.group(1))
            if correct != 1:
              incorrect += 1
              print '[%s/%.2f] %s' % (filename, correct, query)
            i = j;
            break;
          j += 1
        
if incorrect > 0:
  print '%d queries incorrect' % incorrect
  sys.exit(1)
else:
  print 'All Correct!'

sys.exit(0)
