<template>
    <a-menu
        id="menu"
        theme="light"
        mode="inline"
        v-model:selectedKeys="selectedKeys"
    >
        <a-menu-item key="1">
            <router-link to="/home">
                <HomeOutlined />
                <span class="nav-text">Home</span>
            </router-link>
        </a-menu-item>
        <a-menu-item key="2">
            <router-link to="/archives">
                <InboxOutlined />
                <span class="nav-text">Archives</span>
            </router-link>
        </a-menu-item>
        <a-menu-item key="3">
            <router-link to="/categories">
                <FolderOpenOutlined />
                <span class="nav-text">Categories</span>
            </router-link>
        </a-menu-item>
        <a-menu-item key="4">
            <router-link to="/about">
                <UserOutlined />
                <span class="nav-text">About</span>
            </router-link>
        </a-menu-item>
    </a-menu>
</template>

<script>
import {
    HomeOutlined,
    InboxOutlined,
    FolderOpenOutlined,
    UserOutlined,
} from "@ant-design/icons-vue";
export default {
    data() {
        return {
            selectedKeys: [],
        };
    },
    computed: {},
    components: {
        HomeOutlined,
        InboxOutlined,
        FolderOpenOutlined,
        UserOutlined,
    },
    mounted() {
        let routePath = this.$route.path.split("/")[1];
        if (routePath == "archives") {
            this.selectedKeys = ["2"];
        } else if (routePath == "categories") {
            this.selectedKeys = ["3"];
        } else if (routePath == "about") {
            this.selectedKeys = ["4"];
        } else {
            this.selectedKeys = ["1"];
        }
    },
};
</script>

<style lang="scss" scoped>
#menu {
    background-color: rgb(247, 250, 252);
}
</style>