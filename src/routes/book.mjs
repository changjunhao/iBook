import express from 'express'
import multer from 'multer'
import path from 'path'
import * as Book from '../controllers/book.mjs'
import { signinRequired, adminRequired } from '../middleware/auth.mjs'
import config from '../config.mjs'

const router = express.Router()

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(import.meta.dirname, '../../', config.upload.dir))
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
const upload = multer({ storage })

router.get('/book/:id', Book.detail)
router.get('/admin/book/list', signinRequired, adminRequired, Book.list)
router.get('/admin/book/new', signinRequired, adminRequired, Book.create)
router.get('/admin/book/update/:id', signinRequired, adminRequired, Book.update)
router.post('/admin/book', signinRequired, adminRequired, upload.any(), Book.saveCover, Book.save)
router.delete('/admin/book/list', signinRequired, adminRequired, Book.del)

export default router
