const authManagement = require('./auth-management/auth-management.service.js')
const email = require('./email/email.service.js')
const messages = require('./messages/messages.service.js')
const roles = require('./roles/roles.service.js')
const settings = require('./settings/settings.service.js')
const users = require('./users/users.service.js')

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(authManagement)
  app.configure(email)
  app.configure(messages)
  app.configure(roles)
  app.configure(settings)
  app.configure(users)
}
