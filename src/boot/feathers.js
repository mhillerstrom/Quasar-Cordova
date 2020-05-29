// Import Services
import '../services/index'

if (typeof window !== 'undefined') {
  if (typeof window.toastr === 'undefined') {
    window.toastr = () => {}
  }
} else if (typeof global.toastr === 'undefined') {
  global.toastr = () => {}
}

export default ({ app, router, Vue }) => {
  // Prepare the sync list helper
  // eslint-disable-next-line no-undef
  prepareSyncList(app.store)
}
