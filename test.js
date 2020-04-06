const tape = require('tape')
const lispson = require('./')

tape('basic', function (t) {
  const compile = lispson(val => () => val)

  t.same(compile('(1)')(), 1)
  t.end()
})

tape('add', function (t) {
  const compile = lispson(function (name) {
    if (name === '+') return (a, b) => a() + b()
  })

  t.same(compile('(+ 1 2)')(), 3)
  t.same(compile('(+ 1 (+ 2 3))')(), 6)
  t.same(compile('(+ 1 (+ 2 (+ 3 4)))')(), 10)
  t.end()
})

tape('advanced', function (t) {
  const state = new Map()
  const compile = lispson(function (name) {
    if (name === '+') return (a, b) => a() + b()
    if (name === 'if') return (c, t, f = () => {}) => c() ? t() : f()
    if (name === 'set') return (n, v) => state.set(n(), v())
    if (name === 'get') return (n) => state.get(n())
  })

  t.same(compile('(if true 1 2)')(), 1)
  t.same(compile('(if false 1 2)')(), 2)
  t.same(compile('((set 1 2) (get 1))')(), 2)
  t.end()
})
