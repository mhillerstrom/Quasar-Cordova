// index file for server wide hooks

module.exports = {
  // inject hooks
  associateCurrentUser: require('./associate-current-user.js'),
  associateEffectiveUser: require('./associate-effective-user.js'),
  autoVerifyUser: require('./auto-verify-user.js'),
  hasAnyPermission: require('./has-any-permission.js'),
  hasPermissionsBoolean: require('./has-permissions-boolean.js'),
  hasPermissions: require('./has-permissions.js'),
  isEnabled: require('./is-enabled.js'),
  log: require('./log.js'),
  loopItems: require('./loop-items.js'),
  preventDeleteAdmin: require('./prevent-delete-admin.js'),
  preventDisabledAdmin: require('./prevent-disabled-admin.js'),
  sendVerificationEmail: require('./send-verification-email.js'),
  setDefaultRole: require('./set-default-role.js'),
  setFirstUserToRole: require('./set-first-user-to-role.js'),
  suppressEmails: require('./suppress-emails.js')
  // end inject hooks
}
