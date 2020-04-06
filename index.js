const parse = require('./parse')

module.exports = function runner (map) {
  return compileLisp

  function compileLisp (s) {
    return compile(parse(s))
  }

  function compile (program) {
    if (!Array.isArray(program)) return () => program

    const p = program[0]

    if (Array.isArray(p)) {
      return function () {
        let res
        for (const prog of program) res = compile(prog)()
        return res
      }
    }

    return function () {
      const fn = map(p)
      if (typeof fn !== 'function') throw new Error(p + ' is not a function')
      return fn(...program.slice(1).map(compile))
    }
  }
}
