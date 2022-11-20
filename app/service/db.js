'use strict';

const Service = require('egg').Service;
class dbService extends Service {
  async addUser(params) {
    try {
      const { app } = this;
      const res = await app.mysql.insert('students', params);
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async delUser(id) {
    try {
      const { app } = this;
      const res = await app.mysql.delete('students', id);
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async updateUser(params, options) {
    try {
      const { app } = this;
      const res = await app.mysql.update('students', params, options);
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getUsers() {
    try {
      const { app } = this;
      const res = await app.mysql.select('students');
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
module.exports = dbService;
