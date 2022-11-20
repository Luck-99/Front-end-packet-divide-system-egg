'use strict';

module.exports = options => {
  return async (ctx, next) => {
    if (ctx.session) {
      ctx.session.counter++;
    } else {
      ctx.session.counter = 1;
    }
    await next();// 只有next才会向下运行，否则会停在这里不动
  };
};
