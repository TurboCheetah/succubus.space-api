const hanime = require('./lib/hanimetv')
const mal = require('./lib/mal')
const utils = require('./utils')
const express = require('express')
const morgan = require('morgan')
const Redis = require('ioredis')
const JSONCache = require('redis-json')
const cron = require('node-cron')

const ioRedis = new Redis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT })
const client = new JSONCache(ioRedis)

// Scrape new data every 24 hours
cron.schedule('0 0 * * *', () => utils.scrape(client))

const app = express()

// Request logging
if (process.argv.includes('--dev') || process.env.NODE_ENV === 'dev') app.use(morgan('dev'))

const getData = async (req, res) => {
  try {
    console.log('Fetching new data...')
    const search = await utils.cache(client, req.params.query)
    if (search === 'No results') return res.sendStatus(404)
    res.send(search)
  } catch (err) {
    console.error(err)
    return res.sendStatus(500)
  }
}

// Caching
const cache = async (req, res, next) => {
  try {
    const data = await client.get(req.params.query)
    if (data && !data.invalid) {
      res.send(data)
    } else if (data && data.invalid) {
      res.sendStatus(404)
    } else {
      next()
    }
  } catch (err) {
    console.error(err)
    next()
  }
}

// Sends back raw JSON response from HAnime.tv API
app.get('/hanime/:query', async (req, res) => {
  const search = await hanime.scrape(req.params.query)
  if (search === 'No results') return res.sendStatus(404)
  res.send(search)
})

// Sends back raw JSON response from MAL API
app.get('/mal/:query', async (req, res) => {
  const search = await mal.scrape(req.params.query)
  if (search === 'No results') return res.sendStatus(404)
  res.send(search)
})

// Query the cache first and scrape new data if entry not found
app.get('/hentai/:query', cache, getData)

// Force scrape an ID and cache it
app.get('/scrape/:query', getData)

app.listen(process.env.PORT || 4445, () => console.log(`Succubus.space running on port ${process.env.PORT || 4445}`))
