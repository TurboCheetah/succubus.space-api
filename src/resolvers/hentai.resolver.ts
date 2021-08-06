/* eslint-disable camelcase */
import { client, ioRedis } from '@/databases/redis'
import { Hentai } from '@/interfaces/hentai.interface'
import hentaiModel from '@/models/hentai.model'
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

    if (!data) {
      data = id ? await hentaiModel.findOne({ id: id }) : await hentaiModel.findOne({ name: { $regex: name } })

      if (data && !data.invalid) {
        await client.set(`${query}`, {
          id: data.id,
          name: data.name,
          titles: data.titles,
          slug: data.slug,
          description: data.description,
          views: data.views,
          interests: data.interests,
          posterURL: data.posterURL,
          coverURL: data.coverURL,
          brand: data.brand,
          brandID: data.brandID,
          durationInMs: data.durationInMs,
          isCensored: data.isCensored,
          rating: data.rating,
          likes: data.likes,
          dislikes: data.dislikes,
          downloads: data.downloads,
          monthlyRank: data.monthlyRank,
          tags: data.tags,
          releasedAt: data.releasedAt,
          url: data.url,
          streamURL: data.streamURL,
          malURL: data.malURL,
          malID: data.malID,
          invalid: data.invalid
        })
        return data
      } else if (data && data.invalid) {
        data = { id: query, invalid: true }
        await client.set(`${query}`, data, { expire: 86400 })
        return data
      }
    }

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
