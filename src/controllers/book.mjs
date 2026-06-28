import Book from '../models/book.mjs'
import Category from '../models/category.mjs'
import Comment from '../models/comment.mjs'

export const detail = async (req, res, next) => {
  const id = req.params.id
  try {
    const book = await Book.findByIdAndUpdate(
      id,
      { $inc: { pv: 1 } },
      { new: true }
    )
    const comments = await Comment
      .find({ book: id })
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name')
      .exec()
    res.render('detail', {
      title: 'iBook ' + book.title,
      book: book,
      comments: comments
    })
  } catch (err) {
    next(err)
  }
}

export const list = async (req, res, next) => {
  try {
    const books = await Book.fetch()
    res.render('bookList', {
      title: 'iBook 列表页',
      books: books
    })
  } catch (err) {
    next(err)
  }
}

export const create = async (req, res, next) => {
  try {
    const categories = await Category.find({})
    res.render('addBook', {
      title: 'iBook 后台录入页',
      categories: categories,
      book: {}
    })
  } catch (err) {
    next(err)
  }
}

export const update = async (req, res, next) => {
  const id = req.params.id
  if (!id) {
    return next(new Error('Missing book id'))
  }
  try {
    const book = await Book.findById(id)
    const categories = await Category.find({})
    res.render('addBook', {
      title: 'iBook 后台更新页',
      book: book,
      categories: categories
    })
  } catch (err) {
    next(err)
  }
}

export const save = async (req, res, next) => {
  try {
    const bookObj = req.body.book || {}
    const id = bookObj._id
    let _book
    if (req.cover) {
      bookObj.cover = req.cover
    }
    if (id) {
      const book = await Book.findById(id)
      const updateFields = { ...bookObj }
      delete updateFields._id
      _book = Object.assign(book, updateFields)
      await _book.save()
      res.redirect('/book/' + _book._id)
    } else {
      _book = new Book(bookObj)
      const categoryId = bookObj.category
      const categoryName = bookObj.categoryName
      const savedBook = await _book.save()
      if (categoryId) {
        const category = await Category.findById(categoryId)
        category.books.push(savedBook._id)
        await category.save()
      } else if (categoryName) {
        const category = new Category({
          name: categoryName,
          books: [savedBook._id]
        })
        await category.save()
        savedBook.category = category._id
        await savedBook.save()
      }
      res.redirect('/book/' + savedBook._id)
    }
  } catch (err) {
    next(err)
  }
}

export const del = async (req, res, next) => {
  const id = req.query.id
  if (!id) {
    return res.status(400).json({ success: 0, message: 'Missing id' })
  }
  try {
    await Book.deleteOne({ _id: id })
    res.json({ success: 1 })
  } catch (err) {
    next(err)
  }
}

export const saveCover = (req, res, next) => {
  const coverData = (req.files || []).find(item => item.fieldname === 'uploadCover')
  if (coverData) {
    req.cover = coverData.filename
  }
  next()
}
