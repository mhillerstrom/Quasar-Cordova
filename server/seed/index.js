/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable no-func-assign */
const messagesData = require('./services/messages.js')
const rolesData = require('./services/roles.js')
const settingsData = require('./services/settings.js')
const userData = require('./services/users.js')

// eslint-disable-next-line no-unused-vars
const isTest = process.env.NODE_ENV === 'test'

module.exports = function () {
  const app = this

  ifEmptyCreate = ifEmptyCreate.bind(app)
  resetData = resetData.bind(app)
  removeData = removeData.bind(app)

  const reset_seed = process.env.RESET_SEED && typeof process.env.RESET_SEED === 'string' ? process.env.RESET_SEED.toLowerCase() : process.env.RESET_SEED
  console.log(`\nseed: reset_seed=${reset_seed}, settings=${settingsData.length}, messages=${messagesData.length}, users=${userData.length}\n`)

  if (reset_seed === 'true') {
    console.log('resetting site data')
    app.configure(resetData('roles', rolesData))
    removeData('settings')()
    removeData('users')()
    removeData('messages')()
  }

  app.configure(ifEmptyCreate('roles', rolesData))

  if (settingsData.length > 0) {
    app.configure(ifEmptyCreate('settings', settingsData))
  }
  if (messagesData.length > 0) {
    app.configure(ifEmptyCreate('messages', messagesData))
  }
  if (userData.length > 0) {
    // We want to create users one at a time due to hashPassword-hook quirk
    app.configure(ifEmptyCreate('users', userData /* true */))
  }
}

// ### ifEmptyCreate(model, data)
/**
 * If the model is empty then populate it's data
 * @param {object} model Mongoose Model
 * @param {object|object[]} data Object data or Array of Object data to insert
 * @param {boolean} optional: true if create one at a time
 * @return {function} Returns a method to be called by configure
 */
function ifEmptyCreate (name, data, oneByOne = false) {
  const app = this
  return async () => {
    try {
      let found = await this.service(name).find({ query: {} })
      if (found && Number.isInteger(found.total) && Array.isArray(found.data)) {
        found = found.data
      }
      if (found.length !== 0) { return false }
      if (oneByOne) {
        data.forEach(async element => {
          await app.service(name).create(element)
        })
      } else { await app.service(name).create(data) }
      console.log(`>> Default collection '${name}' created with ${data.length} documents.`)
    } catch (err) {
      if (err) { console.log('trouble seeding ' + name + ': ', err) }
    }
  }
}

// ### resetData(model, data)
/**
 * Erases all data in the model and calls ifEmptyCreate
 * @param {object} model Mongoose model
 * @param {object|object[]} data Data to insert
 */
function resetData (name, data) {
  const app = this
  return async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await app.service(name).remove(null, { query: {} })
      ifEmptyCreate(name, data)()
    } catch (err) {
      console.log('trouble resetting data for ' + name, err)
    }
  }
}

function removeData (name) {
  const app = this
  return async () => {
    console.log('resetting ' + name)
    await app.service(name).remove(null, { query: {} })
  }
}
