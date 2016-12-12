'use strict'

var Transform = require('stream').Transform
var ndjson = require('ndjson')

module.exports = jsonDam
module.exports.parseToObject = parseToObject

function jsonDam (opts) {
  opts = opts || {}
  const streamToObject = StreamToObject()
  if (opts.objectMode) {
    return streamToObject
  } else {
    const jsonParser = ndjson()
    const transformer = new Transform({
      readableObjectMode: true,
      transform: function (obj, enc, cb) {
        jsonParser.write(obj)
        cb()
      },
      flush: function (cb) {
        cb()
      }
    })

    jsonParser.pipe(streamToObject)
    streamToObject.on('data', transformer.push)

    return transformer
  }
}

function StreamToObject () {
  var parser = parseToObject()
  var transformer = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform: function (obj, enc, cb) {
      parser.parseObject(obj)
      cb()
    },
    flush: function (cb) {
      this.push(parser.parsedObject)
      cb()
    }
  })

  return transformer
}

function parseToObject () {
  const ret = {}
  ret.parsedObject = null

  ret.parseObject = parseObject

  function parseObject (object) {
    // should this be async to pass an error back?
    if (object !== Object(object)) {
      throw 'Must pass an object to parse object stream'
    }

    if (this.parsedObject === null) {
      this.parsedObject = object
    } else {
      Object.keys(object).forEach((key) => {
        if (Array.isArray(this.parsedObject[key]) && Array.isArray(object[key])) {
          this.parsedObject[key] = this.parsedObject[key].concat(...object[key])
        } else if (Array.isArray(this.parsedObject[key]) && !Array.isArray(object[key])) {
          this.parsedObject[key] = this.parsedObject[key].concat(object[key])
        } else {
          this.parsedObject[key] = object[key]
        }
      })
    }
  }

  return ret
}

