import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'

import app from '@/main/config/app'
import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'

let surveyCollection: Collection
let accountCollection: Collection

const mockAccessToken = async (): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    role: 'admin'
  })
  const accessToken = sign({ id: insertedId }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: insertedId
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    accountCollection = MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'any_question',
          answers: [{
            answer: 'any_answer_one',
            image: 'any_image_url'
          }, {
            answer: 'any_answer_two'
          }]
        })
        .expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await mockAccessToken()
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'any_question',
          answers: [{
            answer: 'any_answer_one',
            image: 'any_image_url'
          }, {
            answer: 'any_answer_two'
          }]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 204 on load surveys with valid accessToken', async () => {
      const accessToken = await mockAccessToken()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })
  })
})
