const path = require('path')

const isProd = process.env.NODE_ENV === 'production'
const confFile = path.join(__dirname, '../', 'environment' + (isProd ? '' : '-dev') + '.env')
const dotenv = require('dotenv')
console.log(`confFile='${confFile}', isProd=${isProd}, NODE_ENV='${process.env.NODE_ENV}'`)
dotenv.config({ /* debug: true, */path: confFile })

const favicon = require('serve-favicon')
const compress = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const logger = require('./logger')

const feathers = require('@feathersjs/feathers')
const configuration = require('@feathersjs/configuration')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')

const middleware = require('./middleware')
const services = require('./services')
const seed = require('./seed')
const appHooks = require('./app.hooks')
const channels = require('./channels')

const mongoose = require('./mongoose')

const authentication = require('./authentication')

const api = express(feathers())

// Load app configuration
api.configure(configuration(path.join(__dirname, '..')))

// Enable security, CORS, compression, favicon and body parsing
api.use(cors())
api.use(helmet())
api.use(compress())
api.use(express.json())
api.use(express.urlencoded({ extended: true }))

// Set up Plugins and providers
api.configure(mongoose)
api.configure(express.rest())
api.configure(socketio())

api.configure(authentication)

// Set up our services (see `services/index.js`)
api.configure(services)
// Check if DB have to be seeded...
api.configure(seed)
// Configure other middleware (see `middleware/index.js`)
api.configure(middleware)
// Set up event channels (see channels.js)
api.configure(channels)
api.hooks(appHooks)

// Currently, Feathers is not quite ready to handle sub-apps
// (websockets and authentication) so we comment-out the next lines
// const app = express();
// //app.configure(socketio());
// app.use('/api', api);
const app = api
app.use(favicon(path.join(api.get('public'), 'favicon.ico')))
// Host the public folder
app.use('/', express.static(api.get('public')))

// Configure a middleware for 404s and the error handler
app.use(express.notFound())
app.use(express.errorHandler({ logger }))

app.set('view engine', 'pug')

// if (process.env.NODE_ENV === 'production') {
//   const expressStaticGzip = require("express-static-gzip");
//   app.use('/public', expressStaticGzip(app.get('public')) )
// } else {
//   app.use('/public', express.static(app.get('public')))
// }

global.app = app
global.api = api

module.exports = { app, api }
