import validator from 'validator'

import { EmailValidatorAdapter } from './email-validator'

jest.mock('validator')

describe('EmailValidator Adapter', () => {
  const mockedValidator = validator as jest.Mocked<typeof validator>

  test('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    mockedValidator.isEmail.mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
})
