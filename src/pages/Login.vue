<template lang="pug">
  q-page.flex.justify-center
    <!-- Login form -->
    div(v-show="showing === 'login'")
      .row.q-mt-md.justify-center
        q-item-label.q-ml-none.text-h5.header Login
      .row.justify-center.q-mt-md
        form()
          q-input(v-model.trim="user.email" type="email" label="Your email" dense clearable autocomplete="true" :rules="emailValidation()"  lazy-rules)
          q-input(v-model="user.password" type="password" label="Your password" dense clearable autocomplete="false" :rules="passwordValidation()"  lazy-rules @keyup.enter="login(user)")
      .row.q-mt-md.q-mb-lx.justify-center
        q-btn.q-mt-md(style="width:100%" color="primary" @click="login(user)") Login

      <!-- Social login buttons -->
      .row.q-mb-md.q-mt-xl
        div(style="margin-right:30px")
          q-tooltip Login using your Facebook account
          a(href="/api/auth/facebook")
            .login-form-social-login-icon.login-form-facebook-icon
              q-icon(name="fab fa-facebook-f")
        div(style="margin-right:30px")
          q-tooltip Login using your Google account
          a(href="/auth/google")
            .login-form-social-login-icon.login-form-google-icon
              q-icon(name="fab fa-google")
        div
          q-tooltip Login using your Twitter account
          a(href="/api/auth/twitter")
            .login-form-social-login-icon.login-form-twitter-icon
              q-icon(name="fab fa-twitter")

      <!-- Signup wanted? -->
      .row.justify-center(v-show="!isLoggedIn")
          a.text-blue-3(href="#" @click.stop="toggleLogin()") Signup if no account yet

      <!-- Additional account handling -->
      .row.justify-center
        div(v-show="!isLoggedIn")
          .login-form-forgot-password(@click="auth.sendResetPassword(user.email)") Forgot your password?

    <!-- Signup form -->
    div(v-show="showing === 'signup'")
      .row.q-mt-md.justify-center
        q-item-label.text-h5.q-mx-md.text-grey-8.header Signup
      .row.q-mt-md.justify-center
        form
          q-input(v-model.trim="user.name" type="text" dense clearable label="Your name" :rules="nameValidation()"  lazy-rules autocomplete="true")
          q-input(v-model.trim="user.email" type="email" dense clearable label="Your email" :rules="emailValidation()"  lazy-rules autocomplete="true")
          q-input(v-model="user.password" type="password" dense clearable label="Your password" :rules="passwordValidation()"  lazy-rules autocomplete="false" @keyup.enter="signup(user)")
      .row.q-mt-md.q-mb-lx.justify-center
        q-btn.q-mt-md.q-px-auto(style="width:100%" color="primary" @click="signup(user)") Signup

      .row.justify-center
        p.q-mt-md
          a.text-blue-3(href="#" @click.stop="toggleLogin()") Already have an account?

</template>

<script>

//  module.exports = {
export default {
  store: ['auth', 'messages'],
  data: function () {
    return {
      showing: 'login',
      accountTitle: 'Login',
      errorsSummary: '',
      error: null,
      authCode: '',
      user: {
        email: 'Admin@MyApp.com',
        name: '',
        password: 'AdminMyAppCom',
        newPassword: null,
        newEmail: null,
        strategy: 'local'
      }
    }
  },

  created: function () {
  },

  computed: {
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
    login: async function (user) {
      // Show modal while logging in
      this.$q.loading.show({ message: 'Logging in...' })

      // Authenticate
      const [err, result] = await to(auth.login(user))

      // Remove modal
      this.$q.loading.hide()

      if (result) {
        this.$store.currentUser = _.get(this, 'auth.currentUser')
        if (!this.isVerified) {
          if (this.$route.path.includes('verify-account')) {
            auth.verifySignUp(this.$route.params.slug)
          }
        }
        this.$router.push({ path: '/Main', history: false })
      }
    },
    signup: async function (user) {
      // Validate user data
      const valid = await checkValid(user, 'users')
console.log(`login.vue signup(1): user='${JSON.stringify(user)}', valid='${JSON.stringify(valid)}'`)
      if (valid) {
        this.errorsSummary = ''

        // Show modal while logging in
        this.$q.loading.show({ message: 'Please wait while we prepare your account...' })

        // Authenticate
        const result = await auth.signup(user)

        // Remove modal
        this.$q.loading.hide()

        // Is successful, show the page for entering authorisation code
        if (result) {
          this.$router.push({ path: '/Main', history: false })
        } else {
          this.errorsSummary = _.map(user.errors, err => err).join('<br>')
        }
      }
    },

    toggleLogin: function () {
      if (this.showing === 'login') {
        this.showing = 'signup'
        this.accountTitle = 'Sign Up'
      } else {
        this.showing = 'login'
        this.accountTitle = 'Login'
      }
    }
  },
  mounted: function () {
  }
}
</script>

<style lang="stylus">
  .login-form-container {
    max-width: 350px;
    margin-right: auto;
    margin-left: auto;
    box-shadow: 5px 5px 17px -8px rgba(0,0,0,0.66);
    font-family: sans-serif;
    border-radius: 3px;
    font-size: 1.2em;
  }
  .login-form-header {
    position: relative;
    padding: 1em;
    border-bottom: 1px solid black;
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
    background-color: #34495e;
    z-index: 3;
  }
  .login-form-title {
    color: #EBEBEB;
    font-size: 1.5em;
  }
  .login-form-add-account-button {
    position: absolute;
    top: 100%;
    right: 10%;
    background-color: #3498db;
    transform: translateY(-50%);
    border-radius: 10em;
    width: 3.5em;
    height: 3.5em;
    color: #EBEBEB;
    box-shadow: 5px 5px 17px -8px rgba(0,0,0,0.66);
    z-index: 3em;
  }
  .login-form-back-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0%;
    font-size: 2em;
    color: #EBEBEB;
    padding: 1em;
    cursor: pointer;
  }
  .login-form-body {
    padding: 1em;
  }
  .login-form-group {
    position: relative;
  }
  .login-form-input {
    border: none;
    outline: none;
    border-bottom: 1px solid #EBEBEB;
    padding: 0.5em;
    width: 100%;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    box-sizing: border-box;
    padding-left: 2em;
    font-size: 1.1em;
  }
  .login-form-icon {
    position: absolute;
    left: 0.5em;
    top: 50%;
    font-size: 1.2em;
    color: #3498db;
    transform: translateY(-50%);
  }
  .login-form-warning-text {
    color: grey;
    text-align: center;
    margin-top: 0.5em;
    padding: 0 0.5em;
  }
  .login-form-third-column {
    border-radius: 10em;
    display: inline-block;
    width: 33.33%;
    margin-right: -0.25em;
    position: relative;
  }
  .login-form-social-logins {
    margin-top: 1.25em;
    margin-bottom: 0.5em;
  }
  .login-form-social-login-icon {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    color: #EBEBEB;
    border-radius: 10em;
    font-size: 1.5em;
    width: 2.2em;
    height: 2.2em;
    box-sizing: border-box;
    cursor: pointer;
  }
  .login-form-social-login-icon i,
  .login-form-add-account-button i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .login-form-google-icon {
    background-color: #DE4B39;
  }
  .login-form-facebook-icon {
    background-color: #3A569B;
  }
  .login-form-twitter-icon {
    background-color: #50ABF1;
  }
  .login-form-login-button,
  .login-form-change-email-btn,
  .login-form-change-password-btn,
  .login-form-reset-password-btn {
    background-color: #3498db;
    color: #EBEBEB;
    padding: 1em;
    margin: 0.5em;
    margin-top: 0.75em;
    box-sizing: border-box;
    border-radius: 3px;
    text-align: center;
    text-transform: uppercase;
    cursor: pointer;
  }
  .login-form-forgot-password {
    text-align: center;
    color: grey;
    padding: 0.5em;
    margin-top: 0.5em;
    box-sizing: border-box;
    position: relative;
    cursor: pointer;
  }
  .login-form-forgot-password:hover:after {
    position: absolute;
    top: 110%;
    left: 0;
    right: 0;
    content: "\a0";
    display: block;
    margin: 0 4em;
    border-top: 2px solid #EBEBEB;
  }
  .login-form-add-account-button:hover,
  .login-form-login-button:hover {
    background-color: #2980b9;
    cursor: pointer;
  }
</style>
