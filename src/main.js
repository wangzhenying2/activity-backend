import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/css/main.css'
import '@/assets/css/right.scss'
import Router from './router'
import Store from './store'
import locale from 'element-plus/lib/locale/lang/zh-cn'

createApp(App)
    .use(Router)
    .use(Store)
    .use(ElementPlus, { size: 'small', locale })
    .mount('#app')
