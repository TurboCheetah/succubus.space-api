import malScraper from 'mal-scraper'

export const mal = async (query) => {
  if (!query) return "Baka! You didn't provide a search query! What am I supposed to search for?"

  const search = async query => {
    return await malScraper.getInfoFromName(query)
      .then(r => r)
      .catch(err => console.error(err))
  }

  return await search(query)
}
