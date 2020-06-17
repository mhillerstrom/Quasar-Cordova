/**
 * A helper to find the correct config in all environments
 */

const defaultConfig = require('../../../config/default.client')
const productionConfig = require('../../../config/production.client')
const testConfig = require('../../../config/test.client')

let config = defaultConfig

if (typeof window === 'undefined') {
  const isProd = process.env.NODE_ENV === 'production'
  const isTest = process.env.NODE_ENV === 'test'
  if (isProd) {
    config = Object.assign(config, productionConfig)
  }
  if (isTest) {
    config = Object.assign(config, testConfig)
    config.url = 'http://localhost:3030'
  }
}

export default config
