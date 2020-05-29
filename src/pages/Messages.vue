<template lang="pug">
div
  .text-h4.q-my-lg.q-mx-md.text-grey-6.justify-start DB Messages
  .q-page.flex
    .q-list.q-mx-md(v-if="isLoggedIn()" style="width:100%")
      .q-item-label.text-grey-8.q-mb-md(header) Got {{messageCount}} {{plural(messageCount,"message","messages")}} from store
      q-scroll-area.bg-grey-1(style="width:100%;height:200px;")
        q-list.reverse-order(bordered separator)
          q-slide-item(
            v-for="message in messages"
            :key="message._id"
            @right="onSlideLeft"
            right-color="grey-12"
            clickable
            @click="showDetails(message);restoreSlide()"
            v-ripple
            style="height:65px"
          )
            template.bg-grey-5(v-slot:right)
              .row.text-align-bottom.items-center
                .col-4.bg-red-6.action-button(@click.stop="onDelete(message._id);restoreSlide()")
                  div.q-mt-lg(align="center" )
                    q-icon(name="delete")
                  div(align="center") Delete
                .col-4.bg-green-6.action-button(@click.stop="onEdit(message._id);restoreSlide()")
                  div.q-mt-lg(align="center" )
                    q-icon(name="edit")
                  div(align="center") Edit
            q-item
              q-item-section
                q-icon(name="sync-disabled")
                q-item-label.message-date(overline) {{dateTime(message.updatedAt)}} by {{message.user.name}}
                q-item-label.message-text.ellipsis-2-lines {{message.text}}

                q-menu(
                  touch-position
                  context-menu
                )
                  q-list(dense style="min-width: 100px")
                    q-item(clickable v-close-popup)
                      q-item-section(@click.stop="onEdit(message._id)") Edit
                    q-item(clickable v-close-popup)
                      q-item-section(@click.stop="onDelete(message._id)") Delete

      q-input.q-ma-md(v-model="text"
              type="text"
              placeholder="Type new message"
              label="Add message"
              @keyup.enter="addMessage(text)"
      )
        template(v-slot:append)
          q-icon.text-primary(name="add_circle" @click="addMessage(text)")
    .q-h5.q-mx-md.q-my-lg.text-grey-6(v-else) You have to login to see messages

    <!-- Modal confirm dialogue -->
    q-dialog(v-model="confirm" persistent)
      q-card
        q-card-section.q-py-sm.bg-red.text-white.text-center.text-h6 Confirm
        q-card-section(class="row items-center")
          span.q-ml-sm Are you sure you want to delete message?

        q-card-actions(align="right")
          q-btn(label="Cancel" color="secondary" v-close-popup @click="onDeleteExcecute(false)")
          q-btn(label="Delete" color="red" v-close-popup @click="onDeleteExcecute(true)")

    <!-- Modal edit dialogue -->
    q-dialog(v-model="edit" persistent)
      q-card(style="width:90%")
        q-card-section.q-py-sm.bg-primary.text-white.text-center.text-h6 Edit message
        q-card-section.row.items-center
          q-input.col(v-model.trim="editMessage.text" type="textarea" cols="80" rows="3" label="Message text" dense clearable autocomplete="true")

        q-card-actions(align="right")
          q-btn(label="Cancel" color="secondary" v-close-popup @click="onEditExcecute(false)")
          q-btn(label="Update" color="primary" v-close-popup @click="onEditExcecute(true)")

    <!-- Modal show details dialogue -->
    q-dialog(v-model="details" persistent)
      q-card(style="width:100%")
        q-card-section.q-py-sm.bg-primary.text-white.text-center.text-h6 Message details
        q-card-section
          .row.lt-md
            .col-1.col-xs-3.text-blue-9 _id:
            .col {{showMessage._id}}
          .row.lt-md
            .col-1.col-xs-3.text-blue-9 uuid:
            .col {{showMessage.uuid}}
          .row.lt-md
            .col-2.col-xs-4.text-blue-9 Text:
          .row.lt-md.q-mb-md
            .col {{showMessage.text}}
          .row.gt-sm
            .col-2.col-xs-4.text-blue-9 Text:
            .col {{showMessage.text}}
          .row
            .col-2.col-xs-4.text-blue-9 Created at:
            .col {{dateTime(showMessage.createdAt)}}
          .row
            .col-6.col-xs-8.q-mt-md.text-blue-9 Last update:
          .row
            .col-2.col-xs-4.text-blue-9 Updated at:
            .col {{dateTime(showMessage.updatedAt)}}
          .row
            .col-2.col-xs-4.text-blue-9 By:
            .col {{showMessage.user.name}} &lt;{{showMessage.user.email}}&gt;

        q-card-actions(align="right")
          q-btn(label="Return" color="primary" v-close-popup @click="details=false")

</template>

<script>
import _ from 'lodash'
import { date } from 'quasar'

const { formatDate } = date

export default {
  name: 'Messages',
  store: ['api', 'auth', 'messages', 'modalConfig'],
  data () {
    return {
      model: null,
      text: '',
      item: null,
      reset: null,
      confirm: false,
      edit: false,
      details: false,
      showMessage: { text: null, _id: null, user: { name: '', email: '' } },
      editMessage: { text: null, _id: null }
    }
  },

  mounted: async function () {
    // We only try to read if the store is empty and we are logged in.
    // Otherwise the store contains the correct information through syncList (see MainLayout.vue)
    if (this.isLoggedIn() && this.messageCount === 0) {
      // eslint-disable-next-line no-unused-vars
      const [err, res] = await api.messages.find({ $sort: { updatedAt: 1 } })
      console.log(`res: ${JSON.stringify(res)}`)
      if (res.data) {
        this.messages = _.keyBy(res.data, '_id')
      } else {
        this.messages = _.keyBy(res, '_id')
      }

      console.log(`this.messages: ${JSON.stringify(this.messages)}`)
    }
  },

  computed: {
    messageCount () {
      return _.size(this.messages)
    }
  },

  methods: {
    isLoggedIn: function () {
      return auth.currentUser !== null
    },
    addMessage: async function (text) {
      if (text === '' || text === null) { return }

      const [err, res] = await api.messages.upsert({ text })
      if (err) {
        notify.error(`addMessage failed with error "${parseErrors(err.error)}"`)
      } else {
        // We do not need to re-read all the messages, as we have set-up liveSync!!!
        this.text = ''
        notify.success('Message added')
        this.messages[res._id] = res
      }
    },

    onSlideLeft ({ reset }) {
      // If another is already open - let's close it
      this.restoreSlide()

      // Remember which slide is open
      this.reset = reset
    },
    restoreSlide () {
      if (typeof this.reset === 'function') {
        this.reset()
      }
      this.reset = null
    },
    onDelete (id) {
      this.item = id
      this.confirm = true
    },
    async onDeleteExcecute (bDelete) {
      if (bDelete) {
        // eslint-disable-next-line no-unused-vars
        const [err, res] = await api.messages.delete({ _id: this.messages[this.item]._id })
        if (err) {
          notify.error(`Error deleting item. error=${parseErrors(err)}`)
        }
      }
      // Note: we do not need to re-read the message data, as this is automatically taken care of
      // through syncList (see MainLayout.vue)
    },
    onEdit (id) {
      this.item = id
      this.editMessage._id = this.messages[id]._id
      this.editMessage.text = this.messages[id].text
      this.edit = true
      console.log(`onEditExec: res=${JSON.stringify(this.editMessage)}`)
    },
    async onEditExcecute (bUpdate) {
      if (bUpdate) {
        // eslint-disable-next-line no-unused-vars
        const [err, res] = await api.messages.upsert(this.editMessage)
        console.log(`onEditExec: res=${JSON.stringify(res)}`)
        // Note: we do not need to re-read the message data, as this is automatically taken care of
        // through syncList (see MainLayout.vue)
        if (err) {
          notify.error(`Error updating item. error=${parseErrors(err)}`)
        }
      }
      this.item = null
      this.editMessage = { text: null, _id: null }
    },
    showDetails (message) {
      this.showMessage = message
      console.log(`message=${JSON.stringify(message)}`)
      this.details = true
    },

    plural (cnt, singular, multiple) {
      return cnt !== 1 ? multiple : singular
    },
    dateTime (ts) {
      return formatDate(ts, 'YYYY-MM-DD HH:mm')
    }

  }

}
</script>

<style lang="scss" scoped>
.reverse-order { /* This can be used for showing messages in reversed order (we fetch in ascending date order) */
  display: flex;
  flex-direction: column-reverse;
}
.message-date {
  margin-top: -15px;
  font-size: 0.7em;
  letter-spacing: 0em;
}
.message-text {
  height:auto;
  margin-bottom: 18px;
}
.action-button {
  height:80px;
  width:80px;
}
</style>
