import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import Layout from '@/components/Layout.vue'
const Login = () => import('@/views/Login.vue')

const drawBasic = () => import('@/views/draw/basic.vue')
const drawWay = () => import('@/views/draw/way.vue')
const drawSets = () => import('@/views/draw/sets.vue')

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
                path: 'draw/basic',
                name: 'drawBasic',
                component: drawBasic
            },
            {
                path: 'draw/way',
                name: 'drawWay',
                component: drawWay
            },
            {
                path: 'draw/sets',
                name: 'drawSets',
                component: drawSets
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
