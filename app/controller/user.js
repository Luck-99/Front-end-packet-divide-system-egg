'use strict'

const Controller = require('./base_controller')

class UserController extends Controller {
  async login() {
    try {
      const {
        ctx,
        app,
        service: { user },
      } = this
      const { username, password } = ctx.request.body
      const res = await user.login({ username, password })
      if (this.isSuccess(res)) {
        this.success(this.getMsg(res), { username })
      } else {
        this.failed(this.getMsg(res))
      }
    } catch (error) {
      this.failed('登录失败')
    }
  }
}
module.exports = UserController
