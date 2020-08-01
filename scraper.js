const config = require('./config.json')
const { combine } = require('./utils')
const hanime = require('./sites/hanimetv')
const fetch = require('node-fetch')
const AbortController = require('abort-controller')
const cheerio = require('cheerio')
const redis = require('redis')

const client = redis.createClient(config.redis.port, config.redis.host)

setTimeout(async () => {
// Get latest HAnime upload ID
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)
  var $ = await fetch('https://hanime.tv/', {
    signal: controller.signal
  }).then((r) => {
    if (!r.ok) throw 'Something went wrong.'
    return r.text()
  }).then((html) => cheerio.load(html))
  clearTimeout(timeout)

  var newestID = $('.elevation-3.mb-3.hvc.item.card').first().find('a').attr('alt')

  newestID = await hanime.scrape(newestID)

  newestID = newestID[0].id
  console.log(`Beginning to scrape data from ${newestID} entries`)

  // Begin scraping
  var ids = []
  for (let i = 5; i < newestID + 1; i++) {
    ids.push(i)
  }

  ids.forEach(id => {
    // Check if ID already exists in Redis
    client.hgetall(id, async (err, data) => {
      if (err) throw err

      if (data == null) {
        var results = await combine(id.toString())
        console.log(`Scraping data for ID ${id}`)
        return results
      } else {
        console.log(`ID ${id} is already in the database`)
      }
    })
  })
}, 1000)
