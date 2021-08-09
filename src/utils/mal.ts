import { myanimelist } from '@/config'
import { malResult } from '@interfaces/mal.interface'
import { logger } from '@utils/logger'
import c from '@aero/centra'

export const malAuth = async (clientID: string, username: string, password: string) => {
  // eslint-disable-next-line camelcase
  const { access_token, refresh_token } = await c('https://api.myanimelist.net/v2/auth/token', 'POST')
    .body(
      {
        client_id: clientID,
        username,
        password,
        grant_type: 'password'
      },
      'form'
    )
    .json()

  return { access_token, refresh_token }
}

export const search = async (query: string): Promise<malResult[]> => {
  const auth = await malAuth(myanimelist.clientID, myanimelist.username, myanimelist.password)

  const { data } = await c('https://api.myanimelist.net/v2/anime')
    .query({
      nsfw: true,
      q: query,
      fields: 'alternative_titles, synopsis'
    })
    .header('authorization', `Bearer ${auth.access_token}`)
    .json()

  if (!data) return undefined

  const hentai = data.map(
    // eslint-disable-next-line camelcase
    (data: { node: { id: number; title: string; alternative_titles: { en: string; ja: string; synonyms: string[] }; synopsis: string } }) => {
      return {
        id: data.node.id,
        titles: [data.node.title, data.node.alternative_titles.en, data.node.alternative_titles.ja, ...data.node.alternative_titles.synonyms],
        synopsis: data.node.synopsis.replace(/\n\n\[Written by MAL Rewrite\]/g, '')
      }
    }
  )

  return hentai
}

export const mal = async (title: string): Promise<malResult | undefined> => {
  try {
    const query = title.replace(/\s([\d]+)/i, '')

    const data = await search(query)

    if (!data) return undefined

    let match: malResult

    data.forEach(hentai => {
      if (hentai.titles.some((title: string) => title === query)) return (match = hentai)
      if (hentai.titles.some((title: string) => title.includes(query))) return (match = hentai)
    })

    return match
  } catch (err) {
    logger.error(err)
  }
}
