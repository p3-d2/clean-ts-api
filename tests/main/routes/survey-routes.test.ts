import request from 'supertest'
import { Express } from 'express'
import { Collection } from 'mongodb'

import { setupApp } from '@/main/config/app'
import { MongoHelper, SurveyMongoRepository } from '@/infra/db'

import { survey, insertSurvey, mockAccessToken } from '@/tests/helpers'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
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

  describe('POST /surveys', () => {
    test('Should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await mockAccessToken('admin')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(survey)
        .expect(204)
    })

    test('Should return 400 if any field not is provided', async () => {
      const surveyWithoutAnswers = { question: 'any_question' }
      const accessToken = await mockAccessToken('admin')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(surveyWithoutAnswers)
        .expect(400)
    })

    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send(survey)
        .expect(403)
    })

    test('Should return 500 if there is an error trying to create the survey', async () => {
      jest.spyOn(SurveyMongoRepository.prototype, 'add').mockImplementationOnce(() => {
        throw new Error()
      })
      const accessToken = await mockAccessToken('admin')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(survey)
        .expect(500)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 200 with survey data', async () => {
      await insertSurvey()
      const accessToken = await mockAccessToken()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })

    test('Should return 204 if there is no survey', async () => {
      const accessToken = await mockAccessToken()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })

    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 500 if make an error when trying to list the surveys', async () => {
      jest.spyOn(SurveyMongoRepository.prototype, 'loadAll').mockImplementationOnce(() => {
        throw new Error()
      })
      const accessToken = await mockAccessToken()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(500)
    })
  })
})
