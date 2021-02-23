<template>
    <div class="wrapper">
        <h1>About😅</h1>
        <h3>Something about this blog...</h3>
        <a-divider id="divider" />
        <article>
            <p>前端： <b>Vue3.x</b> / <b>Vue Router</b> / <b>Vuex</b> / <b>Vue-CLI</b> / <b>Ant Design</b> / <b>SCSS</b> / <b>yarn</b> / <b>wangEditor</b> </p>
            <p>后端： <b>Koa</b> / <b>MySQL</b> / <b>Redis</b> / <b>Ubuntu 20.04 LTS</b></p>
        </article>
    </div>
</template>

<script>
export default {
    setup() {
        
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
        margin: 12px 0;
    }
    article {
        p {
            font-size: 16px;
        }
    }
}
</style>