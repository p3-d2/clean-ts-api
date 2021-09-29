import jwt from 'jsonwebtoken'

import { JwtAdapter } from '@/infra/criptography'

jest.mock('jsonwebtoken', () => ({
  sign () {
    return 'any_token'
  },

  verify (): string {
    return 'any_value'
  }
}))

const makeSut = (): JwtAdapter => new JwtAdapter('secret')

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('Should call sign with correct values', () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    test('Should return a token on sign success', () => {
      const sut = makeSut()
      const accessToken = sut.encrypt('any_id')
      expect(accessToken).toBe('any_token')
    })
  })

  describe('verify()', () => {
    test('Should call verify with correct values', () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    test('Should return a value on verify success', () => {
      const sut = makeSut()
      const value = sut.decrypt('any_token')
      expect(value).toBe('any_value')
    })
  })
})
