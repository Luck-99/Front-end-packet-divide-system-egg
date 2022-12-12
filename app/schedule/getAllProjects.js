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
    const data = await file.readFile(PROJECTENVSNAME)
    const nsp = app.io.of('/')
    nsp.emit('jenkinsAllJobs', data)
  },
}
