import { describe, it, before, after, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import User from '../../src/models/user.mjs'
import Category from '../../src/models/category.mjs'
import { connectDB, disconnectDB, clearDB } from '../helpers/db.mjs'
import { createApp } from '../helpers/app.mjs'

const app = createApp()

describe('Category Integration', () => {
  before(async () => {
    await connectDB()
  })

  after(async () => {
    await disconnectDB()
  })

  beforeEach(async () => {
    await clearDB()
  })

  async function signinAsAdmin() {
    const agent = request.agent(app)
    const admin = new User({ name: 'admin', password: 'adminpass', role: 10 })
    await admin.save()
    await agent
      .post('/user/signin')
      .send({ user: { name: 'admin', password: 'adminpass' } })
    return agent
  }

  describe('GET /admin/category/new', () => {
    it('should render create category page', async () => {
      const agent = await signinAsAdmin()
      const res = await agent.get('/admin/category/new')
      assert.strictEqual(res.status, 200)
      assert.ok(res.text.includes('iBook 后台分类录入页'))
    })
  })

  describe('POST /admin/category (save)', () => {
    it('should create a new category', async () => {
      const agent = await signinAsAdmin()
      const res = await agent
        .post('/admin/category')
        .send({ category: { name: 'Science' } })
      assert.strictEqual(res.status, 302)
      assert.strictEqual(res.headers.location, '/admin/category/list')
      const category = await Category.findOne({ name: 'Science' })
      assert.ok(category)
    })
  })

  describe('GET /admin/category/list', () => {
    it('should render category list', async () => {
      const agent = await signinAsAdmin()
      await new Category({ name: 'Fiction' }).save()
      const res = await agent.get('/admin/category/list')
      assert.strictEqual(res.status, 200)
      assert.ok(res.text.includes('Fiction'))
    })
  })

  describe('DELETE /admin/category/list', () => {
    it('should delete a category', async () => {
      const agent = await signinAsAdmin()
      const category = new Category({ name: 'ToDelete' })
      await category.save()
      const res = await agent.delete(`/admin/category/list?id=${category._id}`)
      assert.strictEqual(res.status, 200)
      assert.deepStrictEqual(res.body, { success: 1 })
      const deleted = await Category.findById(category._id)
      assert.strictEqual(deleted, null)
    })

    it('should return error if id missing', async () => {
      const agent = await signinAsAdmin()
      const res = await agent.delete('/admin/category/list')
      assert.strictEqual(res.status, 400)
      assert.deepStrictEqual(res.body, { success: 0, message: 'Missing id' })
    })
  })

  describe('GET /admin/category/:id', () => {
    it('should show category with books', async () => {
      const agent = await signinAsAdmin()
      const category = new Category({ name: 'Fiction' })
      await category.save()
      const res = await agent.get(`/admin/category/${category._id}`)
      assert.strictEqual(res.status, 200)
      assert.ok(res.text.includes('Fiction'))
    })
  })
})
