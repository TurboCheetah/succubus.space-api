/* eslint-disable camelcase */
import { client, ioRedis } from '@/databases/redis'
import { Hentai } from '@/interfaces/hentai.interface'
import { scrapeData } from '@/utils/util'
import { Arg, Field, ID, ObjectType, Query, Resolver } from 'type-graphql'

@ObjectType()
class hentaiType {
  @Field(() => ID)
  id?: number

  @Field()
  name?: string

  @Field(() => [String])
  titles: string[]

  @Field()
  slug?: string

  @Field()
  description?: string

  @Field()
  views?: number

  @Field()
  interests?: number

  @Field()
  posterURL?: string

  @Field()
  coverURL?: string

  @Field()
  brand?: string

  @Field()
  durationInMs?: number

  @Field()
  isCensored?: boolean

  @Field()
  rating?: string

  @Field()
  likes?: number

  @Field()
  dislikes?: number

  @Field()
  downloads?: number

  @Field()
  monthlyRank?: number

  @Field(() => [String])
  tags?: string[]

  @Field()
  createdAt: string

  @Field()
  releasedAt?: string

  @Field()
  url: string

  @Field()
  streamURL: string

  @Field()
  malURL: string

  @Field(() => ID)
  malID: number

  @Field(() => String)
  updatedAt: Date

  @Field()
  invalid: boolean
}

@Resolver()
export class HentaiResolver {
  @Query(() => hentaiType)
  public async hentai(@Arg('id') id: number, @Arg('name') name: string): Promise<Hentai> {
    const query = id || name

    let data = await client.get(`${query}`)

    if (!data) data = await scrapeData(`${query}`)
    if (data.invalid) data.id = null

    return data
  }

  @Query(() => hentaiType)
  public async random(): Promise<Hentai> {
    const query = `${Math.floor(Math.random() * +(await ioRedis.get('newestID'))) + 1}`

    let data = await client.get(query)
    if (!data) data = await scrapeData(query)

    return data
  }
}
