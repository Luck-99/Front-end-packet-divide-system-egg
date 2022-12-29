'use strict'

const BaseService = require('./base_service')

class GitlabService extends BaseService {
  async getProjectCommits(projectID, since, until) {
    try {
      const {
        ctx,
        config: { GITLABAPI, GITLABTOKEN },
      } = this
      const res = await ctx.curl(
        `${GITLABAPI}/projects/${projectID}/repository/commits`,
        {
          method: 'GET',
          data: {
            private_token: GITLABTOKEN,
            ref_name: 'master', //默认分支
            since,
            until,
          },
          dataType: 'json',
        }
      )
      if (res.status === 200) {
        return this.success(res.data)
      } else {
        return this.failed(res?.data?.message ?? '获取失败')
      }
    } catch (error) {
      return this.failed(error.message)
    }
  }
}

module.exports = GitlabService
