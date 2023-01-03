'use strict'

const Controller = require('./base_controller')

class GitlabController extends Controller {
  async getProjects() {
    // 需要用来获取name和项目id
    const {
      ctx,
      config: { GITLABAPI, GITLABTOKEN },
    } = this
    const res = await ctx.curl(`${GITLABAPI}/projects`, {
      method: 'GET',
      data: {
        private_token: GITLABTOKEN,
        visibility: 'private', //私有项目
        per_page: 10000,
      },
      dataType: 'json',
    })
    if (res.status === 200) {
      this.success('获取项目成功', res.data)
      return res.data
    } else {
      this.failed('获取失败', res)
    }
    return []
  }

  async getProjectCommits() {
    const {
      ctx: { query },
      service: { gitlab },
    } = this
    const { projectID, since, until } = query
    const res = await gitlab.getProjectCommits(projectID, since, until)
    if (this.isSuccess(res)) {
      //需要用到message(title)、id、committed_date、author_name
      this.success('获取commit成功', this.getMsg(res))
    } else {
      this.failed(this.getMsg(res))
    }
  }

  async getVersionCommits() {
    const {
      ctx: { request },
      service: { gitlab },
    } = this
    const { packages } = request.body
    const res = await gitlab.getVersionCommits(packages)
    if (this.isSuccess(res)) {
      this.success('获取成功', this.getMsg(res))
    } else {
      this.failed(this.getMsg(res))
    }
  }
}
module.exports = GitlabController
