'use strict'

const Controller = require('egg').Controller
const fs = require('fs')
const path = require('path')

class HomeController extends Controller {
  async server() {
    const { ctx } = this // render 实现是服务端渲染 vue 组件
    ctx.response.type = 'html'
    ctx.body = fs.readFileSync(
      path.resolve(__dirname, '../public/html/index.html')
    )
  }
}

module.exports = HomeController
