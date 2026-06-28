import express from 'express'
import * as Comment from '../controllers/comment.mjs'
import { signinRequired } from '../middleware/auth.mjs'

const router = express.Router()

router.post('/user/comment', signinRequired, Comment.save)

export default router
