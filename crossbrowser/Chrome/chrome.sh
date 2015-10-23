#!/bin/sh

rm -rf extention/data/* && \
cp -fr ../src/3js extention/data/ && \
cp -fr ../src/css extention/data/ && \
cp -fr ../src/images extention/data/ && \
cat sandbox.coffee ../src/urim.coffee | coffee --compile --stdio > extention/data/urim.js
