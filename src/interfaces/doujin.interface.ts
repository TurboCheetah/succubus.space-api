export interface Doujin {
  id?: number | string
  titles?: {
    english?: string
    japanese?: string
    pretty?: string
  }
  uploadDate?: Date
  length?: number
  favorites?: number
  url?: string
  cover?: string
  thumbnail?: string
  tags?: string[]
  invalid?: boolean
}
