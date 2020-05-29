const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication')
const { LocalStrategy } = require('@feathersjs/authentication-local')
const { expressOauth } = require('@feathersjs/authentication-oauth')

module.exports = app => {
  const authService = new AuthenticationService(app)

  authService.register('jwt', new JWTStrategy())
  authService.register('local', new LocalStrategy())

  app.use('/authentication', authService)
  app.configure(expressOauth())
}
