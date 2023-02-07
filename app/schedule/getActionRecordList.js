'use strict'
const Subscription = require('egg').Subscription

/**
 * 用于获取所有操作动态
 */
module.exports = {
  schedule: {
    interval: '1s', // 1秒间隔
    type: 'worker', // 指定所有的 worker 都需要执行
  },
  async task(ctx) {
    const {
      app: {
        io,
        config: { TASKACTIONLIST },
      },
      service: { file },
    } = ctx
    const dataRes = await file.readFile(TASKACTIONLIST)
    if (dataRes.code > 0) {
      const nsp = io.of('/')
      nsp.emit('actionRecordLists', dataRes.msg)
    }
  },
}
