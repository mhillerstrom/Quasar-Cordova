import Endpoints from './endpoints.service.js'
import EndpointOffline from './endpoint.offline.service.js'

const api = {
  auth: new Endpoints('auth/local'),
  authManagement: new Endpoints('authManagement'),
  messages: new EndpointOffline('messages'),
  roles: new Endpoints('roles'),
  users: new Endpoints('users')
}

global.api = api

export default api
