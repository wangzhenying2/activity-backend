<template>
    <el-dialog v-model="codeShow" title="请输入" width="400">
        百度网盘授权码：<el-input v-model="code" autocomplete="off" class="inputWidth" clearable/>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="codeShow = false">取消</el-button>
                <el-button @click="codeSubmit" type="primary">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue'


// 授权码
const codeShow = ref(false)
const code = ref('')

const codeSubmit = () => {
    Ajax.post('/draw/getAccessToken', {
        code: code.value
    }).then(res => {
        
    })
}

</script>
<style lang="scss" >
.inputWidth {
    width: 250px;
}
</style>