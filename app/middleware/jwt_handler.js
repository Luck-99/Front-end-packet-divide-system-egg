'use strict'

module.exports = (options) => {
  return async function jwtHandler(ctx, next) {
    const token = ctx.session[ctx.app.config.session.key]
    if (token) {
      try {
        ctx.app.jwt.verify(token, options.secret)
        await next()
      } catch (error) {
        ctx.status = 401
        ctx.body = {
          code: -1,
          msg: error.message,
        }
        return
      }
    } else {
      ctx.status = 401
      ctx.body = {
        code: -1,
        msg: '没有正确的token',
      }
      return
    }
  }
}
