let mongoose = require('mongoose')
let BookSchema = require('../schemas/book')
let Book = mongoose.model('Book', BookSchema)
module.exports = Book
