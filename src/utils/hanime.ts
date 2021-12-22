import { HAnime } from '@/interfaces/hentai.interface'
import c from '@aero/centra'

export const hanime = async (query: string | number): Promise<HAnime> => {
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
      return { id: query, invalid: true }
    }

    // return results as HAnime
    query = results[0].id
  }
  const {
    hentai_video: result,
    videos_manifest: vManifest,
    hentai_franchise: franchise,
    hentai_franchise_hentai_videos: franchiseVideos
  } = await c(`https://hanime.tv/api/v8/video?id=${query}`, 'GET').json()

  if (!result) return { id: query, invalid: true }

  const titles = []
  result.titles.forEach((title: { title: string }) => titles.push(title.title))
  if (!titles.length) titles.push(result.name)

  const tags = []
  result.hentai_tags.forEach((tag: { text: string }) => tags.push(tag.text))

  const fVideos = []
  franchiseVideos.forEach((video: { id: number; name: string; slug: string }) => fVideos.push({ id: video.id, name: video.name, slug: video.slug }))

  const servers = {}
  vManifest.servers[0].streams.forEach((server: { height: string; url: string }) => (servers[`_${server.height}p`] = server.url))

  result.description = result.description.replace(/(<([^>]+)>)/gi, '')
  result.rating = result.rating ? result.rating : 'Unrated'
  result.url = `https://hanime.tv/videos/hentai/${result.slug}`
  result.released_at = getDate(result.released_at_unix)
  result.streamURL = servers
  result.titles = titles
  result.tags = tags
  delete result.hentai_tags
  result.franchise = franchise
  result.franchiseVideos = fVideos

  return result as HAnime
}
