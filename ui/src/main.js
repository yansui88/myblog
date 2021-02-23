import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'

import {
    Button, Pagination, Layout, Card,
    Divider, Input, Menu, Modal,
    Collapse, Spin, List, Popconfirm,
    Avatar, Select, Form, PageHeader,
    BackTop, Result, Anchor, Affix
} from 'ant-design-vue'

import 'ant-design-vue/dist/antd.css';

createApp(App)
.use(router)
.use(store)
.use(Button).use(Pagination).use(Layout)
.use(Card).use(Divider).use(Input)
.use(Menu).use(Modal).use(Collapse)
.use(Spin).use(List).use(Popconfirm)
.use(Avatar).use(Select).use(Form).use(PageHeader).use(BackTop).use(Result).use(Anchor).use(Affix)
.mount('#app')

