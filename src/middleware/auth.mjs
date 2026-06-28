export const signinRequired = (req, res, next) => {
  const user = req.session.user
  if (!user) {
    return res.redirect('/signin')
  }
  next()
}

export const adminRequired = (req, res, next) => {
  const user = req.session.user
  if (!user || user.role < 10) {
    return res.redirect('/signin')
  }
  next()
}
