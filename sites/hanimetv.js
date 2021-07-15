const fetch = require('node-fetch')
const AbortController = require('abort-controller')

const scrape = async (query) => {
  if (!query.length) return "Baka! You didn't provide a search query! What am I supposed to search for?"

  const getDate = (releaseDate) => {
    var date = new Date(releaseDate * 1000)

    var year = date.getFullYear()
    var month = ('0' + (date.getMonth() + 1)).slice(-2)
    var day = ('0' + date.getDate()).slice(-2)

    return `${year}-${month}-${day}`
  }

  const search = async (query) => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const config = {
      search_text: query,
      tags: [],
      tags_mode: 'AND',
      brands: [],
      blacklist: [],
      order_by: 'created_at_unix',
      ordering: 'desc'
    }
    var results = await fetch('https://search.htv-services.com/', {
      method: 'POST',
      body: JSON.stringify(config),
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    }).then((r) => r.json())
    clearTimeout(timeout)
    return results
  }

  if (isNaN(query)) {
    var results = await search(query)

    results = results.nbHits > 0 ? JSON.parse(results.hits) : 'No results'
    for (var i = 0; i < results.length; i++) {
      results[i].url = `https://hanime.tv/videos/hentai/${results[i].slug}`
      results[i].released_at = getDate(results[i].released_at)
    }

    return results
  } else {
    results = await fetch(`https://members.hanime.tv/rapi/v7/video?id=${query}`)
      .then((r) => r.json())

    if (results.hentai_video) {
      var newQuery = results.hentai_video.name
    } else {
      return 'No results'
    }

    results = await search(newQuery)

    results = results.nbHits > 0 ? JSON.parse(results.hits) : 'No results'

    results.forEach(el => {
      if (el.id == query) {
        results = el
      }
    })

    results.description = results.description.replace(/(<([^>]+)>)/ig, '')
    results.rating = results.rating == null ? results.rating = 'Unrated' : results.rating
    results.url = `https://hanime.tv/videos/hentai/${results.slug}`
    results.released_at = getDate(results.released_at)

    return results
  }
}

exports.scrape = scrape
