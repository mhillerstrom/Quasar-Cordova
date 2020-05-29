import url from './url.service'
import feathers from '@feathersjs/feathers'
import config from './get.config'

// const axios = require('axios')
import authentication from '@feathersjs/authentication-client'
// const rest = require('@feathersjs/rest-client')

import socketio from '@feathersjs/socketio-client'
import io from 'socket.io-client'

const socket = io(url)
const app = feathers()

app.configure(socketio(socket))
  .configure(authentication({
    storage: window.localStorage,
    path: '/authentication' /* '/api/authentication' */,
    entity: 'user',
    service: '/users',
    cookie: config.clientCookie,
    storageKey: config.clientCookie,
    passReqToCallback: true
  }))

if (typeof window === 'undefined') {
  window.feathers = app
} else {
  global.feathers = app
}

const handleConnectionEvents = (eventTxt) => (event) => {
  console.log(`handleConnectionEvents(${eventTxt})() called...`)
  if (eventTxt === 'connect_error' || eventTxt === 'connect_timeout') {
    app.isOnline = false
  }
  if (eventTxt === 'connect') {
    app.isOnline = true
  }
//  notify.warning(`app.isOnline=${app.isOnline}`)
  app.emit('FeathersIsOnline', app.isOnline)
}

// We use the websockets interface to detect access to backend
socket.on('connect_error', handleConnectionEvents('connect_error'))
socket.on('connect_timeout', handleConnectionEvents('connect_timeout'))
socket.on('connect', handleConnectionEvents('connect'))

export default app
