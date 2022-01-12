import request from 'supertest'
import App from '#/app'
import HentaiRoute from '#routes/hentai.route'
import { container } from 'tsyringe'

jest.setTimeout(30000)

describe('Testing Hentai', () => {
  describe('[GET] /hentai/hanime/1226', () => {
    it('response statusCode 200', () => {
      const hentaiRoute = container.resolve(HentaiRoute)
      const app = new App([hentaiRoute])

      return request(app.getServer()).get(`${hentaiRoute.path}/hanime/1226`).expect(200)
    })
  })

  describe('[GET] /hentai/scrape/1226', () => {
    it('response statusCode 200', () => {
      const hentaiRoute = container.resolve(HentaiRoute)
      const app = new App([hentaiRoute])

      return request(app.getServer()).get(`${hentaiRoute.path}/scrape/1226`).expect(200)
    })
  })

  describe('[GET] /hentai/scrape/itadaki', () => {
    it('response statusCode 200', () => {
      const hentaiRoute = container.resolve(HentaiRoute)
      const app = new App([hentaiRoute])

      return request(app.getServer()).get(`${hentaiRoute.path}/scrape/itadaki`).expect(200)
    })
  })

  describe('[GET] /hentai/1226', () => {
    it('response statusCode 200', () => {
      const hentaiRoute = container.resolve(HentaiRoute)
      const app = new App([hentaiRoute])

      return request(app.getServer()).get(`${hentaiRoute.path}/1226`).expect(200)
    })
  })

  describe('[POST] /graphql', () => {
    it('response statusCode 200', () => {
      const app = new App([])

      return request(app.getServer())
        .post('/graphql')
        .send({
          query: `query {
        hentai(id: 1226) {
          id
          name
        }
      }`
        })
        .expect(200)
    })
  })

  describe('[POST] /graphql', () => {
    it('response statusCode 200', () => {
      const app = new App([])

      return request(app.getServer())
        .post('/graphql')
        .send({
          query: `query {
        randomHentai {
          id
          name
        }
      }`
        })
        .expect(200)
    })
  })
})
