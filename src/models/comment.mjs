import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CommentSchema = new Schema({
  book: { type: ObjectId, ref: 'Book', required: true, index: true },
  from: { type: ObjectId, ref: 'User', required: true },
  reply: [{
    from: { type: ObjectId, ref: 'User' },
    to: { type: ObjectId, ref: 'User' },
    content: String
  }],
  content: { type: String, required: true },
  meta: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updateAt: {
      type: Date,
      default: Date.now
    }
  }
})

CommentSchema.pre('save', async function() {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
})

CommentSchema.statics = {
  fetch: function() {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec()
  }
}

const Comment = mongoose.model('Comment', CommentSchema)

export default Comment
