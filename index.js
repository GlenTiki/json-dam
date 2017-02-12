'use strict'

const callbackStream = require('callback-stream')
const ndjson = require('ndjson')

module.exports = jsonDam

function jsonDam (opts, callback) {
  if (!callback && opts) {
    callback = opts
    opts = {}
  }

  const filler = callbackStream.obj(function (err, data) {
    if (err) return callback(err)
    let parseError = null
    const parsedObject = data.reduce((parsedObject, object) => {
      if (parseError !== null) {
        return null
      }

      if (!opts.ignoreErrors && object !== Object(object)) {
        parseError = new Error('Must pass objects to be parsed by jsonDam if ignoreErrors is false')
        return null
      } else if (opts.ignoreErrors && object !== Object(object)) {
        return parsedObject
      }

      Object.keys(object).forEach((key) => {
        if (parseError !== null) { return }

        if (Array.isArray(parsedObject[key]) && Array.isArray(object[key])) {
          if (opts.strictArrayMode) {
            parseError = new Error('Cannot combine arrays with the same keys in strictArrayMode')
            parsedObject = null
            return
          }
          parsedObject[key] = parsedObject[key].concat(...object[key])
        } else if (Array.isArray(parsedObject[key]) && !Array.isArray(object[key])) {
          if (opts.strictArrayMode) {
            parseError = new Error('Cannot combine arrays with the same keys in strictArrayMode')
            parsedObject = null
            return
          }
          parsedObject[key] = parsedObject[key].concat(object[key])
        } else if (parsedObject[key] && !Array.isArray(parsedObject[key]) && Array.isArray(object[key])) {
          if (opts.strictArrayMode) {
            parseError = new Error('Cannot combine arrays with the same keys in strictArrayMode')
            parsedObject = null
            return
          }
          parsedObject[key] = [parsedObject[key], ...object[key]]
        } else {
          if (opts.strictObjectMode && object[key] && parsedObject[key]) {
            parseError = new Error('Cannot overwrite object properties that already exist with the same keys in strictObjectMode')
            parsedObject = null
            return
          }
          parsedObject[key] = object[key]
        }
      })

      return parsedObject
    }, {})

    return callback(parseError, parsedObject)
  })

  if (opts.objectMode) {
    return filler
  } else {
    const jsonParser = ndjson({strict: !opts.ignoreErrors})
    jsonParser.pipe(filler)
    return jsonParser
  }
}

