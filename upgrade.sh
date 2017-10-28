#!/usr/bin/env bash
git stash
git pull
git stash pop
npm install -d
npm run build