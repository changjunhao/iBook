import User from '../models/user.mjs'

const signup = (req, res, next) => {
  const _user = req.body.user
  User.findOne({ name: _user.name }, function(err, user) {
    if (err) {
      console.log(err)
    }
    if (user) {
      return res.redirect('/signin')
    } else {
      const user = new User(_user)
      user.save(function(err, user) {
        if (err) {
          console.log(err)
        }
        res.redirect('/')
      })
    }
  })
}
const signin = (req, res, next) => {
  const _user = req.body.user
  const name = _user.name
  const password = _user.password
  User.findOne({ name: name }, function(err, user) {
    if (err) {
      console.log(err)
    }
    if (!user) {
      return res.redirect('/signup')
    }
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        console.log(err)
      }
      if (isMatch) {
        req.session.user = user
        return res.redirect('/')
      } else {
        return res.redirect('/signin')
      }
    })
  })
}
const showSignup = (req, res, next) => {
  res.render('signup', {
    title: '注册页面'
  })
}
const showSignin = (req, res, next) => {
  res.render('signin', {
    title: '登录页面'
  })
}

const logout = (req, res, next) => {
  delete req.session.user
  res.redirect('/')
}

const list = (req, res, next) => {
  User.feach(function(err, users) {
    if (err) {
      console.log(err)
    }
    console.log(users)
    res.render('userlist', {
      title: '用户列表页',
      users: users
    })
  })
}
// midware for user
const signinRequired = (req, res, next) => {
  const user = req.session.user
  if (!user) {
    return res.redirect('/signin')
  }
  next()
}

const adminRequired = (req, res, next) => {
  const user = req.session.user
  // if (user.role <= 10) {
  //   return res.redirect('/signin')
  // }
  next()
}

export default {
  signup,
  signin,
  showSignup,
  showSignin,
  logout,
  list,
  signinRequired,
  adminRequired
}
