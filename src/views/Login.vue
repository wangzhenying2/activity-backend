<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">数钥统一认证后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" size="normal" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="请输入用户名">
                        <template #prepend>
                            <i class="el-icon-user"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="param.password"
                              @keyup.enter="submitForm()">
                        <template #prepend>
                            <i class="el-icon-lock"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="identityCode">
                    <el-input placeholder="请输入验证码" v-model="param.identityCode"
                              @keyup.enter="submitForm()">
                        <template #prepend>
                            <i class="el-icon-message"></i>
                        </template>
                        <template #append>
                            <el-button @click="onIdentityCodeClick" :disabled="!identity.flag">{{identity.msg}}</el-button>
                        </template>
                    </el-input>
                    
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Ajax from '@/libs/Ajax'
import utils from '@/libs/utils'
import CryptoJS from 'crypto-js'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()

const encrypt = t=> {
    var e = 'YWl4dWVkYWk0MDAtODY3MQ==',
        n = CryptoJS.enc.Base64.parse(e),
        i = CryptoJS.enc.Base64.parse(e)
    return CryptoJS.AES.encrypt(t, n, {
        iv: i,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    }).toString()
}

const param = reactive({
    username: '',
    password: '',
    identityCode: ''
})
const rules = {
    username: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
        }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    identityCode: [
        {required: true, message: '请输入验证码', trigger: 'blur'}
    ]
}

// 验证码相关
const identity = reactive({
    msg:'获取验证码',
    flag: true
})

// 验证码按钮点击
const onIdentityCodeClick = () => {
    if (!param.username.trim() || !param.password.trim()) {
        ElMessage.error('请输入手机号和密码')
        return
    }
    Ajax.post('/right/phone/msg', {
        username: param.username,
        password: encrypt(param.password)
    }).then(res => {
        ElMessage.closeAll()
        if (res.success) {
            identity.flag = false
            let timer = 60
            const interval = setInterval(() => {
                timer--
                identity.msg = `${timer}秒后重试`
                if (timer == 0) {
                    identity.flag = true
                    identity.msg = '获取验证码'
                    clearInterval(interval)
                }
            }, 1000, 60000)
        } else {
            ElMessage.error(res.result)
        }
    })
}

// 登录
const login = ref(null)
const submitForm = () => {
    login.value.validate((valid) => {
        if (valid) {
            Ajax.post('/right/login/check', {
                username:param.username,
                password:encrypt(param.password),
                pin: param.identityCode
            }).then(res => {
                ElMessage.closeAll()
                if (!res.token) {
                    ElMessage.error(res.msg)
                } else {
                    ElMessage.success('登录成功')
                    localStorage.setItem('sso_token', res.token)
                    if (import.meta.env.DEV) {
                        // 开发环境需要手动写入cookie
                        utils.saveCookie('sso_token', res.token)
                    }
                    utils.saveCookie('userName', param.username)
                    store.commit('clearState')
                    router.push('/views/home')
                }
            })
        }
    })
}

</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color:#409eff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
</style>