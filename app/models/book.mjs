import mongoose from 'mongoose'
import BookSchema from '../schemas/book.mjs'

const Book = mongoose.model('Book', BookSchema)

export default Book
