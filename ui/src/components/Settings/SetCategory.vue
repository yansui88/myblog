<template>
    <div class="wrapper">
        <!-- 预览对话框 -->
        <div>
            <a-modal
                :title="modalData.title"
                style="top: 20px"
                v-model:visible="modalVisible"
                @ok="peview(false)"
                :closable="closable"
                width="66%"
            >
                <div v-html="modalData.content"></div>
            </a-modal>
        </div>

        <h1>Categories📂</h1>
        <div class="btn">
            <a-input v-model:value="categoryName" />
            <a-button id="add" type="primary" @click="addCat()"
                ><EditOutlined />增加分类</a-button
            >
        </div>
        <a-divider />
        <a-collapse accordion>
            <!-- 有内容的分类 -->
            <a-collapse-panel
                v-for="(item, index) in categoriesWithContent"
                :key="index + 1"
                :header="item.category_name"
            >
                <p
                    class="title"
                    v-for="(data, dindex) in list"
                    :key="dindex"
                    v-show="data.category == item.category_name"
                    @click="preview(true, data.id)"
                >
                    <span class="time">{{ createTime(data.createtime) }}</span>
                    <span>{{ data.title }}</span>
                </p>
            </a-collapse-panel>
        </a-collapse>

        <!-- 无内容的分类 -->
        <h3 v-show="categoriesWithoutContent[0]"><b>无内容的分类</b></h3>
        <a-collapse accordion v-show="categoriesWithoutContent[0]">
            <a-collapse-panel
                v-for="(item, index) in categoriesWithoutContent"
                :key="index + 1"
                :header="item.category_name"
                :disabled="disabled"
            >
                <template #extra>
                    <a-popconfirm
                        title="确认要删除?"
                        cancel-text="No"
                        ok-text="Yes"
                        @confirm="delCat(item.id)"
                        @cancel="cancel"
                    >
                        <p @click.stop style="color: rgb(255, 120, 117)">
                            <DeleteOutlined /> <span>删除</span>
                        </p>
                    </a-popconfirm>
                </template>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script>
import {
    getInfo,
    getCategories,
    newCategory,
    deleteCategory,
    getDetail,
} from "../../api/blog";
import { onMounted, reactive, ref } from "vue";
import { message } from "ant-design-vue";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";
export default {
    emits: ["cancelLeave"],
    components: { EditOutlined, DeleteOutlined },
    setup() {
        const modalVisible = ref(false);
        let modalData = reactive({});
        let closable = ref(true);
        let list = reactive([]);
        let disabled = ref(true);
        // 有内容的分类
        let categoriesWithContent = reactive([]);
        // 无内容的分类
        let categoriesWithoutContent = reactive([]);
        let categoryName = ref("");
        onMounted(async () => {
            /* 分类详情接口，默认返回所有分类，
            若只需要有文章的分类，带一个'is'参数==1
            若需要无文章的分类，带一个'is'参数==0 */
            let resWithContent = await getCategories(1);
            categoriesWithContent.push(...resWithContent.data);

            let resWithoutContent = await getCategories(0);
            categoriesWithoutContent.push(...resWithoutContent.data);

            let resInfo = await getInfo();
            list.push(...resInfo.data);
        });

        // 增删后刷新
        const fresh = async () => {
            let res1 = await getCategories(1);
            categoriesWithContent.splice(0, categoriesWithContent.length);
            categoriesWithContent.push(...res1.data);

            let res0 = await getCategories(0);
            categoriesWithoutContent.splice(0, categoriesWithoutContent.length);
            categoriesWithoutContent.push(...res0.data);

            let resInfo = await getInfo();
            list.splice(0, list.length);
            list.push(...resInfo.data);
        };

        // 点击显示文章内容
        const preview = async (visible, id) => {
            let res = await getDetail(id);
            Object.assign(modalData, res.data);
            modalVisible.value = visible;
        };

        // 增加分类
        const addCat = async () => {
            if (categoryName.value == "") {
                message.error("请输入分类名!");
                return;
            }
            let res = await newCategory(categoryName.value);
            message.success(res);
            setTimeout(() => {
                fresh();
            }, 1500);
        };

        // 删除分类
        const delCat = async (id) => {
            let res = await deleteCategory(id);
            message.success(res);
            setTimeout(() => {
                fresh();
            }, 1500);
        };
        // 转换时间戳
        const createTime = (ms) => {
            let fullTime = new Date(parseInt(ms))
                .toLocaleString()
                .replace(/:\d{1,2}$/, " ");
            let timeSplit = fullTime.split("/");
            return `${timeSplit[0]}-${timeSplit[1]}-${
                timeSplit[2].split(" ")[0]
            }`;
        };

        const cancel = () => {
            message.error("取消删除操作!");
        };

        return {
            list,
            createTime,
            categoriesWithContent,
            categoriesWithoutContent,
            cancel,
            categoryName,
            addCat,
            delCat,
            preview,
            closable,
            modalData,
            modalVisible,
            disabled,
        };
    },
};
</script>

<style lang="scss" scoped>
.wrapper {
    height: 100%;
    padding: 12px 24px 8px 0px;
    background-color: white;
    h1 {
        font-size: 24px;
        margin-bottom: 8px;
    }
    .btn {
        display: flex;
        width: 100%;

        #del {
            margin-left: 120px;
        }
    }
    .title {
        font-size: 16px;
        margin: 6px 0;
        padding-left: 8px;
        font-weight: 400;
        font-style: italic;
        .time {
            color: gray;
            padding-right: 12px;
        }
        :hover {
            cursor: pointer;
        }
    }
    h3 {
        margin: 12px 0;
    }
}
</style>