'use strict'
const { Controller } = require('egg')

class BaseController extends Controller {
  get user() {
    return this.ctx.session.user
  }

  success(msg = '成功', data = null) {
    const { ctx } = this
    ctx.body = {
      code: 1,
      msg,
      data,
    }
    ctx.logger.info('msg', ctx.request.body)
  }

  failed(msg, data = null) {
    this.ctx.body = {
      code: -1,
      msg,
      data,
    }
  }

  notFound(msg = 'not found') {
    this.ctx.throw(404, msg)
  }

  isSuccess(obj) {
    return obj.code > 0
  }

  getMsg(obj) {
    return obj.msg
  }

  async translateEnv(key) {
    const {
      config: { PROJECTENVSNAME },
      service: { file },
    } = this
    const res = await file.readFile(PROJECTENVSNAME)
    if (this.isSuccess(res)) {
      const tempData = JSON.parse(this.getMsg(res))
      const tempObj = tempData.find((item) => item.key === key)
      return tempObj?.description ?? null
    }
  }

  async recordActions(userName, envName, action) {
    const {
      config: { TASKACTIONLIST },
      service: { file },
    } = this
    const taskListRes = await file.readFile(TASKACTIONLIST)
    if (this.isSuccess(taskListRes)) {
      const tempList = JSON.parse(this.getMsg(taskListRes))
      const obj = {
        id: tempList.length,
        userName,
        envName,
        action,
        time: Date.now(),
      }
      tempList.unshift(obj)
      file.writeFile(TASKACTIONLIST, tempList)
    }
  }
}
module.exports = BaseController
