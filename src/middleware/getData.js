import { Utils } from '../lib/Utils.js'

export const getData = async (req, res) => {
  // Scrape new data
  const search = await Utils.cache(req.params.query).catch(err => {
    console.error(err)
    return res.sendStatus(500)
  })

  if (search === 'No results') return res.sendStatus(404)

  res.send(search)
}
