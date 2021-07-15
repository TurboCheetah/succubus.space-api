const hanime = require('./sites/hanimetv')
const c = require('@aero/centra')
const AbortController = require('abort-controller')
const cheerio = require('cheerio')

const scrape = async (config, client) => {
  // Get latest HAnime upload ID
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)
  const $ = await c('https://hanime.tv/').text()
    .then(html => cheerio.load(html))
  clearTimeout(timeout)

  let newestID = $('.elevation-3.mb-3.hvc.item.card').first().find('a').attr('alt')

  newestID = await hanime.scrape(newestID)

  newestID = newestID[0].id
  console.log(`Beginning to scrape data from ${newestID} entries`)

  // Begin scraping
  const ids = []
  for (let i = 5; i < newestID + 1; i++) {
    ids.push(i)
  }

  let promise = Promise.resolve()
  ids.forEach(id => {
    // Check if ID already exists in Redis
    client.hgetall(id, async (err, data) => {
      if (err) throw err

      if (data == null) {
        promise = promise.then(async () => {
          console.log(`Scraping data for ID ${id}`)
          return new Promise(resolve => {
            setTimeout(resolve, 10000)
          })
        })
      } else {
        console.log(`ID ${id} is already in the database`)
      }
    })
  })
}

exports.scrape = scrape
