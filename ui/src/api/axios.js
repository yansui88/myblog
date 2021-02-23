import axios from 'axios';

// 根据环境变量区分接口地址
switch (process.env.NODE_ENV) {
    case 'serve':
        axios.defaults.baseURL = 'http://192.168.220.128:8000'
        break;
    case 'build':
        axios.defaults.baseURL = 'http://192.168.220.128:8000'
        break;
    default:
        axios.defaults.baseURL = 'http://192.168.220.128:8000'
}

// 设置超时时间
axios.defaults.timeout = 10000;

// 跨域
axios.defaults.withCredentials = true;

// // 设置请求传递数据的格式
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.transformRequest = data => qs.stringify(data);

// 设置请求拦截器，添加token验证
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    // Bearer后有个空格
    token && (config.headers.common['Authorization'] = 'Bearer ' + token)
    return config;
}, error => {
    return Promise.reject(error);
})

// 响应拦截器
// axios.defaults.validateStatus = status => {
//     // 自定义响应成功HTTP状态码
//     return /^(2|3)\d{2}$/.test(status);
// }

axios.interceptors.response.use(response => {
    // 只返回相应主体中的信息
    return response.data;
}, error => {
    if (error.response) {
        switch (error.response.status) {
            case 401:   // 当前请求需要用户验证(可能是未登录)
                break;
            case 403:   // 服务器理解，但是拒绝执行(可能是token过期)
                break;
            case 404:   // 请求失败
                break;
        }
        return Promise.reject(error.response)
    } else {
        // 断网处理，跳转到断网页面
        if (!window.navigator.onLine) {
            return;
        }
        return Promise.reject(error);
    }
});

export default axios;