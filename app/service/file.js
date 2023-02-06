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

  async existPath(filePath) {
    const {
      config: { FILEPATH },
    } = this
    return fs.existsSync(path.join(FILEPATH, filePath))
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
      return await this.writeFile(PROJECTENVSNAME, tempEnvData)
    } else {
      return this.failed('数据错误')
    }
  }

  async cloneGit(GITPATH) {
    const {
      config: { FILEPATH },
    } = this
    try {
      const GITFILEPATH = this.getGitFilePath(GITPATH)
      if (await this.existPath(GITFILEPATH)) {
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
      return this.success('目录拉取成功')
    } catch (error) {
      console.log(error)
      return this.failed(error.stdout)
    }
  }

  async installDep(GITPATH) {
    const {
      config: { FILEPATH },
    } = this
    try {
      const GITFILEPATH = this.getGitFilePath(GITPATH)
      if (await this.existPath(GITFILEPATH)) {
        execSync('npm install --force', {
          cwd: path.join(FILEPATH, GITFILEPATH),
          encoding: 'utf-8',
        })
        return this.success('安装依赖成功')
      } else {
        return this.failed('目录不存在')
      }
    } catch (error) {
      console.log(error)
      return this.failed(error.stdout)
    }
  }

  async versionUpdate(GITPATH) {
    const {
      config: { FILEPATH },
    } = this
    try {
      const GITFILEPATH = this.getGitFilePath(GITPATH)
      if (await this.existPath(GITFILEPATH)) {
        execSync('npm version patch', {
          cwd: path.join(FILEPATH, GITFILEPATH),
          encoding: 'utf-8',
        })
        return this.success('版本号更新成功')
      } else {
        return this.failed('目录不存在')
      }
    } catch (error) {
      console.log(error)
      return this.failed(error.stdout)
    }
  }

  async buildProject(GITPATH) {
    const {
      config: { FILEPATH },
    } = this
    try {
      const GITFILEPATH = this.getGitFilePath(GITPATH)
      if (await this.existPath(GITFILEPATH)) {
        execSync('npm run build', {
          cwd: path.join(FILEPATH, GITFILEPATH),
          encoding: 'utf-8',
        })
        return this.success('构建成功')
      } else {
        return this.failed('目录不存在')
      }
    } catch (error) {
      console.log(error)
      return this.failed(error.stdout)
    }
  }

  async publishProject(GITPATH) {
    const {
      config: { FILEPATH },
    } = this
    try {
      const BUILDFOLDER = 'dist'
      const GITFILEPATH = this.getGitFilePath(GITPATH)
      if (await this.existPath(GITFILEPATH)) {
        execSync('npm publish', {
          cwd: path.join(FILEPATH, GITFILEPATH, BUILDFOLDER),
          encoding: 'utf-8',
        })
        return this.success('发布成功')
      } else {
        return this.failed('目录不存在')
      }
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
      if (await this.existPath(GITFILEPATH)) {
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
          tempEnvData.dependencies = JSON.parse(devData)
        } else if (typeof devData === 'object') {
          tempEnvData.dependencies = devData
        }
        await this.writeFile(envPath, tempEnvData)
        return this.success(null)
      }
    }
    return this.failed('地址不存在')
  }

  async environmentSetting(envKey, userInfo, isLeave = false) {
    try {
      const {
        app: { io },
      } = this
      const { name, username } = userInfo
      let useEnvironmentUserObj = {}
      const fileName = 'useEnvironmentUser.json'
      if (this.existPath(fileName)) {
        const res = await this.readFile(fileName)
        if (this.isSuccess(res)) {
          useEnvironmentUserObj = JSON.parse(
            this.getMsg(res) ? this.getMsg(res) : '{}'
          )
        }
      }
      if (!useEnvironmentUserObj[envKey]) {
        useEnvironmentUserObj[envKey] = []
      }
      const tempObj = {
        entryTime: Date.now(),
        name,
        username,
      }
      if (
        useEnvironmentUserObj[envKey].findIndex(
          (user) => user.username === username
        ) === -1
      ) {
        useEnvironmentUserObj[envKey].push(tempObj)
      }
      if (isLeave) {
        useEnvironmentUserObj[envKey] = useEnvironmentUserObj[envKey].filter(
          (user) => user.username !== username
        )
        io.of('/').emit('leaveEnvironmentSetting', { envKey, name, username })
      }
      this.writeFile(fileName, useEnvironmentUserObj)
      return this.success(useEnvironmentUserObj[envKey])
    } catch (error) {
      console.log(error)
      return this.failed(error.message)
    }
  }
}

module.exports = FileService
