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
};
