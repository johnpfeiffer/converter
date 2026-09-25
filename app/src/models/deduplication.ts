export const nonemptyLines = (input: string): string[] =>
  input
    .split('\n')
    .map((line) => (line.endsWith('\r') ? line.slice(0, -1) : line))
    .filter((line) => line.length > 0)

export const deduplicateLines = (input: string): string =>
  [...new Set(nonemptyLines(input))].join('\n')

export const sortLines = (input: string): string => nonemptyLines(input).sort().join('\n')

export const splitByWhitespace = (input: string): string => {
  const tokens: string[] = []
  let token = ''

  for (const character of input) {
    if (character.trim() === '') {
      if (token) {
        tokens.push(token)
        token = ''
      }
    } else {
      token += character
    }
  }

  if (token) tokens.push(token)
  return tokens.join('\n')
}
