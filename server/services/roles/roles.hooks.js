const { authenticate } = require('@feathersjs/authentication').hooks

const {
  isEnabled,
  // hasAnyPermission,
  hasPermissions
} = require('../../hooks')

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      isEnabled()
    ],
    find: [],
    get: [],
    create: [
      hasPermissions('manageRoles')
    ],
    update: [
      hasPermissions('manageRoles')
    ],
    patch: [
      hasPermissions('manageRoles')
    ],
    remove: [
      hasPermissions('manageRoles')
    ]
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
