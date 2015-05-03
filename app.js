var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')
var MongoStore=require("connect-mongo")(session)
var multer = require ( 'multer' )

var routes = require('./routes/index')

var app = express()
var dburl = 'mongodb://localhost:27017/iBook'
mongoose.connect(dburl)

// view engine setup
app.set('views', path.join(__dirname, 'app/views/pages'))
app.set('view engine', 'jade')
app.locals.moment=require('moment')

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(multer({
	dest:__dirname+'/public/upload/',
	rename:function(fieldname,filename){
		return fieldname + '_' + filename + '_' + Date.now()
	}
}))
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: 'iBook',
	store: new MongoStore({
		url: dburl,
		collection: 'sessions'
	})
}))
app.use(function(req, res, next){
	var _user = req.session.user
	res.locals.user = _user
	next()
})

app.use('/', routes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
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
