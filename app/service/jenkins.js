'use strict'

const BaseService = require('./base_service')

class JenkinsService extends BaseService {
  async getCrumb() {
    try {
      const { ctx, config } = this
      const { JENKINSURL } = config
      const { data } = await ctx.curl(`${JENKINSURL}/crumbIssuer/api/json`, {
        method: 'GET',
        dataType: 'json',
      })
      return data
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async getBuildInfo(name, id) {
    try {
      const {
        ctx,
        config: { JENKINSURL },
      } = this
      const { data } = await ctx.curl(
        `${JENKINSURL}/job/${name}/${id}/api/json`,
        {
          method: 'GET',
          data: {
            pretty: true,
          },
          dataType: 'json',
        }
      )
      return this.success(data)
    } catch (err) {
      console.log(err)
      return this.failed(err)
    }
  }

  async getQueueInfo(queueId) {
    try {
      const {
        ctx,
        config: { JENKINSURL },
      } = this
      const { data } = await ctx.curl(
        `${JENKINSURL}/queue/item/${queueId}/api/json`,
        {
          method: 'GET',
          dataType: 'json',
        }
      )
      return this.success(data)
    } catch (err) {
      console.log(err)
      return this.failed(err)
    }
  }

  async getBuildLog(buildID) {
    try {
      const {
        ctx,
        config: { JENKINSURL, JENKINSJOBNAME },
      } = this
      const res = await ctx.curl(
        `${JENKINSURL}/job/${JENKINSJOBNAME}/${buildID}/logText/progressiveText`,
        {
          method: 'GET',
          dataType: 'text',
        }
      )
      if (res.status === 200) {
        return this.success(res.data)
      }
      return this.failed(res)
    } catch (err) {
      console.log(err)
      return this.failed(err)
    }
  }
}

module.exports = JenkinsService
