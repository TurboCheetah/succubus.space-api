/* eslint-disable camelcase */
import { client } from '@/databases/redis'
import { Doujin } from '@/interfaces/doujin.interface'
import doujinModel from '@/models/doujin.model'
import { scrapeDoujin } from '@/utils/util'
import { Args, Query, Resolver } from 'type-graphql'
import { DoujinBaseArgs, DoujinTagArgs, DoujinType } from '@resolvers/types/doujin.type'
import { nhentai } from '@utils/nhentai'

@Resolver()
export class DoujinResolver {
  private async getData({ id, name }: { id?: number; name?: string }): Promise<Doujin> {
    const query = id || name

    let data = await client.get(`doujin_${query}`)

    // if no data in Redis check MongoDB
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

      if (data !== null && !data.invalid) {
        await client.set(`doujin_${query}`, data, { expire: 3600 })
        return data
      } else if (data !== null && data.invalid) {
        data = { id: query, invalid: true }
        await client.set(`doujin_${query}`, data, { expire: 86400 })
        return data
      }
    }

    // if no data in MongoDB scrape data from nhentai
    if (!data) data = await scrapeDoujin(`${query}`)

    // if no data from nHentai return null
    if (data !== null && data.invalid) data = null

    return data
  }

  @Query(() => DoujinType, { nullable: true })
  public async doujin(@Args() { id, name }: DoujinBaseArgs): Promise<Doujin> {
    return await this.getData({ id, name })
  }

  @Query(() => DoujinType)
  public async randomDoujin(): Promise<Doujin> {
    return await this.getData({ id: await nhentai.randomDoujinID() })
  }

  @Query(() => [DoujinType])
  public async doujinTag(@Args() { tags, language, order }: DoujinTagArgs) {
    const data = await doujinModel
      .find({ $and: [{ tags: { $all: tags } }, { tags: { $regex: new RegExp(language.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') || '' } }] })
      .sort({ favorites: order || 'desc' })

    return data
  }

  @Query(() => [DoujinType])
  public async popular(@Args() { language, order }: DoujinTagArgs) {
    return await doujinModel
      .find({ tags: { $regex: new RegExp(language.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') || '' } })
      .sort({ favorites: order || 'desc' })
  }

  @Query(() => [DoujinType])
  public async length(@Args() { language, order }: DoujinTagArgs) {
    return await doujinModel
      .find({ tags: { $regex: new RegExp(language.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') || '' } })
      .sort({ length: order || 'desc' })
  }

  @Query(() => [DoujinType])
  public async age(@Args() { language, order }: DoujinTagArgs) {
    return await doujinModel
      .find({ tags: { $regex: new RegExp(language.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') || '' } })
      .sort({ uploadDate: order || 'asc' })
  }
}
