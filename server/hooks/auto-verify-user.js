/* eslint-disable no-console */

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => hook => {
  if (!hook.params.provider) { return hook }

  const user = hook.result

  if (user.verifyToken) {
    const auth = hook.app.service('authManagement')
    auth.create({
      action: 'verifySignupLong',
      value: user.verifyToken
    }).then(result => {
      console.info(`*** auto-verify-user: User '${user.name}', '${user.email}' has been verified! result= ` + JSON.stringify(result))
      return hook
    }).catch(err => {
      console.error(`*** auto-verify-user: Error encountered for '${user.name}', '${user.email}', error= ` + JSON.stringify(err))
      return hook
    })
  }

  return hook
}
