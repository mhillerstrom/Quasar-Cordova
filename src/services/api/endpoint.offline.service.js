import feathers from './feathers.service'
import Realtime from 'feathers-offline-owndata'
import owndataMutator from 'feathers-offline-owndata/lib/owndata-mutator'
import { genUuid } from 'feathers-offline-owndata/lib/commons/utils/cryptographic'
import { to } from '../helpers.service'
import auth from '../auth.service'
import mongoose from 'mongoose'
const { Types: { ObjectId } } = mongoose

/**
 * @overview A service that sends get, post, put, and delete requests to the server
 * through http. Allows raw mongoDB queries to be passed to the server.
 * The user creates a new instance of the endpoints service providing an endpoint
 * url to reach and calls api methods on that instance.
 * @author Jon Paul Miles <milesjonpaul@gmail.com>
 * @author Michael Hillerström <michael@hillerstrom.name>
 * @version 1.0.0
 * @license MIT
 * @example `let menus = new endpoints('menus');
 * let postUpdates = {
 *       title: 'Welcome to my First Article',
 *       author: '1481024910249192',
 *       likes: 14
 * };
 * //Pass in raw mongoDB queries
 * menus.update({title: 'Welcome to my Blog!'}, postUpdates).then(cb);`
 */

const endpointPrefix = '' // Often '/api/'...

/**
   * Sets up a rest endpoint for the given url so create, find, update, and delete can be performed on it.
   * @constructor
   * @param  {string} endpoint The URL of the server endpoint to reach. `/api/` prefix is already assumed.
   * @return {nothing}
   */
function EndpointOffline (endpoint = '') {
  this.endpoint = endpoint
  this.service = null

  if (endpoint.indexOf('http://') > -1 || endpoint.indexOf('https://') > -1) {
    this.url = endpoint // If the url is a full address then don't modify it
  } else { // otherwise prefix it with endpointPrefix (often '/api/') so it calls our server api
    this.url = endpointPrefix + this.endpoint
  }

  const clientServiceName = 'client-' + this.url

  this.serverService = new Realtime(feathers.service(this.url), { uuid: true, updatedAt: true, subscriber: EndpointOffline.subscriber })
  feathers.use(clientServiceName, owndataMutator({ replicator: this.serverService, multi: true, timeout: 200 }))

  this.service = feathers.service(clientServiceName)

  feathers.on('FeathersIsOnline', EndpointOffline.handleConnectionEvent)
  feathers.on('FeathersLoggedIn', EndpointOffline.handleConnectionEvent)

  EndpointOffline.serverServices.push({ handle: this.serverService, name: this.url })
  console.log(`ServerService: typeof ${this.serverService}`)

  if (feathers.isOnline && auth.currentUser) {
    EndpointOffline.serverServices.forEach((service) => service.handle.connect()
      .then(() => console.log(`===== Connect of endpoint ${service.name} successful!`))
      .catch((err) => console.error(`===== Connect of endpoint ${service.name} failed!!!!`, err)))
  }

  // this.serverService.connect()
  //   .then(() => console.log(`===== Endpoint ${this.url} started.`))
  //   .catch((err) => console.error(`===== Start of endpoint ${this.url} failed!!!!`, err))
}

/**
 * List of all offline-realtime services
 */
EndpointOffline.serverServices = []

EndpointOffline.subscriber = function subscriber (records, { action, eventName, source, record }) {
  console.log(`.replicator event. action=${action} eventName=${eventName} source=${source}`, record)
}

EndpointOffline.handleConnectionEvent = function (value) {
  let user = 'no one'
  if (auth.currentUser && auth.currentUser.email) {
    user = auth.currentUser.email
  }

  console.log(`==> Enter: handleConnectionEvent: value=${value}, auth.currentUser=${user}, ${EndpointOffline.serverServices.length} endpoint(s)`)
  if (feathers.isOnline && auth.currentUser) {
    console.log(`==> handleConnectionEvent: value=${value}, auth.currentUser=${user}`)
    EndpointOffline.serverServices.forEach((service) => {
      console.log(`===== Connect of endpoint ${service.name}...`)
      console.log(`service: typeof ${service.handle}`)
      service.handle.connect()
        .then(() => console.log(`===== Connect of endpoint ${service.name} successful!`))
        .catch((err) => console.error(`===== Connect of endpoint ${service.name} failed!!!!`, err))
    })
  }

  if (/*! feathers.isOnline || */ !auth.currentUser) {
    console.log(`==> handleConnectionEvent: value=${value}, auth.currentUser=${user}, ${EndpointOffline.serverServices.length} endpoint(s)`)
    EndpointOffline.serverServices.forEach((service) => {
      console.log(`===== Disconnect endpoint ${service.name}...`)
      console.log(`service: typeof ${service.handle}`)
      service.handle.disconnect()
    })
  }
}

/**
   * Adds content in the server database for the endpoint passed into the constructor function.
   * @param  {object} content The item(s) to be added to the database
   * @return {promise} An array of items that were created
   */
EndpointOffline.prototype.create = function (content) {
  const item = _.clone(content)
  if (!item.uuid) {
    item.uuid = genUuid(true)
  }
  item.userId = auth.currentUser._id
  item.user = auth.currentUser

  // As we cannot guarantee that the back-end answers we have to supply the _id ourselves
  if (!item._id) {
    item._id = ObjectId()
  }

  return to(this.service.create(item))
}

/**
   * Gets data matching the query.
   * @param  {object} query Raw mongoDB query
   * @return {promise} An array of items matching the query
   */
EndpointOffline.prototype.find = function (query) {
  return to(this.service.find({ query }))
}

/**
   * Updates data in the server database identified with a mongoDB query with the replacement data passed in.
   * @param  {object} query Raw mongoDB query
   * @param  {object} replacement Whatever data you want to replace the found data with, only replaces properties mentioned, not the whole object
   * @return {promise} Items that were updated
   */
EndpointOffline.prototype.update = function (query, replacement) {
  const rp = _.clone(replacement)
  rp.userId = auth.currentUser._id
  rp.user = auth.currentUser
  rp.createdAt = undefined
  rp.updatedAt = undefined

  return to(this.service.patch(null, rp, { query }))
}

/**
   * Updates or creates an item depending on if it has an id or not
   * @param {object} item The item to be upserted
   * @return {object} The upserted object from the server
   */
EndpointOffline.prototype.upsert = function (item) {
  const rp = _.clone(item)
  rp.createdAt = undefined
  rp.updatedAt = undefined
  rp.userId = auth.currentUser._id
  rp.user = auth.currentUser

  if (!rp.uuid) {
    rp.uuid = genUuid(true)
  }

  if (rp._id) {
    return to(this.service.patch(rp._id, rp))
  } else {
    return to(this.service.create(rp))
  }
}

/**
   * Deletes data from the server database that matches the mongoDB query passed in.
   * @param  {object} query Raw mongoDB query
   * @return {promise} The item(s) deleted
   */
EndpointOffline.prototype.delete = function (query) {
  let id = null
  const params = { query }
  if (query._id) { id = query._id; query = undefined }

  return to(this.service.remove(id, params))
}

/**
   * Returns one item from the server that has the mongoDB _id passed in.
   * @param  {string} id The _id value of the object to retrieve
   * @return {promise} Object that has that id
   */
EndpointOffline.prototype.findOne = function (id) {
  return to(this.service.get(id))
}

/**
   * Updates one item in the database that has the _id passed in with the information in replacement.
   * @param  {string} id The `_id` of the mongoDB object
   * @param  {object} replacement The content to replace the found object with
   * @return {promise} Item replaced
   */
EndpointOffline.prototype.updateOne = function (id, replacement) {
  const rp = _.clone(replacement, true)
  rp.createdAt = undefined
  rp.updatedAt = undefined

  return to(this.service.patch(id, rp))
}

/**
   * Deletes one item from the server database that has the _id that was passed in.
   * @param  {string} id The _id of the mongoDB object to delete
   * @return {promise} Item deleted
   */
EndpointOffline.prototype.deleteOne = function (id) {
  return to(this.service.remove(id))
}

export default EndpointOffline
