<template>
  <div class="q-pa-md row items-start q-gutter-md center">
    <div class="text-h6">
      Free template
    </div>
    <div class="text-body2">
      This demonstration app will show you some of the most advanced techniques - and they are all freely available for you to create your killer app!
    </div>

    <q-card
      class="my-card text-white"
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
    >
      <q-card-section>
        <div class="text-h6">Full stack</div>
        <div class="text-subtitle2">Develop server and client together</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <ul>
          <li>Server back-end</li>
          <li>Many clients from same source</li>
            <ul>
              <li>Browser</li>
              <li>Desktop app for Windows and MacOS</li>
              <li>Android</li>
              <li>iOS</li>
            </ul>
        </ul>
      </q-card-section>
    </q-card>

    <q-card
      class="my-card text-white"
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
    >
      <q-card-section>
        <div class="text-h6">Mobile first</div>
        <div class="text-subtitle2">Your app is always ready to serve</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <ul>
          <li>Realtime events when connected</li>
          <li>Realtime like when not connected</li>
          <li>Automatic synchronization of data when connected</li>
          <li>...</li>
        </ul>
      </q-card-section>
    </q-card>

    <q-card
      class="my-card text-white"
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
    >
      <q-card-section>
        <div class="text-h6">Modern tools</div>
        <div class="text-subtitle2">Don't rely on outdated tools</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <ul>
          <li>VueJS for reactive UX</li>
          <li>Quasar for modern styling</li>
          <li>FeathersJS for top-notch back-end development</li>
          <li>MongoDB (or any other) for scalable back-end storage</li>
          <li>Cordova to tap-in to mobile-only functions</li>
        </ul>
      </q-card-section>
    </q-card>

    <div class="text-body2">
      <i>This is a very strong line-up.</i> But, don't take my word for it - try it out! Get your own copy of <a href="https://github.com/mhillerstrom/Quasar-Cordova">Quasar-Cordova</a> today.
    </div>

  </div>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      model: null
    }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>
