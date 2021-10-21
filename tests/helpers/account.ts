import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'

import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db'

export const user = {
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
}

export const signUpUser = {
  ...user,
  passwordConfirmation: user.password
}

export const loginUser = {
  email: user.email,
  password: user.password
}

export const mockAccessToken = async (role?: string): Promise<string> => {
  const accountCollection = MongoHelper.getCollection('accounts')
  const { insertedId } = await accountCollection.insertOne({
    ...user,
    role
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

export const insertUser = async (): Promise<void> => {
  const accountCollection = MongoHelper.getCollection('accounts')
  const password = await hash(user.password, 12)
  await accountCollection.insertOne({
    ...user,
    password
  })
}
