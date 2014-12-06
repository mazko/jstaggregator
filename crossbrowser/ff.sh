#!/bin/sh

rm -rf Firefox/sdk/data/* && \
cp -fr src/3js Firefox/sdk/data/ && \
cp -fr src/css Firefox/sdk/data/ && \
cp -fr src/images Firefox/sdk/data/ && \
cat Firefox/sandbox.coffee src/urim.coffee | coffee --compile --stdio > Firefox/sdk/data/urim.js && \
cd Firefox/sdk && \
cfx run --binary-args '-url "http://localhost:8080/" -jsconsole' && \
cd -

#--overload-modules
#--force-use-bundled-sdk   --no-strip-xpi