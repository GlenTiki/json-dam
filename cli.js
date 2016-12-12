#! /usr/bin/env node

const parser = require('./index.js')()

process.stdin
  .pipe(parser)
  .pipe(process.stdout)
