// messages-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const messages = new mongooseClient.Schema({
    text: {
      type: String,
      required: true
    },
    uuid: {
      type: String
    },
    userId: {
      type: mongooseClient.Schema.ObjectId,
      ref: 'user',
      required: true
    },
    createdAt: {
      type: Date,
      default: function () {
        return Date.now()
      }
    },
    updatedAt: {
      type: Date,
      default: function () {
        return Date.now()
      }
    }
  })

  return mongooseClient.model('messages', messages)
}
