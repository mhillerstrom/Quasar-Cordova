import routes from '../router/routes'
import auth from '../services/auth.service'

const store = {
  routes: routes,
  auth: auth,
  currentUser: null,
  currentModal: '',
  modalConfig: {},
  messages: {}
}

export default store
