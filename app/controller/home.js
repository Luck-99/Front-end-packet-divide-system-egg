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
}

module.exports = HomeController;
