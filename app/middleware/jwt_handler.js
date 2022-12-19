'use strict'

module.exports = (options) => {
  return async function jwtHandler(ctx, next) {
    const token = ctx.request.header.authorization
    if (token) {
      try {
        // 解码token
        const decode = ctx.app.jwt.verify(token, options.secret)
        await next()
        console.log(decode)
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
        msg: '没有token',
      }
      return
    }
  }
}
