const registration = require('./registration')
const login = require('./login')
const logout = require('./logout')
const curentUser = require('./curentUser')
const updateAvatar = require('./updateAvatar')
const verify = require('./verify')
const repeatedVerify = require('./repeatedVerify')

module.exports = {
  registration,
  login,
  logout,
  curentUser,
  updateAvatar,
  verify,
  repeatedVerify,
}
