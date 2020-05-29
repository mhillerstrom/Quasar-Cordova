/* eslint-disable no-console */
// Initializes the `email` service on path `/email`
const hooks = require('./email.hooks')
const Mailer = require('./email.class')

module.exports = function (app) {
  // eslint-disable-next-line no-unused-vars
  const paginate = app.get('paginate')

  const smtpOptions = {
    suppressEmail: app.get('SUPPRESS_EMAIL'),
    service: 'gmail',
    auth: {
      // Allowed formats for user:  Donald Duck <dd@disney.com>     or     dd@disney.com
      user: app.get('GMAIL').replace(/^.*</, '').replace(/>.*$/, ''),
      pass: app.get('GMAIL_PASSWORD')
    }
  }

  // Initialize our service with any options it requires
  app.use('/emails', Mailer(smtpOptions))

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('emails')

  service.hooks(hooks)

  if (process.env.SEND_TEST_EMAIL === true || process.env.SEND_TEST_EMAIL === 'true') {
    // Send test email
    // setup email data with unicode symbols
    const mailData = {
      from: process.env.COMPLAINT_EMAIL, // sender address
      to: process.env.COMPLAINT_EMAIL, // list of receivers
      subject: 'Test email from FeathersJS/Cordova/Quasar app', // Subject line
      text: 'Set SEND_TEST_EMAIL=false in configuration file environment-dev.env to avoid this message.', // plain text body
      html: 'Set <b>SEND_TEST_EMAIL=false</b> in configuration file <b>environment-dev.env</b> to avoid this message.' // html body
    }

    // send mail with defined transport object
    service.create(mailData)
      .then(info => console.log('Message sent: to %s with id %s', mailData.to, info.messageId || info.text))
      .catch(err => console.error('Test email failed with err: ' + err))
  }
}
