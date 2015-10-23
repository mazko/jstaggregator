#!/bin/sh

rm -rf sdk/data/* && \
cp -fr ../src/3js sdk/data/ && \
cp -fr ../src/css sdk/data/ && \
cp -fr ../src/images sdk/data/ && \
cp -fr ../../js/Taggregator.js sdk/data/3js && \
cat sandbox.coffee ../src/urim.coffee | coffee --compile --stdio > sdk/data/urim.js && \
cd sdk && \
jpm run --binary "`which firefox`" --binary-args 'http://localhost:8080/' && \
cd -

#--overload-modules
#--force-use-bundled-sdk   --no-strip-xpi