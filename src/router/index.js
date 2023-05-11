import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import Layout from '@/components/Layout.vue'
const Login = () => import('@/views/Login.vue')

const AccountManage = () => import('@/views/accountManage/App.vue')

const routes = [
    {
        path: '/',
        redirect: '/views/home'
    },
    {
        path: '/views/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/views',
        component: Layout,
        redirect: '/views/home',
        children: [
            {
                path: 'home',
                name: 'Home',
                component: Home
            },
            {
                path: 'accountManage/accountManage',
                name: 'AccountManage',
                component: AccountManage
            },
            {
                path: ':currentPath(.*)*', // 路由未匹配到，进入这个
                redirect: (_) => {
                    return { path: '/404' }
                }
            }
        ]
    }
]
const router = createRouter({
    history: createWebHistory(''),
    routes
})

export default router
