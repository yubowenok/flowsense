#!/usr/bin/python

# Count the variables used in the entire grammar

f = open('all.grammar', 'r')

variables = {}

for line in f.readlines():
  line = line.strip().split()
  for token in line:
    if token[0] == '$':
      variables[token] = True

print len(variables)
