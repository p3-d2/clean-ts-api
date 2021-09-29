import { Validation } from '@/presentation/protocols'
import { makeAddSurveyValidation } from '@/main/factories'
import { ValidationComposite, RequiredFieldValidation } from '@/validation/validators'

jest.mock('@/validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
