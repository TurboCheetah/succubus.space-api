const hanime = require('./lib/hanimetv')
const mal = require('./lib/mal')
const { scrape } = require('./lib/utils')
const getData = require('./middleware/getData')
const cache = require('./middleware/cache')
const express = require('express')
const morgan = require('morgan')
const cron = require('node-cron')

// Scrape new data every hour
cron.schedule('0 * * * *', () => scrape())

const app = express()

// Request logging
if (process.argv.includes('--dev') || process.env.NODE_ENV === 'dev') app.use(morgan('dev'))

// Sends back raw JSON response from HAnime.tv API
app.get('/hanime/:query', async (req, res) => {
  const search = await hanime(req.params.query)
  if (search === 'No results') return res.sendStatus(404)
  res.send(search)
})

// Sends back raw JSON response from MAL API
app.get('/mal/:query', async (req, res) => {
  const search = await mal(req.params.query)
  if (search === 'No results') return res.sendStatus(404)
  res.send(search)
})

// Query the cache first and scrape new data if entry not found
app.get('/hentai/:query', cache, getData)

// Force scrape an ID and cache it
app.get('/scrape/:query', getData)

app.listen(process.env.PORT || 4445, () => console.log(`Succubus.space running on port ${process.env.PORT || 4445}`))
