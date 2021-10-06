import faker from 'faker'

import { SurveyModel } from '@/domain/models'
import { mockSurveyModels } from '@/tests/domain/mocks'
import { AddSurvey, LoadAnswersBySurvey, LoadSurveys, CheckSurveyById } from '@/domain/usecases'

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

export class LoadAnswersBySurveySpy implements LoadAnswersBySurvey {
  result = [faker.random.word(), faker.random.word()]
  id: string

  async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result> {
    this.id = id
    return this.result
  }
}

export class CheckSurveyByIdSpy implements CheckSurveyById {
  result = true
  id: string

  async checkById (id: string): Promise<CheckSurveyById.Result> {
    this.id = id
    return this.result
  }
}
