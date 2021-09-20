import express from 'express'

import setupMiddlewares from './middlewares'
import setupSwagger from './config-swagger'
import setupRoutes from './routes'

const app = express()

setupMiddlewares(app)
setupSwagger(app)
setupRoutes(app)

export default app
