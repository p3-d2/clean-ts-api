import { Validation } from '@/presentation/protocols'
import { makeLoginValidation } from '@/main/factories'
import { EmailValidatorAdapter } from '@/infra/validators'
import {
  ValidationComposite,
  RequiredFieldValidation,
  EmailValidation
} from '@/validation/validators'

jest.mock('@/validation/validators/validation-composite')

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
