const User = require('../models/user')
exports.signup = function(req, res) {
  const _user = req.body.user
  User.findOne({ name: _user.name }, function(err, user) {
    if (err) {
      console(err)
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
exports.signin = function(req, res) {
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
exports.showSignup = function(req, res, next) {
  res.render('signup', {
    title: '注册页面'
  })
}
exports.showSignin = function(req, res, next) {
  res.render('signin', {
    title: '登录页面'
  })
}
exports.logout = function(req, res) {
  delete req.session.user
  res.redirect('/')
}
exports.list = function(req, res, next) {
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
exports.signinRequired = function(req, res, next) {
  const user = req.session.user
  if (!user) {
    return res.redirect('/signin')
  }
  next()
}
exports.adminRequired = function(req, res, next) {
  const user = req.session.user
  // if (user.role <= 10) {
  //   return res.redirect('/signin')
  // }
  next()
}
