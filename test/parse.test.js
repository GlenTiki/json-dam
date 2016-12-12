const test = require('tap').test
const JsonDam = require('../')
const PassThrough = require('stream').PassThrough

test('should parse a basic object stream into a single object', (t) => {
  const jsonDam = JsonDam({objectMode: true})

  const passthrough = new PassThrough({
    objectMode: true
  })

  passthrough.pipe(jsonDam)

  jsonDam.on('data', (object) => {
    // the filled in object
    t.same(Object.keys(object), ['foo', 'arr'])
    t.equal(object.foo, 'bar')
    t.same(object.arr, ['one', 'two', 'three', 'four'])
    t.same(object, {foo: 'bar', arr: ['one', 'two', 'three', 'four']})
    t.end()
  })

  passthrough.write({foo: 'bar'})
  passthrough.write({arr: ['one']})
  passthrough.write({arr: ['two']})
  passthrough.write({arr: ['three']})
  passthrough.write({arr: 'four'})

  passthrough.end()
})
