import { Doujin as nDoujin } from 'nhentai'

export interface Doujin extends nDoujin {
  query?: number | string
  invalid?: boolean
}
