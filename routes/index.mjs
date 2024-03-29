import express from 'express'
import Index from '../app/controllers/index.mjs'
import User from '../app/controllers/user.mjs'
import Book from '../app/controllers/book.mjs'
import Comment from '../app/controllers/comment.mjs'
import Category from '../app/controllers/category.mjs'

const router = express.Router()

/* GET home page. */
router.get('/', Index.index)
/* GET user page. */
router.post('/user/signup', User.signup)
router.post('/user/signin', User.signin)
router.get('/signup', User.showSignup)
router.get('/signin', User.showSignin)
router.get('/logout', User.logout)
router.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list)
/* GET book page. */
router.get('/book/:id', Book.detail)
router.get('/admin/book/list', User.signinRequired, User.adminRequired, Book.list)
router.get('/admin/book/new', User.signinRequired, User.adminRequired, Book.create)
router.get('/admin/book/update/:id', User.signinRequired, User.adminRequired, Book.update)
router.post('/admin/book', User.signinRequired, User.adminRequired, Book.saveCover, Book.save)
router.delete('/admin/book/list', User.signinRequired, User.adminRequired, Book.del)
/* GET comment page. */
router.post('/user/comment', User.signinRequired, Comment.save)
/* GET category page. */
router.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.create)
router.post('/admin/category', User.signinRequired, User.adminRequired, Category.save)
router.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list)
router.delete('/admin/category/list', User.signinRequired, User.adminRequired, Category.del)
/* GET results page. */
router.get('/results', Index.search)

export default router
