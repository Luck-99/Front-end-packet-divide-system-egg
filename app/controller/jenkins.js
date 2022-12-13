'use strict'

const Controller = require('./base_controller')

class JenkinsController extends Controller {
  async getAllJobs() {
    try {
      const { ctx, config } = this
      const { JENKINSURL } = config
      const {
        tree = 'jobs[description,displayName,fullName,buildable,lastBuild[timestamp,result]]',
      } = ctx.query
      const res = await ctx.curl(`${JENKINSURL}/api/json`, {
        method: 'GET',
        data: {
          pretty: true,
          tree,
        },
        dataType: 'json',
      })
      this.success('获取成功', res?.data?.jobs)
    } catch (error) {
      this.failed('获取失败')
      console.log(error)
      return
    }
  }

  async buildJob() {
    try {
      const {
        ctx,
        config: { JENKINSURL, JENKINSJOBNAME },
        service: { jenkins },
      } = this
      const { name = JENKINSJOBNAME } = ctx.query
      const { crumb, crumbRequestField: Field } = await jenkins.getCrumb()

      if (crumb) {
        const { data } = await ctx.curl(`${JENKINSURL}/job/${name}/build`, {
          method: 'POST',
          headers: {
            [Field]: crumb,
          },
          dataType: 'json',
        })
        this.success('构建成功', data)
        return
      }
      this.failed('crumb获取失败')
    } catch (error) {
      console.log(error)
      this.failed('构建失败')
      return
    }
  }

  async buildWithParameters() {
    try {
      const {
        ctx,
        config: { JENKINSURL, JENKINSJOBNAME },
        service: { file, jenkins },
      } = this
      const { name = JENKINSJOBNAME, projectName } = ctx.query
      const { crumb, crumbRequestField: Field } = await jenkins.getCrumb()

      if (crumb) {
        const { data } = await ctx.curl(
          `${JENKINSURL}/job/${name}/buildWithParameters?projectName=${projectName}`,
          {
            method: 'POST',
            headers: {
              [Field]: crumb,
            },
            dataType: 'json',
          }
        )
        if (!data) {
          const lastBuildId = await this.getLastBuildInfo()
          file.modifyProjectEnvs(projectName, {
            builtBy: 'admin',
            lastBuildTime: Date.now(),
            building: true,
            id: lastBuildId === 0 ? 0 : lastBuildId + 1,
          })
          this.success('构建成功', data)
        } else {
          this.failed('构建失败', data.message)
        }
      } else {
        this.failed('crumb获取失败')
      }
    } catch (error) {
      console.log(error)
      this.failed('构建失败')
      return
    }
  }

  async getBuildInfo() {
    const {
      ctx,
      config: { JENKINSJOBNAME },
      service: { jenkins },
    } = this
    const { name = JENKINSJOBNAME, id } = ctx.query
    const res = await jenkins.getBuildInfo(name, id)
    if (res.code > 0) {
      this.success('获取成功', res.data)
    } else {
      this.failed('获取失败', res.error)
    }
  }

  async getLastBuildInfo() {
    try {
      const {
        ctx,
        config: { JENKINSURL, JENKINSJOBNAME },
      } = this
      const { name = JENKINSJOBNAME } = ctx.query
      const { data } = await ctx.curl(
        `${JENKINSURL}/job/${name}/lastBuild/api/json`,
        {
          method: 'GET',
          data: {
            pretty: true,
          },
          dataType: 'json',
        }
      )
      this.success('获取成功', data)
      return data.number
    } catch (error) {
      console.log(error)
      this.failed('获取失败')
      return 0
    }
  }

  async getQueue() {
    try {
      const {
        ctx,
        config: { JENKINSURL, JENKINSJOBNAME },
        service: { jenkins },
      } = this
      const { name = JENKINSJOBNAME, id } = ctx.query
      const { crumb, crumbRequestField: Field } = await jenkins.getCrumb()
      if (crumb) {
        const { data } = await ctx.curl(`${JENKINSURL}/queue/api/json`, {
          method: 'POST',
          headers: {
            [Field]: crumb,
          },
          data: {
            pretty: true,
          },
          dataType: 'json',
        })
        this.success('获取成功', data)
      } else {
        this.failed('crumb获取失败')
      }
    } catch (error) {
      console.log(error)
      this.failed('获取失败')
      return
    }
  }

  async getJobInfo() {
    try {
      const {
        ctx,
        config: { JENKINSURL, JENKINSJOBNAME },
      } = this
      //tree=builds[displayName]{3,5},url[*]
      const { name = JENKINSJOBNAME, tree = '*' } = ctx.query
      const res = await ctx.curl(`${JENKINSURL}/job/${name}/api/json`, {
        method: 'GET',
        data: {
          pretty: true,
          tree,
        },
        dataType: 'json',
      })
      this.success('获取成功', res?.data)
    } catch (error) {
      this.failed('获取失败')
      console.log(error)
      return
    }
  }

  async downloadFile() {
    const {
      ctx,
      config: { JENKINSURL, JENKINSJOBNAME },
    } = this
    const {
      jobName = JENKINSJOBNAME,
      downloadTarget = 'dist',
      fileName = jobName,
    } = ctx.query
    try {
      const url = `${JENKINSURL}/job/${jobName}/ws/${downloadTarget}/*zip*/${fileName}.zip`
      const res = await ctx.curl(url, {
        streaming: true,
      })
      ctx.type = 'zip'
      ctx.body = res.res
    } catch (error) {
      this.failed('下载失败', error)
    }
  }

  async stopBuildJob() {
    const {
      ctx,
      config: { JENKINSURL, JENKINSJOBNAME },
      service: { jenkins },
    } = this
    const { jobName = JENKINSJOBNAME, id } = ctx.query
    try {
      const { crumb, crumbRequestField: Field } = await jenkins.getCrumb()
      if (crumb) {
        const res = await ctx.curl(`${JENKINSURL}/job/${jobName}/${id}/stop`, {
          method: 'POST',
          headers: {
            [Field]: crumb,
          },
          data: {
            pretty: true,
          },
          dataType: 'json',
        })
        if (!res.data) {
          this.success('停止成功')
        } else {
          this.failed(res.data.message)
        }
      } else {
        this.failed('crumb获取失败')
      }
    } catch (error) {
      this.failed('停止失败', error)
      return
    }
  }
}

module.exports = JenkinsController
