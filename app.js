const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const multer = require('multer')

const routes = require('./routes/index')

const app = express()
const dburl = 'mongodb://localhost:27017/iBook'
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

// view engine setup
app.set('views', path.join(__dirname, 'app/views/pages'))
app.set('view engine', 'pug')
app.locals.moment = require('moment')

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // eslint-disable-next-line no-path-concat
    cb(null, __dirname + '/public/upload/')
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
  store: new MongoStore({ mongooseConnection: mongoose.connection })
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

module.exports = app
