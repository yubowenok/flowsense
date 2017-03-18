#!/usr/bin/python

import sys, os, re

if len(sys.argv) < 3:
  print 'usage: checker.py result_file test_file'
  sys.exit(1)
  
test_result_path = sys.argv[1]
test_input_path = sys.argv[2]

# Which file each test belongs
test_files = []
cur_test = ''
f = open(test_input_path, 'r')
lines = f.readlines()
num_lines = len(lines)
for i in xrange(num_lines):
  line = lines[i].strip()
  file_match = re.match('### FILE \((.*)\)', line)
  if file_match != None:
    cur_test = file_match.group(1)
  test_match = re.match('\(example', line)
  if test_match != None:
    test_files.append(cur_test)


incorrect, total = 0, 0
warnings = 0

f = open(test_result_path, 'r')
lines = f.readlines()
num_lines = len(lines)
for i in xrange(num_lines):
  line = lines[i].strip()  
  
  warning_match = re.match('WARNING: (.*)', line)
  if warning_match != None:
    warnings += 1
    print warning_match.group(1)
    
  if re.match('iter=3.test: example', line) != None:
    total += 1
    answer = ''
    query = re.match('Example: (.*) {', lines[i + 1].strip()).group(1)
    j = i + 2
    while j < num_lines:
      cur_line = lines[j].strip()
     
      result = re.match('targetValue: \(string "(.*)"\)', cur_line)
      if result != None: # Get answer
        answer = result.group(1)
      
      result = re.match('Current: correct=(.*) oracle', cur_line)
      if result != None: # Get verdict
        correct = float(result.group(1))
        if correct != 1:
          incorrect += 1
          print '[%s/%.2f] %s\nExpected: %s' % (test_files[total - 1], correct, query, answer)
        i = j;
        break;
      j += 1
        
if total != len(test_files):
  print 'runtime error in execution, test number mismatched'
  sys.exit(1)

if warnings != 0:
  print 'aborted with %d warnings' % warnings
  sys.exit(1)
  
if incorrect > 0:
  print '%d/%d tests incorrect' % (incorrect, total)
  sys.exit(1)
else:
  print 'All %d tests correct!' % total

sys.exit(0)
