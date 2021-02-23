<template>
    <div>
        <p>Designed with <a href="https://vuejs.org/">Vue 3</a> and <a href="https://ant.design/index-cn">Ant Design</a></p>
        <ul>
            <li><GithubOutlined /></li>
            <li><TwitterOutlined /></li>
            <li><MailOutlined /></li>
            <li><WifiOutlined :rotate="24" /></li>
        </ul>
    </div>
</template>

<script>
import {
    GithubOutlined,
    TwitterOutlined,
    MailOutlined,
    WifiOutlined,
} from "@ant-design/icons-vue";
export default {
    components: {
        GithubOutlined,
        TwitterOutlined,
        MailOutlined,
        WifiOutlined,
    },
    data() {
        return {};
    },
};
</script>

<style lang="scss" scoped>
div {
    position: absolute;
    bottom: 0;
    padding: 0 16px;
    p {
        width: 100%;
        text-align: center;
        margin-bottom: 4px;
    }
    ul {
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 0;

        li {
            font-size: 18px;
            padding: 0 8px;
            list-style-type: none;
        }
    }
}
</style>