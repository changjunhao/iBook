import crypto from 'crypto'

const SALT_LEN = 16
const KEY_LEN = 64

export function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(SALT_LEN)
    crypto.scrypt(password, salt, KEY_LEN, (err, derivedKey) => {
      if (err) return reject(err)
      resolve(salt.toString('hex') + ':' + derivedKey.toString('hex'))
    })
  })
}

export function comparePassword(password, hash) {
  return new Promise((resolve, reject) => {
    const parts = hash.split(':')
    const salt = parts.length === 2 ? Buffer.from(parts[0], 'hex') : crypto.randomBytes(SALT_LEN)
    const key = parts.length === 2 ? Buffer.from(parts[1], 'hex') : Buffer.alloc(KEY_LEN)
    crypto.scrypt(password, salt, KEY_LEN, (err, derivedKey) => {
      if (err) return reject(err)
      if (derivedKey.length !== key.length) {
        return resolve(false)
      }
      resolve(crypto.timingSafeEqual(derivedKey, key))
    })
  })
}
