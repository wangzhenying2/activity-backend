import {createNamespacedHelpers, createStore} from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import Ajax from '../libs/Ajax'

export default createStore({
    state: {
        collapse: false,
        token: '',
        menu: {
            projects: [{
                projectid: '0',
                projectname: '抽奖',
                children: [{
                    id: '1',
                    title: '基础设置',
                    value: '/drawbasic',
                }, {
                    id: '2',
                    title: '派奖方式',
                    value: '/drawType',
                }, {
                    id: '3',
                    title: '奖项设置',
                    value: '/drawProd',
                }]
            }]
        },
        menuCurrent: [],
        selectedProject: '',
        selectedPage: '',
        currentTab: {},
        opendPages: [],
        companylist: []
    },

    mutations: {
        // 侧边栏折叠
        handleCollapse(state, data) {
            state.collapse = data
        },
        // 保存菜单数据
        saveProjectList(state, data) {
            state.menu = data
        },
        // 设置当前一级菜单
        setMenuCurrent(state, pid) {
            state.selectedProject = pid
            console.log(777, state.menu.projects)
            state.menu.projects.filter(item => {
                if (item.projectid === pid) {
                    state.menuCurrent = item.children
                    return true
                }
            })
            console.log(1111, state.menuCurrent)
        },
        // 设置当前二级菜单
        setSelectedPage(state, id) {
            state.selectedPage = id
        },
        // 设置当前选中tab
        saveCurrentTab(state, data) {
            state.currentTab = data
        },
        addOpendPages(state, page) {
            if(state.opendPages.find(e => e.id === page.id)===undefined){
                state.opendPages.push(page)
            }
            if(state.opendPages.length > 10){
                state.opendPages.shift()
            }
            state.currentTab = page
        },
        removeOpendPages(state, pageId) {
            const removeIndex = state.opendPages.findIndex(e => e.id+'' === pageId)
            state.opendPages.splice(removeIndex, 1)
        },
        // 保存公司
        saveCompanylist(state, data) {
            state.companylist = data
        },
        clearState(state) {
            state.menu = {
                projects: []
            }
            state.currentTab={}
            state.selectedProject = ''
            state.menuCurrent=[]
            state.opendPages=[]
        }
    },

    actions: {
        getSelectMenuList({state}) {
            return new Promise((resolve) => {
                // let object = this.state.menuList.find((item) => item.index === this.state.selectedIndex)
                // resolve(object)
                resolve([])
            })
        },
        getCompanylist({state, commit}) {
            return new Promise((resolve) => {
                if(state.companylist.length) {
                    resolve(state.companylist)
                } else { 
                    Ajax.post('/right/company/able/list').then(res =>{
                        if(res.success){
                            let tempArr=[]
                            res.result.forEach((v)=>{
                                tempArr.push({
                                    value:v.id,
                                    label:v.companyName,
                                    property:v.property
                                })
                            })
                            // companylist.COMPANY_LIST_OPTS =tempArr
                            commit('saveCompanylist', tempArr)
                            resolve(tempArr)
                        }else{
                            ElMessage.error(res.resultDes)
                        }
                    })
                }
            })
        }
    },
    plugins: [createPersistedState({ // 在页面重新加载之间，补充Vuex状态。
        storage: window.sessionStorage,
        paths: ['menu', 'selectedProject', 'selectedPage', 'opendPages', 'currentTab', 'companylist']
    })]
})