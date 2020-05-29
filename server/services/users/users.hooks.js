const _ = require('lodash')
const { authenticate } = require('@feathersjs/express')// require('@feathersjs/authentication').hooks;
const verifyHooks = require('feathers-authentication-management').hooks
const {
  when,
  discard,
  populate,
  disallow,
  iff,
  preventChanges,
  isProvider,
  serialize,
  unless
} = require('feathers-hooks-common')
const {
  hashPassword,
  protect
} = require('@feathersjs/authentication-local').hooks
const {
  isEnabled,
  setDefaultRole,
  setFirstUserToRole,
  sendVerificationEmail,
  hasPermissionsBoolean,
  preventDeleteAdmin,
  preventDisabledAdmin,
  loopItems
} = require('../../hooks')

const restrict = [
  authenticate('jwt'),
  isEnabled(),
  unless(
    hasPermissionsBoolean('manageUsers')
    // restrictToOwner({
    //   idField: '_id',
    //   ownerField: '_id'
    // })
  )
]

function setUserInitials (item) {
  if (item.name) {
    item.initials = _.get(item, 'name', '')
      .match(/\b(\w)/g)
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }
}

const schema = {
  include: [{
    service: 'roles',
    nameAs: 'access',
    parentField: 'role',
    childField: 'role',
    provider: undefined
  }]
}

const serializeSchema = {
  computed: {
    // eslint-disable-next-line no-unused-vars
    permissions: (item, hook) => _.get(item, 'access.permissions')
  },
  exclude: ['access', '_include']
}

module.exports = {
  before: {
    all: [],
    find: [
      when(isProvider('external'),
        authenticate('jwt'),
        isEnabled()
      )
    ],
    get: [
      authenticate('jwt'),
      isEnabled()
    ],
    create: [
      hashPassword('password'),
      verifyHooks.addVerification(),
      setDefaultRole(/* {role: 'basic'} */),
      setFirstUserToRole({ role: 'admin' }),
      preventDisabledAdmin(),
      loopItems(setUserInitials)
    ],
    update: [
      hashPassword('password'),
      iff(isProvider('external'), preventChanges(true, [
        'isVerified',
        'verifyToken',
        'verifyShortToken',
        'verifyExpires',
        'verifyChanges',
        'resetToken',
        'resetShortToken',
        'resetExpires'
      ]))
    ],
    patch: [
      ...restrict,
      hashPassword('password'),
      iff(isProvider('external'), preventChanges(true, [
        'isVerified',
        'verifyToken',
        'verifyShortToken',
        'verifyExpires',
        'verifyChanges',
        'resetToken',
        'resetShortToken',
        'resetExpires'
      ])),
      preventDisabledAdmin(),
      preventDeleteAdmin(),
      loopItems(setUserInitials)
    ],
    remove: [
      ...restrict
    ]
  },

  after: {
    all: [
      when(
        hook => hook.params.provider,
        discard('_computed', 'verifyExpires', 'resetExpires', 'verifyChanges')
      ),
      populate({ schema }),
      serialize(serializeSchema),
      protect('password')
    ],
    find: [],
    get: [],
    create: [
      sendVerificationEmail(),
      verifyHooks.removeVerification()
    ],
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
