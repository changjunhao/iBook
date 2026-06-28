import express from 'express'
import path from 'path'
import crypto from 'crypto'
import mongoose from 'mongoose'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { formatDate } from './utils/date.mjs'

import config from './config.mjs'

import routes from './routes/index.mjs'

const app = express()
mongoose.connect(config.db.url, { autoCreate: true })
  .then(() => {
    console.log('数据库连接成功')
  })
  .catch(() => {
    console.log('数据库连接失败')
  })

// view engine setup
app.set('views', path.join(import.meta.dirname, 'views/pages'))
app.set('view engine', 'pug')
app.locals.formatDate = formatDate

// uncomment after placing your favicon in /public
// app.use(favicon(path.resolve() + '/public/favicon.ico'))
app.use(logger(config.morgan.format))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(import.meta.dirname, '../public')))

app.use(session({
  resave: config.session.resave,
  saveUninitialized: config.session.saveUninitialized,
  secret: config.session.secret,
  store: MongoStore.create({ mongoUrl: config.db.url })
}))
// CSRF token generation
app.use(function(req, res, next) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex')
  }
  res.locals.csrfToken = req.session.csrfToken
  next()
})
// CSRF validation for state-changing requests
app.use(function(req, res, next) {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const token = req.body._csrf || req.headers['x-csrf-token']
    if (!token || token !== req.session.csrfToken) {
      return res.status(403).send('CSRF validation failed')
    }
  }
  next()
})
app.use(function(req, res, next) {
  res.locals.user = req.session.user
  next()
})

app.use('/', routes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (config.env === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

export default app
