/* eslint-disable no-console */
const logger = require('./logger')
// eslint-disable-next-line no-unused-vars
const { app, api } = require('./app')
const port = app.get('port')
const server = app.listen(port)

// Now activate the sub-app
// api.setup(server);

/**
 * Format an array of texts in at box (of '*').
 *
 * @param {String[]} txtArr   Array of texts to format
 * @param {Integer} hIndent   Horizontal offset to first character ('*')
 * @param {Integer} hMargin   Horizontal margin to box
 * @param {Integer} vMargin   Vertical margin to box
 */
const logBox = function (txtArr, hIndent = 0, hMargin = 2, vMargin = 1) {
  var nSize = 0
  var text = '\n'

  txtArr.forEach(element => {
    if (element.length > nSize) { nSize = element.length }
  })

  text += ' '.repeat(hIndent)
  text += '*'.repeat(nSize + 2 * hMargin + 2) + '\n'

  for (let i = 0; i < vMargin; i++) { text += ' '.repeat(hIndent) + '*' + ' '.repeat(nSize + 2 * hMargin) + '*\n' }

  txtArr.forEach(element => {
    text += ' '.repeat(hIndent)
    text += '*' + ' '.repeat(hMargin)
    text += element + ' '.repeat(nSize - element.length + hMargin) + '*\n'
  })

  for (let i = 0; i < vMargin; i++) { text += ' '.repeat(hIndent) + '*' + ' '.repeat(nSize + 2 * hMargin) + '*\n' }

  text += ' '.repeat(hIndent)
  text += '*'.repeat(nSize + 2 * hMargin + 2) + '\n\n'

  logger.info(text)
}

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
)

server.on('listening', () => {
  logBox([
    'myApp a Quasar+Cordova+Vue+Feathers application',
    '',
    '  Listening on:',
    `       ${app.get('protocol')}://${app.get('host')}:${port}`,
    `       ${app.get('mongodb')}`,
    '',
    `Started ${new Date().toISOString()}`
  ])
})
