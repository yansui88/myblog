const crypto = require('crypto');

// 盐
const SECRET_KEY = `YourSalt`;

// md5散列函数
function md5(content) {
    let md5 = crypto.createHash('md5');
    return md5.update(content).digest('hex');
}

// 加盐，然后做散列
function generatePasswd(password) {
    const str = `password=${password}&key=${SECRET_KEY}`;
    return md5(str);
}

module.exports = {
    generatePasswd
}
