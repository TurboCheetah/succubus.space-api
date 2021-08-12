/* eslint-disable camelcase */
import { client } from '@/databases/redis'
import { Doujin } from '@/interfaces/doujin.interface'
import doujinModel from '@/models/doujin.model'
import { scrapeDoujin } from '@/utils/util'
import { Arg, Query, Resolver } from 'type-graphql'
import { doujinType } from '@resolvers/types/doujin.type'
import { nhentai } from '@utils/nhentai'

@Resolver()
export class DoujinResolver {
  private async getData({ id, name }: { id?: number; name?: string }): Promise<Doujin> {
    const query = id || name

    let data = await client.get(`doujin_${query}`)

    if (!data) {
      if (id) {
        data = await doujinModel.findOne({ id: id })
      } else {
        data = await doujinModel.findOne({ 'titles.pretty': { $regex: new RegExp(name, 'i') } })
      }

      if (data && !data.invalid) {
        await client.set(
          `doujin_${query}`,
          {
            id: data.id,
            titles: data.titles,
            uploadDate: data.uploadDate,
            length: data.length,
            favorites: data.favorites,
            url: data.url,
            cover: data.cover,
            thumbnail: data.thumbnail,
            tags: data.tags
          },
          { expire: 3600 }
        )
        return data
      } else if (data && data.invalid) {
        data = { id: query, invalid: true }
        await client.set(`doujin_${query}`, data, { expire: 86400 })
        return data
      }
    }

    if (!data) data = await scrapeDoujin(`${query}`)
    if (data.invalid) data.id = null

    return data
  }

  @Query(() => doujinType)
  public async doujin(@Arg('id') id: number, @Arg('name') name: string): Promise<Doujin> {
    return await this.getData({ id, name })
  }

  @Query(() => doujinType)
  public async randomDoujin(): Promise<Doujin> {
    return await this.getData({ id: await nhentai.randomDoujinID() })
  }

  @Query(() => [doujinType])
  public async doujinTag(@Arg('tag') tag: string, @Arg('order', { nullable: true }) order: 'asc' | 'desc') {
    return await doujinModel.find({ tags: { $regex: tag } }).sort({ favorites: order || 'desc' })
  }

  @Query(() => [doujinType])
  public async popular(@Arg('order', { nullable: true }) order: 'asc' | 'desc') {
    return await doujinModel.find().sort({ favorites: order || 'desc' })
  }

  @Query(() => [doujinType])
  public async length(@Arg('order', { nullable: true }) order: 'asc' | 'desc') {
    return await doujinModel.find().sort({ length: order || 'desc' })
  }

  @Query(() => [doujinType])
  public async age(@Arg('order', { nullable: true }) order: 'asc' | 'desc') {
    return await doujinModel.find().sort({ uploadDate: order || 'asc' })
  }
}
