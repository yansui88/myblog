const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
// 使用session
const session = require('koa-generic-session');
// 用redis存储session
const redisStore = require('koa-redis');
// CORS跨域
const cors = require('koa2-cors');
const path = require('path');
const fs = require('fs');
// 日志
const morgan = require('koa-morgan');

// token认证
const koaJwt = require('koa-jwt')
const key = 'key'

// user 和 blog路由
const user = require('./routes/user');
const blog = require('./routes/blog');

// error handler
onerror(app)

app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
// 跨域
app.use(cors({
  credentials: true,
  origin: 'http://yoursite.com'
}));
app.use(logger())
// 计算响应时间
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

const ENV = process.env.NODE_ENV;
if (ENV !== 'production') {
  // 开发环境
  app.use(morgan('dev'));
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log');
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  });
  app.use(morgan('combined', {
    stream: writeStream
  }))
}

// Session 配置
// 密钥
app.keys = ['tooyoungtoosimple'];
app.use(session({
  // 配置Cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  },
  // 配置redis
  store: redisStore({
    host: 'localhost',
    port: 6379,
  })
}))

// koa-jwt 中间件验证token
app.use(koaJwt({ secret: key }).unless({
  // 绕过以下地址
  path: [/^\/api\/user\/login/,
    /^\/api\/user\/captcha/,
    /^\/api\/blog\/list/,
    /^\/api\/blog\/detail/,
    /^\/api\/blog\/info/,
    /^\/api\/blog\/categories/,
  ]
}));

// routes
app.use(user.routes(), user.allowedMethods());
app.use(blog.routes(), blog.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
