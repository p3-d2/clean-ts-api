import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { Express } from 'express'
import { Collection } from 'mongodb'

import env from '@/main/config/env'
import { setupApp } from '@/main/config/app'
import { MongoHelper, SurveyResultMongoRepository } from '@/infra/db'

let surveyCollection: Collection
let accountCollection: Collection

const mockAccessToken = async (): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })
  const accessToken = sign({ id: insertedId.toString() }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: insertedId
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}

const insertSurvey = async (): Promise<string> => {
  const { insertedId } = await surveyCollection.insertOne({
    question: 'Question',
    answers: [{
      answer: 'Answer 1',
      image: 'http://image-name.com'
    }, {
      answer: 'Answer 2'
    }],
    date: new Date()
  })
  return insertedId.toString()
}

const getUrl = async (): Promise<string> => {
  const surveyId = await insertSurvey()
  return `/api/surveys/${surveyId}/results`
}

describe('Survey Routes', () => {
  let app: Express

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    accountCollection = MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 200 on save survey result with accessToken', async () => {
      const accessToken = await mockAccessToken()
      await request(app)
        .put(await getUrl())
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1'
        })
        .expect(200)
    })

    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('Should return 403 if the survey_id passed in the URL is invalid', async () => {
      const accessToken = await mockAccessToken()
      const invalidSurveyId = '000aaaaa000000000a000a00'
      await request(app)
        .put(`/api/surveys/${invalidSurveyId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1'
        })
        .expect(403)
    })

    test('Should return 403 if the response sent by the client is an invalid response', async () => {
      const accessToken = await mockAccessToken()
      await request(app)
        .put(await getUrl())
        .set('x-access-token', accessToken)
        .send({
          answer: 'invalid_answer'
        })
        .expect(403)
    })

    test('Should return 500 if make an error when trying to create the survey result', async () => {
      jest.spyOn(SurveyResultMongoRepository.prototype, 'save').mockImplementationOnce(() => {
        throw new Error()
      })
      const accessToken = await mockAccessToken()
      await request(app)
        .put(await getUrl())
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 2'
        })
        .expect(500)
    })

    test('Should return 500 if fails when trying to update the survey result', async () => {
      jest.spyOn(SurveyResultMongoRepository.prototype, 'save').mockImplementationOnce(() => {
        throw new Error()
      })
      const accessToken = await mockAccessToken()
      await request(app)
        .put(await getUrl())
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 2',
          image: 'http://image-name.com'
        })
        .expect(500)
    })

    test('Should return 500 if fails when trying to load the poll', async () => {
      jest.spyOn(SurveyResultMongoRepository.prototype, 'loadBySurveyId').mockImplementationOnce(() => {
        throw new Error()
      })
      const accessToken = await mockAccessToken()
      await request(app)
        .put(await getUrl())
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 2'
        })
        .expect(500)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    test('Should return 200 on load survey result with accessToken', async () => {
      const accessToken = await mockAccessToken()
      await request(app)
        .get(await getUrl())
        .set('x-access-token', accessToken)
        .expect(200)
    })

    test('Should return 403 on load survey result without accessToken', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })

    test('Should return 500 if you get an error when trying to list the survey results', async () => {
      jest.spyOn(SurveyResultMongoRepository.prototype, 'loadBySurveyId').mockImplementationOnce(() => {
        throw new Error()
      })
      const accessToken = await mockAccessToken()
      await request(app)
        .get(await getUrl())
        .set('x-access-token', accessToken)
        .expect(500)
    })
  })
})
