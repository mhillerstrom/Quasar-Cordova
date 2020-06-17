import Endpoints from './endpoints.service.js'
import EndpointOffline from './endpoint.offline.service.js'
import mongoose from 'mongoose'
const { Types: { ObjectId } } = mongoose

const api = {
  auth: new Endpoints('auth/local'),
  authManagement: new Endpoints('authManagement'),
  messages: new EndpointOffline('messages', () => { return { userId: { $in: [ObjectId(auth.currentUser._id), ObjectId('100000000000000000000002')] } } }),
  // messages: new Endpoints('messages'),
  // mmessages: new EndpointOffline('messages', () => { return { userId: { $in: [ObjectId(auth.currentUser._id), ObjectId('100000000000000000000002')] } } }),
  roles: new Endpoints('roles'),
  users: new Endpoints('users')
}

global.api = api

export default api
