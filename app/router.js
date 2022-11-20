'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const counter = app.middleware.counter();
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.get('/xz', controller.home.xz);
  router.get('/testGetUser', controller.home.testGetUser);

  router.get('/user', counter, controller.user.index);
  // router.get('/getUsers', controller.user.getUsers);
  router.get('/getUser', controller.user.getUser);
  router.get('/getUser2/:name/:age', controller.user.getUser2);
  router.post('/addUser', controller.user.addUser);
  router.get('/addCookie', controller.user.addCookie);
  router.get('/delCookie', controller.user.delCookie);
  router.get('/editCookie', controller.user.editCookie);
  router.get('/showCookie', controller.user.showCookie);

  router.get('/addUser', controller.userManage.addUser);
  router.get('/delUser', controller.userManage.delUser);
  router.get('/updateUser', controller.userManage.updateUser);
  router.get('/getUsers', controller.userManage.getUsers);
};
