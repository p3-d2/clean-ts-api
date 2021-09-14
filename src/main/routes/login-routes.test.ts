import request from 'supertest'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

let accountCollection: Collection

const insertFakeUser = async (): Promise<void> => {
  const password = await hash('any_password', 12)
  await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password
  })
}

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(200)
    })

    test('Should return 403 if email is already in use', async () => {
      await insertFakeUser()
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(403)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      await insertFakeUser()
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@mail.com',
          password: 'any_password'
        })
        .expect(200)
    })

    test('Should return 401 with invalid credentials', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@mail.com',
          password: 'any_password'
        })
        .expect(401)
    })
  })
})
