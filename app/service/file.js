'use strict'

const Service = require('egg').Service

const fs = require('fs')
const path = require('path')

const { execSync } = require('child_process')

class FileService extends Service {
  async readFile(fileName) {
    const {
      config: { FILEPATH },
    } = this
    try {
      return fs.readFileSync(path.join(FILEPATH, fileName), 'utf8')
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async writeFile(fileName, info = '') {
    const {
      config: { FILEPATH },
    } = this
    try {
      return fs.writeFileSync(path.join(FILEPATH, fileName), info)
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async existGitPath() {
    const {
      config: { FILEPATH, GITFILEPATH },
    } = this
    return fs.existsSync(path.join(FILEPATH, GITFILEPATH))
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
      return null
    } catch (error) {
      console.log(error)
      return error.stdout
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
        return null
      }
    } catch (error) {
      console.log(error)
      return error.stdout
    }
  }

  async changeEnv(envName, devData) {
    const {
      config: { FILEPATH, GITFILEPATH },
    } = this
    const envPath = path.join(GITFILEPATH, `${envName}.json`)
    const existPath = fs.existsSync(path.join(FILEPATH, envPath))
    if (existPath) {
      const envFileData = await this.readFile(envPath)
      if (envFileData) {
        const tempEnvData = JSON.parse(envFileData)
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
        return await this.writeFile(envPath, JSON.stringify(tempEnvData))
      }
    }
    return '地址不存在'
  }
}

module.exports = FileService
