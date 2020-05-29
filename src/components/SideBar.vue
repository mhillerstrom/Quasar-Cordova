<template lang="pug">
    q-drawer(v-model="leftDrawerOpen" show-if-above bordered :width="200" :breakpoint="600" elevated)
      q-scroll-area(style="height:calc(100% - 144px);margin-top:144px;border-right:1px solid #ddd")
        q-list(padding) <!-- no-border link inset-separator -->
          template(v-for="route in routes")
            template(v-if="route.path == '/'")
              template(v-for="child in route.children")
                q-item(v-if="!hide(child)" :to="child.path"  :key="child.path" clickable v-ripple)
                  q-item-section(avatar)
                    q-icon(:name="child.meta.icon")
                  q-item-section
                    q-item-label {{child.name}}

              q-separator

              q-item(to="/ManageAccount" v-show="auth.currentUser" clickable v-ripple)
                q-item-section(avatar)
                  q-icon(name="fas fa-user-secret")
                q-item-section
                  q-item-label Manage account
              q-item(to="/Login" clickable v-ripple @click='logInLogOut()')
                q-item-section(avatar)
                  q-icon(:name="logInLogOutIcon")
                q-item-section
                  q-item-label {{logInLogOutTxt}}

              q-separator
          q-page-sticky(position="bottom-right" :offset="[16, 10]" style="font-size:0.7em") Prepared by&nbsp;
            a(href="https://github.com/mhillerstrom")
              font(color="#0000FF") Hiller
              font(color="#FF0000") Ware

      <q-img @click="leftDrawerOpen=!leftDrawerOpen" elevated class="absolute-top sidebar-image" src="statics/lighthouse.jpg" style="height:144px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <div class="text-weight-bold">{{name}}</div>
          <div>{{email}}</div>
        </div>
      </q-img>
</template>

<script>
export default {
  name: 'SideBar',
  store: ['auth', 'routes', 'messages'],
  props: {
    drawerOpen: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      leftDrawerOpen: true
    }
  },
  beforeMount () {
    this.leftDrawerOpen = this.drawerOpen
  },

  computed: {
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
    logInLogOutIcon () {
      return auth.currentUser ? 'fas fa-sign-out-alt' : 'fas fa-sign-in-alt'
    },
    isLoggedIn () {
      return auth.currentUser !== null
    }

  },

  methods: {
    hide (item) {
      return (item.meta.requiresAuth && !this.isLoggedIn) || (item.meta.hideWhenLoggedIn && this.isLoggedIn)
    },
    async logInLogOut () {
      if (this.isLoggedIn) {
        await this.logout()
        this.leftDrawerOpen = this.$q.platform.is.mobile ? false : this.leftDrawerOpen
      } else console.log('Not logged in!!!!!')
    },
    async logout () {
      await auth.logout('Hope to see you back again soon!')
    }
  },

  watch: {
    /* If our prop ever gets changed outside of this component then we need to update our local data version of the prop */
    drawerOpen: function (newVal) {
      this.leftDrawerOpen = newVal
    },
    /* Signal to parents, if the local copy i changed (ie. user hides the sidebar) */
    leftDrawerOpen: function (newVal) {
      this.$root.$emit('setLeftDrawer', newVal)
    }

  }

}
</script>
