const { authenticate } = require('@feathersjs/authentication').hooks
const {
  when,
  populate,
  dePopulate,
  setNow,
  isProvider
} = require('feathers-hooks-common')
const {
  loopItems,
  associateEffectiveUser,
  log
} = require('../../hooks')

const idField = '_id'

const schema = {
  include: [{
    service: 'users',
    nameAs: 'user',
    parentField: 'userId',
    childField: idField,
    query: {
      $select: ['name', idField, 'color', 'email']
    },
    provider: undefined
  }]
}

module.exports = {
  before: {
    all: [
    //   loopItems(item => {
    //     if (item && !item.uuid) {
    //       item.uuid = genUuid(true)
    //     }
    //   })
    ],
    find: [
      when(isProvider('external'),
        authenticate('jwt')
      )
    ],
    get: [
      authenticate('jwt')
    ],
    create: [
      authenticate('jwt'),
      dePopulate(),
      log(),
      setNow('createdAt', 'updatedAt'),
      associateEffectiveUser()
    ],
    update: [
      authenticate('jwt'),
      dePopulate(),
      setNow('updatedAt'),
      associateEffectiveUser()
    ],
    patch: [
      authenticate('jwt'),
      dePopulate(),
      setNow('updatedAt'),
      associateEffectiveUser()
    ],
    remove: [
      authenticate('jwt')
    ]
  },

  after: {
    all: [
      populate({ schema }),
      loopItems(item => {
        if (!item.user) {
          item.user = {
            name: 'Deleted User',
            _id: '',
            color: 'black',
            initials: 'X'
          }
        }
        // if (!item.uuid) {
        //   item.uuid = item._id
        // }
      })
    ],
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
