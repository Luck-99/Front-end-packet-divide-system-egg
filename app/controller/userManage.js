'use strict';


const Controller = require('egg').Controller;

class UserManage extends Controller {
  async addUser() {
    const { ctx } = this;
    const params = {
      userId: 3,
      name: '小白',
      sex: '男',
      age: 20,
      address: '福建',
    };
    const res = await ctx.service.db.addUser(params);
    ctx.body = '新增' + JSON.stringify(res);
  }
  async delUser() {
    const { ctx } = this;
    const id = { userId: 3 };
    const res = await ctx.service.db.delUser(id);
    ctx.body = '删除' + JSON.stringify(res);
  }
  async updateUser() {
    const { ctx } = this;
    const params = {
      name: '小白纸',
      sex: '女',
      age: 30,
      address: '云南',
    };
    const options = {
      where: {
        userId: 3,
      },
    };
    const res = await ctx.service.db.updateUser(params, options);
    if (res) {
      ctx.body = '修改' + JSON.stringify(res);
    } else {
      ctx.body = '修改失败';
    }
  }
  async getUsers() {
    const { ctx } = this;
    const res = await ctx.service.db.getUsers();
    ctx.body = '查询' + JSON.stringify(res);
  }
}
module.exports = UserManage;
