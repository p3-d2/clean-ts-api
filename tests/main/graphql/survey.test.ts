import request from 'supertest'
import { Express } from 'express'
import { Collection } from 'mongodb'

import { MongoHelper } from '@/infra/db'
import { setupApp } from '@/main/config/app'

import { insertSurvey, mockAccessToken } from '@/tests/helpers'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey GraphQL', () => {
  let app: Express

  beforeAll(async () => {
    app = await setupApp()
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

  describe('Surveys Query', () => {
    const query = `query {
      surveys {
        id
        question
        answers {
          image
          answer
        }
        date
        didAnswer
      }
    }`

    test('Should return Surveys', async () => {
      const accessToken = await mockAccessToken()
      const date = new Date()
      await insertSurvey(date)

      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.surveys.length).toBe(1)
      expect(res.body.data.surveys[0].id).toBeTruthy()
      expect(res.body.data.surveys[0].question).toBe('Question')
      expect(res.body.data.surveys[0].date).toBe(date.toISOString())
      expect(res.body.data.surveys[0].didAnswer).toBe(false)
      expect(res.body.data.surveys[0].answers).toEqual([{
        answer: 'Answer 1',
        image: 'http://image-name.com'
      }, {
        answer: 'Answer 2',
        image: null
      }])
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
      await insertSurvey()
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Access denied')
    })
  })
})
