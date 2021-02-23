const router = require('koa-router')();
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel');
// 引入svg验证码
const svgCaptcha = require('svg-captcha')

// 生成token
const jwt = require('jsonwebtoken');
const key = 'xQYAE-6ME4(Lr*evZis{*.*03A4QD,(f'

// 前缀,路径以 /api/user 开始
router.prefix('/api/user');

router.get('/captcha', async (ctx) => {
    const captcha = svgCaptcha.create({
        size: 6,  //验证码个数
        fontSize: 50,  //验证码字体大小
        width: 120,  //宽度
        ignoreChars: '0o1i',
        heigth: 36,  //高度
        noise: 10,  // 干扰
        background: '#cc9966'//背景
    });
    // 将验证码保存入 session 中,与点击登录按钮之后,同用户输入的验证码进行比对
    ctx.session.captcha = captcha.text;
    // 指定返回的类型
    ctx.response.type = 'image/svg+xml';
    ctx.body = captcha.data;
})

// 登录接口
router.post('/login', async ctx => {
    const { username, password, captcha } = ctx.request.body;
    // 从session中获取验证码,与登录提交的验证码进行比对
    const sesCaptcha = ctx.session.captcha;
    if (sesCaptcha && sesCaptcha === captcha) {
        const data = await login(username, password);
        if (data.username) {
            const token = jwt.sign({
                id: data.id,
                username: data.username
            }, key, { expiresIn: '14day' })
            return ctx.body = new SuccessModel({ token: token }, '登录成功!');
        }
        ctx.body = new ErrorModel('登录失败!');
    }
    // 验证码错误
    return ctx.body = new ErrorModel('登录失败!');
})

// 登录状态接口,已登录返回 1,未登录返回 0
router.get('/islogin', async ctx => {
    if (!ctx.state.user) {
        return ctx.body = {
            state: 0,
            message: '未登录!'
        }
    }
    return ctx.body = {
        state: 1,
        message: '已登录!',
        token: ctx.state.user
    }
})

module.exports = router;
