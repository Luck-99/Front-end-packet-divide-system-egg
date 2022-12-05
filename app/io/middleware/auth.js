'use strict'
// 这个中间件的作用是提示用户连接与断开的，连接成功的消息发送到客户端，断开连接的消息在服务端打印
module.exports = (app) => {
  return async (ctx, next) => {
    ctx.socket.emit('res', '已经成功连接!')
    await next()
    // execute when disconnect.
    console.log('disconnection!')
  }
}
