const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const CommentSchema = new Schema({
  book: { type: ObjectId, ref: 'Book' },
  from: { type: ObjectId, ref: 'User' },
  reply: [{
    from: { type: ObjectId, ref: 'User' },
    to: { type: ObjectId, ref: 'User' },
    content: String
  }],
  content: String,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})
CommentSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})
CommentSchema.statics = {
  feach: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({ _id: id })
      .exec(cb)
  }
}
module.exports = CommentSchema
