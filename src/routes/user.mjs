import express from 'express'
import * as User from '../controllers/user.mjs'
import { signinRequired, adminRequired } from '../middleware/auth.mjs'

const router = express.Router()

router.post('/user/signup', User.signup)
router.post('/user/signin', User.signin)
router.get('/signup', User.showSignup)
router.get('/signin', User.showSignin)
router.get('/logout', User.logout)
router.get('/admin/user/list', signinRequired, adminRequired, User.list)
router.get('/admin/user/:id', signinRequired, adminRequired, User.show)
router.get('/admin/user/update/:id', signinRequired, adminRequired, User.showUpdate)
router.post('/admin/user/update/:id', signinRequired, adminRequired, User.userUpdate)
router.delete('/admin/user/list', signinRequired, adminRequired, User.del)

export default router
