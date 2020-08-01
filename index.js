const express = require('express')
const config = require('./config.json')
const fakedb = require('./fakedb.json')
const hanime = require('./sites/hanimetv')
const mal = require('./sites/mal')
const { combine } = require('./utils')
const redis = require('redis')

const client = redis.createClient(config.redis.port, config.redis.host)

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

const getData = async (req, res, next) => {
  try {
    console.log('Fetching Data...')
    const query = req.params.query
    const search = await combine(query)
    if (search == 'No results') {
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
    } else if (data.invalid) {
      data.id = JSON.parse(data.id)
      if (data.invalid) data.invalid = JSON.parse(data.invalid)
      res.send(data)
    } else {
      next()
    }
  })
}

app.get('/', (req, res) => {
  res.render(`${__dirname}/views/index.ejs`)
})

// Sends back a nice parsed page
app.get('/:hentaiID', (req, res) => {
  const id = req.params.hentaiID
  if (fakedb.hentai[id]) {
    res.render(`${__dirname}/views/hentai.ejs`, { hentai: fakedb.hentai[id] })
  } else {
    res.sendStatus(404)
  }
})

// Sends back raw JSON
app.get('/api/:hentaiID', (req, res) => {
  const id = req.params.hentaiID
  if (fakedb.hentai[id]) {
    res.send(fakedb.hentai[id])
  } else {
    res.sendStatus(404)
  }
})

// Sends back raw JSON response from HAnime.tv API
app.get('/api/hanime/:query', async (req, res) => {
  const query = req.params.query
  const search = await hanime.scrape(query)
  if (search == 'No results') {
    res.sendStatus(404)
  } else {
    res.send(search)
  }
})

// Sends back a nice parsed page
app.get('/hanime/:query', async (req, res) => {
  const query = req.params.query
  const search = await hanime.scrape(query)
  res.render(`${__dirname}/views/hanime.ejs`, { hanime: search })
})

// Sends back raw JSON response from MAL API
app.get('/api/mal/:query', async (req, res) => {
  const query = req.params.query
  const search = await mal.scrape(query)
  if (search == 'No results') {
    res.sendStatus(404)
  } else {
    res.send(search)
  }
})

// Sends back a nice parsed page
app.get('/mal/:query', async (req, res) => {
  const query = req.params.query
  const search = await mal.scrape(query)
  res.render(`${__dirname}/views/mal.ejs`, { mal: search })
})

// API with all the data that will later be saved to databse
app.get('/api/hentai/:query', cache, getData)

app.listen(process.env.PORT || config.port, () => {
  console.log(`HentaiList running on port ${config.port}`)
})
