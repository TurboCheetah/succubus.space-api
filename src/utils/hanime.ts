import { APIVideo } from '@interfaces/hanime/APIVideo.interface'
import { APIRaw } from '@interfaces/hanime/APIRaw.interface'
import c from '@aero/centra'

export const hanime = async (query: string | number): Promise<APIVideo> => {
  const getDate = (releaseDate: number) => {
    return new Date(releaseDate * 1000)
  }

  const search = async (query: string) => {
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
    let results = await search(query as string)

    if (results.nbHits > 0) {
      results = JSON.parse(results.hits)
      for (let i = 0; i < results.length; i++) {
        results[i].url = `https://hanime.tv/videos/hentai/${results[i].slug}`
        results[i].released_at = getDate(results[i].released_at)
      }
    } else {
      return null
    }

    // return results as HAnime
    query = results[0].id
  }
  const data: APIRaw = await c(`https://hanime.tv/api/v8/video?id=${query}`, 'GET').json()

  if (!data.hentai_video) return null

  return new APIVideo(data)
}
