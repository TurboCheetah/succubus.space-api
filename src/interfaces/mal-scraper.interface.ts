declare module 'mal-scraper' {
  interface malInfoFromName {
    title: string
    synopsis: string
    picture: string
    characters: {
      link: string
      picture: string
      name: string
      role: string
      seiyuu: {
        link: string
        picture: string
        name: string
      }
    }[]
    staff: {
      link: string
      picture: string
      name: string
      role: string
    }[]
    trailer: string
    englishTitle: string
    japaneseTitle: string
    synonyms: string[]
    type: string
    episodes: string
    aired: string
    premiered: string
    broadcast: string
    producers: string[]
    studios: string[]
    source: string
    duration: string
    rating: string
    status: string
    genres: string[]
    score: string
    scoreStats: string
    ranked: string
    popularity: string
    members: string
    favorites: string
    id: number
    url: string
  }

  function getInfoFromName(query: string): Promise<malInfoFromName>
}
