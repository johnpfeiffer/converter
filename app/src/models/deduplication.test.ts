import { describe, expect, it } from 'vitest'
import { deduplicateLines, sortLines, splitByWhitespace } from './deduplication'

describe('deduplication', () => {
  it.each([
    ['pear\napple\npear\nbanana\napple', 'pear\napple\nbanana'],
    ['Apple\napple\nApple\n apple', 'Apple\napple\n apple'],
    ['a\r\nb\r\na\r\n', 'a\nb'],
    ['\n\na\n\n', 'a'],
  ])('keeps exact first occurrences from %j', (input, expected) => {
    expect(deduplicateLines(input)).toBe(expected)
  })

  it('splits Unicode and ASCII whitespace without retaining empty tokens', () => {
    expect(splitByWhitespace(' pear\tapple\n banana  pear\u00a0kiwi ')).toBe(
      'pear\napple\nbanana\npear\nkiwi',
    )
  })

  it('sorts lines while preserving duplicates', () => {
    expect(sortLines('pear\napple\r\npear\nBanana')).toBe('Banana\napple\npear\npear')
  })
})
