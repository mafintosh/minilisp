module.exports = function normalise (s) {
  const tokens = tokenise(s)
  const stack = []

  for (const t of tokens) {
    if (t === '(') {
      const next = []
      if (stack.length) stack[stack.length - 1].push(next)
      stack.push(next)
    } else if (t === ')') {
      if (!stack.length) throw new Error('Unexpected )')
      if (stack.length === 1) return stack[0]
      stack.pop()
    } else {
      if (!stack.length) throw new Error('Unexpected token')
      stack[stack.length - 1].push(t)
    }
  }

  throw new Error('Expected )')
}

function tokenise (s) {
  const tokens = []

  let token = ''
  let openQuote = false

  for (let i = 0; i < s.length; i++) {
    if (openQuote) {
      if (s[i] === '"' && s[i - 1] !== '\\') {
        openQuote = false
        push(tokens, token + '"')
        token = ''
      } else {
        token += s[i]
      }
    } else {
      if (s[i] === '(' || s[i] === ')') {
        if (token) push(tokens, token)
        token = ''
        push(tokens, s[i])
      } else if (s[i] === ' ' || s[i] === '\n') {
        if (token) push(tokens, token)
        token = ''
      } else {
        if (!token && s[i] === '"') openQuote = true
        token += s[i]
      }
    }
  }

  if (openQuote) throw new Error('Unclosed string')
  if (token) push(tokens, token)

  return tokens
}

function push (list, token) {
  if (/^(\d+)(\.\d+)?$/.test(token)) list.push(Number(token))
  else if (token[0] === '"') list.push(JSON.parse(token))
  else if (token === 'true') list.push(true)
  else if (token === 'false') list.push(false)
  else list.push(token)
}
