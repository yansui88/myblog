<template>
    <div id="components-modal-demo-position">
        <a-modal
            :title="modalData.title"
            style="top: 20px"
            v-model:visible="modalVisible"
            @ok="preview(false)"
            :closable="closable"
            width="66%"
        >
            <div v-html="modalData.content"></div>
        </a-modal>
    </div>
    <div class="wrapper">
        <h1>Categories📂</h1>
        <h3>There are {{ categories.length }} categories...</h3>
        <a-divider id="divider" />
        <a-collapse accordion>
            <a-collapse-panel
                v-for="(item, index) in categories"
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
    </div>
</template>

<script>
import { getDetail, getCategories, getInfo } from "../../api/blog";
import { onMounted, reactive, ref } from "vue";
export default {
    setup() {
        const modalVisible = ref(false);
        let modalData = reactive({});
        let closable = ref(true);
        let list = reactive([]);
        let categories = reactive([]);

        onMounted(async () => {
            let res = await getCategories(1);
            categories.push(...res.data);
            let resInfo = await getInfo();
            list.push(...resInfo.data);
        });

        // 点击显示文章内容
        const preview = async (visible, id) => {
            let res = await getDetail(id);
            Object.assign(modalData, res.data);
            modalVisible.value = visible;
        };

        // 时间戳转换为年月日格式
        const createTime = (ms) => {
            let fullTime = new Date(parseInt(ms))
                .toLocaleString()
                .replace(/:\d{1,2}$/, " ");
            let timeSplit = fullTime.split("/");
            return `${timeSplit[0]}-${timeSplit[1]}-${
                timeSplit[2].split(" ")[0]
            }`;
        };

        return {
            list,
            createTime,
            categories,
            modalVisible,
            preview,
            modalData,
            closable,
        };
    },
};
</script>

<style lang="scss" scoped>
.wrapper {
    height: 100%;
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
}
</style>