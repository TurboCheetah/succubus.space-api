const malScraper = require('mal-scraper')

const scrape = async query => {
  if (!query.length) return "Baka! You didn't provide a search query! What am I supposed to search for?"

  const search = async query => {
    const results = await malScraper
      .getInfoFromName(query)
      .then(r => r)
      .catch(err => console.log(err))

    return results
  }

  const results = await search(query)

  return results
}

exports.scrape = scrape
