import { NextFunction, Request, Response } from 'express'
import hentaiModel from '@/models/hentai.model'
import { client } from '@/databases/redis'

const mongoMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Scrape new data
    const query = req.params.query

    const data = await hentaiModel.findOne({ id: query })

    if (data && !data.invalid) {
      await client.set(query, {
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
        createdAt: data.createdAt,
        releasedAt: data.releasedAt,
        url: data.url,
        streamURL: data.streamURL,
        malURL: data.malURL,
        malID: data.malID,
        invalid: data.invalid
      })
      return res.send(data)
    } else if (data && data.invalid) {
      await client.set(query, { id: query, invalid: true }, { expire: 86400 })
      return res.sendStatus(404)
    }

    next()
  } catch (err) {
    next(err)
  }
}

export default mongoMiddleware
