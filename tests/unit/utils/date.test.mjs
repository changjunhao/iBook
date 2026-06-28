import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { formatDate } from '../../../src/utils/date.mjs'

describe('formatDate', () => {
  it('should return empty string for null/undefined date', () => {
    assert.strictEqual(formatDate(null), '')
    assert.strictEqual(formatDate(undefined), '')
  })

  it('should return empty string for invalid date string', () => {
    assert.strictEqual(formatDate('not-a-date'), '')
    assert.strictEqual(formatDate('invalid'), '')
  })

  it('should use default format MM/DD/YYYY', () => {
    const result = formatDate('2024-03-15')
    assert.strictEqual(result, '03/15/2024')
  })

  it('should format with custom format YYYY-MM-DD', () => {
    const date = new Date(2024, 0, 5) // Jan 5, 2024
    const result = formatDate(date, 'YYYY-MM-DD')
    assert.strictEqual(result, '2024-01-05')
  })

  it('should pad single-digit month and day', () => {
    const date = new Date(2024, 0, 5)
    const result = formatDate(date, 'MM/DD/YYYY')
    assert.strictEqual(result, '01/05/2024')
  })

  it('should handle double-digit month and day', () => {
    const date = new Date(2024, 10, 25) // Nov 25
    const result = formatDate(date, 'MM/DD/YYYY')
    assert.strictEqual(result, '11/25/2024')
  })

  it('should accept Date object', () => {
    const date = new Date('2024-06-15T12:00:00Z')
    const result = formatDate(date, 'YYYY/MM/DD')
    assert.strictEqual(result, '2024/06/15')
  })

  it('should accept ISO date string', () => {
    const result = formatDate('2024-12-31', 'DD-MM-YYYY')
    assert.strictEqual(result, '31-12-2024')
  })

  it('should return empty string for NaN Date object', () => {
    const result = formatDate(new Date('invalid'))
    assert.strictEqual(result, '')
  })
})
