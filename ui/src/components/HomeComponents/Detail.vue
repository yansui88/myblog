<template>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        title="返回主页"
        sub-title=""
        @back="goHome()"
    />
    <div class="wrapper">
        <div class="title">
            <h1>{{ data.title }}</h1>
            <p class="time">
                <CalendarOutlined />
                {{ createTime(data.createtime) }}
            </p>
        </div>
        <div class="content" v-html="data.content"></div>
    </div>
</template>

<script>
import { message } from "ant-design-vue";
import { getDetail } from "../../api/blog";
import { CalendarOutlined } from "@ant-design/icons-vue";
export default {
    components: {
        CalendarOutlined,
    },
    data() {
        return {
            data: {},
        };
    },
    methods: {
        goHome() {
            this.$router.push({
                path: "/",
            });
        },
        createTime(ms) {
            return new Date(parseInt(ms))
                .toLocaleString()
                .replace(/:\d{1,2}$/, " ");
        },
    },
    computed: {},
    async mounted() {
        let id = this.$route.query.id;
        try {
            let res = await getDetail(id);
            Object.assign(this.data, res.data);
        } catch (error) {
            message.error(error);
            setTimeout(() => {
                this.goHome();
            }, 1000);
        }
    },
};
</script>

<style lang="scss" scoped>
* {
    background-color: rgb(255, 255, 255);
}

.wrapper {
    height: 90vh;
    margin-left: 1px;
    padding: 24px 30px;
    width: 100%;
    overflow: scroll;
    .title {
        display: flex;
        font-style: italic;
        align-items: baseline;
        margin-bottom: 16px;
        border-bottom: 1px solid rgba(228, 226, 226, 0.5);
        h1 {
            display: inline-block;
            font-size: 30px;
            margin-bottom: 0;
        }
        .time {
            margin-left: 32px;
        }
    }

    .content {
        font-size: 1rem;
        white-space: pre-wrap;
    }
}
</style>