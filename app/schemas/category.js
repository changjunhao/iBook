let mongoose = require('mongoose')
mongoose.Promise = global.Promise
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId
let CategorySchema = new Schema({
  name: String,
  books: [{type: ObjectId, ref: 'Book'}],
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
CategorySchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})
CategorySchema.statics = {
  feach: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}
module.exports = CategorySchema
