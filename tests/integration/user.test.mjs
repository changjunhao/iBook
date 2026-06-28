import { describe, it, before, after, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import User from '../../src/models/user.mjs'
import { connectDB, disconnectDB, clearDB } from '../helpers/db.mjs'
import { createApp } from '../helpers/app.mjs'

const app = createApp()

describe('User Integration', () => {
  before(async () => {
    await connectDB()
    // Ensure MongoDB indexes are created for unique constraint
    await User.createIndexes()
  })

  after(async () => {
    await disconnectDB()
  })

  beforeEach(async () => {
    await clearDB()
  })

  describe('User Schema', () => {
    it('should hash password on save', async () => {
      const user = new User({ name: 'testuser', password: 'plaintext' })
      await user.save()
      assert.notStrictEqual(user.password, 'plaintext')
      assert.ok(user.password.includes(':'))
    })

    it('should re-hash password when modified', async () => {
      const user = new User({ name: 'testuser', password: 'oldpass' })
      await user.save()
      const oldHash = user.password
      user.password = 'newpass'
      await user.save()
      assert.notStrictEqual(user.password, oldHash)
    })

    it('should compare password correctly', async () => {
      const user = new User({ name: 'testuser', password: 'secret' })
      await user.save()
      const match = await user.comparePassword('secret')
      assert.strictEqual(match, true)
      const noMatch = await user.comparePassword('wrong')
      assert.strictEqual(noMatch, false)
    })

    it('should default role to 0', async () => {
      const user = new User({ name: 'testuser', password: 'pass' })
      await user.save()
      assert.strictEqual(user.role, 0)
    })

    it('should set meta timestamps on create', async () => {
      const user = new User({ name: 'testuser', password: 'pass' })
      await user.save()
      assert.ok(user.meta.createdAt instanceof Date)
      assert.ok(user.meta.updateAt instanceof Date)
    })

    it('should update meta.updateAt on save', async () => {
      const user = new User({ name: 'testuser', password: 'pass' })
      await user.save()
      const originalUpdate = user.meta.updateAt.getTime()
      await new Promise(resolve => setTimeout(resolve, 10))
      user.name = 'updateduser'
      await user.save()
      assert.ok(user.meta.updateAt.getTime() > originalUpdate)
    })

    it('should enforce unique name', async () => {
      await new User({ name: 'unique', password: 'pass1' }).save()
      // Mongoose 9 rejects with MongoServerError on duplicate
      await assert.rejects(
        () => new User({ name: 'unique', password: 'pass2' }).save(),
        /E11000/
      )
    })
  })

  describe('User Controller', () => {
    describe('GET /signup', () => {
      it('should render signup page', async () => {
        const res = await request(app).get('/signup')
        assert.strictEqual(res.status, 200)
        assert.ok(res.text.includes('注册'))
      })
    })

    describe('GET /signin', () => {
      it('should render signin page', async () => {
        const res = await request(app).get('/signin')
        assert.strictEqual(res.status, 200)
        assert.ok(res.text.includes('登录'))
      })
    })

    describe('POST /user/signup', () => {
      it('should create user and redirect to /', async () => {
        const res = await request(app)
          .post('/user/signup')
          .send({ user: { name: 'newuser', password: 'password123' } })
        assert.strictEqual(res.status, 302)
        assert.strictEqual(res.headers.location, '/')
        const user = await User.findOne({ name: 'newuser' })
        assert.ok(user)
      })

      it('should redirect to /signup if name missing', async () => {
        const res = await request(app)
          .post('/user/signup')
          .send({ user: { password: 'password123' } })
        assert.strictEqual(res.status, 302)
        assert.strictEqual(res.headers.location, '/signup')
      })

      it('should redirect to /signup if password missing', async () => {
        const res = await request(app)
          .post('/user/signup')
          .send({ user: { name: 'newuser' } })
        assert.strictEqual(res.status, 302)
        assert.strictEqual(res.headers.location, '/signup')
      })

      it('should redirect to /signin if user already exists', async () => {
        await new User({ name: 'existing', password: 'pass' }).save()
        const res = await request(app)
          .post('/user/signup')
          .send({ user: { name: 'existing', password: 'newpass' } })
        assert.strictEqual(res.status, 302)
        assert.strictEqual(res.headers.location, '/signin')
      })
    })

    describe('POST /user/signin', () => {
      beforeEach(async () => {
        await clearDB()
        await new User({ name: 'loginuser', password: 'correct' }).save()
      })

      it('should login with correct password', async () => {
        const res = await request(app)
          .post('/user/signin')
          .send({ user: { name: 'loginuser', password: 'correct' } })
        assert.strictEqual(res.status, 302)
        assert.strictEqual(res.headers.location, '/')
      })

      it('should redirect to /signin with wrong password', async () => {
        const res = await request(app)
          .post('/user/signin')
          .send({ user: { name: 'loginuser', password: 'wrong' } })
        assert.strictEqual(res.status, 302)
        assert.strictEqual(res.headers.location, '/signin')
      })

      it('should redirect to /signup for non-existent user', async () => {
        const res = await request(app)
          .post('/user/signin')
          .send({ user: { name: 'nouser', password: 'any' } })
        assert.strictEqual(res.status, 302)
        assert.strictEqual(res.headers.location, '/signup')
      })
    })

    describe('GET /logout', () => {
      it('should redirect to /', async () => {
        const res = await request(app).get('/logout')
        assert.strictEqual(res.status, 302)
        assert.strictEqual(res.headers.location, '/')
      })
    })

    describe('Admin Routes (require signin)', () => {
      it('should redirect unauthenticated user to /signin', async () => {
        const res = await request(app).get('/admin/user/list')
        assert.strictEqual(res.status, 302)
        assert.strictEqual(res.headers.location, '/signin')
      })
    })
  })
})
