import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import crypto from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'
import { formatDate } from '../../src/utils/date.mjs'
import routes from '../../src/routes/index.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function createApp({ enableCsrf = false } = {}) {
  const app = express()

  // view engine setup
  app.set('views', path.join(__dirname, '../../src/views/pages'))
  app.set('view engine', 'pug')
  app.locals.formatDate = formatDate

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())

  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'test-secret',
    cookie: { secure: false }
  }))

  // user session to locals
  app.use(function(req, res, next) {
    res.locals.user = req.session.user
    next()
  })

  if (enableCsrf) {
    // CSRF token generation
    app.use(function(req, res, next) {
      if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString('hex')
      }
      res.locals.csrfToken = req.session.csrfToken
      next()
    })
    // CSRF validation
    app.use(function(req, res, next) {
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const token = req.body._csrf || req.headers['x-csrf-token']
        if (!token || token !== req.session.csrfToken) {
          return res.status(403).send('CSRF validation failed')
        }
      }
      next()
    })
  }

  app.use('/', routes)

  // error handler
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: {}
    })
  })

  return app
}
