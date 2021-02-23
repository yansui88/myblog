<template>
    <a-layout id="layout-responsive" style="backgroundColor: white !important;">
        <a-layout-sider
            id="sider"
            theme="light"
            breakpoint="md"
            collapsed-width="0"
            @collapse="onCollapse"
        >
            <personal></personal>
            <menu-item></menu-item>
            <div v-show="isShow">
                <icons></icons>
            </div>
        </a-layout-sider>
        <a-layout-content class="layout-content" id="layout-content">
            <router-view></router-view>
        </a-layout-content>
    </a-layout>
</template>
<script>
import Personal from "../components/HomeSiders/Personal";
import MenuItem from "../components/HomeSiders/MenuItem.vue";
import Icons from "../components/HomeSiders/Icons";
export default {
    data() {
        return {
            isShow: true,
        };
    },
    computed: {},
    components: {
        Personal,
        MenuItem,
        Icons,
    },
    methods: {
        onCollapse() {
            this.isShow = !this.isShow;
        },
    },
};
</script>

<style lang="scss" scoped>
#layout-responsive {
    height: 100vh;
}

#sider {
    background-color: rgb(247, 250, 252);
}

</style>

