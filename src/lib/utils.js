const hanime = require('./hanimetv')
const mal = require('./mal')
const c = require('@aero/centra')
const cheerio = require('cheerio')
const Redis = require('ioredis')
const JSONCache = require('redis-json')
const Queue = require('bull')

const ioRedis = new Redis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT })
const client = new JSONCache(ioRedis)

const queue = new Queue('scraper', {
  redis: {
    host: process.env.REDIS_HOST
  },
  limiter: {
    max: 1,
    duration: 5000
  }
})

class Utils {
  constructor() {
    throw new Error('Utils is a static class and cannot be instantiated.')
  }

  static async scrape() {
    // Get latest HAnime upload ID
    const $ = await c('https://hanime.tv/').text()
      .then(html => cheerio.load(html))

    let newestID = $('.elevation-3.mb-3.hvc.item.card').first().find('a').attr('alt')

    newestID = (await hanime(newestID))[0].id

    console.log(`Beginning to scrape data from ${newestID} entries`)

    // Begin scraping
    const ids = []
    for (let i = 5; i < newestID + 1; i++) ids.push(i)

    ids.forEach(async id => {
      // Check if ID already exists in Redis
      const data = await client.get(id)

      if (!data) {
        console.log(`Scraping data for ID ${id}`)
        return await queue.add({ id })
      }
    })
  }

  static async cache(query) {
    try {
      let hanimeTitle
      let hanimeSearch = await hanime(query)

      // If no results save to cache with invalid property
      if (hanimeSearch === 'No results') {
        await client.set(query, { id: query, invalid: true }, { expire: 86400 })
        console.log(`Added ${query} to cache`)
        return 'No results'
      }

      if (isNaN(query)) hanimeSearch = hanimeSearch[0]

      hanimeSearch.titles.length < 1 ? hanimeTitle = hanimeSearch.name : hanimeTitle = hanimeSearch.titles[0]

      let malSearch = await mal(isNaN(query) ? this.shorten(query, 100) : this.shorten(hanimeTitle, 100))

      if (malSearch.producers[0] !== hanimeSearch.brand) malSearch = await mal(hanimeSearch.name)

      await client.set(hanimeSearch.id, {
        id: hanimeSearch.id,
        name: hanimeSearch.name,
        titles: hanimeSearch.titles,
        slug: hanimeSearch.slug,
        description: hanimeSearch.description,
        views: hanimeSearch.views,
        interests: hanimeSearch.interests,
        poster_url: hanimeSearch.poster_url,
        cover_url: hanimeSearch.cover_url,
        brand: hanimeSearch.brand,
        brand_id: hanimeSearch.brand_id,
        duration_in_ms: hanimeSearch.duration_in_ms,
        is_censored: hanimeSearch.is_censored,
        rating: hanimeSearch.rating,
        likes: hanimeSearch.likes,
        dislikes: hanimeSearch.dislikes,
        downloads: hanimeSearch.downloads,
        monthly_rank: hanimeSearch.monthly_rank,
        tags: hanimeSearch.tags,
        created_at: hanimeSearch.created_at,
        released_at: hanimeSearch.released_at,
        url: hanimeSearch.url
      })
        .then(() => console.log(`Added ${hanimeSearch.id} to cache`))

      if (!malSearch) return hanimeSearch

      const malProducers = malSearch.producers

      malProducers.forEach(producer => {
        if (producer === hanimeSearch.brand) {
          hanimeSearch.description = malSearch.synopsis.replace(/\n\n\[Written by MAL Rewrite\]/g, '')
          hanimeSearch.malURL = malSearch.url
          hanimeSearch.malID = malSearch.id
        }
      })

      await client.set(hanimeSearch.id, {
        description: hanimeSearch.description,
        malURL: hanimeSearch.malURL,
        malID: hanimeSearch.malID
      })

      return hanimeSearch
    } catch (err) {
      console.error(err)
    }
  }

  static shorten(text, maxLen = 1024) {
    return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text
  }
}

queue.process(async (job) => {
  return await Utils.cache(job.data.id.toString())
})

module.exports = Utils
