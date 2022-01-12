import { MyAnimeListNode } from '#interfaces/MyAnimeList/MyAnimeListNode.interface'

export interface MyAnimeListRawResult {
  data: {
    node: MyAnimeListNode
  }[]
}
