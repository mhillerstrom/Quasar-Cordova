<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-banner v-show="!bannerOff" inline-actions dense class="text-white bg-red">
        You have lost connection to the internet. This app is offline.
        <template v-slot:action>
          <q-btn flat color="white" label="Ok" @click="bannerOff=!bannerOff" />
        </template>
      </q-banner>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-btn class="online-indicator" :offline="isOffline" flat round dense icon="whatshot">
          <q-tooltip>You are currently offline</q-tooltip>
        </q-btn>

      </q-toolbar>
      <div class="q-px-md q-pt-lx q-mb-md">
        <div class="text-h3">MyApp</div>
        <div class="text-subtitle1">{{todaysDate}}</div>
      </div>
      <q-img src="statics/lighthouse.jpg" class="header-image absolute-top"></q-img>
    </q-header>

    <SideBar :drawerOpen="leftDrawerOpen" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { date } from 'quasar'
import SideBar from '../components/SideBar'

const { formatDate } = date

export default {
  name: 'MainLayout',

  components: {
    SideBar
  },

  store: ['auth', 'routes', 'messages'],

  mounted () {
    const self = this
    notify.success('Welcome! Please login to continue...')

    // We listen for teh 'setLeftDrawer' event to be able to sync with child component(s)
    this.$root.$on('setLeftDrawer', value => (self.leftDrawerOpen = value))

    // Initial value depend on platform
    this.leftDrawerOpen = !this.$q.platform.is.mobile

    // We listen for 'FeathersIsOnline' to be able to track the value from Vue
    // This event is triggered by socketio in 'services/api/feathers.service.js'
    feathers.on('FeathersIsOnline', (value) => { self.isOnline = value })

    // Make sure updates to messages are copied to all connected clients
    // eslint-disable-next-line no-undef
    prepareSyncList(this.$store)
    syncList('messages', 'messages')

    if (this.$route.path === '/' && !auth.currentUser) {
      this.$router.push({ path: '/Login', history: false })
    }
  },
  computed: {
    todaysDate: function () {
      const timestamp = Date.now()
      return formatDate(timestamp, 'dddd D MMMM')
    },
    name: function () {
      return auth.currentUser ? auth.currentUser.name : 'Please login'
    },
    email: function () {
      return auth.currentUser ? auth.currentUser.email : ''
    },
    logInLogOutTxt () {
      let isLinTxt = null
      isLinTxt = this.isLoggedIn ? 'Logout' : 'Login'
      return isLinTxt
    },
    isLoggedIn () {
      return this.auth.currentUser !== null
    },
    isOffline () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.bannerOff = this.isOnline // This works as computed properties are only computed when the values changes (this.isOnline)
      return !this.isOnline
    }
  },

  data () {
    return {
      isOnline: feathers.isOnline || false,
      leftDrawerOpen: false,
      bannerOff: false
    }
  }
}
</script>

<style scoped>
.header-image {
  z-index: -1;
  height: 100%;
  opacity: 0.4;
  filter: greyscale(100%);
}
.sidebar-image {
  filter: greyscale(90%);
}
.online-indicator {
  margin-left:auto;
  display:none;
}
.online-indicator[offline=true] {
  display:inline;
  color:orange;
}

</style>
