import mongoose from 'mongoose'
import CategorySchema from '../schemas/category.mjs'

const Category = mongoose.model('Category', CategorySchema)

export default Category
