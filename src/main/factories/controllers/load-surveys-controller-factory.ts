import { Controller } from '@/presentation/protocols'
import { LoadSurveysController } from '@/presentation/controllers'
import { makeLogControllerDecorator, makeDbLoadSurveys } from '@/main/factories'

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(controller)
}
