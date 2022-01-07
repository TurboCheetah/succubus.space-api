/* eslint-disable camelcase */
export interface MALAPINode {
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

export interface MALAPIResult {
  data: {
    node: MALAPINode
  }[]
}

export interface MALResult {
  id: number
  titles: string[]
  synopsis: string
}
