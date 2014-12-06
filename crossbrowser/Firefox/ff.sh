#!/bin/sh

rm -rf sdk/data/* && \
cp -fr ../src/3js sdk/data/ && \
cp -fr ../src/css sdk/data/ && \
cp -fr ../src/images sdk/data/ && \
cat sandbox.coffee ../src/urim.coffee | coffee --compile --stdio > sdk/data/urim.js && \
cd sdk && \
cfx run --binary-args '-url "http://localhost:8080/" -jsconsole' && \
cd -

#--overload-modules
#--force-use-bundled-sdk   --no-strip-xpi