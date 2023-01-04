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

  router.get('/', home.index)

  router.post('/login', user.login)
  router.post('/logout', user.logout)
  router.get('/getMembers', user.getMembers)
  router.get('/getUserInfo', user.getUserInfo)

  router.get('/jenkins/getAllJobs', jenkins.getAllJobs)
  router.get('/jenkins/buildJob', jenkins.buildJob)
  router.get('/jenkins/buildWithParameters', jenkins.buildWithParameters)
  router.get('/jenkins/getBuildInfo', jenkins.getBuildInfo)
  router.get('/jenkins/getLastBuildInfo', jenkins.getLastBuildInfo)
  router.get('/jenkins/getQueue', jenkins.getQueue)
  router.get('/jenkins/getJobInfo', jenkins.getJobInfo)
  router.get('/jenkins/downloadFile', jenkins.downloadFile)
  router.get('/jenkins/stopBuildJob', jenkins.stopBuildJob)

  router.get('/verdaccio/getAllPackages', verdaccio.getAllPackages)
  router.get('/verdaccio/getPackageInfo', verdaccio.getPackageInfo)
  router.get('/verdaccio/getPackageReadme', verdaccio.getPackageReadme)

  router.get('/file/readFile', file.readFile)
  router.post('/file/writeFile', file.writeFile)
  router.get('/file/getProjects', file.getProjects)
  router.post('/file/writeEnv', file.writeEnv)
  router.get('/file/getEnvDeps', file.getEnvDeps)
  router.get('/file/getActionRecordList', file.getActionRecordList)

  router.post('/gitlab/getProjects', gitlab.getProjects)
  router.get('/gitlab/getProjectCommits', gitlab.getProjectCommits)
  router.post('/gitlab/getVersionCommits', gitlab.getVersionCommits)

  io.of('/').route('chat', io.controller.chat)
}
