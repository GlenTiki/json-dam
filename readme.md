# Json-dam

Fill in a stream of json, with a Dam of data!

Takes a stream of objects or ndjson, and creates a singular object out of it.

Its like getting the puzzle pieces, and putting it together into the finished puzzle!

## Examples

Take a stream of ndjson and convert it to an object:
```javascript
var jsonDam = require('json-dam')

ndjsonStream.pipe(jsonDam((error, thePuzzle) => {
  // Here we have the filled out puzzle content!
}))
```

Or pipe an object stream in like so to get an object out:

```javascript
var jsonDam = require('json-dam')

objectStream.pipe(jsonDam({objectMode: true}, (error, thePuzzle) => {
  // Here we have the filled out puzzle content!
}))
```

## API

```javascript
  jsonDam(options, function callback (error, parsedObject) { })
```

Where:

- `options`: an _optional_ object that can take the following properties to configure the parser (all properties below default to false)
  - `objectMode`: A boolean that says if this will receive a stream of objects. Defaluts to false as by default it expects ndjson.
  - `ignoreErrors`: A boolean that says if this should ignore errorable inputs (a string by itself, etc.)
  - `strictObjectMode`: A boolean that says if this should return an error if two objects with the same key are passed in (excluding arrays)
  - `strictArrayMode`: A boolean that says if this should return an error if two objects with the same key are passed in (including arrays).

- `callback`: A _required_ function that takes the following params:
  - `error`: if there was an error parsing the inputs
  - `parsedObject`: the parsed object that was filled in by the parser

## Notes

The stream isn't very smart, some things to keep in mind:
  - The most recently piped in properties are the ones output on the parsed object if `strict` mode is disabled. Example below...
  ```javascript
    someStream.pipe({objectMode: true}, jsonDam((err, obj) => {
      // obj.foo === 'version2'
    }))
    someStream.write({foo: 'version1'})
    someStream.write({foo: 'version2'})
  ```
  - Piped in objects with properties that are arrays get combined, if `strictArrayMode` is disabled...
  ```javascript
    someStream.pipe({objectMode: true}, jsonDam((err, obj) => {
      // obj.foo === 'version2'
    }))
    someStream.write({foo: 'version1'})
    someStream.write({foo: 'version2'})
  ```

I recommend checking out the tests to get a full understanding of the usage of this module.

## Acknowlegements

Thanks to [Matteo Collina](https://github.com/mcollina) for taking a look at this in the early stages.

Thanks to [Rob Jefe Lindstädt](https://github.com/eljefedelrodeodeljefe) for talking about the initial idea with me.

## License

Copyright [Glen Keane](https://github.com/thekemkid) and other contributors, Licensed under [MIT](./LICENSE).
