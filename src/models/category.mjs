import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CategorySchema = new Schema({
  name: { type: String, required: true },
  books: [{ type: ObjectId, ref: 'Book' }],
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

CategorySchema.pre('save', async function() {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
})

CategorySchema.statics = {
  fetch: function() {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec()
  }
}

const Category = mongoose.model('Category', CategorySchema)

export default Category
