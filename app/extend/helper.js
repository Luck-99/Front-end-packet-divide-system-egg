'use strict'
const MD5 = require('./md5')

module.exports = {
  base64Encode(str = '') {
    return new Buffer(str).toString('base64')
  },
  md5(str) {
    const salt = 'front-end-packet-system'
    return MD5(salt + str)
  },
}
