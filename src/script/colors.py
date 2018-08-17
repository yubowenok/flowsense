"""
  Produces grammars that accept common color names.
"""
import sys, re

fin = open('colors.txt', 'r')
fout = open('colors.out', 'w')

for line in fin.readlines():
  for color in re.split('\s+', line.rstrip()):
    if color == 'Shades' or color == 'Mix' or color[0] == '#': continue
    cnt_upper = sum(1 for c in color if c.isupper())
    if cnt_upper == 1:
      fout.write('(rule $ColorValue (%s) (ConstantFn "%s"))\n' % (color.lower(), color.lower()))
    else:
      cur_color = ''
      color_tokens = []
      for i, c in enumerate(color):
        if c.isupper():
          if len(cur_color) > 0:
            color_tokens.append(cur_color)
          cur_color = ''
        cur_color += c.lower()
      color_tokens.append(cur_color)
      fout.write('(rule $ColorValue (%s) (ConstantFn "%s"))\n' % (' '.join(color_tokens), ''.join(color_tokens)))
    
fin.close()
fout.close()