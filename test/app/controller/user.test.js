'use strict';

const { app } = require('egg-mock/bootstrap');

describe('test/app/controller/user.test.js', () => {
  it('should GET /', () => {
    return app.httpRequest()
      .get('/user')
      .expect('<h1>user</h1>')
      .expect(200);
  });

  it('should GET /', async () => {
    return app.httpRequest()
      .get('/getUsers')
      .expect('<h1>一些用户</h1>')
      .expect(200);
  });
});
