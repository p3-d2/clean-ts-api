import request from 'supertest'
import { Express } from 'express'

import { setupApp } from '@/main/config/app'

describe('Body Parser Middleware', () => {
  let app: Express

  beforeAll(async () => {
    app = await setupApp()
  })

  test('Should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'Pedro-frontEnd' })
      .expect({ name: 'Pedro-frontEnd' })
  })
})
