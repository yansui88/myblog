<template>
    <p>
        <router-link to="/settings">
            <img src="../../assets/joker.png" alt="avatar" />
        </router-link>
    </p>
    <div class="my-name">Yansui</div>
    <div class="hello">
        <SmileTwoTone />
        Hello Front-end
    </div>
    <div class="search">
        <a-input
            id="input"
            v-model:value="value"
            size="small"
            placeholder="搜索文章"
            @keyup.enter="pushWithQuery()"
        >
        <template #prefix>🔍</template>
        </a-input>
    </div>
</template>

<script>
import { message } from 'ant-design-vue'
import { SmileTwoTone } from "@ant-design/icons-vue";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
    setup() {
        let value = ref("");
        const router = useRouter();
        const pushWithQuery = () => {
            if (value.value == "") {
               message.error('请输入关键字!')
            } else {
                 router.push({
                    path: '/home',
                    query: {
                        keyword: value.value,
                    },
                });
                value.value = "";
            }
        };
        return {
            value,
            pushWithQuery,
        };
    },
    components: {
        SmileTwoTone,
    },
});
</script>

<style lang="scss" scoped>
p {
    width: 100%;
    text-align: center;
    margin: 32px 0 8px 0;

    img {
        width: 90px;
        height: 90px;
        border-radius: 50%;
    }
}

.my-name {
    width: 100%;
    font-size: 20px;
    font-weight: bolder;
    text-align: center;
}

.hello {
    font-size: 16px;
    text-align: center;
}

.search {
    width: 160px;
    margin: 16px auto 32px;
}
</style>