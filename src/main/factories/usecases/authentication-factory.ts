import env from '@/main/config/env'
import { DbAuthentication } from '@/data/usecases'
import { Authentication } from '@/domain/usecases'
import { AccountMongoRepository } from '@/infra/db'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'

export const makeDbAuthentication = (): Authentication => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}
