<template>
    <el-upload
        class="avatar-uploader"
        action="/draw/upload"
        :show-file-list="false"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
    >
        <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        <template #tip>
            <div class="el-upload__tip">
                {{ prop.tip }}
            </div>
        </template>
    </el-upload>
    
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
const prop = defineProps(['tip'])
const imageUrl = ref('')

const handleSuccess = (
    response,
    uploadFile
) => {
    imageUrl.value = response
}

const beforeUpload = (rawFile) => {
    // if (rawFile.type !== 'image/jpeg') {
    //     ElMessage.error('请上传图片!')
    //     return false
    // }
    if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('图片大小不超过2MB!')
        return false
    }
    return true
}

</script>
<style lang="scss" >
.avatar-uploader .avatar {
    width: 150px;
    height: 150px;
    display: block;
}
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
}
.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    text-align: center;
}
</style>