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
        this.success(this.getMsg(res))
      } else {
        this.failed(this.getMsg(res))
      }
    } catch (error) {
      this.failed('登录失败')
    }
  }

  async logout() {
    const {
      ctx,
      config: { session },
    } = this
    if (ctx.session[session.key]) {
      ctx.session[session.key] = null
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

  async getUserInfo() {
    try {
      const {
        ctx,
        app,
        service: { user },
        config: { session },
      } = this
      const token = ctx.session[session.key]
      const decodeToken = app.jwt.decode(token)
      const { username } = decodeToken
      const userInfo = await user.getUserInfo(username)
      if (this.isSuccess(userInfo)) {
        this.success('获取用户信息成功', this.getMsg(userInfo))
      } else {
        this.failed(this.getMsg(userInfo))
      }
    } catch (error) {
      this.failed(error.message)
    }
  }
}
module.exports = UserController
