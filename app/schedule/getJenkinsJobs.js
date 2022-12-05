'use strict'
const Subscription = require('egg').Subscription

module.exports = {
  schedule: {
    interval: '5s', // 1 分钟间隔
    type: 'all', // 指定所有的 worker 都需要执行
  },
  async task(ctx) {
    const { app } = ctx
    const {
      config: { JENKINSURL },
    } = app
    const tree = 'jobs[*[*[*]]]'
    const res = await ctx.curl(`${JENKINSURL}/api/json`, {
      method: 'GET',
      data: {
        pretty: true,
        tree,
      },
      dataType: 'json',
    })
    if (res.status === 200) {
      const nsp = app.io.of('/')
      nsp.emit('jenkinsAllJobs', res.data?.jobs)
    }
  },
}
