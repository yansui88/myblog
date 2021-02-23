import { createStore } from 'vuex';
const store = createStore({
    state() {
        return {
            // 登录状态，1已登入，0未登入
            loginState: 0
        }
    },
    mutations: {
        setLogin(state) {
            state.loginState = 1;
        },
        setLogout(state) {
            state.loginState = 0;
        }
    }
})

export default store;