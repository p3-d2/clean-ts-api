import express from 'express'

import { setupApolloServer } from '@/main/graphql/apollo'

import setupRoutes from './routes'
import setupSwagger from './swagger'
import setupMiddlewares from './middlewares'

const app = express()

;(async () => {
  setupMiddlewares(app)
  setupSwagger(app)
  setupRoutes(app)
  const apolloServer = setupApolloServer()
  await apolloServer.start()
  apolloServer.applyMiddleware({ app })
})()

export default app
