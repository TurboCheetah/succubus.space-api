const hanime = require('./sites/hanimetv')
const mal = require('./sites/mal')
const redis = require('redis')

const client = redis.RedisClient('redis')

const combine = async (query) => {
  try {
    var hanimeSearch = await hanime.scrape(query)

    if (hanimeSearch == 'No results') return 'No results'

    isNaN(query) ? hanimeSearch = hanimeSearch[0] : hanimeSearch = hanimeSearch

    var malSearch = await mal.scrape(isNaN(query) ? query : hanimeSearch.titles[0])

    if (malSearch.producers[0] !== hanimeSearch.brand) {
      malSearch = await mal.scrape(hanimeSearch.name)
    }
    if (!malSearch) {
      return hanimeSearch
    }

    const malProducers = malSearch.producers

    malProducers.forEach(producer => {
      if (producer == hanimeSearch.brand) {
        hanimeSearch.description = malSearch.synopsis.replace(/\n\n\[Written by MAL Rewrite\]/g, '')
        hanimeSearch.malURL = malSearch.url
        hanimeSearch.malID = malSearch.id
      }
    })

    client.hmset(hanimeSearch.id, [
      'id', hanimeSearch.id,
      'name', hanimeSearch.name,
      'titles', JSON.stringify(hanimeSearch.titles),
      'slug', hanimeSearch.slug,
      'description', hanimeSearch.description,
      'views', hanimeSearch.views,
      'interests', hanimeSearch.interests,
      'poster_url', hanimeSearch.poster_url,
      'cover_url', hanimeSearch.cover_url,
      'brand', hanimeSearch.brand,
      'brand_id', hanimeSearch.brand_id,
      'duration_in_ms', hanimeSearch.duration_in_ms,
      'is_censored', hanimeSearch.is_censored,
      'rating', hanimeSearch.rating,
      'likes', hanimeSearch.likes,
      'dislikes', hanimeSearch.dislikes,
      'downloads', hanimeSearch.downloads,
      'monthly_rank', hanimeSearch.monthly_rank,
      'tags', JSON.stringify(hanimeSearch.tags),
      'created_at', hanimeSearch.created_at,
      'released_at', hanimeSearch.released_at,
      'url', hanimeSearch.url,
      'malURL', hanimeSearch.malURL,
      'malID', hanimeSearch.malID
    ], (err, reply) => {
      if (err) console.error(err)
      console.log(reply)
      console.log(`Added ${hanimeSearch.id} to cache`)
    })

    client.expire(hanimeSearch.id, 86400)

    return hanimeSearch
  } catch (err) {
    console.error(err)
  }
}

exports.combine = combine
