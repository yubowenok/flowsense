#!/usr/bin/python

import os, re

# Count the variables used in the entire grammar
preset_variables = ['TOKEN', 'LEMMA_TOKEN', 'PHRASE']

variables = set()
for filename in os.listdir('.'):
  if filename[-8:] != '.grammar': continue
  f = open(filename, 'r')
  for line in f.readlines():
    line = line.strip().split()
    for token in line:
      if token[0] == '$':
        token = re.match('^\$([a-zA-Z0-9_]+).*$', token).group(1)
        if token not in preset_variables:
          variables.add(token)

for i, variable in enumerate(variables):
  print '$' + variable,
print '\n----------'

print len(variables), 'variables'
