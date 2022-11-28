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
        config: { JENKINSURL },
      } = this
      const { name } = ctx.query
      const { crumb, crumbRequestField: Field } =
        await ctx.service.jenkins.getCrumb()

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

  async getJobInfo() {
    try {
      const {
        ctx,
        config: { JENKINSURL },
      } = this
      //tree=builds[displayName]{3,5},url[*]
      const { name, tree = '*' } = ctx.query
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
}

module.exports = JenkinsController
