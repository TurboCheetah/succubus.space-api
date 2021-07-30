const Redis = require('ioredis')
const JSONCache = require('redis-json')
const ioRedis = new Redis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT })
const client = new JSONCache(ioRedis)

module.exports = async (req, res, next) => {
  // Fetch data from cache
  if (req.path === '/random') req.params.query = Math.floor(Math.random() * parseInt(await ioRedis.get('newestID'))) + 1

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
