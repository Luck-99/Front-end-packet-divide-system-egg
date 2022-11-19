'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = '<h1>user</h1>';
  }
  async getUsers() { // 异步模式
    const { ctx } = this;
    await new Promise(resolve => {
      setTimeout(() => {
        resolve((ctx.body = '<h1>一些用户</h1>'));
      }, 1000);
    });
  }
  async getUser() {
    // 自由传参模式
    const { ctx } = this;
    const { name } = ctx.query;
    ctx.body = '姓名' + name + '所有参数：' + JSON.stringify(ctx.query);
  }
  async getUser2() {
    // 严格传参模式
    const { ctx } = this;
    const { name, age } = ctx.params;
    ctx.body = '姓名:' + name + '年龄:' + age;
  }

  async addUser() { // post方法
    const { ctx } = this;
    ctx.body = {
      status: 200,
      data: ctx.request.body,
    };
  }

}
module.exports = UserController;
