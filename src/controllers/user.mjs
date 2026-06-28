import User from '../models/user.mjs'

export const signup = async (req, res, next) => {
  const _user = req.body.user
  if (!_user || !_user.name || !_user.password) {
    return res.redirect('/signup')
  }
  try {
    const existingUser = await User.findOne({ name: _user.name })
    if (existingUser) {
      return res.redirect('/signin')
    }
    const user = new User(_user)
    await user.save()
    res.redirect('/')
  } catch (err) {
    next(err)
  }
}

export const signin = async (req, res, next) => {
  const _user = req.body.user
  if (!_user || !_user.name || !_user.password) {
    return res.redirect('/signin')
  }
  const name = _user.name
  const password = _user.password
  try {
    const user = await User.findOne({ name: name })
    if (!user) {
      return res.redirect('/signup')
    }
    const isMatch = await user.comparePassword(password)
    if (isMatch) {
      req.session.user = user
      return res.redirect('/')
    } else {
      return res.redirect('/signin')
    }
  } catch (err) {
    next(err)
  }
}

export const showSignup = (req, res) => {
  res.render('signup', {
    title: '注册页面'
  })
}

export const showSignin = (req, res) => {
  res.render('signin', {
    title: '登录页面'
  })
}

export const logout = (req, res) => {
  delete req.session.user
  res.redirect('/')
}

export const list = async (req, res, next) => {
  try {
    const users = await User.fetch()
    res.render('userlist', {
      title: '用户列表页',
      users: users
    })
  } catch (err) {
    next(err)
  }
}

export const show = async (req, res, next) => {
  const id = req.params.id
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).render('error', {
        message: '用户不存在',
        error: { status: 404 }
      })
    }
    res.render('userDetail', {
      title: '用户详情',
      user: user
    })
  } catch (err) {
    next(err)
  }
}

export const showUpdate = async (req, res, next) => {
  const id = req.params.id
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).render('error', {
        message: '用户不存在',
        error: { status: 404 }
      })
    }
    res.render('userUpdate', {
      title: '用户修改',
      user: user
    })
  } catch (err) {
    next(err)
  }
}

export const userUpdate = async (req, res, next) => {
  const id = req.params.id
  const { name, password, role } = req.body
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).render('error', {
        message: '用户不存在',
        error: { status: 404 }
      })
    }
    if (name) user.name = name
    if (password) user.password = password
    if (role !== undefined) user.role = parseInt(role, 10)
    await user.save()
    res.redirect('/admin/user/list')
  } catch (err) {
    next(err)
  }
}

export const del = async (req, res, next) => {
  const id = req.query.id
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.json({ success: 0, message: '用户不存在' })
    }
    await User.deleteOne({ _id: id })
    res.json({ success: 1 })
  } catch (err) {
    next(err)
  }
}
