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
      config: { PROJECT_PREFIX },
    } = this
    const {
      packages, // = [
      //   'product-system-product-management',
      //   'product-system-product-overview',
      // ],
    } = request.body
    const MAX_COMMITS_RECORDS = 10 //提交记录限制
    // 需要用来获取项目名称name和项目对应gitlab的id
    const projectsRes = await gitlab.getProjects(packages)
    const tempPackages = packages?.map((pack) => {
      if (!pack.includes(PROJECT_PREFIX)) {
        return `${PROJECT_PREFIX}${pack}`
      }
      return pack
    })
    const versionCommitsRes = await gitlab.getVersionCommits(tempPackages)
    if (this.isSuccess(projectsRes) && this.isSuccess(versionCommitsRes)) {
      const projects = this.getMsg(projectsRes)
      const versionCommits = this.getMsg(versionCommitsRes)
      const projectCommits = []
      const returnData = {}
      for (const project of projects) {
        const { id, name } = project
        const projectCommitsRes = await gitlab.getProjectCommits(id)
        if (this.isSuccess(projectCommitsRes)) {
          //提取出项目名称和提交记录
          projectCommits.push({ name, commits: this.getMsg(projectCommitsRes) })
        }
      }
      /**  算法说明
       * 从所有版本提交记录中遍历，得到项目对象{版本号：提交hash}
       * 遍历本项目所有提交，找到版本和hash对应的记录
       * 如果相同，就把这个记录添加到数组里
       * 如果不相同，就依次加入到上一个版本里(初始length等于0的时候不加入，这时候没有版本)
       */
      for (const projectName in versionCommits) {
        const tempProjects = versionCommits[projectName]
        const gitHeads = Object.values(tempProjects).reverse()
        const versions = Object.keys(tempProjects).reverse()
        const { commits } = projectCommits.find(
          (pro) => pro.name === projectName
        )
        returnData[projectName] = {}
        let projectIndex
        for (const commit of commits) {
          const { created_at, title, message, author_name, committer_name } =
            commit
          const tempCommit = {
            created_at,
            title,
            message,
            author_name,
            committer_name,
          }
          if (gitHeads.includes(commit.id)) {
            projectIndex = gitHeads.findIndex(
              (gitHead) => gitHead === commit.id
            )
            returnData[projectName][versions[projectIndex]] = [tempCommit]
          } else if (
            Object.keys(returnData[projectName]).length !== 0 &&
            returnData[projectName][versions[projectIndex]].length <
              MAX_COMMITS_RECORDS
          ) {
            returnData[projectName][versions[projectIndex]].push(tempCommit)
          }
        }
      }
      this.success('获取成功', returnData)
    } else {
      this.failed(this.getMsg(versionCommitsRes))
    }
  }
}
module.exports = GitlabController
