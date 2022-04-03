import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import multer from 'multer'
import moment from 'moment'

import routes from './routes/index.mjs'

const app = express()
const dbUrl = 'mongodb://39.102.83.218:27017/iBook'
mongoose.connect(dbUrl, { autoCreate: true }, (err) => {
  if (err) {
    console.log('数据库连接失败')
  } else {
    console.log('数据库连接成功')
  }
})

// view engine setup
app.set('views', path.join(path.resolve(), 'app/views/pages'))
app.set('view engine', 'pug')
app.locals.moment = moment

// uncomment after placing your favicon in /public
// app.use(favicon(path.resolve() + '/public/favicon.ico'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(path.resolve(), 'public')))

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // eslint-disable-next-line no-path-concat
    cb(null, path.resolve() + '/public/upload/')
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
app.use(multer({ storage }).any())
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'iBook',
  store: MongoStore.create({ mongoUrl: dbUrl })
}))
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
if (app.get('env') === 'development') {
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
