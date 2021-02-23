// 封装好的执行函数和转义函数，防止SQL注入
const { exec, escape } = require('../db/mysql');
// xss过滤器
const xss = require('xss');

/*
文章列表接口
keyword 关键字
page 当前页码
size 每页条数 
*/
const getList = async (keyword, page, size) => {
    let sql = `select * from blogs where 1 = 1 `;
    if (keyword) {
        keyword = escape('%' + keyword + '%');
        sql += ` and title like ${keyword} `;
    }
    sql += ' order by id desc '
    if (page) {
        let startNum = (page - 1) * size
        sql += ` limit ${startNum}, ${size}`
    }
    return await exec(sql);
}

// 文章详情接口，传入id
const getDetail = async (id) => {
    id = escape(id);
    const sql = `select * from blogs where id = ${id}`;
    const rows = await exec(sql);
    return rows[0];
}

// 文章信息接口(相比getList无正文)，可分页
const getInfo = async (page, size, categoryId) => {
    let sql = `select title, createtime, category, id from blogs `;
    if (categoryId) {
        categoryId = escape(categoryId)
        sql += `where category = (select category_name from categories where id = ${categoryId})`
    }
    sql += ` order by createtime desc`;
    if (page) {
        let startNum = (page - 1) * size
        sql += ` limit ${startNum}, ${size}`
    }
    return await exec(sql)
}

// 文章总数
const maxNum = async (keyword) => {
    let sql = `select count(*) from blogs where 1 = 1`;
    if (keyword) {
        keyword = escape('%' + keyword + '%');
        sql += ` and title like ${keyword} `;
    }
    let result = await exec(sql);
    return JSON.stringify(result).split(':')[1].split('}')[0]
}

// 新增文章接口
const newArticle = async (blogData = {}) => {
    let title = xss(blogData.title);
    let content = xss(blogData.content);
    let author = blogData.author;
    let category = blogData.category;
    title = escape(title);
    content = escape(content);
    // 自动获取一个时间戳
    const createTime = Date.now();
    let sql = `
        insert into blogs (title, content, createtime, author, category) 
        values (${title}, ${content}, ${createTime}, '${author}', '${category}');
   `
    const insertData = await exec(sql);
    return {
        id: insertData.insertId
    }
}

// 更新文章接口 
const updateBlog = async (id, blogData = {}) => {
    // id 就是要更新博客的 id
    // blogData 是一个博客对象，包含title,content 属性
    let title = xss(blogData.title);
    title = escape(title)
    let content = xss(blogData.content);
    content = escape(content)
    let category = blogData.category;
    const sql = `
        update blogs set title = ${title}, content = ${content}, category = '${category}'
        where id = ${id}; 
    `;
    const updateData = await exec(sql);
    if (updateData.affectedRows > 0) {
        return true;
    }
    return false;
}

// 删除文章接口
const delBlog = async (id, author) => {
    const sql = `
        delete from blogs where id = ${id} and author = '${author}';
    `;
    const delData = await exec(sql);
    if (delData.affectedRows > 0) {
        return true;
    }
    return false;
}

/* 分类详情接口，默认返回所有分类，
若只需要有文章的分类，带一个'is'参数==1
若需要无文章的分类，带一个'is'参数==0 */
const getCategories = async (is) => {
    escape(is)
    let sql;
    if (is == 1) {
        sql = `select * from categories where category_name in (select category from blogs) `;
    } else if (is == '0'){
        sql = `select * from categories where category_name not in (select category from blogs)`;
    } else {
        sql = `select * from categories where 1 = 1`
    }
    return await exec(sql);
}

// 增加分类接口
const newCategory = async (category_name) => {
    category_name = xss(category_name);
    category_name = escape(category_name);
    const sql = `insert into categories (category_name) values (${category_name})`;
    const data = await exec(sql);
    return {
        id: data.insertId
    }
}

// 删除分类接口 
const deleteCategory = async (id) => {
    id = escape(id);
    // 只能删除无文章的分类
    let checkEmpty = `select id from categories where category_name in (select category from blogs) and id = ${id}`;
    let result = await exec(checkEmpty)
    if (!result[0]) {
        let sql = `delete from categories where id = ${id}`;
        const data = await exec(sql);
        if (data.affectedRows > 0) {
            return true;
        }
    }
    return false;
}

module.exports = {
    getList,
    getDetail,
    newArticle,
    updateBlog,
    delBlog,
    maxNum,
    getCategories,
    getInfo,
    newCategory,
    deleteCategory
}
