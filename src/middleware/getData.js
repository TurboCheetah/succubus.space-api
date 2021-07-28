const { cache } = require('../lib/utils')

module.exports = async (req, res) => {
  // Scrape new data
  const search = await cache(req.params.query).catch(err => {
    console.error(err)
    return res.sendStatus(500)
  })

  if (search === 'No results') return res.sendStatus(404)

  res.send(search)
}
