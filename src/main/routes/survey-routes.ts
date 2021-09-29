import { Router } from 'express'

import { adaptRoute } from '@/main/adapters'
import { adminAuth, auth } from '@/main/middlewares'
import { makeAddSurveyController, makeLoadSurveysController } from '@/main/factories'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
