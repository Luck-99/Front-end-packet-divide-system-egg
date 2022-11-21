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
    const base64 = ctx.helper.base64Encode('username');
    console.log(base64);
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


  async login() {
    try {
      const { ctx, app } = this;
      const { username, password } = ctx.request.body;
      // 根据用户名查找对应的id
      const userInfo = await ctx.service.user.getUserByName(username);
      if (!userInfo || !userInfo.id) { // 没找到用户
        console.log(userInfo);
        ctx.body = {
          status: 500,
          desc: '账号不存在',
          data: userInfo,
        };
        return;
      }
      if (userInfo && password !== userInfo.password) { // 用户存在，密码错误
        ctx.body = {
          status: 500,
          desc: '账号密码错误',
          data: null,
        };
        return;
      }
      const token = app.jwt.sign({ id: userInfo.id,
        username: userInfo.username,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24小时有效
      }, app.config.jwt.secret);
      ctx.body = {
        status: 200,
        desc: '登录成功',
        data: { token },
      };
    } catch (error) {
      this.ctx.body = {
        status: 500,
        desc: '登录失败',
        data: null,
      };
    }
  }
}
module.exports = UserController;
