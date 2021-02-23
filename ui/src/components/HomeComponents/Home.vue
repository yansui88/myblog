<template>
    <div class="wrapper">
        <a id="title">
            <h1>首页🏠</h1>
        </a>
        <h3>Default page...</h3>
        <a-divider id="divider" />
        <ul id="list">
            <li v-for="(item, index) in list" :key="index" :name="index">
                <router-link :to="{ path: '/detail', query: { id: item.id } }">
                    <a-card
                        size="small"
                        :title="item.title"
                        :loading="loading"
                        class="title"
                        :hoverable="hoverable"
                    >
                        <template #extra>{{
                            createTime(item.createtime)
                        }}</template>
                        <div class="content">
                            <div v-html="item.content.split('</p>')[0]"></div>
                            <div v-html="item.content.split('</p>')[1]"></div>
                        </div>
                    </a-card>
                </router-link>
            </li>
        </ul>
        <a-layout-footer style="text-align: center; padding: 0 !important">
            <a-affix
                :offset-bottom="bottom"
                :style="{ backgroundColor: 'white' }"
            >
                <a-pagination
                    id="pagination"
                    @change="onChange"
                    v-model:current="page"
                    :total="total"
                    v-model:pageSize="size"
                />
            </a-affix>
        </a-layout-footer>
    </div>
</template>

<script>
import { getList } from "../../api/blog";
import { message } from "ant-design-vue";
message.config({
    top: `24px`,
    duration: 3,
    maxCount: 1,
});
export default {
    data() {
        return {
            size: 3,
            page: 1,
            total: 0,
            loading: true,
            hoverable: true,
            list: [],
            keyword: this.$route.query.keyword || "",
            bottom: 0,
        };
    },
    created() {
        this.getData(this.page, this.size, this.keyword);
    },
    methods: {
        // 加载数据，用于首次加载，翻页，查询关键字
        async getData(page, size, keyword) {
            try {
                let res = await getList(page, size, keyword);
                // 如果有关键字，则弹窗提示
                if (keyword && page == 1) {
                    message.success(`已找到关键字含有 ${this.keyword} 的文章!`);
                }
                this.list = res.data;
                this.page = parseInt(res.message.split(" ")[1]);
                this.total = parseInt(res.message.split(" ")[3]);
                this.loading = false;
            } catch (err) {
                // 若无结果，返回主页
                message.error(err);
                this.keyword = "";
                this.$router.push({
                    path: "/home",
                });
            }
        },
        onChange(page, size) {
            this.getData(page, size, this.keyword);
        },
        createTime(ms) {
            return new Date(parseInt(ms))
                .toLocaleString()
                .replace(/:\d{1,2}$/, " ")
                .split(" ")[0];
        },
    },
    beforeRouteUpdate(to, from, next) {
        // 在当前路由改变，但是该组件被复用时调用
        if (to.query.keyword != from.query.keyword) {
            this.keyword = to.query.keyword;
            this.getData(1, this.size, this.keyword);
        }
        next();
    },
};
</script>

<style lang="scss" scoped>
.wrapper {
    height: 100%;
    position: relative;
    padding: 24px 24px 8px;
    background-color: white;
    h1 {
        font-size: 24px;
        margin-bottom: 0;
    }
    h3 {
        color: gray;
    }
    #divider {
        margin: 12px 0 16px;
    }
    ul {
        padding-left: 0;
        margin: 0 auto;
        li {
            list-style-type: none;
            margin-bottom: 36px;
            .content {
                font-size: 14px !important;
                line-height: 24px;
                font-style: italic;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    .title {
        padding-left: 12px;
    }

    #pagination {
        position: absolute;
        bottom: 0;
        left: 50%;
        background-color: white;
        margin-top: -12px;
        transform: translateX(-50%);
        margin-bottom: 12px;
    }
}
</style>