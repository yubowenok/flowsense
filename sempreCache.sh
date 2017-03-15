#!/bin/bash

if [ -f '../sempre_lib/fig.jar' ]
then
  echo 'lib and fig found in cache'
  mv ../sempre_lib lib
  mv ../sempre_fig fig
fi

if [ ! -f 'lib/fig.jar' ]
then
  echo 'lib and fig not prepared. re-pull dependencies...'
  ./pull-dependencies core corenlp
fi

