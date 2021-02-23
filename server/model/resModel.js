// 模型，用于返回数据，标识成功/失败
class BaseModel {
    constructor(data, message) {
        // 可以传对象(data),也可以传字符串(messsage)的兼容方式
        if (typeof data === 'string') {
            this.message = data;
            data = null;
            message = null;
        }
        if (data) {
            this.data = data;
        }
        if (message) {
            this.message = message;
        }
    }
}

// 成功返回代码 0
class SuccessModel extends BaseModel {
    constructor(data, message) {
        super(data, message);
        this.errno = 0;
    }
}

// 失败返回 -1
class ErrorModel extends BaseModel {
    constructor(data, message) {
        super(data, message);
        this.errno = -1;
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}