'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const {
    router,
    controller: { home, user, jenkins, verdaccio, file, gitlab },
    io,
  } = app

  router.get('index', '/html/*', home.server)
  router.redirect('/', '/html/', 301)

  router.post('/user/login', user.login)
  router.post('/user/logout', user.logout)
  router.get('/user/getMembers', user.getMembers)
  router.get('/user/getUserInfo', user.getUserInfo)
  router.post('/user/changePassWord', user.changePassWord)

  router.get('/jenkins/getAllJobs', jenkins.getAllJobs)
  router.get('/jenkins/buildJob', jenkins.buildJob)
  router.get('/jenkins/buildWithParameters', jenkins.buildWithParameters)
  router.get('/jenkins/getBuildInfo', jenkins.getBuildInfo)
  router.get('/jenkins/getLastBuildInfo', jenkins.getLastBuildInfo)
  router.get('/jenkins/getQueue', jenkins.getQueue)
  router.get('/jenkins/getJobInfo', jenkins.getJobInfo)
  router.get('/jenkins/downloadFile', jenkins.downloadFile)
  router.post('/jenkins/stopBuildJob', jenkins.stopBuildJob)
  router.get('/jenkins/getBuildLog', jenkins.getBuildLog)

  router.get('/verdaccio/getAllPackages', verdaccio.getAllPackages)
  router.get('/verdaccio/getPackageInfo', verdaccio.getPackageInfo)
  router.get('/verdaccio/getPackageReadme', verdaccio.getPackageReadme)

  router.get('/file/readFile', file.readFile)
  router.post('/file/writeFile', file.writeFile)
  router.get('/file/getProjects', file.getProjects)
  router.post('/file/writeEnv', file.writeEnv)
  router.get('/file/getEnvDeps', file.getEnvDeps)
  router.get('/file/getActionRecordList', file.getActionRecordList)
  router.get('/file/environmentSetting', file.environmentSetting)
  router.post('/file/buildDevProject', file.buildDevProject)

  router.post('/gitlab/getProjects', gitlab.getProjects)
  router.post('/gitlab/getProjectCommits', gitlab.getProjectCommits)
  router.post('/gitlab/getVersionCommits', gitlab.getVersionCommits)
  router.post('/gitlab/getProjectsCommits', gitlab.getProjectsCommits)

  io.of('/').route('chat', io.controller.chat)
}
