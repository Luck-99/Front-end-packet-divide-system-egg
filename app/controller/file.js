'use strict';

const Controller = require('./base_controller');

class FileController extends Controller {
  async readFile() {
    const {
      service: { file },
    } = this;
    const fileName = '1.json';
    const data = await file.readFile(fileName);
    if (data) {
      this.success('读取文件成功', JSON.parse(data));
    } else {
      this.failed('文件读取失败');
    }
  }

  async writeFile() {
    const {
      ctx: { request },
      service: { file },
    } = this;
    const { data = '{}' } = request.body;
    const fileName = '1.json';
    //因为写入成功返回undefined，所以这里返回err
    const err = await file.writeFile(fileName, data);
    if (!err) {
      this.success('写入文件成功', data);
    } else {
      this.failed('文件写入失败', err);
    }
  }
}

module.exports = FileController;
