'use strict'

const BaseService = require('./base_service')

class UserService extends BaseService {
  async initUser() {
    const {
      service: { file },
      config: { USERCONFIGFILE },
    } = this
    if (!(await file.existPath(USERCONFIGFILE))) {
      const user = [
        {
          id: 0,
          username: 'admin',
          password: 'admin',
          name: '管理员',
          avaUrl:
            'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
          creatTime: Date.now(),
          updateTime: Date.now(),
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
      await this.initUser()
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
      return this.failed(error.message)
    }
  }

  async getMembers() {
    const {
      service: { file },
      config: { USERCONFIGFILE },
    } = this
    try {
      const tempUser = await file.readFile(USERCONFIGFILE)
      const user = this.isSuccess(tempUser)
        ? JSON.parse(this.getMsg(tempUser))
        : []
      const tempData = user.map((item) => {
        return {
          id: item.id,
          name: item.name,
          avaUrl: item.avaUrl,
        }
      })
      return this.success(tempData)
    } catch (error) {
      return this.failed(error.message)
    }
  }

  async getUserInfo(username) {
    const {
      service: { file },
      config: { USERCONFIGFILE },
    } = this
    try {
      const tempUser = await file.readFile(USERCONFIGFILE)
      const user = this.isSuccess(tempUser)
        ? JSON.parse(this.getMsg(tempUser))
        : []
      const userInfo = user.find((user) => user.username === username)
      if (userInfo) {
        const { username, avaUrl, name } = userInfo
        return this.success({ username, avaUrl, name })
      }
      return this.failed('未找到此用户')
    } catch (error) {
      return this.failed(error.message)
    }
  }
}

module.exports = UserService
