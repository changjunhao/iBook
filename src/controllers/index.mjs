import Book from '../models/book.mjs'
import Category from '../models/category.mjs'

export const index = async (req, res, next) => {
  try {
    const categories = await Category
      .find({})
      .populate({ path: 'books', options: { limit: 6 } })
      .exec()
    res.render('index', {
      title: 'iBook 首页',
      categories: categories
    })
  } catch (err) {
    next(err)
  }
}

export const search = async (req, res, next) => {
  const catId = req.query.cat
  const q = req.query.q
  const page = parseInt(req.query.p, 10) || 0
  const count = 2
  const index = page * count
  try {
    if (catId) {
      const categories = await Category
        .find({ _id: catId })
        .populate({
          path: 'books',
          select: 'title cover'
        })
        .exec()
      const category = categories[0] || {}
      const books = category.books || []
      const results = books.slice(index, index + count)
      res.render('results', {
        title: 'iBook 结果列表页面',
        keyword: category.name,
        currentPage: (page + 1),
        query: 'cat=' + encodeURIComponent(catId),
        totalPage: Math.ceil(books.length / count),
        books: results
      })
    } else {
      const books = await Book
        .find({ title: new RegExp(q + '.*', 'i') })
        .exec()
      const results = books.slice(index, index + count)
      res.render('results', {
        title: 'iBook 结果列表页面',
        keyword: q,
        currentPage: (page + 1),
        query: 'q=' + encodeURIComponent(q),
        totalPage: Math.ceil(books.length / count),
        books: results
      })
    }
  } catch (err) {
    next(err)
  }
}
