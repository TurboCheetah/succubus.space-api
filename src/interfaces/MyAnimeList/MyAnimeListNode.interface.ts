/* eslint-disable camelcase */
export interface MyAnimeListNode {
  id: number
  title: string
  main_picture: {
    medium: string
    large: string
  }
  alternative_titles: {
    synonyms: string[]
    en: string
    ja: string
  }
  synopsis: string
}
