import { Controller } from '@/presentation/protocols'
import { LoadSurveyResultController } from '@/presentation/controllers'
import {
  makeLogControllerDecorator,
  makeDbLoadSurveyById,
  makeDbLoadSurveyResult
} from '@/main/factories'

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResult())
  return makeLogControllerDecorator(controller)
}
