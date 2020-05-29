/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const _ = require('lodash')
const nodemailer = require('nodemailer')

class Service {
  constructor (options) {
    this.options = options || {}
    this.suppressEmail = _.get(options, 'suppressEmail', false) === 'true'
    delete this.options.suppressEmail

    this.transporter = nodemailer.createTransport(this.options)
    this.verifyTransport()
  }

  verifyTransport () {
    const self = this
    // If we have activated the email service, then test the set-up...
    if (!this.suppressEmail) {
      this.transporter.verify(function (error, success) {
        if (error) {
          console.log(error)
          throw new Error('Bad options to emailer, options: ' + JSON.stringify(self.options) + ', error=' + error)
        } else {
          console.log(`email.class: transporter: Service '${self.options.service}' is ready to take our messages!`)
        }
      })
    }
  }

  create (data, params) {
    const self = this
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => self.transporter.sendMail(current)))
    }

    return Promise.resolve(self.transporter.sendMail(data))
  }
}

module.exports = function (options) {
  return new Service(options)
}

module.exports.Service = Service
