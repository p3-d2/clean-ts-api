export default {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'secret',
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api'
}
