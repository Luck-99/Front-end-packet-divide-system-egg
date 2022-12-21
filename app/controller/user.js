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
      const userInfo = await user.getUserInfo(username)
      if (this.isSuccess(res) && this.isSuccess(userInfo)) {
        this.success(this.getMsg(res), this.getMsg(userInfo))
      } else {
        this.failed(this.getMsg(res) + this.getMsg(userInfo))
      }
    } catch (error) {
      this.failed('登录失败')
    }
  }

  async logout() {
    const { ctx } = this
    if (ctx.session['front-end-packet-system']) {
      ctx.session['front-end-packet-system'] = null
      this.success('注销成功')
    } else {
      this.failed('未登录')
    }
  }

  async getMembers() {
    const {
      service: { user },
    } = this
    const res = await user.getMembers()
    const msg = this.getMsg(res)
    if (this.isSuccess(res)) {
      this.success('获取成员信息成功', msg)
    } else {
      this.failed(msg)
    }
  }
}
module.exports = UserController
