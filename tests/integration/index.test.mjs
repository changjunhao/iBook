import { describe, it, before, after, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import Book from '../../src/models/book.mjs'
import Category from '../../src/models/category.mjs'
import { connectDB, disconnectDB, clearDB } from '../helpers/db.mjs'
import { createApp } from '../helpers/app.mjs'

const app = createApp()

describe('Index Integration', () => {
  before(async () => {
    await connectDB()
  })

  after(async () => {
    await disconnectDB()
  })

  beforeEach(async () => {
    await clearDB()
  })

  describe('GET / (homepage)', () => {
    it('should render homepage with categories', async () => {
      await new Category({ name: 'Fiction' }).save()
      const res = await request(app).get('/')
      assert.strictEqual(res.status, 200)
      assert.ok(res.text.includes('iBook 首页'))
    })

    it('should handle empty database gracefully', async () => {
      const res = await request(app).get('/')
      assert.strictEqual(res.status, 200)
      assert.ok(res.text.includes('iBook 首页'))
    })
  })

  describe('GET /results (search)', () => {
    it('should search books by title', async () => {
      await new Book({
        title: 'JavaScript Guide',
        author: 'Author',
        price: '29.99',
        summary: 'A book about JavaScript'
      }).save()
      await new Book({
        title: 'Python Guide',
        author: 'Author',
        price: '19.99',
        summary: 'A book about Python'
      }).save()

      const res = await request(app).get('/results?q=JavaScript')
      assert.strictEqual(res.status, 200)
      assert.ok(res.text.includes('JavaScript Guide'))
      assert.ok(!res.text.includes('Python Guide'))
    })

    it('should search by category', async () => {
      const category = new Category({ name: 'Programming' })
      await category.save()
      const book = new Book({
        title: 'Node.js Book',
        author: 'Author',
        price: '39.99',
        summary: 'Learn Node.js',
        category: category._id
      })
      await book.save()
      category.books.push(book._id)
      await category.save()

      const res = await request(app).get(`/results?cat=${category._id}`)
      assert.strictEqual(res.status, 200)
      assert.ok(res.text.includes('Node.js Book'))
    })

    it('should handle search with no results', async () => {
      const res = await request(app).get('/results?q=NonExistent')
      assert.strictEqual(res.status, 200)
      assert.ok(res.text.includes('iBook 结果列表页面'))
    })

    it('should support pagination', async () => {
      for (let i = 1; i <= 5; i++) {
        await new Book({
          title: `Book ${i}`,
          author: 'Author',
          price: '9.99',
          summary: 'Summary'
        }).save()
      }

      const resPage1 = await request(app).get('/results?q=Book&p=0')
      assert.strictEqual(resPage1.status, 200)

      const resPage2 = await request(app).get('/results?q=Book&p=1')
      assert.strictEqual(resPage2.status, 200)
    })
  })
})
