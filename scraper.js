const utils = require('./utils')
const hanime = require('./sites/hanimetv')
const fetch = require('node-fetch')
const AbortController = require('abort-controller')
const cheerio = require('cheerio')

const scrape = async (config, client) => {
  setTimeout(async () => {
    // Get latest HAnime upload ID
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const $ = await fetch('https://hanime.tv/', {
      signal: controller.signal
    })
      .then(r => {
        if (!r.ok) throw 'Something went wrong.'
        return r.text()
      })
      .then(html => cheerio.load(html))
    clearTimeout(timeout)

    let newestID = $('.elevation-3.mb-3.hvc.item.card').first().find('a').attr('alt')

    newestID = await hanime.scrape(newestID)

    newestID = newestID[0].id
    console.log(`Beginning to scrape data from ${newestID} entries`)
    const body = {
      username: 'Succubus.space',
      avatar_url: 'https://please-fuck.me/fUUmyR.png',
      embeds: [
        {
          description: `Beginning to scrape data from ${newestID} entries`,
          color: 11076351,
          author: {
            name: 'Succubus.space Cache',
            url: 'https://succubus.space',
            icon_url: 'https://please-fuck.me/fUUmyR.png'
          },
          footer: {
            text: 'Powered by Succubus.space'
          }
        }
      ]
    }
    utils.webhook(config.webhookURL, body)

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

    promise.then(function () {
      console.log('All IDs have been added to the database')
      const body = {
        username: 'Succubus.space',
        avatar_url: 'https://please-fuck.me/fUUmyR.png',
        embeds: [
          {
            description: `Finished caching ${newestID} entries!`,
            color: 11076351,
            author: {
              name: 'Succubus.space Cache',
              url: 'https://succubus.space',
              icon_url: 'https://please-fuck.me/fUUmyR.png'
            },
            footer: {
              text: 'Powered by Succubus.space'
            }
          }
        ]
      }
      utils.webhook(config.webhookURL, body)
      setTimeout(() => {
        process.exit()
      }, 3000)
    })
  }, 300)
}

exports.scrape = scrape
