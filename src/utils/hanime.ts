import { APIVideo } from '@interfaces/hanime/APIVideo.interface'
import { APIRaw } from '@interfaces/hanime/APIRaw.interface'
import { SEARCH_URL, VIDEO_API_URL, VIDEO_URL } from '@interfaces/constants'
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

    return await c(SEARCH_URL, 'POST').header('Content-Type', 'application/json').body(JSON.stringify(config)).json()
  }

  if (isNaN(+query)) {
    let results = await search(query as string)

    if (results.nbHits > 0) {
      results = JSON.parse(results.hits)
      for (let i = 0; i < results.length; i++) {
        results[i].url = `${VIDEO_URL}/${results[i].slug}`
        results[i].released_at = getDate(results[i].released_at)
      }
    } else {
      return null
    }

    // return results as HAnime
    query = results[0].id
  }
  const data: APIRaw = await c(`${VIDEO_API_URL}?id=${query}`, 'GET').json()

  if (!data.hentai_video) return null

  return new APIVideo(data)
}
