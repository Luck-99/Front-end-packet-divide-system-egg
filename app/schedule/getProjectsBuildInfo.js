'use strict'
const Subscription = require('egg').Subscription

/**
 * 用于获取项目构建信息
 */
module.exports = {
  schedule: {
    interval: '1s', // 1 分钟间隔
    type: 'all', // 指定所有的 worker 都需要执行
  },
  async task(ctx) {
    const {
      app,
      service: { file, jenkins },
    } = ctx
    const {
      config: { PROJECTENVSNAME, JENKINSJOBNAME },
    } = app
    const nsp = app.io.of('/')

    const dataRes = await file.readFile(PROJECTENVSNAME)
    const tempData = dataRes.code > 0 ? JSON.parse(dataRes.msg) : []
    const envData = []
    const hasBuilding = tempData.findIndex((i) => i.building)
    if (hasBuilding > -1) {
      for (let index = 0; index < tempData.length; index++) {
        const env = tempData[index]
        const tempEnv = { ...env }
        const { building, id } = tempEnv
        if (building && id) {
          const res = await jenkins.getBuildInfo(JENKINSJOBNAME, id)
          if (res.code > 0) {
            tempEnv.building = res?.msg?.building ?? tempEnv.building
          }
          if (!tempEnv.building && res.msg.result === 'SUCCESS') {
            nsp.emit(
              'jenkinsFileDownLoad',
              `${tempEnv.description}${tempEnv.id}`
            )
          }
        }
        envData.push(tempEnv)
      }
      file.writeFile(PROJECTENVSNAME, JSON.stringify(envData))
      nsp.emit('jenkinsAllJobs', JSON.stringify(envData))
    }
  },
}
