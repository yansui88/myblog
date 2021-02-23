const router = require('koa-router')();
const {
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
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel');

// 前缀,路径以 /api/blog 开始
router.prefix('/api/blog');

/*
文章列表接口
keyword 关键字
page 当前页码
size 每页条数 
*/
router.get('/list', async ctx => {
    console.log(ctx.state.user)
    const keyword = ctx.query.keyword || '';
    let page = ctx.query.page || 1;
    let size = ctx.query.size || 3;
    // 判断分页是否超出结果数,超出直接返回error
    const max = await maxNum(keyword);
    if (size * (page - 1) > max) {
        ctx.body = new ErrorModel('无法找到你想要的结果!')
        return;
    }
    const listData = await getList(keyword, page, size);
    if (listData.length == 0) {
        ctx.body = new ErrorModel('无结果');
        return;
    }
    // 返回数据以及 当前页码 和 总条数
    ctx.body = new SuccessModel(listData, `currentPage ${page} totalRecords ${max}`);
})

// 文章详情接口,传入id
router.get('/detail', async ctx => {
    const data = await getDetail(ctx.query.id);
    if (data) {
        ctx.body = new SuccessModel(data);
        return;
    }
    ctx.body = new ErrorModel(`没有id为${ctx.query.id}的文章!`)
})

// 文章信息接口(相比getList无正文),可分页
router.get('/info', async ctx => {
    let page = ctx.query.page || 1;
    let size = ctx.query.size || 999;
    let categoryid = ctx.query.categoryid || '';
    const max = await maxNum();
    if (size * (page - 1) > max) {
        ctx.body = new ErrorModel('无法找到你想要的结果!')
        return;
    }
    const listData = await getInfo(page, size, categoryid);
    if (listData.length == 0) {
        ctx.body = new ErrorModel('无结果');
        return;
    }
    ctx.body = new SuccessModel(listData, `currentPage ${page} totalRecords ${max}`);
})

/* 分类详情接口，默认返回所有分类，
若只需要有文章的分类，带一个'is'参数==1
若需要无文章的分类，带一个'is'参数==0 */
router.get('/categories', async ctx => {
    const is = ctx.query.is || '';
    const data = await getCategories(is);
    ctx.body = new SuccessModel(data, data.length);
})

// 新增文章接口,从token中获取author(ctx.state.user.username),添加到ctx.request.body里
router.post('/new', async ctx => {
    ctx.request.body.author = ctx.state.user.username
    const data = await newArticle(ctx.request.body);
    if (data) {
        ctx.body = new SuccessModel(data, '新增文章成功');
    } else {
        ctx.body = new ErrorModel('新增文章失败!');
    }
})

// 删除分类接口,参数传入id
router.post('/del/category', async ctx => {
    const id = ctx.request.body.id;
    const data = await deleteCategory(id);
    if (data) {
        ctx.body = new SuccessModel(data, '删除成功');
    } else {
        ctx.body = new ErrorModel('删除失败!');
    }
})

// 增加分类接口
router.post('/add/category', async ctx => {
    const name = ctx.request.body.name;
    const data = await newCategory(name);
    if (data) {
        ctx.body = new SuccessModel(data, '新增分类成功');
    } else {
        ctx.body = new ErrorModel('新增分类失败!');
    }
})

// 更新文章接口,参数传入id
router.post('/update', async ctx => {
    const val = await updateBlog(ctx.query.id, ctx.request.body);
    if (val) {
        ctx.body = new SuccessModel('更新成功!');
    } else {
        ctx.body = new ErrorModel('更新失败!');
    }
})

// 删除文章接口,body传入id,从ctx.state.user.username中获取author
router.post('/del', async ctx => {
    const author = ctx.state.user.username;
    const id = ctx.request.body.id;
    const val = await delBlog(id, author);
    if (val) {
        ctx.body = new SuccessModel('删除成功!');
    } else {
        ctx.body = new ErrorModel('删除失败!');
    }
})
module.exports = router;