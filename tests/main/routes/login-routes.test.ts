import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { Express } from 'express'
import { Collection } from 'mongodb'

import { setupApp } from '@/main/config/app'
import { MongoHelper, AccountMongoRepository } from '@/infra/db'

let accountCollection: Collection

const insertFakeUser = async (): Promise<void> => {
  const password = await bcrypt.hash('any_password', 12)
  await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password
  })
}

describe('Login Routes', () => {
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

    test('Should return 400 if any field not is provided', async () => {
      const userWithoutEmail = {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
      await request(app)
        .post('/api/signup')
        .send(userWithoutEmail)
        .expect(400)
    })

    test('Should return 400 if password and passwordConfirmation are not the same', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'invalid_email',
          password: 'any_password',
          passwordConfirmation: 'invalid_password_confirmation'
        })
        .expect(400)
    })

    test('Should return 400 if email provided not is valid', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'invalid_email',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(400)
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

    test('Should return 500 if fails when trying to generate an encrypted password', async () => {
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
        throw new Error()
      })
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(500)
    })

    test('Should return 500 if fails when trying to create the user account', async () => {
      jest.spyOn(AccountMongoRepository.prototype, 'add').mockImplementationOnce(() => {
        throw new Error()
      })
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(500)
    })

    test('Should return 500 if fails when trying to generate the access token', async () => {
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(500)
    })

    test('Should return 500 if fails when trying to update the user with the generated access token', async () => {
      jest.spyOn(AccountMongoRepository.prototype, 'updateAccessToken').mockImplementationOnce(() => {
        throw new Error()
      })
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(500)
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

    test('Should return 400 if any field not is provided', async () => {
      const userWithoutEmail = {
        password: 'any_password'
      }
      await request(app)
        .post('/api/signup')
        .send(userWithoutEmail)
        .expect(400)
    })

    test('Should return 400 if email provided not is valid', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          email: 'invalid_email',
          password: 'any_password'
        })
        .expect(400)
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

    test('Should return 500 if fails when trying to generate the access token', async () => {
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(500)
    })

    test('Should return 500 if fails when trying to update the user with the generated access token', async () => {
      jest.spyOn(AccountMongoRepository.prototype, 'updateAccessToken').mockImplementationOnce(() => {
        throw new Error()
      })
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(500)
    })
  })
})
