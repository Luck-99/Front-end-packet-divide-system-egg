'use strict'

const path = require('path')

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */

module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1650721011656_8991'

  // add your middleware config here
  config.middleware = ['jwtHandler', 'errorHandler']

  config.errorHandler = {
    match: '/',
  }

  config.cluster = {
    //生产端口配置
    listen: {
      path: '',
      port: '7222',
      hostname: '127.0.0.1', // 0.0.0.0
    },
  }

  const jenkinsConfig = {
    name: '',
    token: '',
    protocol: 'http', //协议
    domain: 'localhost', //域名
    port: '9090', //端口
  }
  const { name, token, protocol, domain, port } = jenkinsConfig

  const fileConfig = {
    FILEPATH: path.join(__dirname, '../', 'app/public/files'),
    PROJECTENVSNAME: 'portal-mix/projectEnvs.json',
    GITPATH: 'https://git.apexsoft.com.cn/kangchongguang/portal-mix.git',
    GITFILEPATH: 'portal-mix',
    TASKACTIONLIST: 'taskActionList.json',
    USERCONFIGFILE: 'user.json',
  }
  // add your user config here
  const userConfig = {
    JENKINSJOBNAME: 'product-system-product-management',
    JENKINSURL: `${protocol}://${name}:${token}@${domain}:${port}`,
    VERDACCIOURL: 'http://192.168.183.123:4873/-/verdaccio',
    ...fileConfig,
  }

  // CSRF enable false
  config.security = {
    csrf: {
      enable: false,
    },
  }
  config.session = {
    key: 'front-end-packet-system',
    httpOnly: true,
    encrypt: true,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    renew: true, // 自动刷新过期时间
  }

  config.io = {
    init: {}, // passed to engine.io  内部默认使用 ws 引擎
    namespace: {
      '/': {
        connectionMiddleware: ['auth'],
        packetMiddleware: ['filter'],
      },
      '/example': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
    },
  }

  config.jwtHandler = {
    enable: true,
    secret: 'APEX-Front-end-packet-divide-system',
    ignore: ['/registered', '/login'], // 不需要认证请求
    expiresIn: '3d', //3天过期
  }

  return {
    ...config,
    ...userConfig,
  }
}
