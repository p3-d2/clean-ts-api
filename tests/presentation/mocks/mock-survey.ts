import { SurveyModel } from '@/domain/models'
import { mockSurveyModels, mockSurveyModel } from '@/tests/domain/mocks'
import { AddSurvey, LoadSurveyById, LoadSurveys } from '@/domain/usecases'

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurvey.Params

  async add (data: AddSurvey.Params): Promise<void> {
    this.addSurveyParams = data
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveyModels = mockSurveyModels()
  callsCount = 0
  accountId: string

  async load (accountId: string): Promise<SurveyModel[]> {
    this.callsCount++
    this.accountId = accountId
    return this.surveyModels
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  surveyModel = mockSurveyModel()
  id: string

  async loadById (id: string): Promise<SurveyModel> {
    this.id = id
    return this.surveyModel
  }
}
