'use strict'

const BaseService = require('./base_service')

class UserService extends BaseService {
  async getUser(id) {
    return {
      id,
      name: 'user',
      age: 18,
    }
  }

  async getUserByName(username) {
    try {
      const { app } = this
      const res = await app.mysql.get('user', { username })
      return res
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async initUser() {
    const {
      service: { file },
      config: { USERCONFIGFILE },
    } = this
    if (!(await file.existPath(USERCONFIGFILE))) {
      const user = [
        {
          username: 'admin',
          password: 'admin',
        },
      ]
      file.writeFile(USERCONFIGFILE, user)
    }
  }

  async login(params) {
    try {
      const {
        ctx,
        app,
        service: { file },
        config: { USERCONFIGFILE },
      } = this
      const { username, password } = params
      this.initUser()
      const tempUsers = await file.readFile(USERCONFIGFILE)
      const users = this.isSuccess(tempUsers)
        ? JSON.parse(this.getMsg(tempUsers))
        : []
      const currentUser = users.find((item) => item.username === username)
      if (currentUser && currentUser.password === password) {
        const token = app.jwt.sign(
          {
            username,
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24小时有效
          },
          app.config.jwtHandler.secret
        )
        ctx.session['front-end-packet-system'] = token
        return this.success('登录成功')
      } else {
        return this.failed('账号或密码错误')
      }
    } catch (error) {
      return this.failed(error)
    }
  }
}

module.exports = UserService
