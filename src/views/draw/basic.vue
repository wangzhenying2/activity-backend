<template>
    <div>
        <el-row>
            <el-col :span="12">
                <preview></preview>
            </el-col>
            <el-col :span="12">
                <el-divider content-position="left">基本选项</el-divider>
                <uploadImg tip="背景图"></uploadImg>
            </el-col>
        </el-row>
    </div>
   
</template>
<script setup>
import { computed, nextTick, ref, onMounted } from 'vue'
import { USER_TYPE, USER_TYPE_OPTS, dataRights } from '@/libs/dictionary'
import { ElMessage, ElMessageBox } from 'element-plus'
import preview from '@/components/preview/index.vue'
import uploadImg from '@/components/uploadImg.vue'
import utils from '@/libs/utils'
import Ajax from '@/libs/Ajax'







// 初始化
// onMounted(() => {
//     codeShow.value = true
//     window.open('http://10.18.11.31:4100/draw/getBaiduCode')
// })
</script>
<style lang="scss">

</style>
