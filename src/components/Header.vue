<template>
    <div class="header">
        <div class="logo" @click="router.push('/')">后台管理系统</div>
        <div class="menu-layer">
            <el-space class="project-list">
                <div v-for="item in (projects.length > 8 ? projects.slice(0, 8) : projects)" :key="item.projectid" :index="item.projectid+''" class="project-item">
                    <a class="text-base cursor-pointer" :class="{'el-button-selected':selectedId === item.projectid }" @click="handleProjectClick(item.projectid)" :title="item.projectname">{{item.projectname}}</a>
                </div>
                <el-menu
                    :default-active="selectedId"
                    class="menu-more"
                    background-color="#242f42"
                    text-color="#fff"
                    mode="horizontal"
                    @select="handleProjectChange"
                >
                    <el-sub-menu v-if="projects.length>8" index="">
                        <template #title>更多</template>
                        <el-menu-item v-for="item in projects.slice(8)" :key="item.projectid" :index="item.projectid+''">{{item.projectname}}</el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </el-space>
        </div>
        
        <div class="header-right">
            <div class="header-user-con">
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        欢迎您，{{username}}
                        <el-icon :size="15" style="vertical-align: middle"><caretBottom/></el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="changePwd">修改密码</el-dropdown-item>
                            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>

        <!-- 修改密码界面 -->
        <el-dialog title="修改密码" width="35%" v-model="cgpwdVisible" :show-close=false>
            <el-form :model="dataForm" label-width="150px" :rules="rules" ref="pwdForm" size="small" label-position="right">
                <el-form-item label="旧密码" prop="oldPassword">
                    <el-input v-model="dataForm.oldPassword" type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input v-model="dataForm.newPassword" type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="comfirePassword">
                    <el-input v-model="dataForm.comfirePassword" type="password" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cgpwdVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitChangePwd">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import Ajax from '@/libs/Ajax'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed, ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Fold, Expand, CaretBottom, ArrowDown } from '@element-plus/icons-vue'
const store = useStore()

const username = computed(() => store.state.menu.user ? store.state.menu.user.realname : '')

const router = useRouter()

const cgpwdVisible = ref(false)
const dataForm = reactive({
    oldPassword: '',
    newPassword: '',
    comfirePassword: ''
})

const checkPwd = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('请再次输入新密码'))
    } 

    if (value !== dataForm.newPassword) {
        return callback(new Error('您两次输入的新密码不一致！'))
    }

    return callback()
}
const rules = {
    oldPassword: [
        { required: true, message: '请输入旧密码', trigger: 'blur' }
        // { type: 'string', required: true, message: '8位以上包含大写字母，小写字母，数字和特殊字符！', pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, trigger: 'blur'}
    ],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { type: 'string', required: true, message: '8位以上包含大写字母，小写字母，数字和特殊字符！', pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, trigger: 'blur'}
    ],
    comfirePassword: [
        { type: 'string', required: true, validator: checkPwd, trigger: ['blur', 'change'] }
    ]
}
const handleCommand = (command) => {
    if (command === 'loginout') {
        localStorage.removeItem('sso_token')
        Ajax.get('/right/exit', {}).then(res => {
            if (res.success) {
                router.push('/views/login')
            }else {
                ElMessage.error(res.resultDes)
            }
        })
    } else (
        cgpwdVisible.value = true
    )
}

const pwdForm = ref(null)
const submitChangePwd = () => {
    pwdForm.value.validate((valid) => {
        if (valid) {
            Ajax.post('/right/login/changepwd', {
                pwd:dataForm.oldPassword,
                newpwd:dataForm.newPassword
            }).then(res => {
                ElMessage.closeAll()
                if (res.code ===  '100' ) {
                    cgpwdVisible.value = false
                    ElMessage.success('修改密码成功！')
                }else {
                    ElMessage.error(res.msg)
                }
            }) 
        }
    })
}

const projects = computed(() => store.state.menu.projects)

const selectedId = computed(() => store.state.selectedProject)
// 菜单-点击
function handleProjectClick(projectid) {
    selectedId.value = 0
    store.commit('setMenuCurrent', projectid)
}
// 菜单更多-点击
const handleProjectChange = (projectid) => {
    selectedId.value = projectid
    store.commit('setMenuCurrent', projectid)
}
</script>

<style lang="scss" scoped>
.header :deep(){
    padding: 0 20px;
    box-sizing: border-box;
    width: 100%;
    font-size: 18px;
    color: #fff;
    background-color: #242f42;
    display: flex;
    align-items: center;
    .el-space__item {
        padding-bottom: 4px!important;
        margin-right: 0!important;
    }
}


.header .logo {
    width: 160px;
    cursor: pointer;
}



.header-user-con {
    display: flex;
    height: 50px;
    align-items: center;
}

.user-name {
    margin-left: 10px;
}

.user-avator {
    margin-left: 20px;
}

.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}

.el-dropdown-menu__item {
    text-align: center;
}


.project-list {
    flex-wrap: nowrap;
    margin-bottom: 0!important;
    .project-item {
        max-width: 6rem;
        height: 1.8rem;
        overflow: hidden;
    }
    .el-button-selected, a:hover {
        background-color: #7080906b;
        border-radius: 6px;
    }
}
.text-base {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    color: #fff;
}
.menu-layer {
    padding: 10px 0;
    flex: 1 1 0%;
}
:deep(.menu-more) {
    width: 180px;
    border-bottom: 0;
    &.el-menu--horizontal>.el-sub-menu .el-sub-menu__title {
        border-bottom: 0;
        height: 1.8rem;
        line-height: 1.8rem;
    }
    &.el-menu--horizontal>.el-sub-menu.is-active .el-sub-menu__title {
        border-bottom: 0;
    }
}
</style>