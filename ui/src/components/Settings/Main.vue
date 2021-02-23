<template>
    <a-modal
        :title="modalData.title"
        style="top: 20px"
        v-model:visible="modalVisible"
        @ok="setModalVisible(false)"
        :closable="closable"
        width="66%"
    >
        <div v-html="modalData.content"></div>
    </a-modal>
    <a-list
        style="padding: 0 0 12px 0; backgroundcolor: white"
        class="loadmore-list"
        item-layout="horizontal"
        :data-source="data"
        :split="true"
    >
        <template #loadMore>
            <div
                v-if="showLoadingMore"
                :style="{
                    textAlign: 'center',
                    margin: '12px 0 !important',
                    height: '32px',
                    lineHeight: '32px',
                }"
            >
                <a-spin v-if="loadingMore" />
                <a-button v-else @click="onLoadMore"
                    ><SyncOutlined />加载更多</a-button
                >
            </div>
        </template>
        <template #renderItem="{ item }">
            <a-list-item>
                <template #actions>
                    <a-button @click="setModalVisible(true, item)"
                        ><EyeOutlined />预览</a-button
                    >
                    <a-button @click="update(item.id)" type="primary"
                        ><EditOutlined />修改</a-button
                    >
                    <a-popconfirm
                        title="确认要删除?"
                        cancel-text="No"
                        ok-text="Yes"
                        @confirm="del(item.id)"
                        @cancel="cancel"
                    >
                        <a-button type="danger">
                            <DeleteOutlined />
                            <span>删除</span>
                        </a-button>
                    </a-popconfirm>
                </template>
                <a-list-item-meta :description="createTime(item.createtime)">
                    <template #title>
                        <a href="#" @click="setModalVisible(true, item)">{{
                            item.title
                        }}</a>
                    </template>
                    <template #avatar>
                        <a-avatar :src="avatarSrc" />
                    </template>
                </a-list-item-meta>
                <!-- <div>content</div> -->
            </a-list-item>
        </template>
    </a-list>
</template>
<script>
import avatarSrc from "../../assets/ice-cream.jpg";
import { deleteArticle, getList } from "../../api/blog";
import { ref, reactive, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import {
    DeleteOutlined,
    EditOutlined,
    SyncOutlined,
    EyeOutlined,
} from "@ant-design/icons-vue";
export default {
    emits: ["cancelLeave"],
    components: { DeleteOutlined, EditOutlined, SyncOutlined, EyeOutlined },
    setup() {
        const modalVisible = ref(false);
        const router = useRouter();
        const loadingMore = ref(false);
        const showLoadingMore = ref(true);
        const size = ref(8);
        const total = ref(0);
        let closable = ref(true);
        let modalData = reactive({});
        let data = reactive([]);
        let page = ref(1);
        onMounted(async () => {
            let res = await getList(page.value, size.value);
            loadingMore.value = false;
            total.value = res.message.split(" ")[3];
            data.push(...res.data);
            page.value++;
            if (total.value > data.length) {
                loadingMore.value = false;
            } else {
                showLoadingMore.value = false;
            }
        });

        // 加载更多
        const onLoadMore = async () => {
            // 显示加载中图标
            loadingMore.value = true;
            let res = await getList(page.value, size.value);
            data.push(...res.data);
            page.value++;
            if (total.value > data.length) {
                loadingMore.value = false;
            } else {
                showLoadingMore.value = false;
            }
            nextTick(() => {
                window.dispatchEvent(new Event("resize"));
            });
        };

        // 转换时间戳
        const createTime = (ms) => {
            return new Date(parseInt(ms))
                .toLocaleString()
                .replace(/:\d{1,2}$/, " ");
        };

        // 修改文章
        const update = (id) => {
            router.push({
                name: "Update",
                query: {
                    id: id,
                },
            });
        };

        // 删除文章
        const del = async (id) => {
            let result = await deleteArticle(id);
            message.success(result);
            // 清除数据,恢复页码
            data.splice(0, data.length);
            showLoadingMore.value = true;
            page.value = 1;
            // 重新加载
            let res = await getList(page.value, size.value);
            setTimeout(() => {
                page.value++;
                total.value = res.message.split(" ")[3];
                data.push(...res.data);
                if (total.value > data.length) {
                    loadingMore.value = false;
                } else {
                    showLoadingMore.value = false;
                }
            }, 1000);
        };

        // 取消删除操作
        const cancel = () => {
            message.error("取消了删除操作!");
        };

        // 点击预览文章
        const setModalVisible = (visible, item) => {
            Object.assign(modalData, item);
            modalVisible.value = visible;
        };

        return {
            loadingMore,
            showLoadingMore,
            data,
            onLoadMore,
            createTime,
            del,
            cancel,
            update,
            modalVisible,
            setModalVisible,
            modalData,
            closable,
            avatarSrc,
        };
    },
};
</script>
<style scoped>
.loadmore-list {
    background-color: white !important;
}
</style>