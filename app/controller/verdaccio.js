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
    const {
      ctx: { query },
      service: { verdaccio },
    } = this
    const { name } = query
    const res = await verdaccio.getPackageInfo(name)
    if (this.isSuccess(res)) {
      this.success('获取成功', this.getMsg(res))
    } else {
      this.failed(this.getMsg(res))
    }
  }

  async getPackageReadme() {
    const {
      ctx,
      config: { VERDACCIOURL },
    } = this
    const { name } = ctx.query
    const res = await ctx.curl(`${VERDACCIOURL}/package/readme/${name}`, {
      method: 'GET',
      // dataType: 'json',
    })
    if (res.status === 200) {
      this.success('获取成功', res.data)
    } else {
      this.failed(res?.data?.message)
    }
  }
}

module.exports = VerdaccioController
