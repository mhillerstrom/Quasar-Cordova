const mongoose = require('mongoose')
const { Types: { ObjectId } } = mongoose

const isTest = process.env.NODE_ENV === 'test'
const isProd = process.env.NODE_ENV === 'production'

// For development we create the
const adminUser = {
  _id: ObjectId('100000000000000000000001'),
  name: 'Administrator',
  email: 'admin@myapp.com',
  password: 'AdminMyAppCom',
  role: 'admin',
  isVerified: true,
  isEnabled: true
}
const batchUser = {
  _id: ObjectId('100000000000000000000002'),
  name: 'Batch',
  email: 'batch@myapp.com',
  password: 'BatchMyAppCom',
  role: 'admin',
  isVerified: true,
  isEnabled: true
}

const testUser = {
  name: 'Jimmy the tester',
  email: 'admin@test.com',
  password: 'admin',
  role: 'admin'
}

const users = isTest ? [testUser] : (isProd ? [adminUser, batchUser] : [adminUser, batchUser])

module.exports = users
