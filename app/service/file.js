'use strict';

const Service = require('egg').Service;

const fs = require('fs');
const path = require('path');

class FileService extends Service {
  async readFile(fileName) {
    const {
      config: { FILEPATH },
    } = this;
    try {
      return fs.readFileSync(path.join(FILEPATH, fileName), 'utf8');
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async writeFile(fileName, info = '') {
    const {
      config: { FILEPATH },
    } = this;
    try {
      return fs.writeFileSync(path.join(FILEPATH, fileName), info);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

module.exports = FileService;
