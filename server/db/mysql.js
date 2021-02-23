const mysql = require('mysql');
// 创建连接对象
const conObj = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'YourPasswd',
    port: '3306',
    database: 'myblog'
});

// 开始连接
conObj.connect();

// SQL执行结果封装为Promise
function exec(sql) {
    const promise = new Promise((resolve, reject) => {
        conObj.query(sql, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
    return promise;
}

module.exports = {
    exec,
    // escape()函数处理SQL注入
    escape: mysql.escape
}
