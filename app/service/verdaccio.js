'use strict'

const BaseService = require('./base_service')

class VerdaccioService extends BaseService {
  async getPackageInfo(name) {
    const {
      ctx,
      config: { VERDACCIOURL },
    } = this
    const res = await ctx.curl(`${VERDACCIOURL}/sidebar/${name}`, {
      method: 'GET',
      dataType: 'json',
    })
    if (res.status === 200) {
      return this.success(res.data)
    }
    return this.failed(res.data)
  }
}

module.exports = VerdaccioService
