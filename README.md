# minilisp

Small minimalistic LISP interpreter

```
npm install minilisp
```

## Usage

``` js
const minilisp = require('minilisp')

// Define your functions.
// Notice all values/statements are functions that can be resolved lazily.
const lisp = minilisp(function (name) {
  if (name === '+') {
    return function (a, b) {
      return a() + b()
    }
  }
  if (name === '-') {
    return function (a, b) {
      return a() - b()
    }
  }
})

// Compile your program
const prog = lisp(`
  (+ 1 (- 3 2))
`)

// And run it
console.log(prog()) // prints 2!
```

## License

MIT
