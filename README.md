# FlowSense: A Natural Language Interface for Visual Data Exploration within a Dataflow System
[![Build Status](https://travis-ci.org/yubowenok/flowsense.svg?branch=master)](https://travis-ci.org/yubowenok/flowsense)

FlowSense is a natural language interface (NLI) that is integrated into the VisFlow dataflow visualization framework to support dataflow diagram editing with natural language (NL).
The user types or uses voice to input an NL query, which can be parsed by FlowSense and mapped to a VisFlow function to update the dataflow diagrams.
This repository contains the FlowSense core implementation that includes its grammar rules, backend API, integration tests, and experiment code.

This content of this repository is structured as:
- ``src/grammar``: SEMPRE grammar files
- ``src/script``: Server API implemented in Python, and grammar analysis code
- ``src/*.ts``: Server API implemented in TypeScript
- ``data``: Training examples and auto completion base templates

## Installation

Run the installation script:
- ``yarn install`` (for setting up backend API)
- ``pip install --user -r requirements.txt`` (for setting up python backend API)

Install SEMPRE from [here](https://github.com/yubowenok/sempre).
Note that this is a forked repository from the [original SEMPRE repository](https://github.com/percyliang/sempre) for extended parsing utility.
- ``git clone https://github.com/yubowenok/sempre``
- ``cd sempre && ../sempreCache.sh`` (pull SEMPRE dependencies if they not yet exist)
- ``ant core corenlp`` (SEMPRE installation)

## Running FlowSense
- Run the backend API node server: ``yarn start``
- Run the backend API python server: ``python src/script/similarity.py``
- Run SEMPRE: ``cd sempre && ../runSempre`` (SEMPRE should be run from the ``./sempre`` directory)

To verify that SEMPRE is working in the background, go to ``localhost:8400/sempre`` for SEMPRE web interface and try some queries there.

## Running Tests
- ``cd sempre`` (make sure the current directory is ``./sempre``)
- ``yarn build``
- ``../tests/run.sh``


## Publication
Bowen Yu, and Claudio T. Silva.
_FlowSense: A Natural Language Interface for Visual Data Exploration within a Dataflow System._
In IEEE Transactions on Visualization and Computer Graphics (Proc. VAST), 2019.
```
@ARTICLE{YuB19,
  author = {B. {Yu} and C. T. {Silva}},
  journal = {IEEE Transactions on Visualization and Computer Graphics},
  title = {FlowSense: A Natural Language Interface for Visual Data Exploration within a Dataflow System},
  year = {2019},
  doi = {10.1109/TVCG.2019.2934668},
}
```
