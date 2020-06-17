<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script >

export default {
  name: 'App',
  beforeMount: function () {
    // If we'r not logged in yet - let's og to the login page
    if (!auth.currentUser) {
      this.$router.push({ path: '/Login', history: false })
    }
  }

}
</script>
