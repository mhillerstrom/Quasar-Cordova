// roles-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const validatePattern = require('../utils/validate-pattern')
const sitePermissions = require('../../config/sitePermissions')

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const roles = new mongooseClient.Schema({
    role: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: validatePattern('isTitle')
    },
    permissions: [{
      type: String,
      enum: sitePermissions
    }],

    userId: {
      type: mongooseClient.Schema.ObjectId,
      ref: 'users',
      required: true
    }
  }, {
    timestamps: true
  })

  return mongooseClient.model('roles', roles)
}
