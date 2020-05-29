const _ = require('lodash')
const { getItems } = require('feathers-hooks-common')
const to = require('../utils/to')

module.exports = function (options /* = {role: 'basic'} */) {
  var defRole = _.get(options, 'role', null)

  return async function (hook) {
    var role = defRole
    if (hook.data) {
      if (role == null) {
        const [err, dbRoleRes] = await to(hook.app.service('settings').find({ name: 'defaultRole' }))

        if (!err) {
          var dbRoleObj = _.get(dbRoleRes, '0')
          role = _.get(dbRoleObj, 'value.role') || 'basic'
          defRole = role
        } else {
          hook.result = { text: 'Error setting default role' }
          return hook
        }
      }

      (_.castArray(getItems(hook)))
        .forEach(item => { item.role = role })

      return (hook)
    }
  }
}
