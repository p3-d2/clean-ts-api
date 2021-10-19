import request from 'supertest'
import { Express } from 'express'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'

import { MongoHelper } from '@/infra/db'
import env from '@/main/config/env'
import { setupApp } from '@/main/config/app'

let surveyCollection: Collection
let accountCollection: Collection

const mockAccessToken = async (): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne({
    name: 'Pedro',
    email: 'pedro.contato.email@mail.com',
    password: '123',
    role: 'admin'
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

const insertSurvey = async (date = new Date()): Promise<string> => {
  const { insertedId } = await surveyCollection.insertOne({
    question: 'Question',
    answers: [{
      answer: 'Answer 1',
      image: 'http://image-name.com'
    }, {
      answer: 'Answer 2'
    }],
    date
  })
  return insertedId.toString()
}

describe('SurveyResult GraphQL', () => {
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

  describe('SurveyResult Query', () => {
    const mountQuery = (surveyId: string): string => `
      query {
        surveyResult (surveyId: "${surveyId}") {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
    `

    test('Should return SurveyResult', async () => {
      const accessToken = await mockAccessToken()
      const date = new Date()
      const surveyId = await insertSurvey(date)
      const query = mountQuery(surveyId)
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.surveyResult.question).toBe('Question')
      expect(res.body.data.surveyResult.date).toBe(date.toISOString())
      expect(res.body.data.surveyResult.answers).toEqual([{
        answer: 'Answer 1',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }, {
        answer: 'Answer 2',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
      const surveyId = await insertSurvey()
      const query = mountQuery(surveyId)
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Access denied')
    })
  })

  describe('SaveSurveyResult Mutation', () => {
    const mountQuery = (surveyId: string): string => `
      mutation {
        saveSurveyResult (surveyId: "${surveyId}", answer: "Answer 1") {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
    `

    test('Should return SurveyResult', async () => {
      const accessToken = await mockAccessToken()
      const date = new Date()
      const surveyId = await insertSurvey(date)
      const query = mountQuery(surveyId)
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.saveSurveyResult.question).toBe('Question')
      expect(res.body.data.saveSurveyResult.date).toBe(date.toISOString())
      expect(res.body.data.saveSurveyResult.answers).toEqual([{
        answer: 'Answer 1',
        count: 1,
        percent: 100,
        isCurrentAccountAnswer: true
      }, {
        answer: 'Answer 2',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
      const surveyId = await insertSurvey()
      const query = mountQuery(surveyId)
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Access denied')
    })
  })
})
