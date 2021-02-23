import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'
import Home from '../components/HomeComponents/Home.vue'
import { isLogin } from '../api/login'
const routes = [
  {
    path: '/',
    redirect: '/home',
    component: Index,
    children: [
      { path: '/home', component: Home, },
      { path: '/detail', name: 'detail', component: () => import('../components/HomeComponents/Detail.vue') },
      {
        path: '/about',
        name: 'About',
        component: () => import('../components/HomeComponents/About.vue')
      },
      {
        path: '/archives',
        name: 'Archives',
        component: () => import('../components/HomeComponents/Archives.vue')
      },
      {
        path: '/categories',
        name: 'Categories',
        component: () => import('../components/HomeComponents/Categories.vue')
      },
    ]
  },
  {
    path: '/settings',
    name: 'Settings',
    redirect: '/settings/main',
    component: () => import('../views/Settings.vue'),
    children: [
      {
        path: 'main',
        name: 'Main',
        component: () => import('../components/Settings/Main.vue')
      },
      {
        path: 'new',
        name: 'New',
        component: () => import('../components/Settings/Edit.vue'),
      },
      {
        path: 'update',
        name: 'Update',
        component: () => import('../components/Settings/Edit.vue')
      },
      {
        path: 'category',
        component: () => import('../components/Settings/SetCategory.vue')
      }
    ],
    
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    beforeEnter: async (to, from, next) => {
      // 从localStorage中取出token
      let token = localStorage.getItem('token');
      // 有则验证token是否有效
      if (token) {
        let state = await isLogin();
        if (state) {
          // 已登录就跳转到管理界面
          next('/settings');
        } else {
          next();
        }
      } else {
        // 无token就什么都不做
        next();
      }
    }
  },
  {
    path: "/:catchAll(.*)",
    name: "404",
    component: () => import('../views/NotFound.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
