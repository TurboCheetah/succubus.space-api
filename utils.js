const hanime = require('./sites/hanimetv')
const mal = require('./sites/mal')

const combine = async (client, query) => {
  let hanimeTitle

  try {
    let hanimeSearch = await hanime.scrape(query)

    if (hanimeSearch === 'No results') {
      await client.set(query, { id: query, invalid: true })
      console.log(`Added ${query} to cache`)

      await client.expire(query, 86400)
      return 'No results'
    }

    if (isNaN(query)) (hanimeSearch = hanimeSearch[0])

    if (hanimeSearch.titles.length < 1) {
      hanimeTitle = hanimeSearch.name
    } else {
      hanimeTitle = hanimeSearch.titles[0]
    }

    let malSearch = await mal.scrape(isNaN(query) ? shorten(query, 100) : shorten(hanimeTitle, 100))

    if (malSearch.producers[0] !== hanimeSearch.brand) {
      malSearch = await mal.scrape(hanimeSearch.name)
    }
    if (!malSearch) {
      return hanimeSearch
    }

    const malProducers = malSearch.producers

    malProducers.forEach(producer => {
      if (producer === hanimeSearch.brand) {
        hanimeSearch.description = malSearch.synopsis.replace(/\n\n\[Written by MAL Rewrite\]/g, '')
        hanimeSearch.malURL = malSearch.url
        hanimeSearch.malID = malSearch.id
      }
    })

    await client.set(hanimeSearch.id, {
      id: hanimeSearch.id,
      name: hanimeSearch.name,
      titles: JSON.stringify(hanimeSearch.titles),
      slug: hanimeSearch.slug,
      description: JSON.stringify(hanimeSearch.description),
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
      tags: JSON.stringify(hanimeSearch.tags),
      created_at: hanimeSearch.created_at,
      released_at: hanimeSearch.released_at,
      url: hanimeSearch.url,
      malURL: hanimeSearch.malURL ? hanimeSearch.malURL : 'Hentai is not on MAL',
      malID: hanimeSearch.malID ? hanimeSearch.malID : 'Hentai is not on MAL'
    })
      .then(() => console.log(`Added ${hanimeSearch.id} to cache`))
      .catch(err => console.error(err))

    await client.expire(hanimeSearch.id, 604800)

    return hanimeSearch
  } catch (err) {
    console.error(err)
  }
}

const shorten = (text, maxLen = 1024) => {
  return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text
}

exports.combine = combine
exports.shorten = shorten
