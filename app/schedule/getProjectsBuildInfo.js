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
      service: { file, jenkins, baseService: base },
    } = ctx
    const {
      config: { TASKACTIONLIST, PROJECTENVSNAME, JENKINSJOBNAME },
    } = app
    const nsp = app.io.of('/')

    const dataRes = await file.readFile(PROJECTENVSNAME)
    const tempData = base.isSuccess(dataRes)
      ? JSON.parse(base.getMsg(dataRes))
      : []
    const envData = []
    const hasBuilding = tempData.findIndex((i) => i.building)
    if (hasBuilding > -1) {
      for (let index = 0; index < tempData.length; index++) {
        const env = tempData[index]
        const tempEnv = { ...env }
        const { building, id, queueId, builtBy } = tempEnv
        if (queueId) {
          const queueInfoRes = await jenkins.getQueueInfo(queueId)
          if (base.isSuccess(queueInfoRes)) {
            const number = queueInfoRes.msg?.executable?.number ?? null
            if (number) {
              tempEnv.id = number
              tempEnv.queueId = null
            }
          }
        }
        if (building && id) {
          const res = await jenkins.getBuildInfo(JENKINSJOBNAME, id)
          if (base.isSuccess(res)) {
            const buildInfo = base.getMsg(res)
            tempEnv.building = buildInfo?.building ?? tempEnv.building
            if (!tempEnv.building) {
              const taskListRes = await file.readFile(TASKACTIONLIST)
              const tempList = base.isSuccess(taskListRes)
                ? JSON.parse(base.getMsg(taskListRes))
                : []
              const obj = {
                id: tempList.length,
                userName: builtBy,
                envName: null,
                action: '成功',
                actionDec: '构建结果',
                buildId: null,
                time: Date.now(),
              }
              if (res.msg.result === 'SUCCESS') {
                nsp.emit('jenkinsFileDownLoad', {
                  envName: tempEnv.description,
                  id: tempEnv.id,
                })
                tempList.unshift({
                  ...obj,
                  ...{
                    envName: tempEnv.description,
                    buildId: buildInfo?.id,
                    duration: buildInfo.duration,
                  },
                })
              } else {
                tempList.unshift({
                  ...obj,
                  ...{
                    envName: tempEnv.description,
                    action: '失败',
                    buildId: buildInfo?.id,
                    duration: buildInfo.duration,
                  },
                })
              }
              file.writeFile(TASKACTIONLIST, tempList)
            }
          }
        }
        envData.push(tempEnv)
      }
      file.writeFile(PROJECTENVSNAME, envData)
      nsp.emit('jenkinsAllJobs', JSON.stringify(envData))
    }
  },
}
