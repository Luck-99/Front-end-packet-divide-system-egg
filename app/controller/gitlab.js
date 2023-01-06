'use strict'

const Controller = require('./base_controller')

class GitlabController extends Controller {
  async getProjects() {
    const {
      ctx: { request },
      service: { gitlab },
    } = this
    const { projectName } = request.body
    // 需要用来获取name和项目id
    const res = await gitlab.getProjects(projectName)
    if (this.isSuccess(res)) {
      this.success('获取项目成功', this.getMsg(res))
    } else {
      this.failed(this.getMsg(res))
    }
  }

  async getProjectCommits() {
    const {
      ctx: { request },
      service: { gitlab },
    } = this
    const { projectID, since, until } = request.body
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

  async getProjectsCommits() {
    const {
      ctx: { request },
      service: { gitlab },
    } = this
    const MAX_COMMITS_RECORDS = 10 //提交记录限制
    const {
      packages,
      // = [
      //   'product-system-product-management',
      //   'product-system-product-overview',
      // ],
      maxRecords = MAX_COMMITS_RECORDS,
    } = request.body
    const res = await gitlab.getProjectsCommits(packages, maxRecords)
    if (this.isSuccess(res)) {
      this.success('获取成功', this.getMsg(res))
    } else {
      this.failed(this.getMsg(res))
    }
  }
}
module.exports = GitlabController
