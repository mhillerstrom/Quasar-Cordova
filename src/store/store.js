// The server may have made changes to the store before rendering the initial html. It writes those changes to window.__INITIAL_STATE__. We need to set out local store to be the same as the server so vue does not throw an hydration error (server and client html out of sync)
import Vue from 'vue'
import VueStash from 'vue-stash'
import defaultStore from './store-defs'

Vue.use(VueStash)

let store = defaultStore

try {
  // eslint-disable-next-line no-undef
  if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
    // eslint-disable-next-line no-undef
    store = window.__INITIAL_STATE__
  }
// eslint-disable-next-line no-empty
} catch (err) {}

export default store
