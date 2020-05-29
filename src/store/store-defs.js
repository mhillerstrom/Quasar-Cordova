import routes from '../router/routes'
import auth from '../services/auth.service'
import app from '../services/api/feathers.service'

const store = {
  routes: routes,
  auth: auth,
  currentUser: null,
  currentModal: '',
  modalConfig: {},
  messages: {}
}

export default store
