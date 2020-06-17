/**
 * A helper to find the correct url to connect to socket.io
 * in all environments.
 *
 * 'production' overrules 'development' which shares all parameters but 'url'
 * with (automatic Mocha) 'test'.
 */
import config from './get.config'

let url = config.url

if (!url) {
  if (config.port === 'PORT') {
    config.port = process.env.PORT
  }

  const port = (config.port !== 80 || config.port !== '80') ? ':' + config.port : ''

  url = `${config.protocol}://${config.host}${port}`
}

console.log(`\n\nStarting at:\t\t${url}\n\n`)

export default url
