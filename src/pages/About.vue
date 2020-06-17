/* eslint-disable no-trailing-spaces */
<template lang="pug">
  .q-page
    .text-h4.q-my-lg.q-mx-md.text-grey-6.justify-start About
    p.q-mx-md This app is prepared using Quasar {{$q.version}}, Vue {{vueVersion}},
      |  and Cordova 8.1.1 with added power from FeathersJS {{feathersVersion}} and MongoDB.
      |  We have also thrown in Pug and Docker for your optional convenience.
    .q-list.q-ma-md
      .q-item-label.text-grey-8(header) This platform is identified as:
      ul
        li UserAgent: {{$q.platform.userAgent}}
          ul
            li Touch: {{$q.platform.has.touch}}
            li webStorage: {{$q.platform.has.webStorage}}
            li mobile: {{$q.platform.is.mobile === true}}
            li screen: {{$q.screen.width}} x {{$q.screen.height}}
        li OS: {{$q.platform.is.platform}}
    p.q-mx-md ...and the rest is silence...
</template>

<script>
import Vue from 'vue'

export default {
  name: 'About',
  store: [],
  computed: {
    vueVersion () {
      return Vue.version
    },
    feathersVersion () {
      return feathers.version
    }
  },
  data () {
    return {
      model: null
    }
  }
}
</script>
