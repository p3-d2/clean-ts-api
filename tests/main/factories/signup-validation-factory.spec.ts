import { Validation } from '@/presentation/protocols'
import { makeSignUpValidation } from '@/main/factories'
import { EmailValidatorAdapter } from '@/infra/validators'
import {
  ValidationComposite,
  RequiredFieldValidation,
  CompareFieldsValidation,
  EmailValidation
} from '@/validation/validators'

jest.mock('@/validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
