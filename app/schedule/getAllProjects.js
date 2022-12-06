'use strict'
const Subscription = require('egg').Subscription

module.exports = {
  schedule: {
    interval: '5s', // 1 分钟间隔
    type: 'all', // 指定所有的 worker 都需要执行
  },
  async task(ctx) {
    const { app, service } = ctx
    const {
      config: { PROJECTENVSNAME },
    } = app
    const data = await service.file.readFile(PROJECTENVSNAME)
    const nsp = app.io.of('/')
    nsp.emit('jenkinsAllJobs', data)
  },
}
