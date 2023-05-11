<template>
    <div class="item-pagination">
        <el-pagination
            layout="sizes, prev, pager, next, total"
            :total="total"
            :current-page="cpage"
            :page-sizes="pgSizes"
            :page-size="pageSize"
            @size-change="handleSizeChange"
            v-on:current-change="currentChange"
        >
        </el-pagination>
    </div>
</template>
<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import Ajax from '@/libs/Ajax'
import { ElMessage } from 'element-plus'
const prop = defineProps(['sidex', 'sord', 'url', 'postdata', 'initdata', 'pageSizes'])
const total = ref(0)
const rs = ref('')
const page = ref(1)
const cpage = ref(1)
const rows = ref(20)
const pageSize = ref(20)
const pgSizes = [20, 50, 100, 200]


function handleSizeChange(size) {
    rows.value = size
    pageSize.value = size
    query()
}

const query = () => {
    page.value = 1
    reset()
    getData(1)
}

const refresh = (callback) => {
    getData(page.value, callback)
}

// 暴露组件定义的方法和变量给父级使用
defineExpose({
    query,
    refresh
})

function reset() {
    cpage.value = 1
}



function currentChange(currentPage) {
    page.value = currentPage
    getData(currentPage)
}

function formatPostData(currentPage) {
    let post = {
        sidex: prop.sidex,
        sord: prop.sord,
        nd: +new Date(),
        page: currentPage,
        rows: rows.value,
        pageSize: rows.value
    }

    let postData = {
        ...post,
        ...prop.postdata
    }

    return postData
}

const emit = defineEmits(['loading', 'ajaxResult', 'allSum', 'transferLoading', 'ajaxResult', 'transferLoading'])
const vm = getCurrentInstance()
function getData(currentPage, callback) {
    emit('loading', true)
    Ajax.post(prop.url, formatPostData(currentPage)).then(rs => {
        emit('loading', false)
        if (rs.success === true || (rs.code && parseInt(rs.code) === 200)) {
            total.value = parseInt(rs.result.records) || 0
            emit('ajaxResult', rs.result.rows || [])
            emit('allSum', total.value) //总条数
            emit('transferLoading', 'false')
            if (callback) {
                callback()
            }
        } else if (rs.code == '-1') {
            emit('ajaxResult', rs.resultDes || '')
            emit('transferLoading', 'false')
        } else {
            if (rs.resultDes) {
                ElMessage.error(rs.resultDes)
            }
        }
    })
}

onMounted(() => {
    if (prop.initdata === '1') {
        getData(1)
    }
})
</script>
<style lang="scss">
.item-pagination {
    text-align: center;
    margin: 20px;
}
</style>