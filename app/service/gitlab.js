'use strict'

const BaseService = require('./base_service')

class GitlabService extends BaseService {
  async getProjects(projectName) {
    // 需要用来获取name和项目id
    const {
      ctx,
      config: { GITLABAPI, GITLABTOKEN, PROJECT_PREFIX },
    } = this
    const res = await ctx.curl(`${GITLABAPI}/projects`, {
      method: 'GET',
      data: {
        private_token: GITLABTOKEN,
        visibility: 'private', //私有项目
        per_page: 10000,
      },
      dataType: 'json',
      timeout: 1000 * 30,
    })
    if (res.status === 200) {
      const tempData = res?.data?.map((item) => {
        const { id, name, readme_url } = item
        return { id, name, readme_url }
      })
      if (projectName && typeof projectName === 'string') {
        return this.success(
          tempData?.filter(
            (pro) =>
              pro.name === projectName ||
              `${PROJECT_PREFIX}${pro.name}` === projectName
          )
        )
      } else if (projectName && projectName instanceof Array) {
        return this.success(
          tempData?.filter(
            (pro) =>
              projectName.includes(pro.name) ||
              projectName.includes(`${PROJECT_PREFIX}${pro.name}`)
          )
        )
      }
      return this.success(tempData)
    } else {
      return this.failed(res?.data?.message ?? '获取失败')
    }
  }

  async getProjectCommits(projectID, since, until, pagesize = 1000) {
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
            per_page: pagesize, //最大条数
          },
          dataType: 'json',
          timeout: 1000 * 20,
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

  async getVersionCommits(packages) {
    try {
      const {
        service: { verdaccio },
        config: { PROJECT_PREFIX },
      } = this
      const requests = []
      for (const item of packages) {
        requests.push(await verdaccio.getPackageInfo(item))
      }
      const packageVersionCommit = {}
      const requestsRes = await Promise.all(requests)
        .then((res) => {
          for (const pack of res) {
            if (this.isSuccess(pack)) {
              const data = this.getMsg(pack)
              const { versions, _id } = data
              const versionData = {}
              for (const [version, packageData] of Object.entries(versions)) {
                const { gitHead } = packageData
                versionData[version] = gitHead
              }
              packageVersionCommit[`${_id}`.replace(PROJECT_PREFIX, '')] =
                versionData
            }
          }
          return this.success(packageVersionCommit)
        })
        .catch((err) => {
          return this.failed(err)
        })
      return requestsRes
    } catch (error) {
      return this.failed(error.message)
    }
  }

  async getProjectsCommits(packages, maxRecords) {
    try {
      const {
        config: { PROJECT_PREFIX },
      } = this
      // 需要用来获取项目名称name和项目对应gitlab的id
      const projectsRes = await this.getProjects(packages)
      const tempPackages = packages?.map((pack) => {
        if (!pack.includes(PROJECT_PREFIX)) {
          return `${PROJECT_PREFIX}${pack}`
        }
        return pack
      })
      const versionCommitsRes = await this.getVersionCommits(tempPackages)
      if (this.isSuccess(projectsRes) && this.isSuccess(versionCommitsRes)) {
        const projects = this.getMsg(projectsRes)
        const versionCommits = this.getMsg(versionCommitsRes)
        const projectCommits = []
        const returnData = {}
        for (const project of projects) {
          const { id, name } = project
          const projectCommitsRes = await this.getProjectCommits(id)
          if (this.isSuccess(projectCommitsRes)) {
            //提取出项目名称和提交记录
            projectCommits.push({
              name,
              commits: this.getMsg(projectCommitsRes),
            })
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
              returnData[projectName][versions[projectIndex]] = [
                { ...tempCommit, index: 1 },
              ]
            } else if (
              Object.keys(returnData[projectName]).length !== 0 &&
              returnData[projectName][versions[projectIndex]].length <
                maxRecords
            ) {
              returnData[projectName][versions[projectIndex]].push({
                ...tempCommit,
                index:
                  returnData[projectName][versions[projectIndex]].length + 1,
              })
            }
          }
        }
        return this.success(returnData)
      } else {
        return this.failed(this.getMsg(versionCommitsRes))
      }
    } catch (error) {
      return this.failed(error.message)
    }
  }
}

module.exports = GitlabService
