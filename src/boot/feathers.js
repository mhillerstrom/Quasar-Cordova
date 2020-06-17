// Import Services
import '../services/index'

export default ({ app, router, Vue }) => {
  // Prepare the sync list helper
  // eslint-disable-next-line no-undef
  prepareSyncList(app.store)
}
