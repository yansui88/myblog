<template>
    <a-layout id="components-layout-demo-responsive">
        <a-layout-sider
            id="sider"
            breakpoint="md"
            theme="light"
            collapsed-width="0"
            @collapse="onCollapse"
        >
            <div id="home">
                <a-button block type="primary" size="large" @click="goHome()">
                    <LeftOutlined />返回主页
                </a-button>
            </div>

            <a-menu
                id="menu"
                theme="light"
                mode="inline"
                v-model:selectedKeys="selectedKeys"
            >
                <a-menu-item key="1">
                    <router-link to="/settings/main">
                        <ToolOutlined />
                        <span class="nav-text">文章管理</span>
                    </router-link>
                </a-menu-item>
                <a-menu-item key="2">
                    <router-link to="/settings/category">
                        <FolderOpenOutlined />
                        <span class="nav-text">分类管理</span>
                    </router-link>
                </a-menu-item>
                <a-menu-item key="3">
                    <router-link to="/settings/new">
                        <FileAddOutlined />
                        <span class="nav-text">新建 / 修改</span>
                    </router-link>
                </a-menu-item>
            </a-menu>
            <div id="log-out" v-show="isShow">
                <a-popconfirm
                    title="确认要注销?"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="logOut()"
                >
                    <a-button size="large" block type="danger">
                        <PoweroffOutlined />注销
                    </a-button>
                </a-popconfirm>
            </div>
        </a-layout-sider>
        <a-layout :style="{ backgroundColor: 'white' }">
            <!-- <a-layout-header :style="{ background: '#fff', padding: 0 }" /> -->
            <a-layout-content :style="{ padding: '16px 24px 16px 24px' }">
                <router-view @cancelLeave="cancelLeave"></router-view>
            </a-layout-content>
            <!-- <a-layout-footer style="textalign: center">
                Ant Design ©2018 Created by Ant UED
            </a-layout-footer> -->
        </a-layout>
    </a-layout>
</template>
<script>
import {
    LeftOutlined,
    FileAddOutlined,
    ToolOutlined,
    FolderOpenOutlined,
    PoweroffOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { isLogin } from "../api/login";

export default {
    data() {
        return {
            selectedKeys: [],
            isShow: true,
            path: "",
        };
    },
    components: {
        LeftOutlined,
        ToolOutlined,
        FileAddOutlined,
        FolderOpenOutlined,
        PoweroffOutlined,
    },
    methods: {
        onCollapse() {
            this.isShow = !this.isShow;
        },
        goHome() {
            this.$router.push({
                path: "/",
            });
        },
        logOut() {
            localStorage.removeItem("token");
            message.success("已注销!");
            setTimeout(() => {
                this.goHome();
            }, 1500);
        },
        computeKey() {
            this.path = this.$route.path.split("/")[2];
            if (this.path == "main") {
                this.selectedKeys = ["1"];
            } else if (this.path == "category") {
                this.selectedKeys = ["2"];
            } else {
                this.selectedKeys = ["3"];
            }
            return;
        },
        // 当New和Update组件取消跳转，重置菜单key值
        cancelLeave() {
            if (
                this.$route.path.split("/")[2] == "new" ||
                this.$route.path.split("/")[2] == "update"
            ) {
                this.selectedKeys = ["3"];
            }
        },
    },
    mounted() {
        this.computeKey();
    },
    beforeRouteEnter: async (to, from, next) => {
        // 从localStorage中取出token
        let token = localStorage.getItem("token");
        // 有则验证token是否有效
        if (token) {
            let state = await isLogin();
            if (state) {
                next();
            } else {
                // token无效,跳转到登录页面
                message.error("token无效，重新登录!");
                next("/login");
            }
        } else {
            // 无token就跳转到登录页面
            message.error("未登录!");
            next("/login");
        }
    },
    beforeRouteUpdate(to, from) {
        if (to.fullPath != from.fullPath) {
            this.path = to.fullPath.split("/")[2];
            if (this.path == "main") {
                this.selectedKeys = ["1"];
            } else if (this.path == "category") {
                this.selectedKeys = ["2"];
            } else {
                this.selectedKeys = ["3"];
            }
        }
    },
};
</script>

<style lang="scss" scoped>
#components-layout-demo-responsive {
    height: 100vh;
    #home {
        text-align: center;
    }
    #sider {
        position: relative;
        background-color: rgb(247, 250, 252);

        #log-out {
            position: absolute;
            width: 100%;
            bottom: 0;
        }
    }
    #menu {
        padding-top: 120px;
        background-color: rgb(247, 250, 252);
    }
}
</style>

