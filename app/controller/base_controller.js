'use strict';
const { Controller } = require('egg');

class BaseController extends Controller {
  get user() {
    return this.ctx.session.user;
  }

  success(msg = '成功', data = null) {
    const { ctx } = this;
    ctx.body = {
      code: 1,
      msg,
      data,
    };
    ctx.logger.info('msg', ctx.request.body);
  }

  failed(msg, data = null) {
    this.ctx.body = {
      code: -1,
      msg,
      data,
    };
  }

  notFound(msg = 'not found') {
    this.ctx.throw(404, msg);
  }
}
module.exports = BaseController;
