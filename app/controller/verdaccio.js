'use strict'

const Controller = require('./base_controller')

class VerdaccioController extends Controller {
  async getAllPackages() {
    try {
      const {
        ctx,
        config: { VERDACCIOURL },
      } = this
      const res = await ctx.curl(`${VERDACCIOURL}/packages`, {
        method: 'GET',
        dataType: 'json',
      })
      this.success('获取成功', res?.data)
    } catch (error) {
      this.failed('获取失败')
      console.log(error)
      return
    }
  }

  async getPackageInfo() {
    try {
      const {
        ctx,
        config: { VERDACCIOURL },
      } = this
      const { name } = ctx.query
      const res = await ctx.curl(`${VERDACCIOURL}/sidebar/${name}`, {
        method: 'GET',
        dataType: 'json',
      })
      this.success('获取成功', res?.data)
    } catch (error) {
      this.failed('获取失败')
      console.log(error)
      return
    }
  }
}

module.exports = VerdaccioController
