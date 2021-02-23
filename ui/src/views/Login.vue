<template>
    <div class="wrapper">
        <div class="border-wrapper">
            <h1>登录</h1>
            <a-form-item>
                <a-input
                    style="width: 280px !important"
                    v-model:value="loginData.username"
                    placeholder="Username"
                >
                    <template #prefix
                        ><UserOutlined
                            style="
                                color: rgba(0, 0, 0, 0.4);
                                paddingright: 4px;
                            "
                    /></template>
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-input
                    style="width: 280px !important"
                    v-model:value="loginData.password"
                    type="password"
                    placeholder="Password"
                >
                    <template #prefix
                        ><LockOutlined
                            style="
                                color: rgba(0, 0, 0, 0.4);
                                paddingright: 4px;
                            "
                    /></template>
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-input
                    style="width: 280px !important"
                    v-model:value="loginData.captcha"
                    placeholder="Captcha"
                >
                    <template #prefix
                        ><ExclamationCircleOutlined
                            style="
                                color: rgba(0, 0, 0, 0.4);
                                paddingright: 4px;
                            "
                    /></template>
                </a-input>
            </a-form-item>

            <a-form-item class="btn">
                <img
                    id="captcha"
                    :src="captcha"
                    @click="updateCaptcha"
                    alt="captcha"
                />
                <a-button
                    type="primary"
                    html-type="submit"
                    :disabled="
                        loginData.user === '' ||
                        loginData.password === '' ||
                        loginData.captcha.length != '6'
                    "
                    @click.stop="toLogin(loginData)"
                >
                    登录
                </a-button>
            </a-form-item>
        </div>
    </div>
</template>
<script>
import { useRouter } from "vue-router";
import {
    UserOutlined,
    LockOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { defineComponent, reactive, ref } from "vue";
import { captchaSrc, login } from "../api/login";
export default defineComponent({
    setup() {
        let captcha = ref(captchaSrc);
        const router = useRouter();
        const updateCaptcha = async () => {
            captcha.value = `${captchaSrc}?${Math.random()}`;
        };
        const loginData = reactive({
            username: "",
            password: "",
            captcha: "",
        });
        const toLogin = async (data) => {
            try {
                let res = await login(data);
                // 将token存储到localStorage，全局提示并跳转到后台
                localStorage.setItem("token", res.data.token);
                message.success(res.message);
                setTimeout(() => {
                    router.push({
                        path: "/settings",
                    });
                }, 1500);
            } catch (error) {
                // 不成功则刷新验证码，并提示登陆失败
                message.error(error);
                updateCaptcha();
            }
        };
        return {
            loginData,
            toLogin,
            captcha,
            updateCaptcha,
        };
    },
    components: {
        UserOutlined,
        LockOutlined,
        ExclamationCircleOutlined,
    },
});
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100vw;
    height: 100vh;
    background-color: rgb(247, 250, 252);
    .border-wrapper {
        border: 1px solid rgba(194, 193, 193, 0.5);
        padding: 24px 128px;
        border-radius: 2%;
        background-color: rgb(230, 247, 255);
        h1 {
            width: 100%;
            text-align: center;
            color: rgb(24, 144, 255);
        }

        .btn {
            width: 100%;
            display: flex;
            justify-content: flex-start;

            #captcha {
                width: 120px;
                border-radius: 4%;
            }
            button {
                width: 80px;
                height: 36px;
                margin-left: 48px;
            }
        }
    }
}
</style>