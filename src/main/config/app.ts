import express, { Express } from 'express'

import { setupApolloServer } from '@/main/graphql/apollo'

import setupRoutes from './routes'
import setupSwagger from './swagger'
import setupMiddlewares from './middlewares'

const app = express()

export const setupApp = async (): Promise<Express> => {
  setupMiddlewares(app)
  setupSwagger(app)
  setupRoutes(app)
  const apolloServer = setupApolloServer()
  await apolloServer.start()
  apolloServer.applyMiddleware({ app })
  return app
}
