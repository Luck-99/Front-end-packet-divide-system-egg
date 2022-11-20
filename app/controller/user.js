'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async index() {
    const { ctx } = this;
    console.log(ctx.session.counter);
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
    const res = await ctx.service.user.getUser('666');
    // const { name } = ctx.query;
    ctx.body = res;
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

  async addCookie() {
    const { ctx } = this;
    ctx.cookies.set('user', 'user.com', {
      maxAge: 1000 * 10,
      httpOnly: true,
    });
    ctx.session.username = 'username';
    ctx.body = {
      status: 200,
      data: 'cookie add success',
    };
  }
  async delCookie() {
    const { ctx } = this;
    ctx.cookies.set('user', null);
    ctx.session.username = null;
    ctx.body = {
      status: 200,
      data: 'cookie del success',
    };
  }
  async editCookie() {
    const { ctx } = this;
    ctx.cookies.set('user', 'username.com');
    ctx.session.username = 'username.com';
    ctx.body = {
      status: 200,
      data: 'cookie edit success',
    };
  }
  async showCookie() {
    const { ctx } = this;
    const userCookie = ctx.cookies.get('user');
    const username = ctx.session.username;
    console.log(userCookie, username);
    ctx.body = {
      status: 200,
      data: 'cookie show success',
    };
  }

}
module.exports = UserController;
