import request from 'supertest'
import App from '@/app'
import HentaiRoute from '@routes/hentai.route'

jest.setTimeout(30000)

describe('Testing Hentai', () => {
  describe('[GET] /hanime/1226', () => {
    it('response statusCode 200', () => {
      const hentaiRoute = new HentaiRoute()
      const app = new App([hentaiRoute])

      return request(app.getServer()).get(`${hentaiRoute.path}hanime/1226`).expect(200)
    })
  })

  describe('[GET] /scrape/1226', () => {
    it('response statusCode 200', () => {
      const hentaiRoute = new HentaiRoute()
      const app = new App([hentaiRoute])

      return request(app.getServer()).get(`${hentaiRoute.path}scrape/1226`).expect(200)
    })
  })

  describe('[GET] /scrape/itadaki', () => {
    it('response statusCode 200', () => {
      const hentaiRoute = new HentaiRoute()
      const app = new App([hentaiRoute])

      return request(app.getServer()).get(`${hentaiRoute.path}scrape/itadaki`).expect(200)
    })
  })

  describe('[GET] /hentai/1226', () => {
    it('response statusCode 200', () => {
      const hentaiRoute = new HentaiRoute()
      const app = new App([hentaiRoute])

      return request(app.getServer()).get(`${hentaiRoute.path}hentai/1226`).expect(200)
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
        random {
          id
          name
        }
      }`
        })
        .expect(200)
    })
  })
})
