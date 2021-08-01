import express from 'express'
import { cache } from '../middleware/cache.js'
import { getData } from '../middleware/getData.js'
import { ratelimiter } from '../middleware/ratelimiter.js'
import { hanimeController } from '../controllers/hanime.js'

const router = express.Router()

// Sends back raw JSON response from HAnime.tv API
router.get('/hanime/:query', ratelimiter({ points: 333 }), hanimeController)

// Query the cache first and scrape new data if entry not found
router.get('/hentai/:query', ratelimiter({ points: 1 }), cache, getData)

// Force scrape an ID and cache it
router.get('/scrape/:query', ratelimiter({ points: 333 }), getData)

// Retrieve a random hentai
router.get('/random', ratelimiter({ points: 1 }), cache, getData)

export default router
