let Category = require('../models/category')
let Book = require('../models/book')
exports.new = function(req, res, next) {
  res.render('category_admin', {
    title: 'iBook 后台分类录入页',
    category: {}
  })
}
exports.save = function(req, res, next) {
  let _category = req.body.category
  let category = new Category(_category)
  category.save(function(err, category) {
    if (err) {
      console.log(err)
    }
    res.redirect('/admin/category/list')
  })
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
exports.list = function(req, res, next) {
  Category.feach(function(err, categories) {
    if (err) {
      console.log(err)
    }
    res.render('categorylist', {
      title: 'ibook 分类列表页',
      categories: categories
    })
  })
}
