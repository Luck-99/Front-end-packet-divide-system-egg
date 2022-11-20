'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hello, egg';
  }

  async xz() {
    const { ctx } = this;
    ctx.body = '<h1>hello</h1>';
  }

  async testGetUser() {
    const { ctx } = this;
    const { id } = ctx.query;
    const res = await ctx.service.user.getUser(id);
    ctx.body = res;
  }
}

module.exports = HomeController;
