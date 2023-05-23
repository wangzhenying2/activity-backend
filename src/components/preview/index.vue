<template>
    <el-tabs tab-position="left">
        <el-tab-pane label="首页">
            授也
        </el-tab-pane>
        <el-tab-pane label="奖品详情">奖品详情</el-tab-pane>
        <el-tab-pane label="中奖页面">中奖页面</el-tab-pane>
        <el-tab-pane label="没中奖页">没中奖页</el-tab-pane>
        <el-tab-pane label="奖品派完页">奖品派完页</el-tab-pane>
    </el-tabs>
</template>

<script setup>
import { watch, ref, computed } from 'vue'
import utils from '@/libs/utils'
import Ajax from '@/libs/Ajax'
const companylist = computed(() => store.state.companylist)

const prop = defineProps(['cur_companyId','cur_deptId'])
const companyId = ref(prop.cur_companyId) 
const deptId = ref(prop.cur_deptId)
const deptlist_query = ref([])

function changeCompany(val) {
    deptId.value = ''
    if (val) {
        Ajax.post('/right/dept/getDeptBycompanyId',{
            'companyId':val
        }).then(res=>{
            let tmpArr = []
            if(res.length>0){
                res.forEach((v)=>{
                    tmpArr.push({
                        value:v.deptid,
                        label:v.deptname
                    })
                })
            } 
            deptlist_query.value = tmpArr
        })
    } else {
        deptlist_query.value = []
    }    
}

const emit = defineEmits(['companyIdTrans','deptIdTrans'])

watch(companyId, newVal => {
    emit('companyIdTrans', newVal)
})

watch(deptId, newVal => {
    emit('deptIdTrans', newVal)
})

</script>
<style lang="scss" >
    .companydept{
        display:inline-block
    }
</style>