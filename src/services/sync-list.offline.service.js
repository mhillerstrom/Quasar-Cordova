/**
 * Uses Socket.io to detect updates, deletions, and creations and updates a property on
 * the store with the changes.
 *
 * Please note:
 * ============
 * Arrays will be transformed into objects with each idProperty (default '_id')
 * as key and the item as value.
 * While this principle ensures fast manipulations of the data it actually makes it impossible
 * to use the 'length' property to establish the "arrays" size (easily remedied by using
 * '_.size' instead). Also, you need to make any code manipulating the syncList array
 * aware of the transformation from Array -> Object. Not at big thing, but it can be difficult
 * to spot.
 */
import feathers from './api/feathers.service'
import _ from 'lodash'

// ### liveSyncWithServer(service, storeProperty, idProperty, store)
/**
 * Syncs a store list with an api endpoint list
 * @param {string} service Api endpoint to sync with
 * @param {string} storeProperty The property to update on the store
 * @param {string} idProperty The id property of the collection/table (default '_id')
 * @param {object} store The store to update with
 * @return {nothing}
 */

function convertStoreArrayToHash (store, storeProperty, idProperty) {
  if (store[storeProperty] && Array.isArray(store[storeProperty])) {
    store[storeProperty] = _.keyBy(store[storeProperty], idProperty)
  }
}

/**
 * Receives the item(s) being updated and updates them by id in an existing list. First converts the list to a hashmap if not already.
 * @param {array|object} items A single item or multiple items to update
 * @return {nothing}
 */
function updateLocalItems (items, store, storeProperty, idProperty) {
//  console.log(`syncList updateLocalItems: items=${JSON.stringify(items)},\nstore=${JSON.stringify(store)},\nstoreProperty=${JSON.stringify(storeProperty)},\nval=${JSON.stringify(store[storeProperty])}`)
  items = _.castArray(items)

  convertStoreArrayToHash(store, storeProperty, idProperty)

  store[storeProperty] = Object.assign({}, store[storeProperty], _.keyBy(items, idProperty))
}

function liveSyncWithServer (service, storeProperty, idProperty = '_id', store) {
  // This line disables the service from running server side when doing things like SSR with Vue
  if (typeof window === 'undefined') { return false }

  // Pre-inputs the store, storeProperty and idProperty values since the event listeners won't provide that data
  const updateItemsInStore = _.partialRight(updateLocalItems, store, storeProperty, idProperty)

  // Adds items to the local list that were added to the server
  feathers.service(service).on('created', updateItemsInStore)

  // Updates items in local list that were patched from the server
  feathers.service(service).on('patched', updateItemsInStore)

  // Updates items in local list that were updated from the server
  feathers.service(service).on('updated', updateItemsInStore)

  // Removes items from local list that were removed from the server
  feathers.service(service).on('removed', items => {
    items = _.castArray(items)

    convertStoreArrayToHash(store, storeProperty, idProperty)

    const itemsHash = _.keyBy(items, idProperty)

    store[storeProperty] = _.pickBy(store[storeProperty], function (item, key) {
      if (!itemsHash[key]) { return item }
    })
  })
}

function prepareSyncList (store) {
  global.syncList = _.partialRight(liveSyncWithServer, store)
  return global.syncList
}

global.prepareSyncList = prepareSyncList

export default prepareSyncList
