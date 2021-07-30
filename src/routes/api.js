import express from 'express'
import { cache } from '../middleware/cache.js'
import { getData } from '../middleware/getData.js'
import { hanime } from '../lib/hanimetv.js'

const router = express.Router()

// Sends back raw JSON response from HAnime.tv API
router.get('/hanime/:query', async (req, res) => {
  const search = await hanime(req.params.query)
  if (search === 'No results') return res.sendStatus(404)
  res.send(search)
})

// Query the cache first and scrape new data if entry not found
router.get('/hentai/:query', cache, getData)

// Force scrape an ID and cache it
router.get('/scrape/:query', getData)

// Retrieve a random hentai
router.get('/random', cache, getData)

export default router
