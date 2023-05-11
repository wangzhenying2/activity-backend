<template>
    <div class="companydept">
        <el-form-item label="公司">
            <el-select clearable size="small" v-model="companyId" @change="changeCompany">
                <el-option
                    v-for="item in companylist"
                    :key="item.key"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="部门">
            <el-select clearable size="small" v-model="deptId" >
                <el-option
                    v-for="item in deptlist_query"
                    :key="item.key"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
        </el-form-item> 
    </div>
</template>

<script setup>
import { watch, ref, computed } from 'vue'
import utils from '@/libs/utils'
import Ajax from '@/libs/Ajax'
import { useStore } from 'vuex'
const store = useStore()
store.dispatch('getCompanylist')
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