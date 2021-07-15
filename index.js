const config = require('./config.json')
const hanime = require('./sites/hanimetv')
const mal = require('./sites/mal')
const { combine } = require('./utils')
const express = require('express')
const morgan = require('morgan')
const redis = require('redis')

const client = redis.createClient(config.redis.port, config.redis.host)

const app = express()
if (process.argv.includes('--dev') || process.env.NODE_ENV === 'dev') app.use(morgan('dev'))

const getData = async (req, res, next) => {
  try {
    console.log('Fetching Data...')
    const search = await combine(req.params.query)
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
const cache = (req, res, next) => {
  try {
    client.hgetall(req.params.query, (err, data) => {
      if (err) throw err

      if (data !== null && !data.invalid) {
        data.id = JSON.parse(data.id)
        data.titles = JSON.parse(data.titles)
        data.description = JSON.parse(data.description)
        data.views = JSON.parse(data.views)
        data.interests = JSON.parse(data.interests)
        data.brand_id = JSON.parse(data.brand_id)
        data.duration_in_ms = JSON.parse(data.duration_in_ms)
        data.is_censored = JSON.parse(data.is_censored)
        data.likes = JSON.parse(data.likes)
        data.dislikes = JSON.parse(data.dislikes)
        data.downloads = JSON.parse(data.downloads)
        data.monthly_rank = JSON.parse(data.monthly_rank)
        data.tags = JSON.parse(data.tags)
        data.created_at = JSON.parse(data.created_at)
        if (parseInt(data.malID)) data.malID = JSON.parse(data.malID)
        res.send(data)
      } else if (data == null) {
        next()
      } else if (data.invalid) {
        data.id = JSON.parse(data.id)
        if (data.invalid) data.invalid = JSON.parse(data.invalid)
        res.send(data)
      } else {
        next()
      }
    })
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
