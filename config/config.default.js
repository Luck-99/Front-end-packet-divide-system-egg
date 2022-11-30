/* eslint valid-jsdoc: "off" */

'use strict'

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
  config.middleware = ['counter', 'errorHandler']

  config.errorHandler = {
    match: '/',
  }

  const jenkinsConfig = {
    name: '',
    token: '',
    protocol: 'http', //协议
    domain: 'localhost', //域名
    port: '9090', //端口
  }
  const { name, token, protocol, domain, port } = jenkinsConfig

  // add your user config here
  const userConfig = {
    JENKINSJOBNAME: 'product-system-product-management',
    JENKINSURL: `${protocol}://${name}:${token}@${domain}:${port}`,
    VERDACCIOURL: 'http://192.168.183.123:4873/-/verdaccio',
    // myAppName: 'egg',
  }

  // CSRF enable false
  config.security = {
    csrf: {
      enable: false,
    },
  }
  config.session = {
    key: 'my_session',
    httpOnly: true,
    maxAge: 1000 * 60,
    renew: true, // 自动刷新过期时间
  }

  // config.mysql = {
  //   app: true, // 是否挂在到app上
  //   agent: false, // 是否挂到代理上
  //   client: {
  //     host: '127.0.0.1', // 数据库地址
  //     port: '3306', // 端口
  //     user: 'root',
  //     password: '520+zzl.',
  //     database: 'mydatabase',
  //   },
  // };
  config.jwt = {
    secret: 'APEX-Front-end-packet-divide-system',
  }

  return {
    ...config,
    ...userConfig,
  }
}
