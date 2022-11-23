'use strict';

const Controller = require('./base_controller');

class JenkinsController extends Controller {
  async getAllJob() {
    try {
      const { ctx, config } = this;
      const { JENKINSURL } = config;
      console.log(JENKINSURL);
      const res = await ctx.curl(`${JENKINSURL}http:xxx.com/api`, {
        method: 'get',
      });
      this.success(res);
    } catch (error) {
      this.failed('获取失败');
      console.log(error);
      return;
    }
  }

  async buildJob() {
    try {
      const { ctx, config } = this;
      const { name } = ctx.request.body;
      const { JENKINSURL } = config;
      const crumb = await ctx.service.jenkins.getCrumb();
      if (crumb) {
        const { data } = await ctx.curl(`${JENKINSURL}http:xxx.com${name}/api`, {
          method: 'POST',
          headers: {
            [crumb]: crumb,
          },
        });
        this.success('构建成功', data);
      }
      this.failed('crumb获取失败');
    } catch (error) {
      console.log(error);
      this.failed('构建失败');
      return;
    }
  }
}

module.exports = JenkinsController;
