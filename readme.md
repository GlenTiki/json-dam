# Json-dam

Fill in a stream of json, with a Dam of data!

Takes a stream of ndjson, and creates a singular object out of it.
Its like getting a picture of a puzzle, the puzzle pieces, and putting it together!

```
var jsonDam = require('json-dam')

ndjsonStream.pipe(jsonDam())

jsonDam.on(data, (thePuzzle) => {
  // Here we have the filled out puzzle content!
})
```

Or pipe an object stream in like so

```
var jsonDam = require('json-dam')

objectStream.pipe(jsonDam({objectMode: true}))

jsonDam.on(data, (thePuzzle) => {
  // Here we have the filled out puzzle content!
})
```