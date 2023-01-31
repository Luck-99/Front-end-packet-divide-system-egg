'use strict'

const Controller = require('egg').Controller

class HomeController extends Controller {
  async server() {
    const { ctx } = this // render 实现是服务端渲染 vue 组件
    await ctx.render('home.js', { message: 'egg vue server side render' })
  }
  // async client() {
  //   const { ctx } = this
  //   /* - renderClient 前端渲染，Node层只做 layout.html和资源依赖组装，渲染交给前端渲染。 - 与服务端渲染的差别你可以通过查看运行后页面源代码即可明白两者之间的差异 */ await ctx.renderClient(
  //     'home/home.js',
  //     { message: 'egg vue client render render' }
  //   )
  // }
}

module.exports = HomeController
