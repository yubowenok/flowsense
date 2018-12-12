#!/usr/bin/python

import os, re

# Count the rules used in the grammar

count = 0
variables = set()
for filename in os.listdir('.'):
  if filename[-8:] != '.grammar': continue
  f = open(filename, 'r')
  for line in f.readlines():
    line = line.strip()
    if re.match(r'^\s*\(\s*rule.*', line):
      count += 1

print count, 'rules'
