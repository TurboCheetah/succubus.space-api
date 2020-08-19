const config = require('./config.json')
const utils = require('./utils')
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
  const body = {
    username: 'HentaiList',
    avatar_url: 'https://please-fuck.me/fUUmyR.png',
    embeds: [
      {
        description: `Beginning to scrape data from ${newestID} entries`,
        color: 11076351,
        author: {
          name: 'HentaiList Cache',
          url: 'https://hentailist.io',
          icon_url: 'https://please-fuck.me/fUUmyR.png'
        },
        footer: {
          text: 'Powered by HentaiList.io'
        }
      }
    ]
  }
  utils.webhook(config.webhookURL, body)

  // Begin scraping
  var ids = []
  for (let i = 5; i < newestID + 1; i++) {
    ids.push(i)
  }

  var cached = 0
  var uncached = []

  ids.forEach(id => {
    // Check if ID already exists in Redis
    client.hgetall(id, async (err, data) => {
      if (err) throw err

      if (data == null) {
        uncached.push(id)
        console.log(`Added ${id} to caching queue`)
      }
    })
  })

  setTimeout(() => {
    uncached.forEach(uncached => {
      cached++
      setTimeout(function () {
        client.hgetall(uncached, async (err, data) => {
          if (err) throw err

          if (data == null) {
            var results = await utils.combine(uncached.toString())
            console.log(`Scraping data for ID ${uncached}`)
          } else {
            console.log(`ID ${uncached} is already in the database`)
          }
        })
      }, cached * 10000)
    })
  }, 3000)

  if (cached === ids.length) {
    console.log('All IDs have been added to the database')
    const body = {
      username: 'HentaiList',
      avatar_url: 'https://please-fuck.me/fUUmyR.png',
      embeds: [
        {
          description: `Finished caching ${newestID} entries!`,
          color: 11076351,
          author: {
            name: 'HentaiList Cache',
            url: 'https://hentailist.io',
            icon_url: 'https://please-fuck.me/fUUmyR.png'
          },
          footer: {
            text: 'Powered by HentaiList.io'
          }
        }
      ]
    }
    utils.webhook(config.webhookURL, body)
    setTimeout(() => {
      process.exit()
    }, 5000)
  }
}, 300)
