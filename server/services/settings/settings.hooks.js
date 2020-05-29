const { authenticate } = require('@feathersjs/authentication').hooks

const {
  isEnabled
} = require('../../hooks')

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      isEnabled()
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
