import request from 'supertest'
import { Express } from 'express'
import { Collection } from 'mongodb'

import { MongoHelper } from '@/infra/db'
import { setupApp } from '@/main/config/app'

import { insertUser, user } from '@/tests/helpers'

let accountCollection: Collection

describe('Login GraphQL', () => {
  let app: Express

  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Login Query', () => {
    const query = `query {
      login (email: "${user.email}", password: "${user.password}") {
        accessToken
        name
      }
    }`

    test('Should return an Account on valid credentials', async () => {
      await insertUser()
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.login.accessToken).toBeTruthy()
      expect(res.body.data.login.name).toBe(user.name)
    })

    test('Should return UnauthorizedError on invalid credentials', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(401)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Unauthorized')
    })
  })

  describe('SignUp Mutation', () => {
    const query = `mutation {
      signUp (name: "${user.name}", email: "${user.email}", password: "${user.password}", passwordConfirmation: "${user.password}") {
        accessToken
        name
      }
    }`

    test('Should return an Account on valid data', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.signUp.accessToken).toBeTruthy()
      expect(res.body.data.signUp.name).toBe(user.name)
    })

    test('Should return EmailInUseError on invalid data', async () => {
      await insertUser()
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('The received email is already in use')
    })
  })
})
