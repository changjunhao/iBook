let mongoose = require('mongoose')
let CategorySchema = require('../schemas/category')
let Category = mongoose.model('Category', CategorySchema)
module.exports = Category
