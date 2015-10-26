#!/bin/sh

rm -rf extention/data/* && \
cp -fr ../src/3js extention/data/ && \
cp -fr ../src/css extention/data/ && \
cp -fr ../src/images extention/data/ && \
cp -f  ../../js/Taggregator.js extention/data/3js && \
cp -f  ../../Readability/ReadabilityWrapper.js extention/data/3js && \
cat sandbox.coffee ../src/urim.coffee | coffee --compile --stdio > extention/data/urim.js
