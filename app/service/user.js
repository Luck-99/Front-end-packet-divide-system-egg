'use strict';

const Service = require('egg').Service;
class UserService extends Service {
  async getUser(id) {
    return {
      id,
      name: 'user',
      age: 18,
    };
  }
  async getUserByName(username) {
    try {
      const { app } = this;
      const res = await app.mysql.get('user', { username });
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = UserService;
