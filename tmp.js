/* eslint-disable no-console */
const isProd = false
const path = require('path')
const _ = require('lodash')
const pug = require('pug')

const iconPath = './dist/spa/statics/icons/'
const iconName = 'favicon-32x32.png'

  // Here we configure which type of token to use; short are best for mobile apps
  const verifyToken = 'verifyShortToken'
  const resetToken = 'resetShortToken'

  const returnEmail = 'mih@reflectit.dk'

  function getLink (type, hash) {
    return getLinkSub(type, '#/Login/', '/' + hash + '/')
  }

  function getLinkSub (type, sub, hash) {
    const port = ":8080"
    const host = "192.168.1.70"
    let protocol = 'http'
    protocol += '://'
    return `${protocol}${host}${port}/${sub}${type}${hash}`
  }

  function sendEmail (email) {
      console.log(`\nEmail: ${email.html}\n`)
  }

const    notifier = function (type, user, notifierOptions) {
      console.info(`-- Preparing email for ${type}`)
      const emailAccountTemplatesPath = 'server/email-templates/account'
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
            appname: 'MyApp',
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
            appname: 'MyApp',
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
            appname: 'MyApp',
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
            appname: 'MyApp',
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
            appname: 'MyApp',
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
            appname: 'MyApp',
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

notifier('resendVerifySignup',{name:'Michael 007', email:'mih@mi6.com', verifyShortToken: '123456'}, null);
