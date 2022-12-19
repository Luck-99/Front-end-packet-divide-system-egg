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
      config: { TASKACTIONLIST, PROJECTENVSNAME, JENKINSJOBNAME },
    } = app
    const nsp = app.io.of('/')

    const taskListRes = await file.readFile(TASKACTIONLIST)
    const tempList = taskListRes.code > 0 ? JSON.parse(taskListRes.msg) : []
    const dataRes = await file.readFile(PROJECTENVSNAME)
    const tempData = dataRes.code > 0 ? JSON.parse(dataRes.msg) : []
    const obj = {
      id: tempList.length,
      userName: 'admin',
      envName: null,
      action: '成功',
      actionDec: '构建结果',
      buildId: null,
      time: Date.now(),
    }

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
          if (!tempEnv.building) {
            if (res.msg.result === 'SUCCESS') {
              nsp.emit(
                'jenkinsFileDownLoad',
                `${tempEnv.description}${tempEnv.id}`
              )
              tempList.unshift({
                ...obj,
                ...{
                  envName: tempEnv.description,
                  buildId: res?.msg?.id,
                  duration: res?.msg.duration,
                },
              })
            } else {
              tempList.unshift({
                ...obj,
                ...{
                  envName: tempEnv.description,
                  action: '失败',
                  buildId: res?.msg?.id,
                  duration: res?.msg.duration,
                },
              })
            }
            file.writeFile(TASKACTIONLIST, tempList)
          }
        }
        envData.push(tempEnv)
      }
      file.writeFile(PROJECTENVSNAME, envData)
      nsp.emit('jenkinsAllJobs', JSON.stringify(envData))
    }
  },
}
