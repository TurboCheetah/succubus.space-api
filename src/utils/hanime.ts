import { Hentai } from '@/interfaces/hentai.interface'
import c from '@aero/centra'

export const hanime = async (query: string | number): Promise<Hentai> => {
  const getDate = releaseDate => {
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

    return await c('https://search.htv-services.com/', 'POST').header('Content-Type', 'application/json').body(JSON.stringify(config)).json()
  }

  if (isNaN(+query)) {
    let results = await search(query)

    if (results.nbHits > 0) {
      results = JSON.parse(results.hits)
      for (let i = 0; i < results.length; i++) {
        results[i].url = `https://hanime.tv/videos/hentai/${results[i].slug}`
        results[i].released_at = getDate(results[i].released_at)
      }
    } else {
      results = { id: query, invalid: true }
    }

    return results as Hentai
  } else {
    const { hentai_video: result, videos_manifest: vManifest } = await c(`https://hw.hanime.tv/api/v8/video?id=${query}`).json()

    if (!result) return { id: query, invalid: true }

    const titles = []
    result.titles.forEach((title: { title: string }) => titles.push(title.title))

    const tags = []
    result.hentai_tags.forEach((tag: { text: string }) => tags.push(tag.text))

    result.description = result.description.replace(/(<([^>]+)>)/gi, '')
    result.rating = result.rating ? result.rating : 'Unrated'
    result.url = `https://hanime.tv/videos/hentai/${result.slug}`
    result.released_at = result.released_at.split('T')[0]
    result.streamURL = vManifest ? vManifest.servers[0].streams[1].url : ''
    result.titles = titles
    result.tags = tags

    return result as Hentai
  }
}
