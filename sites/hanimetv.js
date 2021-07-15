const c = require('@aero/centra')

const scrape = async (query) => {
  let results

  if (!query.length) return "Baka! You didn't provide a search query! What am I supposed to search for?"

  const getDate = (releaseDate) => {
    const date = new Date(releaseDate * 1000)

    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)

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

    results = await c('https://search.htv-services.com/', 'POST')
      .header('Content-Type', 'application/json')
      .body(JSON.stringify(config))
      .json()
    clearTimeout(timeout)
    return results
  }

  if (isNaN(query)) {
    results = await search(query)

    results = results.nbHits > 0 ? JSON.parse(results.hits) : 'No results'
    for (let i = 0; i < results.length; i++) {
      results[i].url = `https://hanime.tv/videos/hentai/${results[i].slug}`
      results[i].released_at = getDate(results[i].released_at)
    }

    return results
  } else {
    results = await c(`https://members.hanime.tv/rapi/v7/video?id=${query}`).json()

    let newQuery

    if (results.hentai_video) {
      newQuery = results.hentai_video.name
    } else {
      return 'No results'
    }

    results = await search(newQuery)

    results = results.nbHits > 0 ? JSON.parse(results.hits) : 'No results'

    results.forEach(el => {
      if (el.id.toString() === query) results = el
    })

    results.description = results.description.replace(/(<([^>]+)>)/ig, '')
    results.rating = results.rating == null ? results.rating = 'Unrated' : results.rating
    results.url = `https://hanime.tv/videos/hentai/${results.slug}`
    results.released_at = getDate(results.released_at)

    return results
  }
}

exports.scrape = scrape
