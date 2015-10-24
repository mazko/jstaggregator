#!/bin/sh

rm -rf sdk/data/* && \
cp -fr ../src/3js sdk/data/ && \
cp -fr ../src/css sdk/data/ && \
cp -fr ../src/images sdk/data/ && \
cp -fr ../../js/Taggregator.js sdk/data/3js && \
cat sandbox.coffee ../src/urim.coffee | \
coffee --compile --stdio > sdk/data/urim.js && \

# ToggleButton bugs !!!
# https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/ui_button_togglechecked
# checked state is always UNCHECKED in ff jetpack sdk > 37 (cfx -> jpm)
# Test on https://archive.mozilla.org/pub/firefox/releases/41.0.2/source/firefox-41.0.2.source.tar.xz
# cd mozilla-release/addon-sdk/source/examples/ui-button-apis
# /usr/bin/firefox -V => Mozilla Firefox 41.0.2
# jpm -b /usr/bin/firefox test => 6 of 6 tests passed. All tests passed!
# jpm -b /usr/bin/firefox run

# To make extention build working correctry use old sdk versions:
# https://ftp.mozilla.org/pub/firefox/releases/37.0.2/linux-x86_64/en-US/firefox-37.0.2.tar.bz2
# https://github.com/mozilla/addon-sdk/releases/tag/1.17
# and rename sdk/index.js -> sdk/main.js and replace jpm -> cfx below

cd sdk
jpm run --binary "$HOME/firefox/firefox" \
--binary-args 'http://localhost:8080/'
cd -