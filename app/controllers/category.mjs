import Book from '../models/book.mjs'
import Category from '../models/category.mjs'

const create = (req, res, next) => {
  res.render('category_admin', {
    title: 'iBook 后台分类录入页',
    category: {}
  })
}
const save = (req, res, next) => {
  const _category = req.body.category
  const category = new Category(_category)
  category.save(function(err, category) {
    if (err) {
      console.log(err)
    }
    res.redirect('/admin/category/list')
  })
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
const list = (req, res, next) => {
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

export default {
  create,
  save,
  del,
  list
}
