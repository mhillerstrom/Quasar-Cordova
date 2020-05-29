const { disallow } = require('feathers-hooks-common')
const { suppressEmails } = require('../../hooks')

module.exports = {
  before: {
    all: [
      disallow('external'),
      suppressEmails()
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
