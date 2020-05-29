const _ = require('lodash')
const errors = require('feathers-errors')

const defaults = {
  idField: '_id'
}

module.exports = (options = {}) => async hook => {
  if (!hook.params.provider) { return hook } // I.e. the back-end can delete admins...

  const settings = Object.assign({}, defaults, options)

  let query = {}

  if (hook.id) {
    query = { [settings.idField]: hook.id }
  } else if (_.get(hook, `data[${settings.idField}]`)) {
    query = { [settings.idField]: hook.data[settings.idField] }
  } else if (_.get(hook, 'data.name')) {
    query = { name: hook.data.name }
  } else if (_.get(hook, 'data.email')) {
    query = { email: hook.data.email }
  }
  // eslint-disable-next-line no-unused-vars
  const [err, result] = await to(hook.app.service('/users').find({ query }))
  if (_.get(result, 'data[0].role') === 'admin') {
    throw new errors.Forbidden('An admin cannot be deleted.')
  }

  return hook
}
