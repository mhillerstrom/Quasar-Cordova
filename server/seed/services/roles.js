const mongoose = require('mongoose')
const { Types: { ObjectId } } = mongoose
const sitePermissions = require('../../../config/sitePermissions')

const admin = {
  role: 'admin',
  permissions: sitePermissions,
  userId: ObjectId('100000000000000000000001')
}

const basic = {
  role: 'basic',
  permissions: [
    'read'
  ],
  userId: ObjectId('100000000000000000000001')
}

const messageManager = {
  role: 'messageManager',
  permissions: [
    'manageMessages',
    'read'
  ],
  userId: ObjectId('100000000000000000000001')
}
const roleManager = {
  role: 'roleManager',
  permissions: [
    'manageRoles',
    'read'
  ],
  userId: ObjectId('100000000000000000000001')
}
const settingsManager = {
  role: 'settingsManager',
  permissions: [
    'manageSettings',
    'read'
  ],
  userId: ObjectId('100000000000000000000001')
}
const userManager = {
  role: 'userManager',
  permissions: [
    'manageUsers',
    'read'
  ],
  userId: ObjectId('100000000000000000000001')
}

// Additional roles must be entered below between the tags in order to be auto-injected into sitePermissions...

// inject roles
// end inject roles

module.exports = [admin, basic, messageManager, roleManager, settingsManager, userManager
]
