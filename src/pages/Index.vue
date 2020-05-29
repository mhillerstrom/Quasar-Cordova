<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="statics/quasar-logo-full.svg"
    >
    <p style="margin-top: -180px"><font size="+1">- 'cause quality matters!</font></p>
    <q-file class="q-ma-lg" rounded outlined bottom-slots v-model="model" label="Your ID" counter max-files="1">
      <!--
      <template v-slot:before>
        <q-icon name="burst_mode" />
      </template>
      -->
      <template v-slot:append>
        <q-icon v-if="model !== null" name="close" @click.stop="model = null" class="cursor-pointer" />
        <q-icon name="search" @click.stop />
      </template>

      <template v-slot:hint>
        Upload picture of your ID
      </template>
    </q-file>

  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data() {
    return {
      model: null
    }
  }
}
</script>
