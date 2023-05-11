<template>
    <div class="sidebar h-full">
        <el-menu :default-active="activeIndex" class="sidebar-el-menu" :collapse="collapse" background-color="#324157"
                 text-color="#bfcbd9" active-text-color="#20a0ff" :collapse-transition="true" unique-opened>
            <template v-for="item in items">
                <template v-if="item.childrenitems && item.childrenitems.length>0">
                    <el-sub-menu :key="item.id" :index="item.id+''">
                        <template #title>
                            <el-icon :size="14"><folder /></el-icon>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.childrenitems">
                            <el-sub-menu v-if="subItem.childrenitems && subItem.childrenitems.length>0" :index="subItem.id+''" :key="subItem.id">
                                <template #title><el-icon :size="14"><folder /></el-icon>{{ subItem.title }}</template>
                                <el-menu-item v-for="threeItem in subItem.childrenitems" :key="threeItem.id" :index="threeItem.id+''" :url="threeItem.value" @click="handleSelect(threeItem)">
                                    {{ threeItem.title }}</el-menu-item>
                            </el-sub-menu>
                            <el-menu-item v-else :index="subItem.id+''" :key="subItem.id" :url="subItem.value" @click="handleSelect(subItem)">{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-sub-menu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.id+''" :key="item.id" :url="item.value" @click="handleSelect(item)">{{ item.title }}</el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, onMounted, ref, watch, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { accessLog } from '@/libs/accessLog'
import Ajax from '@/libs/Ajax'
import { Folder } from '@element-plus/icons-vue'

const store = useStore()
const router = useRouter()

const clearMenus = menus => {
    let pages = menus.filter(e => e.menuType === 0)
    pages.forEach(e => {
        if (e.childrenitems && e.childrenitems.length) {
            e.childrenAuth = []
            e.childrenitems.filter(e => e.menuType === 1).map(item => {
                e.childrenAuth.push({
                    id: item.id,
                    title: item.title,
                    url: item.value
                })
            })
            e.childrenitems = clearMenus(e.childrenitems)
        }
    })
    return pages
}

const collapse = computed(() => store.state.collapse )
const items = computed(() => store.state.menuCurrent )
const activeIndex = computed(() => store.state.selectedPage)
console.log(123, items)


const handleSelect = (page) => {
    // 防止打开当前页面造成循环嵌套 10203
    if(!page.value || (page.value === '/') || (page.value === window.location.origin) || (page.value === window.location.origin + '/')) {
        return
    }
    // 重置random参数以刷新子页面
    store.state.opendPages.some(item => {
        if ((item.id == page.id) && (page.projectid !== 1)) {
            if (item.value.indexOf('random=') === -1) {
                item.value = item.value + '&random=' + Math.floor((Math.random() + 1) * 1000000)
            } else {
                item.value = item.value.split('random=')[0] + 'random=' + Math.floor((Math.random() + 1) * 1000000)
            }
            // item.value = 'http://fe-exodus-dev.shuyaotest.com:8084/channel/capital'
        }
    })
    store.commit('setSelectedPage', page.id.toString())
    const newPage = {...page}
    // newPage.value = 'http://fe-exodus-dev.shuyaotest.com:8084/channel/capital'
    store.commit('saveCurrentTab', newPage)
    if(newPage.projectid === 1) {
        newPage.value = '/views' + page.value.replace('/right/pages', '').replace('.jsp', '')
    } else {
        // 发送页面访问埋点
        accessLog({
            url: newPage.value,
            pageTitle: newPage.title
        })
        newPage.value += (newPage.value.includes('?') ? '&' : '?')+'sso_token='+localStorage.getItem('sso_token')+'&projectid='+newPage.projectid+'&menuid='+newPage.id
    }
    store.commit('addOpendPages', newPage)
    if(newPage.projectid === 1) {
        router.push(newPage.value)
    }
}
</script>

<style scoped lang="scss">
.sidebar {
    display: block;
    overflow-y: scroll;
    position: absolute;
    left: 0;
    width: 220px;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 220px;
}
.sidebar > ul {
    height: 100%;   
}
</style>