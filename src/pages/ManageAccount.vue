<template lang="pug">
div
  .text-h4.q-my-lg.q-mx-md.text-grey-6.justify-start Manage Account
  .q-page.flex
    .row
      div.q-pa-md(style="max-width:320px;width:100%")
        q-list
          q-expansion-item(
            v-show="!isVerified"
            group="manageGroup"
            expand-separator
            icon="perm_identity"
            label="Enter authorisation code"
          )
            q-card
              q-card-section
                .row.justify-center
                  form
                    q-input(type="number" dense label='Authorisation code' v-model="authCode" lazy-rules clearable autocomplete="true" @keyup.enter="authorise(authCode)")
                .row.q-mt-md.q-mb-lx.justify-center
                    q-btn(style="width:100%" color="primary" @click="authorise(authCode)") Authorise

          q-expansion-item(
            v-show="!isVerified"
            group="manageGroup"
            expand-separator
            icon="mail"
            label="Resend authorisation code"
          )
            q-card
              q-card-section
                q-btn(style="width:100%" color="primary" label="Resend Authorisation code" @click="resendVerificationCode(currentUser.email)")

          q-expansion-item(
            v-show="isVerified"
            group="manageGroup"
            expand-separator
            icon="xxxxxxxx_email_multiple"
            label="Change email"
          )
            div
              q-card
                q-card-section
                  .row.justify-center
                    form
                      q-input(type='email' dense label='new email' v-model.trim="user.newEmail" :rules="emailValidation()"  lazy-rules clearable)
                      q-input(type='password' dense label='current password' v-model="user.password" :rules="passwordValidation()"  lazy-rules clearable autocomplete="true")
                  .row.q-mt-md.q-mb-lx.justify-center
                    q-btn(style="width:100%" color="primary" @click="auth.changeMyIdentity(user.password, {email: user.newEmail})") Change Email

          q-expansion-item(
            v-show="isVerified"
            group="manageGroup"
            expand-separator
            icon="fas fa-key"
            label="Change password"
          )
            div
              q-card
                q-card-section
                  .row.justify-center
                    form
                      q-input(type='password' dense label='old password' v-model="user.password" :rules="passwordValidation()"  lazy-rules clearable autocomplete="true")
                      q-input(type='password' dense label='new password' v-model="user.newPassword" :rules="passwordValidation()"  lazy-rules clearable autocomplete="false")
                  .row.q-mt-md.q-mb-lx.justify-center
                      q-btn(style="width:100%" color="primary" @click="auth.changePassword(user.password, user.newPassword)") Change Password

          q-expansion-item(
            v-show="isVerified"
            group="manageGroup"
            expand-separator
            icon="fas fa-paper-plane"
            label="Reset Password"
          )
            q-card
              q-card-section
                q-btn(style="width:100%" color="red" label="Reset Password" @click="auth.sendResetPassword(user.email)")

          q-expansion-item(
            v-show="isVerified"
            group="manageGroup"
            expand-separator
            icon="fas fa-user-alt-slash"
            label="Delete account"
          )
            q-card
              q-card-section
                q-btn(style="width:100%" color="red" label="Delete my account" @click="doDeleteAccount()")

    <!-- Modal confirm dialogue -->
    q-dialog(v-model="confirm.show" persistent)
      q-card
        q-card-section.q-py-sm.bg-red.text-white.text-center.text-h6 Confirm
        q-card-section(class="row items-center")
          span.q-ml-sm {{ confirm.text }}

        q-card-actions(align="right")
          q-btn(label="Cancel" color="secondary" v-close-popup @click="doDeleteAccountExecute(false)")
          q-btn(label="Delete" color="red" v-close-popup @click="doDeleteAccountExecute(true)")

</template>

<script>

//  module.exports = {
export default {
  store: ['auth', 'currentUser'],
  data: function () {
    return {
      errorsSummary: '',
      error: null,
      authCode: '',
      confirm: {
        show: false,
        text: ''
      },
      func: 0,
      user: {
        email: '',
        name: '',
        password: '',
        newPassword: null,
        newEmail: null,
        strategy: 'local'
      }
    }
  },

  computed: {
    isMobile: function () {
      return this.$q.platform.is.mobile === true
    },
    isDesktop: function () {
      return this.$q.platform.is.desktop === true
    },
    isVerified: function () {
      return this.auth && this.auth.currentUser && this.auth.currentUser.isVerified
    },
    isLoggedIn: function () {
      return this.auth && this.auth.currentUser
    }
  },

  methods: {
    nameValidation: function () {
      return [
        val => !!val || '* Required',
        val => val.length > 6 || 'Seems a little short...',
        val => val.indexOf(' ') !== -1 || 'Enter full name please'
      ]
    },
    emailValidation: function () {
      return [
        val => !!val || '* Required',
        val => val.length > 6 || 'Illegal format 1',
        val => val.indexOf('@') !== -1 || 'Illegal format 2',
        val => val.indexOf('.') !== -1 || 'Illegal format 3'
      ]
    },
    passwordValidation: function () {
      return [
        val => !!val || '* Required',
        val => val.length > 2 || 'Too short'
      ]
    },
    authorise: async function (code) {
      this.$q.loading.show({ message: 'Please wait while we authorise account...' })
      const result = await auth.verifySignUp(code)
      this.$q.loading.hide()
      console.log(`login.vue authorise(): typeof result='${typeof result}'`)
      if (!result) {
        this.errorsSummary = _.map(result, err => err).join('<br>')
        return
      }
      this.$router.push({ path: '/Main', history: false })
    },
    resendVerificationCode: async function (email) {
      this.$q.loading.show({ message: 'Please wait while we prepare your email...' })
      if (email > '') { auth.resendVerification(email) } else { auth.resendVerification(auth.currentUser.email) }
      this.$q.loading.hide()
      this.$router.push({ path: '/Main', history: false })
    },
    resetPassword: async function (password) {
      this.$q.loading.show({ message: 'Please wait while we prepare your email...' })
      await auth.resetPassword(this.$route.params.slug, password)
      this.$q.loading.hide()
      this.$router.push({ path: '/Main', history: false })
    },
    doDeleteAccount: function () {
      this.confirm.text = 'Are you sure you want to delete your user and all your data?'
      this.confirm.show = true
    },
    doDeleteAccountExecute: async function (flag) {
      if (!flag) return
      this.$q.loading.show({ message: 'Please wait while we delete your user...' })
      await api.users.deleteOne(auth.currentUser._id)
      await auth.logout()
      this.$q.loading.hide()
      this.$router.push({ path: '/Login', history: false })
    }
  }
}
</script>

<style lang="scss">

</style>
