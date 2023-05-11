<template>
    <router-view />
    <div class="browser" v-if="!tipFlag">为了您更好的使用体检，请在Chrome浏览器下打开此页面，<a class="downChrome" href="https://www.google.cn/chrome/" target="_blank">立即下载Chrome </a>
        <el-button class="downChromeClose" type="warning" @click="onClose">知道了</el-button>
    </div>
</template>

<script setup>

import { ref } from 'vue'
const tipFlag = ref(true)
if (!sessionStorage.getItem('tipFlag')) {
    // ie浏览器有Edg和Chrome 
    if (window.navigator.userAgent.indexOf('Chrome') !== -1 && window.navigator.userAgent.indexOf('Edg') > -1) { // userAgent有Chrome和edg是ie浏览器
        tipFlag.value = false
    } else {
        tipFlag.value = window.navigator.userAgent.indexOf('Chrome') !== -1
    }
} else {
    tipFlag.value = true
}

console.log('哈哈哈哈' + sessionStorage.getItem('tipFlag'))
const onClose = () => {
    tipFlag.value = true
    sessionStorage.setItem('tipFlag', true)
}

//在页面加载时读取sessionStorage里的状态信息
// if (sessionStorage.getItem("store")) {
//     store.replaceState(Object.assign({}, store.state, JSON.parse(sessionStorage.getItem("store"))))
// } 

// //在页面刷新时将vuex里的信息保存到sessionStorage里
// window.addEventListener("beforeunload",()=>{
//     sessionStorage.setItem("store",JSON.stringify(store.state))
// })

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
}
.browser {
  width: 100%;
  position: absolute;
  left: 0%;
  top: 0;
  background: #fdf6ec;
  color: #e6a23c;
  border-radius: 4px;
  padding: 5px 20px;
  text-align: center;
}
a.downChrome {
    text-decoration:underline;
  }
.downChromeClose {
  float: right;
  vertical-align: middle;
}
</style>
