/* 该文件定义有关登录
/api/user 下的接口
在组件Login.vue中使用 */
import axios from './axios'

// 验证码接口地址
let captchaSrc = `http://192.168.220.128:8000/api/user/captcha`;

// 登录接口
async function login(data) {
    const res = await axios.post('/api/user/login', {
        username: data.username,
        password: data.password,
        captcha: data.captcha,
    })
    // 根据状态码判断是否登录成功，是0成功，否则失败
    if (res.errno == 0) {
        return Promise.resolve(res ,`登录成功!`)
    }
    return Promise.reject(`登录失败!`)
}

/* 
登录状态接口,已登录返回 1,未登录返回 0 */
async function isLogin() {
    const res = await axios.get('/api/user/islogin')
    if (res.state == 1) {
        return true
    }
    return false
}

export {
    captchaSrc,
    login,
    isLogin
}