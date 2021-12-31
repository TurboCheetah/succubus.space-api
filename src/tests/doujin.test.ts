import request from 'supertest'
import App from '@/app'
import DoujinRoute from '@routes/doujin.route'
import { container } from 'tsyringe'

jest.setTimeout(30000)

describe('Testing Doujin', () => {
  describe('[GET] /doujin/177013', () => {
    it('response statusCode 200', () => {
      const doujinRoute = container.resolve(DoujinRoute)
      const app = new App([doujinRoute])

      return request(app.getServer()).get(`${doujinRoute.path}177013`).expect(200)
    })
  })

  describe('[GET] /doujin/metamorphosis', () => {
    it('response statusCode 200', () => {
      const doujinRoute = container.resolve(DoujinRoute)
      const app = new App([doujinRoute])

      return request(app.getServer()).get(`${doujinRoute.path}metamorphosis`).expect(200)
    })
  })

  describe('[POST] /graphql', () => {
    it('response statusCode 200', () => {
      const app = new App([])

      return request(app.getServer())
        .post('/graphql')
        .send({
          query: `query {
        doujin(id: 177013) {
          id
          titles {
            pretty
          }
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
        randomDoujin {
          id
          titles {
            pretty
          }
        }
      }`
        })
        .expect(200)
    })
  })
})
