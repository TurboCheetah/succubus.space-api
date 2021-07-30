
import express from 'express'
import apiRouter from './api.js'

const router = express.Router()

router.use('/', apiRouter)

export default router
