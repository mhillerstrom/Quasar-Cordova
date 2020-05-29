/* eslint-disable no-console */
const isProd = process.env.NODE_ENV === 'production'
const path = require('path')
const _ = require('lodash')
const pug = require('pug')

const iconPath = 'statics/icons/'
const iconName = 'favicon-32x32.png'

module.exports = function (app) {
  // Here we configure which type of token to use; short are best for mobile apps
  const verifyToken = 'verifyShortToken'
  const resetToken = 'resetShortToken'
  const appName = app.get('appName')
  console.error(`appname = ${appName}`)
  const returnEmail = app.get('complaint_email') || process.env.COMPLAINT_EMAIL

  function getLink (type, hash) {
    return getLinkSub(type, '#/Login/', '/' + hash + '/')
  }

  function getLinkSub (type, sub, hash) {
    const port = (app.get('clientPort') === '80' || isProd) ? '' : ':' + app.get('clientPort')
    const host = (app.get('host') === 'HOST') ? 'localhost' : app.get('host')
    let protocol = (app.get('protocol') === 'PROTOCOL') ? 'http' : app.get('protocol')
    protocol += '://'
    return `${protocol}${host}${port}/${sub}${type}${hash}`
  }

  function sendEmail (email) {
    if (app.get('SUPPRESS_EMAIL') === true || app.get('SUPPRESS_EMAIL') === 'true') {
      if (!isProd) {
        console.info('notifier.js sendEmail(): Suppressing email as per configuration')
      }
      return
    }

    const emailService = app.service('emails')
    return emailService.create(email).then(function (result) {
      console.log('Sent email', result)
    }).catch(err => {
      console.error('Error sending email', err)
    })
  }

  return {
    notifier: function (type, user, notifierOptions) {
      console.info(`-- Preparing email for ${type}`)
      const emailAccountTemplatesPath = path.join(app.get('src'), 'email-templates', 'account')
      let templatePath
      let compiledHTML
      let hashLink
      let email

      switch (type) {
        case 'resendVerifySignup': // send another email with link for verifying user's email addr
          hashLink = getLink('verify-account', _.get(user, verifyToken))

          templatePath = path.join(emailAccountTemplatesPath, 'verify-email.pug')

          compiledHTML = pug.compileFile(templatePath)({
            logo: getLinkSub(iconName, iconPath, ''),
            appName,
            name: user.name || user.email,
            hashLink,
            returnEmail
          })

          email = {
            from: process.env.GMAIL,
            to: user.email,
            subject: 'Confirm Signup',
            html: compiledHTML
          }

          return sendEmail(email)

        case 'verifySignup': // inform that user's email is now confirmed
          templatePath = path.join(emailAccountTemplatesPath, 'email-verified.pug')

          compiledHTML = pug.compileFile(templatePath)({
            logo: getLinkSub(iconName, iconPath, ''),
            appName,
            name: user.name || user.email,
            returnEmail
          })

          email = {
            from: process.env.GMAIL,
            to: user.email,
            subject: 'Thank you, your email has been verified',
            html: compiledHTML
          }

          return sendEmail(email)

        case 'sendResetPwd': // inform that user's email is now confirmed
          hashLink = getLink('reset-password', _.get(user, resetToken))

          templatePath = path.join(emailAccountTemplatesPath, 'reset-password.pug')

          compiledHTML = pug.compileFile(templatePath)({
            logo: getLinkSub(iconName, iconPath, ''),
            appName,
            name: user.name || user.email,
            hashLink,
            returnEmail
          })

          email = {
            from: process.env.GMAIL,
            to: user.email,
            subject: 'Reset Password',
            html: compiledHTML
          }

          return sendEmail(email)

        case 'resetPwd': // inform that user's email is now confirmed
          hashLink = getLink('reset-password', _.get(user, resetToken))

          templatePath = path.join(emailAccountTemplatesPath, 'password-was-reset.pug')

          compiledHTML = pug.compileFile(templatePath)({
            logo: getLinkSub(iconName, iconPath, ''),
            appName,
            name: user.name || user.email,
            hashLink,
            returnEmail
          })

          email = {
            from: process.env.GMAIL,
            to: user.email,
            subject: 'Your password was reset',
            html: compiledHTML
          }

          return sendEmail(email)

        case 'passwordChange':
          templatePath = path.join(emailAccountTemplatesPath, 'password-change.pug')

          compiledHTML = pug.compileFile(templatePath)({
            logo: getLinkSub(iconName, iconPath, ''),
            appName,
            name: user.name || user.email,
            returnEmail
          })

          email = {
            from: process.env.GMAIL,
            to: user.email,
            subject: 'Your password was changed',
            html: compiledHTML
          }

          return sendEmail(email)

        case 'identityChange':
          hashLink = getLink('verify-account-changes', _.get(user, verifyToken))

          templatePath = path.join(emailAccountTemplatesPath, 'identity-change.pug')

          compiledHTML = pug.compileFile(templatePath)({
            logo: getLinkSub(iconName, iconPath, ''),
            appName,
            name: user.name || user.email,
            hashLink,
            returnEmail,
            changes: user.verifyChanges
          })

          email = {
            from: process.env.GMAIL,
            to: user.email,
            subject: 'Your account was changed. Please verify the changes',
            html: compiledHTML
          }

          return sendEmail(email)

        default:
          break
      }
    }
  }
}
