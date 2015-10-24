#!/bin/sh

rm -rf sdk/data/* && \
cp -fr ../src/3js sdk/data/ && \
cp -fr ../src/css sdk/data/ && \
cp -fr ../src/images sdk/data/ && \
cp -f  ../../js/Taggregator.js sdk/data/3js && \
cp -f  ../../Readability/ReadabilityWrapper.js sdk/data/3js && \
cat sandbox.coffee ../src/urim.coffee | \
coffee --compile --stdio > sdk/data/urim.js && \

# ToggleButton is broken: checked/unchecked UI state is always UNCHECKED !!!
# https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/ui_button_togglechecked
# checked state is always UNCHECKED in ff jetpack sdk > 37 (cfx -> jpm)
# Reproduce on https://archive.mozilla.org/pub/firefox/releases/41.0.2/source/firefox-41.0.2.source.tar.xz
# cd mozilla-release/addon-sdk/source/examples/ui-button-apis
# /usr/bin/firefox -V => Mozilla Firefox 41.0.2
# jpm -b /usr/bin/firefox test => 6 of 6 tests passed. All tests passed!
# jpm -b /usr/bin/firefox run << UI state is always UNCHECKED

# To make extention build working correctry use old sdk versions:
# https://ftp.mozilla.org/pub/firefox/releases/37.0.2/linux-x86_64/en-US/firefox-37.0.2.tar.bz2
# https://github.com/mozilla/addon-sdk/releases/tag/1.17
# and replace jpm <-> cfx, local ff-version below

cd sdk
cfx run --binary "$HOME/firefox-37/firefox" \
--binary-args 'http://localhost:8080/'
cd -