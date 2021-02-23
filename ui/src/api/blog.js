// 该文件定义 有关文章 /api/blog 下的接口

import axios from './axios'

/* 
文章列表接口
List.vue
Main.vue
 */
async function getList(page = 1, size = 3, keyword = '') {
    const res = await axios.get('api/blog/list', {
        params: {
            page: page,
            size: size,
            keyword: keyword
        }
    });
    if (res.errno == 0) {
        return res
    }
    return Promise.reject(`未找到关键字为 ${keyword} 的结果`)
}

/* 
文章详情接口
Archives.vue
Category.vue
Detail.vue
Main.vue
SetCategory.vue
 */
async function getDetail(id) {
    const res = await axios.get('/api/blog/detail', {
        params: {
            id: id
        }
    });
    if (res.errno == 0) {
        return res
    }
    return Promise.reject(res.message)
}

/* 
文章信息接口(相比getList无正文)，可分页
Archives.vue
SetCategory.vue
 */
async function getInfo() {
    const res = await axios.get('/api/blog/info', {
        params: {
            page: 1,
            size: 999
        }
    })
    if (res.errno == 0) {
        return res
    }
    return Promise.reject(res.message)
}

/* 分类详情接口，默认返回所有分类，
若只需要有文章的分类，带一个'is'参数==1
若需要无文章的分类，带一个'is'参数==0 
Categories.vue
SetCategory.vue
*/
async function getCategories(is) {
    const res = await axios.get('/api/blog/categories', {
        params: {
            is: is
        }
    })
    return res;
}

/* 
新增文章接口
New.vue
 */
async function newArticle(title, content, category) {
    const res = await axios.post('/api/blog/new', {
        title: title,
        content: content,
        category: category
    });
    if (res.errno == 0) {
        return '新建文章成功!'
    }
    return Promise.reject('新建失败!');
}

/* 
更新文章接口 
Main.vue
*/
async function updateArticle(title, content, category, id) {
    const res = await axios.post(`/api/blog/update?id=${id}`, {
        title: title,
        content: content,
        category: category
    });
    if (res.errno == 0) {
        return '修改成功!'
    }
    return Promise.reject('修改失败!')
}

/* 
删除文章接口
Main.vue
*/
async function deleteArticle(id) {
    const res = await axios.post('/api/blog/del', {
        id: id
    });
    if (res.errno == 0) {
        return '删除成功!'
    }
    return Promise.reject('删除失败!')
}

/* 
增加分类接口
SetCategory.vue
 */
async function newCategory(name) {
    const res = await axios.post('/api/blog/add/category', {
        name: name
    });
    if (res.errno == 0) {
        return '添加分类成功'
    }
    return Promise.reject('添加分类失败!')

}

/* 
删除分类接口 
SetCategory.vue
*/
async function deleteCategory(id) {
    const res = await axios.post('/api/blog/del/category', {
        id: id
    })
    if (res.errno == 0) {
        return '删除分类成功!'
    }
    return Promise.reject('删除分类失败!');
}

export {
    getList,
    getDetail,
    getInfo,
    getCategories,
    newArticle,
    updateArticle,
    deleteArticle,
    newCategory,
    deleteCategory
}
