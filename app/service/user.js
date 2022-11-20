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
}

module.exports = UserService;
