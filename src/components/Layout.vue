<template>
    <div class="h-full">
        <v-header ref="header"/>
        <div class="">
            <v-side-bar ref="sidebar"/>
            <div class="content">
                <div v-show="editableTabs.length>0">
                    <el-tabs v-model="editableTabsValue" class="tabs" type="card" closable @tab-remove="removeTab" @tab-click="selectTab">
                        <el-tab-pane v-for="item in editableTabs" :label="item.title" :name="item.id+''" :key="item.id">
                        </el-tab-pane>
                    </el-tabs>
                    <div :style="{ height: style.contHeight, overflow: 'auto' }">
                        <router-view v-slot="{ Component }">
                            <keep-alive>
                                <component class="view" :is="Component" />
                            </keep-alive>
                        </router-view>
                    </div>
                </div>
                <div class="p20" v-show="editableTabs.length === 0">
                    欢迎来到崭新的数钥3.0后台系统
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { nextTick, computed, onMounted, reactive, ref, watch } from 'vue'
import vHeader from '@/components/Header.vue'
import vSideBar from '@/components/SideBar.vue'
import Ajax from '@/libs/Ajax'
import utils from '@/libs/utils'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const store = useStore()
const router = useRouter()
const editableTabs = computed(() => store.state.opendPages)
const currentTab = computed(() => store.state.currentTab)

const editableTabsValue = ref('1')
const style = reactive({ contHeight: '' })
const timer = ref(null)

watch(() => store.state.currentTab, (v, ov) => {
    editableTabsValue.value = v.id+''
}, {
    immediate: true
})

if(!store.state.menu || !store.state.menu.projects || (store.state.menu.projects  && store.state.menu.projects.length === 0)) {
    Ajax.get('/right/getMenusAndChildItem', {
        time: new Date().getTime()
    }).then(res => {
        if(Object.keys(res.menus).length === 0) {
            router.push('/views/login')
        } else {
            store.commit('saveProjectList', res)
            utils.saveCookie('realName', res.user.realname)
        }
    })
}

const removeTab = pageId => {
    let tabs = editableTabs.value
    if (editableTabsValue.value === pageId) {
        tabs.forEach((tab, index) => {
            if (tab.id+'' === pageId) {
                let nextTab = tabs[index + 1] || tabs[index - 1]
                if (nextTab) {
                    store.commit('saveCurrentTab', nextTab)
                }
            }
        })
    }
    store.commit('removeOpendPages', pageId)
}

const selectTab = page => {
    const currentTab = editableTabs.value.find(e => e.id+'' === page.props.name)
    store.commit('saveCurrentTab', currentTab)
    router.push(currentTab.value)
}

// 定期刷新token
// setInterval(() => {
//     if(window.location.pathname !== '/views/login'){
//         Ajax.post('/right/user/setRefreshToken').then(() => {
//             Ajax.post('/right/user/refreshUsersToken').then(res => {
//                 if (!res.success) {
//                     ElMessage({
//                         message: '登录失效，请重新登录！',
//                         onClose: () => {
//                             localStorage.removeItem('sso_token')
//                             router.push('/views/login')
//                         }
//                     })
//                 }
//             })
//         })
//     }
// }, 60000)

// 子系统要求重新登录
window.addEventListener('message',function(e){
    if(e.data === 'login') {
        window.location.href = '/views/login'
    }
},false)

const header = ref(null)
const sidebar = ref(null)
onMounted(() => {
    editableTabsValue.value = store.state.currentTab.id+''
    window.onresize = () => {
        if(window.location.pathname !== '/views/login'){
            sidebar.value.$el.style.height = (document.body.clientHeight - header.value.$el.clientHeight) + 'px'
            style.contHeight = (document.body.clientHeight - header.value.$el.clientHeight - 50) + 'px'
        }
    }
    window.onresize()
})

</script>

<style scoped>
.content {
    width: auto;
    padding-left: 220px;
    overflow-y: hidden;
    box-sizing: border-box;
}

.tabs {
    height: 100%;
}


</style>