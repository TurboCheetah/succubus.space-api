import c from '@aero/centra'

export const hanime = async (query) => {
  if (!query) return "Baka! You didn't provide a search query! What am I supposed to search for?"

  const getDate = (releaseDate) => {
    const date = new Date(releaseDate * 1000)

    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)

    return `${year}-${month}-${day}`
  }

  const search = async query => {
    const config = {
      search_text: query,
      tags: [],
      tags_mode: 'AND',
      brands: [],
      blacklist: [],
      order_by: 'created_at_unix',
      ordering: 'desc'
    }

    return await c('https://search.htv-services.com/', 'POST')
      .header('Content-Type', 'application/json')
      .body(JSON.stringify(config))
      .json()
  }

  if (isNaN(query)) {
    let results = await search(query)

    results = results.nbHits > 0 ? JSON.parse(results.hits) : 'No results'
    for (let i = 0; i < results.length; i++) {
      results[i].url = `https://hanime.tv/videos/hentai/${results[i].slug}`
      results[i].released_at = getDate(results[i].released_at)
    }

    return results
  } else {
    const { hentai_video: result, videos_manifest: vManifest } = await c(`https://hw.hanime.tv/api/v8/video?id=${query}`).json()

    if (!result) return 'No results'

    const titles = []
    result.titles.forEach(t => titles.push(t.title))

    const tags = []
    result.hentai_tags.forEach(t => tags.push(t.text))

    result.description = result.description.replace(/(<([^>]+)>)/ig, '')
    result.rating = result.rating ? result.rating : 'Unrated'
    result.url = `https://hanime.tv/videos/hentai/${result.slug}`
    result.released_at = result.released_at.split('T')[0]
    result.streamURL = vManifest ? vManifest.servers[0].streams[1].url : ''
    result.titles = titles
    result.tags = tags

    return result
  }
}
