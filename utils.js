const hanime = require('./sites/hanimetv')
const mal = require('./sites/mal')

const combine = async (query) => {
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

  return hanimeSearch
}

exports.combine = combine
