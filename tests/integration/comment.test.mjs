import { describe, it, before, after, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import User from '../../src/models/user.mjs'
import Book from '../../src/models/book.mjs'
import Comment from '../../src/models/comment.mjs'
import { connectDB, disconnectDB, clearDB } from '../helpers/db.mjs'
import { createApp } from '../helpers/app.mjs'

const app = createApp()

describe('Comment Integration', () => {
  before(async () => {
    await connectDB()
  })

  after(async () => {
    await disconnectDB()
  })

  beforeEach(async () => {
    await clearDB()
  })

  async function signinAsUser(name = 'testuser') {
    const agent = request.agent(app)
    const user = new User({ name, password: 'testpass' })
    await user.save()
    await agent
      .post('/user/signin')
      .send({ user: { name, password: 'testpass' } })
    return { agent, user }
  }

  describe('POST /user/comment (save)', () => {
    it('should create a new comment', async () => {
      const { agent, user } = await signinAsUser()
      const book = new Book({ title: 'Book', author: 'Author', price: '10', summary: 'Summary' })
      await book.save()

      const res = await agent
        .post('/user/comment')
        .send({
          comment: {
            book: book._id.toString(),
            from: user._id.toString(),
            content: 'Great book!'
          }
        })
      assert.strictEqual(res.status, 302)
      assert.ok(res.headers.location.includes(`/book/${book._id}`))

      const comments = await Comment.find({ book: book._id })
      assert.strictEqual(comments.length, 1)
      assert.strictEqual(comments[0].content, 'Great book!')
    })

    it('should add reply to existing comment with cid', async () => {
      const { agent, user } = await signinAsUser('commenter')
      const book = new Book({ title: 'Book', author: 'Author', price: '10', summary: 'Summary' })
      await book.save()

      // Create first comment
      const comment = new Comment({
        book: book._id,
        from: user._id,
        content: 'First comment'
      })
      await comment.save()

      // Add reply
      const res = await agent
        .post('/user/comment')
        .send({
          comment: {
            book: book._id.toString(),
            cid: comment._id.toString(),
            from: user._id.toString(),
            tid: user._id.toString(),
            content: 'Reply to comment'
          }
        })
      assert.strictEqual(res.status, 302)

      const updated = await Comment.findById(comment._id)
      assert.strictEqual(updated.reply.length, 1)
      assert.strictEqual(updated.reply[0].content, 'Reply to comment')
    })

    it('should require signin', async () => {
      const res = await request(app)
        .post('/user/comment')
        .send({ comment: { book: 'someid', from: 'someid', content: 'test' } })
      assert.strictEqual(res.status, 302)
      assert.strictEqual(res.headers.location, '/signin')
    })
  })
})
