/**
 * A helper to find the correct url to connect to socket.io
 * in all environments.
 *
 * 'production' overrules 'development' which shares all parameters but 'url'
 * with (automatic Mocha) 'test'.
 */
import config from '../../../config/default.client'
import productionConfig from '../../../config/production.client'

let correctConfig = config
let url

if (typeof window === 'undefined') {
  let isProd = process.env.NODE_ENV === 'production'
  if (isProd) {
    correctConfig = Object.assign({}, config, productionConfig)
  }

  if (correctConfig.port === 'PORT') {
    correctConfig.port = process.env.PORT
  }

  const port = (correctConfig.port !== 80 || correctConfig.port !== '80') ? ':' + correctConfig.port : ''

  url = `${correctConfig.protocol}://${correctConfig.host}${port}`
} else {
  if (process.env.NODE_ENV === 'test') {
    url = 'http://localhost:3030'
  } else {
    // eslint-disable-next-line no-undef
    const protocol = correctConfig.protocol
    const host = correctConfig.host
    const port = correctConfig.port ? ':' + correctConfig.port : ''

    // url = window.location.origin;
    url = protocol + '://' + host + port
  }
}

console.log(`\n\nStarting at:\t\t${url}\n\n`)

export default url
