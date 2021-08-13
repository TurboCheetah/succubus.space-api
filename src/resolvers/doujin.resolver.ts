/* eslint-disable camelcase */
import { client } from '@/databases/redis'
import { Doujin } from '@/interfaces/doujin.interface'
import doujinModel from '@/models/doujin.model'
import { doujinBuilder, scrapeDoujin } from '@/utils/util'
import { Arg, Args, Query, Resolver } from 'type-graphql'
import { doujinArgs, doujinType } from '@resolvers/types/doujin.type'
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
        data = await doujinModel.findOne({
          $or: [
            { 'titles.english': { $regex: new RegExp(name, 'i') } },
            { 'titles.japanese': { $regex: new RegExp(name, 'i') } },
            { 'titles.pretty': { $regex: new RegExp(name, 'i') } }
          ]
        })
      }

      if (data && !data.invalid) {
        await client.set(`doujin_${query}`, doujinBuilder(data), { expire: 3600 })
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
  public async doujinTag(@Args() { tags, language, order }: doujinArgs) {
    const data = await doujinModel
      .find({ $and: [{ tags: { $all: tags } }, { tags: { $regex: language || '' } }] })
      .sort({ favorites: order || 'desc' })

    return data
  }

  @Query(() => [doujinType])
  public async popular(@Args() { language, order }: doujinArgs) {
    return await doujinModel.find({ tags: { $regex: language || '' } }).sort({ favorites: order || 'desc' })
  }

  @Query(() => [doujinType])
  public async length(@Args() { language, order }: doujinArgs) {
    return await doujinModel.find({ tags: { $regex: language || '' } }).sort({ length: order || 'desc' })
  }

  @Query(() => [doujinType])
  public async age(@Args() { language, order }: doujinArgs) {
    return await doujinModel.find({ tags: { $regex: language || '' } }).sort({ uploadDate: order || 'asc' })
  }
}
