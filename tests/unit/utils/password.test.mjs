import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { hashPassword, comparePassword } from '../../../src/utils/password.mjs'

describe('hashPassword', () => {
  it('should return a salt:hash string', async () => {
    const result = await hashPassword('mypassword')
    assert.ok(result.includes(':'))
    const [salt, hash] = result.split(':')
    assert.strictEqual(salt.length, 32) // 16 bytes hex = 32 chars
    assert.strictEqual(hash.length, 128) // 64 bytes hex = 128 chars
  })

  it('should produce different hashes for same password', async () => {
    const hash1 = await hashPassword('mypassword')
    const hash2 = await hashPassword('mypassword')
    assert.notStrictEqual(hash1, hash2) // different salt = different hash
  })
})

describe('comparePassword', () => {
  it('should return true for matching password', async () => {
    const hash = await hashPassword('secret123')
    const result = await comparePassword('secret123', hash)
    assert.strictEqual(result, true)
  })

  it('should return false for non-matching password', async () => {
    const hash = await hashPassword('secret123')
    const result = await comparePassword('wrongpassword', hash)
    assert.strictEqual(result, false)
  })

  it('should handle invalid hash gracefully', async () => {
    const result = await comparePassword('anything', 'not-a-valid-hash')
    assert.strictEqual(result, false)
  })

  it('should be case sensitive', async () => {
    const hash = await hashPassword('Password')
    const result = await comparePassword('password', hash)
    assert.strictEqual(result, false)
  })
})
