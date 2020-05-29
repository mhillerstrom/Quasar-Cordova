// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { getItems } = require('feathers-hooks-common')

const _ = require('lodash')
const errors = require('feathers-errors')

const mongoose = require('mongoose')
const { Types: { ObjectId } } = mongoose

const batchId = ObjectId('100000000000000000000002') // Defined in '../seed/services/messages.js'

const defaults = {
  idField: '_id',
  fieldToSet: 'userId'
}

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  const settings = Object.assign({}, defaults, options)

  return function (hook) {
    if (!_.get(hook, 'params.provider')) {
      // It's the server calling
      hook.data[defaults.fieldToSet] = batchId
      return hook
    }

    // Ok, we being called from the out-side world
    if (!_.get(hook, `params.user[${settings.idField}]`)) {
      throw new errors.NotAuthenticated('The current user is missing. You must not be authenticated.')
    }

    (_.castArray(getItems(hook)))
      .forEach(item => { item[settings.fieldToSet] = _.get(hook, `params.user[${settings.idField}]`) })

    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    return Promise.resolve(hook)
  }
}
