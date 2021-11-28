/* eslint-disable camelcase */
import { client } from '@/databases/redis'
import { Doujin } from '@/interfaces/doujin.interface'
import doujinModel from '@/models/doujin.model'
import { doujinBuilder, scrapeDoujin } from '@/utils/util'
import { Args, Query, Resolver } from 'type-graphql'
import { doujinBaseArgs, doujinTagArgs, doujinType } from '@resolvers/types/doujin.type'
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
            { 'titles.english': { $regex: new RegExp(name.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') } },
            { 'titles.japanese': { $regex: new RegExp(name.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') } },
            { 'titles.pretty': { $regex: new RegExp(name.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') } }
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
  public async doujin(@Args() { id, name }: doujinBaseArgs): Promise<Doujin> {
    return await this.getData({ id, name })
  }

  @Query(() => doujinType)
  public async randomDoujin(): Promise<Doujin> {
    return await this.getData({ id: await nhentai.randomDoujinID() })
  }

  @Query(() => [doujinType])
  public async doujinTag(@Args() { tags, language, order }: doujinTagArgs) {
    const data = await doujinModel
      .find({ $and: [{ tags: { $all: tags } }, { tags: { $regex: new RegExp(language.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') || '' } }] })
      .sort({ favorites: order || 'desc' })

    return data
  }

  @Query(() => [doujinType])
  public async popular(@Args() { language, order }: doujinTagArgs) {
    return await doujinModel
      .find({ tags: { $regex: new RegExp(language.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') || '' } })
      .sort({ favorites: order || 'desc' })
  }

  @Query(() => [doujinType])
  public async length(@Args() { language, order }: doujinTagArgs) {
    return await doujinModel
      .find({ tags: { $regex: new RegExp(language.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') || '' } })
      .sort({ length: order || 'desc' })
  }

  @Query(() => [doujinType])
  public async age(@Args() { language, order }: doujinTagArgs) {
    return await doujinModel
      .find({ tags: { $regex: new RegExp(language.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') || '' } })
      .sort({ uploadDate: order || 'asc' })
  }
}
