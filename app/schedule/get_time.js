'use strict'
const Subscription = require('egg').Subscription

class GetTime extends Subscription {
  static get schedule() {
    return {
      interval: '1000000s', // 3s 间隔
      // cron: '* */3 * * * *',
      type: 'worker', // worker|all
      disable: true,
      // all 类型：每台机器上的每个 worker 都会执行这个定时任务。
      // worker 每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的
    }
  }
  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    // console.log(Date.now());
  }
}
// module.exports = {
//   schedule: {
//     interval: '1m', // 1 分钟间隔
//     type: 'all', // 指定所有的 worker 都需要执行
//   },
//   async task(ctx) {
//     const res = await ctx.curl('http://www.api.com/cache', {
//       dataType: 'json',
//     });
//     ctx.app.cache = res.data;
//   },
// };
module.exports = GetTime

/*
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, optional)
*/
