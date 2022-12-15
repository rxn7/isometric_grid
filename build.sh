#!/usr/bin/env bash

set -e

rm -rf build
mkdir build

npx tsc --project $(pwd)
cp -r static/* build

# Optimize css
tr --delete '\n' < static/style.css > build/style.css

echo -e "\e[1;32mProject has been successfuly built!\e[0m"