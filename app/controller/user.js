'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = '<h1>user</h1>';
  }

  async getUsers() {
    const { ctx } = this;
    await new Promise(resolve => {
      setTimeout(() => {
        resolve(ctx.body = '<h1>一些用户</h1>');
      }, 1000);
    });
  }
}
module.exports = UserController;
