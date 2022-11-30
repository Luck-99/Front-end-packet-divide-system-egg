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
}

module.exports = JenkinsService
