import _ from 'underscore'
import Book from '../models/book.mjs'
import Category from '../models/category.mjs'
import Comment from '../models/comment.mjs'

const detail = (req, res, next) => {
  const id = req.params.id
  Book.updateOne({ _id: id }, { $inc: { pv: 1 } }, function(err) {
    if (err) {
      console.log(err)
    }
  })
  Book.findById(id, function(err, book) {
    Comment
      .find({ book: id })
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name')
      .exec(function(err, comments) {
        res.render('detail', {
          title: 'iBook ' + book.title,
          book: book,
          comments: comments
        })
      })
  })
}

const list = (req, res, next) => {
  Book.feach(function(err, books) {
    if (err) {
      console.log(err)
    }
    res.render('bookList', {
      title: 'iBook 列表页',
      books: books
    })
  })
}

const create = (req, res, next) => {
  Category.find({}, function(err, categories) {
    if (err) {
      console.log(err)
    }
    res.render('addBook', {
      title: 'iBook 后台录入页',
      categories: categories,
      book: {}
    })
  })
}

const update = (req, res, next) => {
  const id = req.params.id
  if (id) {
    Book.findById(id, function(err, book) {
      Category.find({}, function(err, categories) {
        res.render('addBook', {
          title: 'iBook 后台更新页',
          book: book,
          categories: categories
        })
      })
    })
  }
}

const save = (req, res, next) => {
  const id = req.body.book._id
  const bookObj = req.body.book
  let _book
  if (req.cover) {
    bookObj.cover = req.cover
  }
  if (id) {
    Book.findById(id, function(err, book) {
      if (err) {
        console.log(err)
      }
      _book = _.extend(book, bookObj)
      _book.save(function(err, book) {
        if (err) {
          console.log(err)
        }
        res.redirect('/book/' + book._id)
      })
    })
  } else {
    _book = new Book(bookObj)
    const categoryId = bookObj.category
    const categoryName = bookObj.categoryName
    _book.save(function(err, book) {
      if (err) {
        console.log(err)
      }
      if (categoryId) {
        Category.findById(categoryId, function(err, category) {
          category.books.push(book._id)
          category.save(function(err, category) {
            res.redirect('/book/' + book._id)
          })
        })
      } else if (categoryName) {
        const category = new Category({
          name: categoryName,
          books: [book._id]
        })
        category.save(function(err, category) {
          book.category = category._id
          book.save(function(err, book) {
            res.redirect('/book/' + book._id)
          })
        })
      }
    })
  }
}

const del = (req, res, next) => {
  const id = req.query.id
  if (id) {
    Book.remove({ _id: id }, function(err, book) {
      if (err) {
        console.log(err)
      } else {
        res.json({ success: 1 })
      }
    })
  }
}

const saveCover = (req, res, next) => {
  const coverData = req.files.find(item => item.fieldname === 'uploadCover')
  if (coverData) {
    req.cover = coverData.filename
    next()
  } else {
    next()
  }
}

export default {
  detail,
  list,
  create,
  update,
  save,
  del,
  saveCover
}
