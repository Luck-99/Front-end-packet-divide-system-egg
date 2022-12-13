'use strict'

const Service = require('egg').Service

class BaseService extends Service {
  success(msg = '成功') {
    return { code: 1, msg }
  }

  failed(msg = '错误') {
    return { code: -1, msg }
  }
}

module.exports = BaseService
