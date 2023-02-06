'use strict'

const Controller = require('./base_controller')
const path = require('path')

class FileController extends Controller {
  async readFile() {
    const {
      service: { file },
    } = this
    const fileName = '1.json'
    const data = await file.readFile(fileName)
    if (data) {
      this.success('读取文件成功', JSON.parse(data))
    } else {
      this.failed('文件读取失败')
    }
  }

  async writeFile() {
    const {
      ctx: { request },
      service: { file },
    } = this
    const { data = '{}' } = request.body
    const fileName = '1.json'
    //因为写入成功返回undefined，所以这里返回err
    const err = await file.writeFile(fileName, data)
    if (!err) {
      this.success('写入文件成功', data)
    } else {
      this.failed('文件写入失败', err)
    }
  }

  async getProjects() {
    const {
      service: { file },
      config: { PROJECTENVSNAME },
    } = this
    const data = await file.readFile(PROJECTENVSNAME)
    if (this.isSuccess(data)) {
      this.success('获取项目成功', JSON.parse(this.getMsg(data)))
    } else {
      this.failed('获取项目失败', {})
    }
  }

  async writeEnv() {
    const {
      ctx: { request },
      service: { file },
      config: { PROJECTENVSNAME, GITPATH },
    } = this
    const { depData = '{}', envName } = request.body
    const userName = await this.getCurrentName()
    const cloneGit = await file.cloneGit(GITPATH)
    if (this.isSuccess(cloneGit)) {
      const changeEnv = await file.changeEnv(envName, depData)
      const commitGit = await file.commitGit(userName, envName)
      if (this.isSuccess(changeEnv) && this.isSuccess(commitGit)) {
        this.recordActions(
          envName,
          userName,
          await this.translateEnv(envName),
          '配置更改'
        )
        return this.success('更改配置成功')
      } else {
        return this.failed(
          this.getMsg(changeEnv) ?? this.getMsg(commitGit),
          '更改配置失败'
        )
      }
    } else {
      this.failed('git clone 失败', cloneGit)
    }
  }

  async getEnvDeps() {
    const {
      ctx: { query },
      service: { file },
      config: { GITFILEPATH },
    } = this
    const { key } = query
    const tempData = await file.readFile(path.join(GITFILEPATH, `${key}.json`))
    if (this.isSuccess(tempData) && typeof this.getMsg(tempData) === 'string') {
      const tempEnv = JSON.parse(this.getMsg(tempData))
      this.success('获取配置成功', tempEnv.dependencies)
    } else {
      this.failed('获取配置失败')
    }
  }

  async getActionRecordList() {
    const {
      service: { file },
      config: { TASKACTIONLIST },
    } = this
    const dataRes = await file.readFile(TASKACTIONLIST)
    if (this.isSuccess(dataRes)) {
      this.success('获取成功', JSON.parse(this.getMsg(dataRes)))
    } else {
      this.failed('获取失败')
    }
  }

  async environmentSetting() {
    const {
      ctx: { query },
      service: { file },
    } = this
    const { envKey, isLeave = false } = query
    const userInfo = await this.getCurrentUser()
    const res = await file.environmentSetting(envKey, userInfo, isLeave)
    if (this.isSuccess(res)) {
      this.success('成功', this.getMsg(res))
    } else {
      this.failed('失败')
    }
  }

  async buildDevProject() {
    const {
      ctx,
      service: { file },
    } = this
    const { gitUrl } = ctx.request.body
    const cloneRes = await file.cloneGit(gitUrl)
    const installRes = await file.installDep(gitUrl)
    const versionRes = await file.versionUpdate(gitUrl)
    const buildRes = await file.buildProject(gitUrl)
    let publishRes = await file.publishProject(gitUrl)
    if (this.isSuccess(cloneRes) && this.isSuccess(installRes)) {
      while (!this.isSuccess(publishRes)) {
        await file.versionUpdate(gitUrl)
        await file.buildProject(gitUrl)
        publishRes = await file.publishProject(gitUrl)
      }
      this.success('构建成功')
    } else {
      this.failed(this.getMsg(installRes))
    }
  }
}

module.exports = FileController
