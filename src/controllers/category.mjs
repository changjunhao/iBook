import Category from '../models/category.mjs'

export const create = (req, res) => {
  res.render('category_admin', {
    title: 'iBook 后台分类录入页',
    category: {}
  })
}

export const save = async (req, res, next) => {
  const _category = req.body.category
  const category = new Category(_category)
  try {
    await category.save()
    res.redirect('/admin/category/list')
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
    await Category.deleteOne({ _id: id })
    res.json({ success: 1 })
  } catch (err) {
    next(err)
  }
}

export const list = async (req, res, next) => {
  try {
    const categories = await Category.fetch()
    res.render('categorylist', {
      title: 'ibook 分类列表页',
      categories: categories
    })
  } catch (err) {
    next(err)
  }
}

export const show = async (req, res, next) => {
  const id = req.params.id
  try {
    const category = await Category.findById(id).populate('books', 'title cover')
    if (!category) {
      return res.status(404).render('error', {
        message: '分类不存在',
        error: { status: 404 }
      })
    }
    const books = category.books || []
    res.render('results', {
      title: 'iBook 分类: ' + category.name,
      keyword: category.name,
      currentPage: 1,
      query: 'cat=' + encodeURIComponent(id),
      totalPage: Math.ceil(books.length / 2),
      books: books.slice(0, 2)
    })
  } catch (err) {
    next(err)
  }
}

export const update = async (req, res, next) => {
  const id = req.params.id
  try {
    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).render('error', {
        message: '分类不存在',
        error: { status: 404 }
      })
    }
    res.render('category_update', {
      title: 'iBook 分类修改',
      category: category
    })
  } catch (err) {
    next(err)
  }
}

export const saveUpdate = async (req, res, next) => {
  const id = req.params.id
  const _category = req.body.category
  try {
    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).render('error', {
        message: '分类不存在',
        error: { status: 404 }
      })
    }
    if (_category && _category.name) category.name = _category.name
    await category.save()
    res.redirect('/admin/category/list')
  } catch (err) {
    next(err)
  }
}
