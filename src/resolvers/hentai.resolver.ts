/* eslint-disable camelcase */
import { client, ioRedis } from '@/databases/redis'
import { Hentai } from '@/interfaces/hentai.interface'
import hentaiModel from '@/models/hentai.model'
import { dataBuilder, scrapeData } from '@/utils/util'
import { Arg, Query, Resolver } from 'type-graphql'
import { hentaiType } from '@resolvers/types/hentai.type'

@Resolver()
export class HentaiResolver {
  private async getData({ id, name, malID }: { id?: number; name?: string; malID?: number }): Promise<Hentai> {
    const query = id || name || malID

    let data = await client.get(`${query}`)

    if (!data) {
      if (id) {
        data = await hentaiModel.findOne({ id: id })
      } else if (name) {
        data = await hentaiModel.findOne({ name: { $regex: name } })
      } else if (malID) {
        data = await hentaiModel.findOne({ malID: malID })
      }

      if (data && !data.invalid) {
        await client.set(`${query}`, dataBuilder(data), { expire: 3600 })
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
  public async hentai(@Arg('id') id: number, @Arg('name') name: string, @Arg('malID') malID: number): Promise<Hentai> {
    return await this.getData({ id, name, malID })
  }

  @Query(() => hentaiType)
  public async random(): Promise<Hentai> {
    return await this.getData({ id: Math.floor(Math.random() * +(await ioRedis.get('newestID'))) + 1 })
  }
}
