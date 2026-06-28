import express from 'express'
import * as Category from '../controllers/category.mjs'
import { signinRequired, adminRequired } from '../middleware/auth.mjs'

const router = express.Router()

router.get('/admin/category/new', signinRequired, adminRequired, Category.create)
router.post('/admin/category', signinRequired, adminRequired, Category.save)
router.get('/admin/category/list', signinRequired, adminRequired, Category.list)
router.delete('/admin/category/list', signinRequired, adminRequired, Category.del)
router.get('/admin/category/:id', signinRequired, adminRequired, Category.show)
router.get('/admin/category/update/:id', signinRequired, adminRequired, Category.update)
router.post('/admin/category/update/:id', signinRequired, adminRequired, Category.saveUpdate)

export default router
