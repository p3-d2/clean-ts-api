import { Controller } from '@/presentation/protocols'
import { SaveSurveyResultController } from '@/presentation/controllers'
import {
  makeLogControllerDecorator,
  makeDbLoadSurveyById,
  makeDbSaveSurveyResult
} from '@/main/factories'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult())
  return makeLogControllerDecorator(controller)
}
