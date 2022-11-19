'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.get('/xz', controller.home.xz);
  router.get('/user', controller.user.index);
  router.get('/getUsers', controller.user.getUsers);
  router.get('/getUser', controller.user.getUser);
  router.get('/getUser2/:name/:age', controller.user.getUser2);
  router.post('/addUser', controller.user.addUser);
};
