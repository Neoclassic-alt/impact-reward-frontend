import { describe, expect, test } from 'vitest'
import { plural } from '../index'

describe('russian_plural', () => {
  test('plural 1', () => {
    expect(plural(1, 'секунду', 'секунды', 'секунд')).toBe('секунду')
  })
  
  test('plural 5', () => {
    expect(plural(5, 'секунду', 'секунды', 'секунд')).toBe('секунд')
  })
})
