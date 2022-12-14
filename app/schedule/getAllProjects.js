'use strict'
const Subscription = require('egg').Subscription

/**
 * 用于获取所有项目信息
 */
module.exports = {
  schedule: {
    interval: '5s', // 1 分钟间隔
    type: 'all', // 指定所有的 worker 都需要执行
  },
  async task(ctx) {
    const {
      app,
      service: { file },
    } = ctx
    const {
      config: { PROJECTENVSNAME },
    } = app
    const dataRes = await file.readFile(PROJECTENVSNAME)
    if (dataRes.code > 0) {
      const nsp = app.io.of('/')
      nsp.emit('jenkinsAllJobs', dataRes.msg)
    }
  },
}
