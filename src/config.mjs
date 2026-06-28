import 'dotenv/config'

export default {
  env: process.env.NODE_ENV || 'development',

  port: parseInt(process.env.PORT, 10) || 3000,

  db: {
    url: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/iBook'
  },

  session: {
    secret: process.env.SESSION_SECRET || (process.env.NODE_ENV === 'production'
      ? (() => { throw new Error('SESSION_SECRET must be set in production') })()
      : 'iBook-dev-secret-change-in-production'),
    resave: process.env.SESSION_RESAVE !== 'false',
    saveUninitialized: process.env.SESSION_SAVE_UNINITIALIZED !== 'false'
  },

  morgan: {
    format: process.env.MORGAN_FORMAT || 'dev'
  },

  upload: {
    dir: 'public/upload'
  }
}
