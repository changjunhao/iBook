import express from 'express'
import * as Index from '../controllers/index.mjs'

const router = express.Router()

router.get('/', Index.index)
router.get('/results', Index.search)

export default router
