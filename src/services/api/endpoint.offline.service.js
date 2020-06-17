import feathers from './feathers.service'
import Realtime from 'feathers-offline-owndata'
import owndataMutator from 'feathers-offline-owndata/lib/owndata-mutator'
import { genUuid } from 'feathers-offline-owndata/lib/commons/utils/cryptographic'
import { to } from '../helpers.service'
import auth from '../auth.service'
import mongoose from 'mongoose'
const { Types: { ObjectId } } = mongoose

/**
 * @overview A service that sends get, post, put, and delete requests to the server (remote)
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
   * @param  {function} queryFn A function returning a query object for limiting sync data (e.g. only users _id)
   * @return {nothing}
   */
function EndpointOffline (endpoint = '', queryFn = () => {}) {
  this.endpoint = endpoint
  this.service = null
  this.queryFn = queryFn

  if (endpoint.indexOf('http://') > -1 || endpoint.indexOf('https://') > -1) {
    this.url = endpoint // If the url is a full address then don't modify it
  } else { // otherwise prefix it with endpointPrefix (often '/api/') so it calls our server api
    this.url = endpointPrefix + this.endpoint
  }

  const clientServiceName = 'offClient-' + this.endpoint

  this.remoteService = feathers.service(this.url)
  this.realtimeRemoteService = new Realtime(this.remoteService, { uuid: true, updatedAt: true, subscriber: EndpointOffline.subscriber })
  this.remoteService._clientServiceName = clientServiceName
  feathers.use(clientServiceName, owndataMutator({ replicator: this.realtimeRemoteService, multi: true, timeout: 200 }))

  this.service = feathers.service(clientServiceName)

  // Note: we cannot use feathers.on('login', ...) and feathers.on('logout', ...)
  // as they are sent before auth.currentUser is populated (/cleared)
  feathers.on('FeathersIsOnline', EndpointOffline.handleConnectionEvent)
  feathers.on('FeathersIsLoggedIn', EndpointOffline.handleConnectionEvent)

  EndpointOffline.remoteServices.push({ handle: this.realtimeRemoteService, name: this.url, queryFn: this.queryFn })
  console.log(`remoteService: typeof ${this.realtimeRemoteService}`)

  if (feathers.isOnline && auth.currentUser) {
    EndpointOffline.remoteServices.forEach((service) => service.handle.connect(this.queryFn())
      .then(() => console.log(`===== Connect of endpoint ${service.name} successful!`))
      .catch((err) => console.error(`===== Connect of endpoint ${service.name} failed!!!!`, err)))
  }
  // TODO: REMOVE!!!!
  feathers.isOnline = true
  feathers.emit('FeathersIsOnline', true)

  // this.remoteService.connect()
  //   .then(() => console.log(`===== Endpoint ${this.url} started.`))
  //   .catch((err) => console.error(`===== Start of endpoint ${this.url} failed!!!!`, err))
}

/**
 * List of all offline-realtime services
 */
EndpointOffline.remoteServices = []

EndpointOffline.subscriber = function subscriber (records, { action, eventName, source, record }) {
  console.log(`.replicator event. action=${action} eventName=${eventName} source=${source}`, record)
}

EndpointOffline.handleConnectionEvent = function (value) {
  let user = 'no one'
  if (auth.currentUser && auth.currentUser.email) {
    user = auth.currentUser.email
  }

  console.log(`==> Enter: handleConnectionEvent: value=${JSON.stringify(value)}, auth.currentUser=${user}, ${EndpointOffline.remoteServices.length} endpoint(s)`)
  if (feathers.isOnline && auth.currentUser) {
    console.log(`==> handleConnectionEvent: value=${value}, auth.currentUser=${user}`)
    EndpointOffline.remoteServices.forEach((service) => {
      console.log(`===== Connect of endpoint ${service.name}...`)
      console.log(`service: typeof ${typeof service.handle}`)
      console.log(`\nquery: ${JSON.stringify(service.queryFn())}\nservice: name ${service.name}`)
      service.handle.connect(service.queryFn())
        .then(() => console.log(`===== Connect of endpoint ${service.name} successful!`))
        .catch((err) => console.error(`===== Connect of endpoint ${service.name} failed!!!!`, err))
    })
  }

  if (/*! feathers.isOnline || */ !auth.currentUser) {
    console.log(`==> handleConnectionEvent: value=${JSON.stringify(value)}, auth.currentUser=${user}, ${EndpointOffline.remoteServices.length} endpoint(s)`)
    EndpointOffline.remoteServices.forEach((service) => {
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
  // As we cannot guarantee that the back-end answers we have to supply the vitals ourselves (_id and uuid)
  if (!item._id) {
    item._id = ObjectId()
  }
  if (!item.uuid) {
    item.uuid = genUuid(true)
  }
  item.userId = auth.currentUser._id
  item.user = auth.currentUser

  // return to(this.service.create(item))
  console.log(`Calling create(${JSON.stringify(item)})`)
  //  const [err, res] = to(this.service.create(item))
  const res = to(this.service.create(item))
  console.log(`returned from create(${JSON.stringify(item)}), res=${JSON.stringify(res)}`)
  return res
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

  let res = null

  // if (rp._id) {
  //   return to(this.service.patch(rp._id, rp))
  // } else {
  //   return to(this.service.create(rp))
  // }
  if (rp._id) {
    console.log(`Calling upsert.patch(${JSON.stringify(item)})`)
    res = to(this.service.patch(rp._id, rp))
    console.log(`returned from upsert.patch(${rp._id},${JSON.stringify(item)}), res=${JSON.stringify(res)}`)
  } else {
    console.log(`Calling upsert.create(${JSON.stringify(item)})`)
    res = to(this.service.create(item))
    console.log(`returned from upsert.create(${JSON.stringify(item)}), res=${JSON.stringify(res)}`)
  }
  return res
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
