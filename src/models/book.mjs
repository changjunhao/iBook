import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publisher: String,
  price: { type: String, required: true },
  summary: { type: String, required: true },
  isbn: String,
  cover: String,
  year: String,
  category: {
    type: ObjectId,
    ref: 'Category'
  },
  pv: {
    type: Number,
    default: 0
  },
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

BookSchema.pre('save', async function() {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
})

BookSchema.statics = {
  fetch: function() {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec()
  }
}

const Book = mongoose.model('Book', BookSchema)

export default Book
