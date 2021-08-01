import { hanime } from '../lib/hanimetv.js'

export const hanimeController = async (req, res) => {
  const search = await hanime(req.params.query)
  if (search === 'No results') return res.sendStatus(404)
  res.send(search)
}
