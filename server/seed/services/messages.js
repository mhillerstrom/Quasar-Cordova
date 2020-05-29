const mongoose = require('mongoose')
const { Types: { ObjectId } } = mongoose

const isProd = process.env.NODE_ENV === 'production'

const testMessage1 = {
  text: 'This test message was inserted into MongoDB at compile time. Remove from "server/seed/services/messages.js"',
  uuid: '0',
  userId: ObjectId('100000000000000000000001')
}

const testMessage2 = {
  text: 'And this was added just to make sure you know we can fetch multiple rows. Remove from "server/seed/services/messages.js"',
  uuid: '1',
  userId: ObjectId('100000000000000000000001')
}

const messages = !isProd ? [testMessage1, testMessage2] : []

module.exports = messages
