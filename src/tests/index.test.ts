import request from 'supertest'
import App from '@/app'
import IndexRoute from '@routes/index.route'
import { connection } from 'mongoose'
import { container } from 'tsyringe'

afterAll(() => {
  connection.close()
})

describe('Testing Index', () => {
  describe('[GET] /', () => {
    it('response statusCode 200', () => {
      const indexRoute = container.resolve(IndexRoute)
      const app = new App([indexRoute])

      return request(app.getServer()).get(`${indexRoute.path}`).expect(200)
    })
  })
})
