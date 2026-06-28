import express from 'express'
import homeRouter from './home.mjs'
import userRouter from './user.mjs'
import bookRouter from './book.mjs'
import commentRouter from './comment.mjs'
import categoryRouter from './category.mjs'

const router = express.Router()

router.use(homeRouter)
router.use(userRouter)
router.use(bookRouter)
router.use(commentRouter)
router.use(categoryRouter)

export default router
