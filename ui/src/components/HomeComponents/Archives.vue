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
        <h1>Archives🗄️</h1>
        <h3>Found {{ total }} articles...</h3>
        <a-divider id="divider" />
        <ul>
            <li v-for="(item, index) in list" :key="index">
                <span class="time">{{ createTime(item.createtime) }}</span>
                <span class="title" @click="preview(true, item.id)">{{
                    item.title
                }}</span>
            </li>
        </ul>
    </div>
</template>
<script>
import { getDetail, getInfo } from "../../api/blog";
import { onMounted, reactive, ref } from "vue";
import { message } from "ant-design-vue";
export default {
    setup() {
        const modalVisible = ref(false);
        let modalData = reactive({});
        let closable = ref(true);
        let total = ref(0);
        let list = reactive([]);

        onMounted(async () => {
            try {
                let res = await getInfo();
                list.push(...res.data);
                total.value = res.message.split(" ")[3];
            } catch (error) {
                message.error(error);
            }
        });

        // 获取文章详情
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
            total,
            list,
            createTime,
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
    background-color: white;
    padding: 24px 24px 8px;
    overflow: scroll;
    h1 {
        font-size: 24px;
        margin-bottom: 0;
    }
    h3 {
        color: gray;
    }
    #divider {
        margin: 12px 0 8px;
    }
    ul {
        font-size: 16px;
        padding-left: 0;
        li {
            list-style-type: none;
            font-size: 16px;
            line-height: 32px;
            .time {
                color: gray;
                padding-right: 12px;
            }
            .title {
                font-style: italic;
            }
            :hover {
                cursor: pointer;
            }
        }
    }
}
</style>