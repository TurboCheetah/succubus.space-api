import { ioRedis, client } from '../lib/redis.js'

export const cache = async (req, res, next) => {
  // Fetch data from cache
  if (req.path === '/random') req.params.query = Math.floor(Math.random() * +(await ioRedis.get('newestID'))) + 1

  const data = await client.get(req.params.query).catch(err => {
    console.error(err)
    next()
  })

  if (data && !data.invalid) {
    return res.send(data)
  } else if (data && data.invalid) {
    return res.sendStatus(404)
  }

  next()
}
