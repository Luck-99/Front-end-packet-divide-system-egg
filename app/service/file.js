'use strict'

const BaseService = require('./base_service')

const fs = require('fs')
const path = require('path')

const { execSync } = require('child_process')

class FileService extends BaseService {
  async readFile(fileName) {
    const {
      config: { FILEPATH },
    } = this
    try {
      return this.success(
        fs.readFileSync(path.join(FILEPATH, fileName), 'utf8')
      )
    } catch (error) {
      console.log(error)
      return this.failed(error)
    }
  }

  async writeFile(fileName, info = '') {
    const {
      config: { FILEPATH },
    } = this
    try {
      if (typeof info === 'object') {
        return this.success(
          fs.writeFileSync(
            path.join(FILEPATH, fileName),
            JSON.stringify(info, null, 2)
          )
        )
      }
      return this.success(fs.writeFileSync(path.join(FILEPATH, fileName), info))
    } catch (error) {
      console.log(error)
      return this.failed(error)
    }
  }

  async existGitPath() {
    const {
      config: { FILEPATH, GITFILEPATH },
    } = this
    return fs.existsSync(path.join(FILEPATH, GITFILEPATH))
  }

  async modifyProjectEnvs(env, infoObj) {
    const {
      config: { PROJECTENVSNAME },
    } = this
    const projectRes = await this.readFile(PROJECTENVSNAME)
    const tempEnvData = projectRes.code > 0 ? JSON.parse(projectRes.msg) : []
    if (tempEnvData instanceof Array && infoObj instanceof Object) {
      const index = tempEnvData.findIndex((item) => item.key === env)
      tempEnvData[index] = {
        ...tempEnvData[index],
        ...infoObj,
      }
      return await this.writeFile(PROJECTENVSNAME, JSON.stringify(tempEnvData))
    } else {
      return this.failed('数据错误')
    }
  }

  async cloneGit() {
    const {
      config: { FILEPATH, GITPATH, GITFILEPATH },
    } = this
    try {
      if (await this.existGitPath()) {
        execSync('git pull', {
          cwd: path.join(FILEPATH, GITFILEPATH),
          encoding: 'utf-8',
        })
      } else {
        execSync(`git clone ${GITPATH}`, {
          cwd: FILEPATH,
          encoding: 'utf-8',
        })
      }
      return this.success()
    } catch (error) {
      console.log(error)
      return this.failed(error.stdout)
    }
  }

  async commitGit(userName, envName) {
    const {
      config: { FILEPATH, GITFILEPATH, GITPATH },
    } = this
    try {
      if (await this.existGitPath()) {
        execSync(`git commit -am "refactor:${userName} 更新了 ${envName}"`, {
          cwd: path.join(FILEPATH, GITFILEPATH),
          encoding: 'utf-8',
        })
        execSync(`git push`, {
          cwd: path.join(FILEPATH, GITFILEPATH),
          encoding: 'utf-8',
        })
        this.modifyProjectEnvs(envName, {
          updateBy: userName,
          updateTime: Date.now(),
        })
        return this.success('提交到git成功')
      }
    } catch (error) {
      console.log(error)
      return this.failed(error.stdout)
    }
  }

  async changeEnv(envName, devData) {
    const {
      config: { FILEPATH, GITFILEPATH },
    } = this
    const envPath = path.join(GITFILEPATH, `${envName}.json`)
    const existPath = fs.existsSync(path.join(FILEPATH, envPath))
    if (existPath) {
      const envFileRes = await this.readFile(envPath)
      if (envFileRes.code > 0) {
        const tempEnvData = JSON.parse(envFileRes.msg)
        if (!tempEnvData.dependencies) {
          tempEnvData.dependencies = {}
        }
        if (typeof devData === 'string') {
          tempEnvData.dependencies = {
            ...tempEnvData.dependencies,
            ...JSON.parse(devData),
          }
        } else if (typeof devData === 'object') {
          tempEnvData.dependencies = {
            ...tempEnvData.dependencies,
            ...devData,
          }
        }
        await this.writeFile(envPath, JSON.stringify(tempEnvData))
        return this.success(null)
      }
    }
    return this.failed('地址不存在')
  }
}

module.exports = FileService
