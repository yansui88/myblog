// redis中间件，用于管理员鉴权,已废弃，改用token

const { ErrorModel } = require('../model/resModel');

module.exports = async (ctx, next) => {
    if (ctx.session.username) {
        await next();
        return;
    }
    ctx.body = new ErrorModel('未登录')
}