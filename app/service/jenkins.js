'use strict'

const Service = require('egg').Service

class JenkinsService extends Service {
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
      return { code: 1, data }
    } catch (err) {
      console.log(err)
      return { code: -1, err }
    }
  }
}

module.exports = JenkinsService
