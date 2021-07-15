const config = require('./config.json')
const hanime = require('./sites/hanimetv')
const mal = require('./sites/mal')
const { combine } = require('./utils')
const { scrape } = require('./scraper')
const express = require('express')
const morgan = require('morgan')
const Redis = require('ioredis')
const JSONCache = require('redis-json')
const cron = require('node-cron')

const ioRedis = new Redis({ host: config.redis.host, port: config.redis.port })
const client = new JSONCache(ioRedis)

const app = express()
if (process.argv.includes('--dev') || process.env.NODE_ENV === 'dev') app.use(morgan('dev'))

const getData = async (req, res, next) => {
  try {
    console.log('Fetching Data...')
    const search = await combine(client, req.params.query)
    if (search === 'No results') {
      res.sendStatus(404)
    } else {
      res.send(search)
    }
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
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
  if (search === 'No results') {
    res.sendStatus(404)
  } else {
    res.send(search)
  }
})

// Sends back raw JSON response from MAL API
app.get('/mal/:query', async (req, res) => {
  const search = await mal.scrape(req.params.query)
  if (search === 'No results') {
    res.sendStatus(404)
  } else {
    res.send(search)
  }
})

// API with all the data that will later be saved to databse
app.get('/hentai/:query', cache, getData)

app.get('/scrape/:query', getData)

app.listen(process.env.PORT || config.port, () => {
  console.log(`Succubus.space running on port ${process.env.PORT || config.port}`)
})

// Scrape data every 24 hours
cron.schedule('0 0 * * *', () => scrape(client))
