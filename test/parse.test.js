const test = require('tap').test
const JsonDam = require('../')
const PassThrough = require('stream').PassThrough

test('should parse a basic object stream into a single object', (t) => {
  const jsonDam = JsonDam({objectMode: true}, (err, object) => {
    t.error(err)
    // the filled in object
    t.same(Object.keys(object), ['foo', 'arr'])
    t.equal(object.foo, 'bar')
    t.same(object.arr, ['one', 'two', 'three', 'four', 'five', 'six'])
    t.same(object, {foo: 'bar', arr: ['one', 'two', 'three', 'four', 'five', 'six']})
    t.end()
  })

  const passthrough = new PassThrough({
    objectMode: true
  })

  passthrough.pipe(jsonDam)

  passthrough.write({foo: 'bar'})
  passthrough.write({arr: ['one']})
  passthrough.write({arr: ['two']})
  passthrough.write({arr: ['three']})
  passthrough.write({arr: 'four'})
  passthrough.write({arr: ['five', 'six']})

  passthrough.end()
})

test('should parse a basic ndjson string stream into a single object', (t) => {
  const jsonDam = JsonDam((err, object) => {
    t.error(err)
    // the filled in object
    t.same(Object.keys(object), ['foo', 'arr'])
    t.equal(object.foo, 'bar')
    t.same(object.arr, ['one', 'two', 'three', 'four'])
    t.same(object, {foo: 'bar', arr: ['one', 'two', 'three', 'four']})
    t.end()
  })

  const passthrough = new PassThrough({
    objectMode: true
  })

  passthrough.pipe(jsonDam)

  passthrough.write(JSON.stringify({foo: 'bar'}) + '\n')
  passthrough.write(JSON.stringify({arr: ['one']}) + '\n')
  passthrough.write(JSON.stringify({arr: ['two']}) + '\n')
  passthrough.write(JSON.stringify({arr: ['three']}) + '\n')
  passthrough.write(JSON.stringify({arr: 'four'}))

  passthrough.end()
})

test('should callback with an error if passed a string by itself', (t) => {
  const jsonDam = JsonDam({objectMode: true}, (err, object) => {
    t.ok(err, 'there should be an error')
    t.same(object, null)
    t.end()
  })

  const passthrough = new PassThrough({
    objectMode: true
  })

  passthrough.pipe(jsonDam)

  passthrough.write({foo: 'bar'})
  passthrough.write('this should cause a problem')
  passthrough.write({bar: 'baz'})

  passthrough.end()
})

test('shouldnt callback with an error if passed a string by itself if passed ignoreErrors', (t) => {
  const jsonDam = JsonDam({objectMode: true, ignoreErrors: true}, (err, object) => {
    t.error(err, 'there shouldnt be an error')
    t.same(object, {foo: 'bar', bar: 'baz'})
    t.end()
  })

  const passthrough = new PassThrough({
    objectMode: true
  })

  passthrough.pipe(jsonDam)

  passthrough.write({foo: 'bar'})
  passthrough.write('this shouldnt cause a problem')
  passthrough.write({bar: 'baz'})

  passthrough.end()
})

test('should callback with an error if passed two arrays with same key in strictArrayMode', (t) => {
  const jsonDam = JsonDam({objectMode: true, strictArrayMode: true}, (err, object) => {
    t.same(err, new Error('Cannot combine arrays with the same keys in strictArrayMode'), 'there should be an error')
    t.same(object, null)
    t.end()
  })

  const passthrough = new PassThrough({
    objectMode: true
  })

  passthrough.pipe(jsonDam)

  passthrough.write({other: 'testing'})
  passthrough.write({other: 'testing2'})
  passthrough.write({foo: ['bar']})
  passthrough.write({foo: ['baz']})

  passthrough.end()
})

test('shouldnt callback with an error if passed two properties with same key in strictArrayMode', (t) => {
  const jsonDam = JsonDam({objectMode: true, strictArrayMode: true}, (err, object) => {
    t.error(err, 'there shouldnt be an error')
    t.same(object, {other: 'testing2'})
    t.end()
  })

  const passthrough = new PassThrough({
    objectMode: true
  })

  passthrough.pipe(jsonDam)

  passthrough.write({other: 'testing'})
  passthrough.write({other: 'testing2'})

  passthrough.end()
})

test('should callback with an error if passed two objects with same key are passed in strictObjectMode', (t) => {
  const jsonDam = JsonDam({objectMode: true, strictObjectMode: true}, (err, object) => {
    t.same(err, new Error('Cannot overwrite object properties that already exist with the same keys in strictObjectMode'), 'there should be an error')
    t.same(object, null)
    t.end()
  })

  const passthrough = new PassThrough({
    objectMode: true
  })

  passthrough.pipe(jsonDam)

  passthrough.write({foo: 'bar'})
  passthrough.write({foo: 'joe'})

  passthrough.end()
})

test('shouldnt callback with an error if passed two arrays with same key are passed in strictObjectMode', (t) => {
  const jsonDam = JsonDam({objectMode: true, strictObjectMode: true}, (err, object) => {
    t.error(err, 'there shouldnt be an error')
    t.same(object, {arr: ['one', 'two']})
    t.end()
  })

  const passthrough = new PassThrough({
    objectMode: true
  })

  passthrough.pipe(jsonDam)

  passthrough.write({arr: ['one']})
  passthrough.write({arr: ['two']})

  passthrough.end()
})
