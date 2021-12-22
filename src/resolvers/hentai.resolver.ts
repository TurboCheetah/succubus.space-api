/* eslint-disable camelcase */
import { client, ioRedis } from '@/databases/redis'
import { Hentai } from '@/interfaces/hentai.interface'
import hentaiModel from '@/models/hentai.model'
import { hentaiBuilder, scrapeHentai } from '@/utils/util'
import { Args, Query, Resolver } from 'type-graphql'
import { hentaiArgs, hentaiType } from '@resolvers/types/hentai.type'

@Resolver()
export class HentaiResolver {
  private async getData({ id, name, malID }: { id?: number; name?: string; malID?: number }): Promise<Hentai> {
    const query = id || name || malID

    // Redis
    let data = await client.get(`hentai_${query}`)

    // If no data in Redis check Mongo
    if (!data) {
      if (id) {
        data = await hentaiModel.findOne({ id: id })
      } else if (name) {
        data = await hentaiModel.findOne({ name: { $regex: new RegExp(name.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') } })
      } else if (malID) {
        data = await hentaiModel.findOne({ malID: malID })
      }

      // If no data in Mongo go to scraper
      if (data && !data.invalid) {
        await client.set(`hentai_${query}`, hentaiBuilder(data), { expire: 3600 })
        return data
      } else if (data && data.invalid) {
        data = { id: query, invalid: true }
        await client.set(`hentai_${query}`, data, { expire: 86400 })
        return data
      }
    }

    if (!data) data = await scrapeHentai(`${query}`)
    if (data.invalid) data.id = null

    return data
  }

  @Query(() => hentaiType)
  public async hentai(@Args() { id, name, malID }: hentaiArgs): Promise<Hentai> {
    return await this.getData({ id, name, malID })
  }

  @Query(() => hentaiType)
  public async latest(): Promise<Hentai> {
    return await this.getData({ id: +(await ioRedis.get('hentai_newestID')) })
  }

  @Query(() => hentaiType)
  public async randomHentai(): Promise<Hentai> {
    return await this.getData({ id: Math.floor(Math.random() * +(await ioRedis.get('hentai_newestID'))) + 1 })
  }

  @Query(() => [hentaiType])
  public async allHentai(@Args() { sortBy, order }: hentaiArgs) {
    return await hentaiModel.find().sort({ [sortBy]: order || 'desc' })
  }

  @Query(() => [hentaiType])
  public async brand(@Args() { brand, sortBy, order }: hentaiArgs) {
    return await hentaiModel
      .find({ brand: { $regex: new RegExp(brand.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') } })
      .sort({ [sortBy]: order || 'desc' })
  }

  @Query(() => hentaiType)
  public async monthlyRank(@Args() { monthlyRank }: hentaiArgs) {
    return await hentaiModel.findOne({ monthlyRank })
  }

  @Query(() => [hentaiType])
  public async tags(@Args() { tags, sortBy, order }: hentaiArgs) {
    return await hentaiModel.find({ tags: { $all: tags } }).sort({ [sortBy]: order || 'desc' })
  }

  @Query(() => [hentaiType])
  public async series(@Args() { id, name, slug }: hentaiArgs) {
    if (slug) {
      console.log(slug.replace(/(?![-])[#-.]|[[-^]|[!|?|{}]/g, '').replace(' ', '-'))
      return await hentaiModel.find({
        'franchise.slug': { $regex: new RegExp(slug.replace(/(?![-])[#-.]|[[-^]|[!|?|{}]/g, '').replace(' ', '-'), 'i') }
      })
    } else if (name) {
      return await hentaiModel.find({ 'franchise.name': { $regex: new RegExp(name.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') } })
    }
    return await hentaiModel.find({ 'franchise.id': id })
  }
}
