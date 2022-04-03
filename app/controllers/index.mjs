import Book from '../models/book.mjs'
import Category from '../models/category.mjs'

const index = (req, res, next) => {
  Category
    .find({})
    .populate({ path: 'books', options: { limit: 6 } })
    .exec(function(err, categories) {
      if (err) {
        console.log(err)
      }
      res.render('index', {
        title: 'iBook 首页',
        categories: categories
      })
    })
}
const search = (req, res, next) => {
  const catId = req.query.cat
  const q = req.query.q
  const page = parseInt(req.query.p, 10) || 0
  const count = 2
  const index = page * count
  if (catId) {
    Category
      .find({ _id: catId })
      .populate({
        path: 'books',
        select: 'title cover'
      })
      .exec(function(err, categories) {
        if (err) {
          console.log(err)
        }
        const category = categories[0] || {}
        const books = category.books || []
        const results = books.slice(index, index + count)
        res.render('results', {
          title: 'iBook 结果列表页面',
          keyword: category.name,
          currentPage: (page + 1),
          query: 'cat=' + catId,
          totalPage: Math.ceil(books.length / count),
          books: results
        })
      })
  } else {
    Book
      .find({ title: new RegExp(q + '.*', 'i') })
      .exec(function(err, books) {
        if (err) {
          console.log(err)
        }
        const results = books.slice(index, index + count)
        res.render('results', {
          title: 'iBook 结果列表页面',
          keyword: q,
          currentPage: (page + 1),
          query: 'q=' + q,
          totalPage: Math.ceil(books.length / count),
          books: results
        })
      })
  }
}

export default {
  index,
  search
}
