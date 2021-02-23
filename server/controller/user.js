const { exec, escape } = require('../db/mysql');
// 用于处理密码的散列函数
const { generatePasswd } = require('../utils/crpt');

const login = async (username, password) => {
    username = escape(username);
    // 生成散列处理后的密码
    password = generatePasswd(password);
    const sql = `
        select id, username from users where username = ${username} and password = '${password}';
    `
    const rows = await exec(sql);
    return rows[0] || {};
}
module.exports = {
    login
};
