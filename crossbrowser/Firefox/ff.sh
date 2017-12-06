#!/bin/sh

../Chrome/chrome.sh

CURRENT_DIR=`dirname "$(readlink -f "$0")"`

cd extention

case "$1" in
  "build")
    web-ext build --overwrite-dest --artifacts-dir $CURRENT_DIR
    ;;
  *)
    web-ext run --browser-console
    ;;
esac

cd -