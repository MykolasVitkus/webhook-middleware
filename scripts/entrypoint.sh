#!/bin/bash

node /usr/src/server/dist/main &
pid=$!
node /usr/src/app/server/index.js
kill $pid