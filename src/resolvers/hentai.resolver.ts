/* eslint-disable camelcase */
import { client, ioRedis } from '@/databases/redis'
import { Hentai } from '@interfaces/hentai/Hentai.interface'
import hentaiModel from '@/models/hentai.model'
import { scrapeHentai } from '@/utils/util'
import { Arg, Query, Resolver } from 'type-graphql'
import { hentaiType } from '@resolvers/types/hentai.type'

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

      // if there is data in MongoDB save it to Redis
      if (data) await client.set(`hentai_${query}`, data.toJSON(), { expire: 3600 })
    }

    // if there isn't data in MongoDB scrape it from HAnime.tv
    if (!data) data = await scrapeHentai(`${query}`)

    // if Redis returns invalid = true, return null
    if (data !== null && data.invalid) data = null

    return data
  }

  @Query(() => hentaiType)
  public async hentai(@Arg('id') id: number, @Arg('name') name: string, @Arg('malID') malID: number): Promise<Hentai> {
    return await this.getData({ id, name, malID })
  }

  @Query(() => hentaiType)
  public async latest(): Promise<Hentai> {
    return await this.getData({ id: +(await ioRedis.get('hentai_newestID')) })
  }

  @Query(() => [hentaiType])
  public async recent(@Arg('amount') amount: number): Promise<Hentai[]> {
    return await hentaiModel.find().sort({ _id: -1 }).limit(amount)
  }

  @Query(() => hentaiType)
  public async randomHentai(): Promise<Hentai> {
    return await this.getData({ id: Math.floor(Math.random() * +(await ioRedis.get('hentai_newestID'))) + 1 })
  }

  @Query(() => [hentaiType])
  public async allHentai(
    @Arg('sortBy') sortBy: 'views' | 'interests' | 'likes' | 'dislikes' | 'downloads' | 'monthlyRank',
    @Arg('order') order: 'asc' | 'desc'
  ) {
    return await hentaiModel.find().sort({ [sortBy]: order || 'desc' })
  }

  @Query(() => [hentaiType])
  public async brand(
    @Arg('brandTitle') brandTitle: string,
    @Arg('brandID') brandID: number,
    @Arg('sortBy') sortBy: 'views' | 'interests' | 'likes' | 'dislikes' | 'downloads' | 'monthlyRank',
    @Arg('order') order: 'asc' | 'desc'
  ) {
    if (brandID) return await hentaiModel.find({ 'brand.id': brandID }).sort({ [sortBy]: order || 'desc' })

    return await hentaiModel
      .find({ brand: { $regex: new RegExp(brandTitle.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') } })
      .sort({ [sortBy]: order || 'desc' })
  }

  @Query(() => hentaiType)
  public async monthlyRank(@Arg('rank') rank: number) {
    return await hentaiModel.findOne({ rank })
  }

  @Query(() => [hentaiType])
  public async popularHentai(@Arg('amount') amount: number) {
    return await hentaiModel.find().sort({ monthlyRank: 1 }).limit(amount)
  }

  @Query(() => [hentaiType])
  public async tags(
    @Arg('tags') tags: string,
    @Arg('tagID') tagID: number,
    @Arg('sortBy') sortBy: 'views' | 'interests' | 'likes' | 'dislikes' | 'downloads' | 'monthlyRank',
    @Arg('order') order: 'asc' | 'desc'
  ) {
    if (tagID) return await hentaiModel.find({ 'tags.id': { $all: tagID } }).sort({ [sortBy]: order || 'desc' })
    return await hentaiModel.find({ 'tags.text': { $all: tags } }).sort({ [sortBy]: order || 'desc' })
  }

  @Query(() => [hentaiType])
  public async series(@Arg('id') id: number, @Arg('name') name: string, @Arg('slug') slug: string) {
    if (slug) {
      return await hentaiModel.find({
        'franchise.slug': { $regex: new RegExp(slug.replace(/(?![-])[#-.]|[[-^]|[!|?|{}]/g, '').replace(/\s/g, '-'), 'i') }
      })
    } else if (name) {
      return await hentaiModel.find({ 'franchise.name': { $regex: new RegExp(name.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') } })
    }
    return await hentaiModel.find({ 'franchise.id': id })
  }
}
