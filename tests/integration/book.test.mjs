import { describe, it, before, after, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import User from '../../src/models/user.mjs'
import Book from '../../src/models/book.mjs'
import Category from '../../src/models/category.mjs'
import { connectDB, disconnectDB, clearDB } from '../helpers/db.mjs'
import { createApp } from '../helpers/app.mjs'

const app = createApp()

describe('Book Integration', () => {
  before(async () => {
    await connectDB()
  })

  after(async () => {
    await disconnectDB()
  })

  beforeEach(async () => {
    await clearDB()
  })

  /**
   * Helper: create an admin user and sign in, return supertest agent with session
   */
  async function signinAsAdmin() {
    const agent = request.agent(app)
    const admin = new User({ name: 'admin', password: 'adminpass', role: 10 })
    await admin.save()
    await agent
      .post('/user/signin')
      .send({ user: { name: 'admin', password: 'adminpass' } })
    return agent
  }

  /**
   * Helper: create a regular user and sign in
   */
  async function signinAsUser() {
    const agent = request.agent(app)
    const user = new User({ name: 'user', password: 'userpass', role: 0 })
    await user.save()
    await agent
      .post('/user/signin')
      .send({ user: { name: 'user', password: 'userpass' } })
    return agent
  }

  describe('GET /book/:id (detail)', () => {
    it('should render book detail page', async () => {
      const book = new Book({ title: 'Test Book', author: 'Author', price: '29.99', summary: 'A test book' })
      await book.save()
      const res = await request(app).get(`/book/${book._id}`)
      assert.strictEqual(res.status, 200)
      assert.ok(res.text.includes('Test Book'))
    })

    it('should increment pv on each view', async () => {
      const book = new Book({ title: 'Test Book', author: 'Author', price: '29.99', summary: 'A test book' })
      await book.save()
      await request(app).get(`/book/${book._id}`)
      const updated = await Book.findById(book._id)
      assert.strictEqual(updated.pv, 1)
      await request(app).get(`/book/${book._id}`)
      const updated2 = await Book.findById(book._id)
      assert.strictEqual(updated2.pv, 2)
    })
  })

  describe('GET /admin/book/list', () => {
    it('should render book list for admin', async () => {
      const agent = await signinAsAdmin()
      const res = await agent.get('/admin/book/list')
      assert.strictEqual(res.status, 200)
      assert.ok(res.text.includes('iBook 列表页'))
    })

    it('should redirect non-admin user', async () => {
      const agent = await signinAsUser()
      const res = await agent.get('/admin/book/list')
      assert.strictEqual(res.status, 302)
      assert.strictEqual(res.headers.location, '/signin')
    })
  })

  describe('GET /admin/book/new', () => {
    it('should render add book page for admin', async () => {
      const agent = await signinAsAdmin()
      const res = await agent.get('/admin/book/new')
      assert.strictEqual(res.status, 200)
      assert.ok(res.text.includes('iBook 后台录入页'))
    })
  })

  describe('POST /admin/book (save)', () => {
    it('should create a new book', async () => {
      const agent = await signinAsAdmin()
      const res = await agent
        .post('/admin/book')
        .send({
          book: {
            title: 'New Book',
            author: 'Test Author',
            price: '39.99',
            summary: 'A new book summary',
            publisher: 'Test Publisher',
            isbn: '1234567890',
            year: '2024'
          }
        })
      assert.strictEqual(res.status, 302)
      const book = await Book.findOne({ title: 'New Book' })
      assert.ok(book)
      assert.strictEqual(book.author, 'Test Author')
      assert.strictEqual(book.price, '39.99')
    })

    it('should create book with new category name', async () => {
      const agent = await signinAsAdmin()
      const res = await agent
        .post('/admin/book')
        .send({
          book: {
            title: 'Categorized Book',
            author: 'Author',
            price: '19.99',
            summary: 'Summary',
            categoryName: 'Fiction'
          }
        })
      assert.strictEqual(res.status, 302)
      const category = await Category.findOne({ name: 'Fiction' })
      assert.ok(category)
    })
  })

  describe('DELETE /admin/book/list', () => {
    it('should delete a book', async () => {
      const agent = await signinAsAdmin()
      const book = new Book({ title: 'To Delete', author: 'Author', price: '9.99', summary: 'Delete me' })
      await book.save()
      const res = await agent.delete(`/admin/book/list?id=${book._id}`)
      assert.strictEqual(res.status, 200)
      assert.deepStrictEqual(res.body, { success: 1 })
      const deleted = await Book.findById(book._id)
      assert.strictEqual(deleted, null)
    })

    it('should return error if id missing', async () => {
      const agent = await signinAsAdmin()
      const res = await agent.delete('/admin/book/list')
      assert.strictEqual(res.status, 400)
      assert.deepStrictEqual(res.body, { success: 0, message: 'Missing id' })
    })
  })
})
