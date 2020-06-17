// import something here
import VueStash from 'vue-stash'
import store from '../store/store-defs'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  // something to do
  Vue.use(VueStash)
  app.data = {
    store
  }
  // eslint-disable-next-line no-undef
  prepareConfirm(app.data.store)
}
