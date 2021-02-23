<template>
    <div class="home">
        <!-- 预览对话框 -->
        <a-modal
            :title="data.title"
            style="top: 20px"
            v-model:visible="modalVisible"
            @ok="preview(false)"
        >
            <div v-html="data.content"></div>
        </a-modal>
        <div class="info-bar">
            <div class="title">
                <label for="title"><b>标题</b></label>
                <a-input
                    name="title"
                    id="title-input"
                    v-model:value="data.title"
                    placeholder="标题"
                />
            </div>
            <div class="categories" id="cat">
                <label><b>分类</b></label>
                <a-select
                    style="width: 120px; zindex: 666"
                    v-model:value="data.category"
                >
                    <template #suffixIcon><smile-outlined /></template>
                    <a-select-option
                        v-for="(item, index) in categories"
                        :key="index"
                        :value="item.category_name"
                        >{{ item.category_name }}</a-select-option
                    >
                </a-select>
            </div>
        </div>
        <div id="content"></div>
        <div id="btn">
            <a-button @click="preview(true)"><b>预览</b></a-button>

            <!-- 提交修改 -->
            <a-popconfirm
                v-if="path == 'update'"
                title="确认要提交修改的内容?"
                cancel-text="取消"
                ok-text="提交"
                @confirm="update()"
            >
                <a-button type="primary" style="padding: 0 24px"
                    ><b>提交</b></a-button
                >
            </a-popconfirm>

            <!-- 提交新增 -->
            <a-popconfirm
                v-else
                title="确认要提交?"
                cancel-text="取消"
                ok-text="提交"
                @confirm="submit()"
            >
                <a-button type="primary" style="padding: 0 24px"
                    ><b>提交</b></a-button
                >
            </a-popconfirm>
        </div>
    </div>
</template>

<script>
import {
    getCategories,
    updateArticle,
    getDetail,
    newArticle,
} from "../../api/blog";
import { SmileOutlined } from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
// 引入 wangEditor
import wangEditor from "wangeditor";
export default {
    emits: ["cancelLeave"],
    components: {
        SmileOutlined,
    },
    data() {
        return {
            data: {
                title: "",
                content: "",
                category: "",
            },
            editor: null,
            categories: [],
            resData: {},
            modalVisible: false,
            path: "",
        };
    },
    async mounted() {
        // 获取path,是new还是update
        this.path = this.$route.path.split("/")[2];
        if (this.path == "update") {
            // 如果是update,参数里没id,跳转到管理主页
            if (!this.$route.query.id) {
                message.error(`没有id为 ${this.$route.query.id} 的文章!`);
                setTimeout(() => {
                    this.$router.push({
                        path: "/settings/main",
                    });
                }, 1500);
            }
        }
        const editor = new wangEditor(`#content`);
        editor.config.height = 360;
        editor.config.zIndex = 500;
        // 配置 onchange 回调函数，将数据同步到 vue 中
        editor.config.onchange = (newHtml) => {
            this.data.content = newHtml;
        };
        // 创建编辑器
        editor.create();
        this.editor = editor;

        // 获取分类信息
        let res = await getCategories();
        this.categories.push(...res.data);
        this.data.category = this.categories[0].category_name;

        // 如果是update，则获取数据
        if (this.path == "update") {
            this.load();
        }
    },
    methods: {
        // 提交新增
        async submit() {
            if (
                this.data.title == "" ||
                this.data.content == "" ||
                this.data.category == ""
            ) {
                message.error("标题、内容、分类不能为空!");
                return;
            }
            try {
                let res = await newArticle(
                    this.data.title,
                    this.data.content,
                    this.data.category
                );
                this.data.title = "";
                this.data.content = "";
                message.success(res);
                setTimeout(() => {
                    this.$router.push({
                        path: "/settings",
                    });
                }, 1500);
                return;
            } catch (error) {
                message.error(error);
                return;
            }
        },

        // 提交修改
        async update() {
            if (
                this.data.title == "" ||
                this.data.content == "" ||
                this.data.category == ""
            ) {
                message.error("标题、内容、分类不能为空!");
                return;
            }
            try {
                let res = await updateArticle(
                    this.data.title,
                    this.data.content,
                    this.data.category,
                    this.$route.query.id
                );
                this.data.title = "";
                this.data.content = "";
                message.success(res);
                setTimeout(() => {
                    this.$router.push({
                        path: "/detail",
                        query: {
                            id: this.$route.query.id,
                        },
                    });
                }, 1500);
            } catch (error) {
                message.error("修改失败!");
            }
        },

        // update组件初始化加载数据
        load: async function () {
            let id = this.$route.query.id;
            let res = await getDetail(id);
            this.data.title = res.data.title;
            this.data.category = res.data.category;
            this.editor.txt.html(res.data.content);
        },

        // 预览
        preview(visible) {
            if (this.data.title == "" || this.data.content == "") {
                message.error("标题或内容不能为空!");
                return;
            }
            this.modalVisible = visible;
        },
    },
    beforeUnmount() {
        // 调用销毁 API 对当前编辑器实例进行销毁
        this.editor.destroy();
        this.editor = null;
    },
    /*
    如有内容未提交，离开之前提醒 
   该组件被/api/blog/new 和 /api/blog/update 复用 
   如果是update -> new，离开之前清除编辑器里的数据
   */
    beforeRouteLeave(to, from, next) {
        let that = this;
        if (this.data.title == "" && this.data.content == "") {
            next();
        } else {
            Modal.confirm({
                title: "还有未提交的内容，确定要离开?",
                onOk() {
                    // 离开之前清除数据
                    that.data.title = "";
                    that.data.content = "";
                    that.editor.txt.html("");
                    next();
                },
                onCancel() {
                    // 取消了离开操作，重置父组件菜单key值
                    that.$emit("cancelLeave");
                    next(false);
                },
            });
        }
    },
};
</script>

<style lang="scss" scoped>
.home {
    padding: 8px 0px 0px 0px;
    width: 100%;
    margin: auto;
    position: relative;

    .info-bar {
        width: 100%;
        display: flex;
        height: 56px;
        line-height: 56px;
        margin-bottom: 24px;
        .title {
            width: 100%;
            flex: 1;
            label {
                width: 20%;
                font-size: 20px;
                padding-right: 16px;
            }

            #title-input {
                width: 75%;
                height: 32px;
                margin-bottom: 16px;
            }
        }

        #cat {
            height: 56px;
            line-height: 56px;
            align-self: flex-end;
            width: 177px;
            margin-left: auto;
            label {
                font-size: 20px;
                padding-right: 16px;
            }
        }
    }

    #btn {
        width: 100%;
        display: flex;
        justify-content: space-around;
        margin-top: 24px;
        text-align: center;
    }
}
</style>