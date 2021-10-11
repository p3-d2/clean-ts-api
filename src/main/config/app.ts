import express from 'express'

import { setupApolloServer } from '@/main/graphql/apollo'

import setupRoutes from './routes'
import setupSwagger from './swagger'
import setupMiddlewares from './middlewares'

const app = express()

;(async () => {
  await setupApolloServer(app)
  setupMiddlewares(app)
  setupSwagger(app)
  setupRoutes(app)
})()

export default app
