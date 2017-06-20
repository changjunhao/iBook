let Book = require('../models/book')
let Category = require('../models/category')
let Comment = require('../models/comment')
let _ = require('underscore')

exports.detail = function(req, res, next) {
  let id = req.params.id
  Book.update({_id: id}, {$inc: {pv: 1}}, function(err) {
    if (err) {
      console.log(err)
    }
  })
  Book.findById(id, function(err, book) {
    Comment
      .find({book: id})
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
exports.list = function(req, res, next) {
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
exports.new = function(req, res, next) {
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
exports.update = function(req, res, next) {
  let id = req.params.id
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
exports.save = function(req, res, next) {
  let id = req.body.book._id
  let bookObj = req.body.book
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
    let categoryId = bookObj.category
    let categoryName = bookObj.categoryName
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
        let category = new Category({
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
exports.del = function(req, res) {
  let id = req.query.id
  if (id) {
    Book.remove({_id: id}, function(err, book) {
      if (err) {
        console.log(err)
      } else {
        res.json({success: 1})
      }
    })
  }
}
exports.saveCover = function(req, res, next) {
  let coverData = req.files.uploadCover
  if (coverData) {
    req.cover = coverData.name
    next()
  } else {
    next()
  }
}
