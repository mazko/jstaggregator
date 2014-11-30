#!/bin/sh

rm -rf Firefox/data/* && \
cp -fr src/3js Firefox/data/ && \
cp -fr src/css Firefox/data/ && \
cp -fr src/images Firefox/data/ && \
coffee -c -o Firefox/data/ src/urim.coffee && \
cd Firefox && \
cfx run --binary-args '-url "http://localhost:8080/" -jsconsole' && \
cd -

#--overload-modules
#--force-use-bundled-sdk   --no-strip-xpi