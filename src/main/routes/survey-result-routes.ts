import { Router } from 'express'

import { auth } from '@/main/middlewares'
import { adaptRoute } from '@/main/adapters'
import { makeSaveSurveyResultController, makeLoadSurveyResultController } from '@/main/factories'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', auth, adaptRoute(makeLoadSurveyResultController()))
}
