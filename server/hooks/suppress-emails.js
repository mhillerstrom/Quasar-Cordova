// If the environment variable SUPPRESS_EMAIL is true we choose not to contact our mail
// provider as we probably also has activated the auto-verify-user hook.
// This hook must be before the send-email-verification hook in the before chain

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return function (hook) {
    // If we should not send emails, we short-circuit the hook chain by defining
    // a hook.result... (works only for before hooks)
    if (hook.app.get('SUPPRESS_EMAIL') === true || hook.app.get('SUPPRESS_EMAIL') === 'true') { hook.result = { text: '** Email suppressed due to configuration.! **' } }

    return hook
  }
}
