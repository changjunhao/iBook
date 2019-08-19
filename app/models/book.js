const mongoose = require('mongoose')
const BookSchema = require('../schemas/book')
const Book = mongoose.model('Book', BookSchema)
module.exports = Book
