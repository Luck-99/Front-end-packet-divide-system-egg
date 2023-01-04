'use strict'

const Controller = require('./base_controller')

class GitlabController extends Controller {
  async getProjects() {
    const {
      service: { gitlab },
    } = this
    // 需要用来获取name和项目id
    const res = await gitlab.getProjects()
    if (this.isSuccess(res)) {
      this.success('获取项目成功', this.getMsg(res))
    } else {
      this.failed(this.getMsg(res))
    }
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
