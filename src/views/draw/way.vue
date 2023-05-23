<template>
    <div>
        <div class="queryForm">
            <el-form :model="queryForm">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="公司222">
                            <el-select clearable size="small" v-model="queryForm.companyId" @change="changeCompany($event, 'deptlist_query')">
                                <el-option v-for="item in companylist" :key="item.key" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="部门">
                            <el-select clearable size="small" v-model="queryForm.deptId" @change="changeDept($event, 'rolelist_query')">
                                <el-option v-for="item in deptlist_query" :key="item.key" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="角色">
                            <el-select clearable size="small" filterable v-model="queryForm.roleId">
                                <el-option v-for="item in rolelist_query" :key="item.key" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="用户类别">
                            <el-select clearable size="small" v-model="queryForm.userstat">
                                <el-option v-for="item in USER_TYPE_OPTS" :key="item.key" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="手机号">
                            <el-input clearable v-model="queryForm.telphone" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="工号">
                            <el-input clearable v-model="queryForm.userCode" size="small"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="姓名">
                            <el-input clearable v-model="queryForm.username" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="邮箱">
                            <el-input clearable v-model="queryForm.useremail" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="菜单名称或ID">
                            <el-input clearable v-model="queryForm.menuname" size="small"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="数据权限">
                            <el-select clearable size="small" v-model="queryForm.gradeId">
                                <el-option v-for="item in dataRights.DATA_RIGHTS_OPTS" :key="item.key" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" class="ml20" @click="onQuery" size="small">查询</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="btns">
            <el-button size="small" type="primary" @click="doAddDept">添加</el-button>
            <el-button size="small" type="primary" @click="OAsync">OA同步</el-button>
            <el-button size="small" type="primary" @click="onExport">导出</el-button>
            <el-button size="small" type="primary" @click="roleEmpower">角色赋权</el-button>
            <el-button size="small" type="primary" @click="dataEmpower">数据权限赋权</el-button>
        </div>

        <el-table border :data="tableData" @selection-change="handleSelectionChange" style="width: 100%">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="userid" label="ID" min-width="140"></el-table-column>
            <el-table-column prop="userCode" label="工号" min-width="110"></el-table-column>
            <el-table-column prop="telphone" label="手机号" width="100"></el-table-column>
            <el-table-column prop="realname" label="姓名" width="80"></el-table-column>
            <el-table-column prop="useremail" label="邮箱" width="180"></el-table-column>
            <el-table-column prop="sysDataRightVo.gradeName" label="数据权限" min-width="110"></el-table-column>
            <el-table-column prop="roles" label="角色" width="150" :show-overflow-tooltip="true" :formatter="roleFmt"> </el-table-column>
            <el-table-column prop="company.companyName" label="公司" width="150"></el-table-column>
            <el-table-column prop="deptname" label="部门" min-width="120"></el-table-column>
            <el-table-column prop="userstat" label="用户类别" min-width="130">
                <template v-slot="scope">
                    {{ USER_TYPE[scope.row.userstat] }}
                </template>
            </el-table-column>
            <el-table-column prop="modifyTime" label="创建时间" width="150"></el-table-column>
            <el-table-column prop="operator" label="创建人" width="80"></el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template v-slot="scope">
                    <el-button link @click="editHandler(scope.row)">修改</el-button>
                    <el-button link @click="doDelete(scope.row)">注销</el-button>
                    <el-button link @click="checkRights(scope.row)">查看权限</el-button>
                    <el-button link @click="resetPassword(scope.row)">重置密码</el-button>
                    <el-button link @click="accUnlock(scope.row)">账号解锁</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <ac-pagination ref="pagination" url="/right/user/list" :postdata="copyqueryForm" initdata="1" v-on:ajaxResult="getPaginationData"></ac-pagination>
        </div>

        <!-- OA同步 -->
        <el-dialog class="editDialog" title="OA数据同步" :show-close="false" :close-on-click-modal="false" v-model="syncDialog" width="30%">
            <el-form :model="syncForm" :rules="syncrules" ref="syncFormRef" label-width="100px">
                <el-form-item label="工号" prop="code">
                    <el-input size="small" v-model="syncForm.code" placeholder="请输入工号" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="syncSubmit" size="small">确认</el-button>
                    <el-button @click="syncDialog=false" size="small">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 数据权限赋权 -->
        <el-dialog class="editDialog" title="数据权限赋权" :show-close="false" :close-on-click-modal="false" v-model="dataDialog" width="30%">
            <el-form :model="dataForm" label-width="100px">
                <p>选中{{ multipleSelection.length }}个用户</p>
                <el-form-item label="数据权限" prop="dRightId">
                    <el-select size="small" v-model="dataForm.dRightId">
                        <el-option v-for="item in dataRights.DATA_RIGHTS_OPTS" :key="item.key" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="dataSubmit" size="small">确认</el-button>
                    <el-button @click="dataDialog=false" size="small">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 角色赋权 -->
        <el-dialog class="editDialog" title="角色赋权" :show-close="false" :close-on-click-modal="false" v-model="roleDialog" width="50%">
            <el-form ref="roleFromRef" :model="roleForm" :rules="roleFormRules" label-width="100px">
                <p>选中{{ multipleSelection.length }}个用户</p>
                <el-form-item label="所属部门" prop="deptId">
                    <el-select size="small" v-model="roleForm.deptId" @change="changeDept($event, 'roleLists')">
                        <el-option v-for="item in deptlist_role" :key="item.key" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属角色" prop="roleList">
                    <el-checkbox-group v-model="roleForm.roleList" size="small">
                        <el-checkbox v-for="item in roleLists" :key="item.value" :label="item.value" border>{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="roleSubmit" size="small">确认</el-button>
                    <el-button @click="roleDialog=false" size="small">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 重置密码 -->
        <el-dialog class="editDialog" title="重置密码" :show-close="false" :close-on-click-modal="false" v-model="resetPswdDialog" width="30%">
            <el-form :model="resetPswdForm" :rules="passwordrules" ref="resetPswdFormRef" label-width="100px">
                <el-form-item label="密码" prop="password">
                    <el-input size="small" type="password" v-model="resetPswdForm.password" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="recheckPassword">
                    <el-input size="small" type="password" v-model="resetPswdForm.recheckPassword" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="passwordSubmit" size="small">确认</el-button>
                    <el-button @click="resetPswdDialog=false" size="small">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 查看权限 -->
        <el-dialog title="权限查看" v-model="checkRightsDialog" width="50%" >
            <div class="block">
                <el-row>
                    <el-col :span="10">登陆手机号:{{ rightsDetail.username || '' }} </el-col>
                    <el-col :span="10">邮箱:{{ rightsDetail.useremail || '' }} </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">真实姓名:{{ rightsDetail.realname || '' }} </el-col>
                    <el-col :span="10">所属状态:{{ USER_TYPE[rightsDetail.userstat] || '' }} </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">所属部门:{{ rightsDetail.deptname || '' }} </el-col>
                </el-row>
            </div>
            <el-table :data="rightsTableData" border style="width: 100%">
                <el-table-column prop="role" label="角色" min-width="150"> </el-table-column>
                <el-table-column prop="rights" min-width="400" label="权限">
                    <template v-slot="scope">
                        <div v-html="scope.row.rights"></div>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <!-- 新增、编辑 -->
        <el-dialog class="editDialog" :title="addOrEditTitle" :show-close="false" :close-on-click-modal="false" v-model="addOrEditdialog" width="60%">
            <el-form class="roleEdit" :model="userForm" size="small" :rules="userRules" ref="userFormRef" label-width="100px">
                <el-form-item label="公司名称" class="edit-item" prop="companyId">
                    <el-select v-model="userForm.companyId" :disabled="!ifAdd" @change="changeCompany($event, 'deptlist')">
                        <el-option v-for="item in companylist" :key="item.key" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属部门" prop="deptid" class="edit-item">
                    <el-select v-model="userForm.deptid" @change="changeDept($event, 'roleLists')">
                        <el-option v-for="item in deptlist_query" :key="item.key" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="员工ID" v-if="ifOwn" prop="userCode" class="edit-item">
                    <el-input v-model="userForm.userCode" :disabled="!ifAdd" placeholder="请输入员工ID" clearable></el-input>
                </el-form-item>
                <el-form-item label="登录手机号" prop="telphone" class="edit-item">
                    <el-input v-model="userForm.telphone" placeholder="请输入手机号" clearable></el-input>
                </el-form-item>
                <el-form-item label="初始密码" v-if="ifAdd" prop="password" class="edit-item">
                    <el-input v-model="userForm.password" placeholder="请输入初始密码" clearable></el-input>
                </el-form-item>
                <el-form-item label="确认密码" v-if="ifAdd" prop="checkPsw" class="edit-item">
                    <el-input v-model="userForm.checkPsw" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="useremail" class="edit-item">
                    <el-input v-model="userForm.useremail" placeholder="请输入邮箱" clearable></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realname" class="edit-item">
                    <el-input v-model="userForm.realname" placeholder="请输入姓名" clearable></el-input>
                </el-form-item>
                <el-form-item label="用户类别" prop="userstat" class="edit-item">
                    <el-select v-if="ifAdmin" v-model="userForm.userstat">
                        <el-option v-for="item in USER_TYPE_OPTS" :key="item.key" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-select v-if="!ifAdmin" v-model="userForm.userstat">
                        <el-option label="普通用户" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据权限" prop="sysDataRightVo" class="edit-item">
                    <el-select v-model="userForm.sysDataRightVo">
                        <el-option v-for="item in dataRights.DATA_RIGHTS_OPTS" :key="item.key" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限角色" prop="roles" class="full-item">
                    <el-checkbox-group v-model="userForm.roles">
                        <el-checkbox v-for="item in roleLists" :label="item.value" :key="item.value" border>{{ item.label }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item class="full-item">
                    <el-button type="primary" @click="onSubmit">确认</el-button>
                    <el-button @click="onCance">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script setup>
import { computed, nextTick, ref } from 'vue'
import { USER_TYPE, USER_TYPE_OPTS, dataRights } from '@/libs/dictionary'
import { ElMessage, ElMessageBox } from 'element-plus'
import acPagination from '@/components/Pagination.vue'
import utils from '@/libs/utils'
import Ajax from '@/libs/Ajax'
import { useStore } from 'vuex'
const store = useStore()
store.dispatch('getCompanylist')
const companylist = computed(() => store.state.companylist)

const ifOwn = ref(false)
const ifAdmin = ref(true)

const deptlist_query = ref([])
const rolelist_query = ref([])
const deptlist_role = ref([])
const queryForm = ref({
    telphone: '',
    username: '',
    useremail: '',
    menuname: '',
    deptId: '',
    userstat: '',
    roleId: '',
    companyId: '',
    userCode: '',
    gradeId: ''
})

const copyqueryForm = ref({})
const syncDialog = ref(false)
const syncForm = ref({ code: '' })
const syncrules = ref({
    code: [{ required: true, message: '请输入工号', trigger: 'blur' }]
})

const resetPswdDialog = ref(false)
const resetPswdForm = ref({
    password: '',
    recheckPassword: ''
})

const resetPswdFormRef = ref(null)
const validatePass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入密码'))
    } else {
        if (value.length > 15 || value.length < 5) {
            callback(new Error('密码为5-15个字符组成！'))
        }
        let resetPswdFormV = resetPswdForm.value
        if (resetPswdFormV.recheckPassword !== '') {
            resetPswdFormRef.value.validateField('recheckPassword')
        }
        callback()
    }
}

const validatePass2 = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== resetPswdForm.value.password) {
        callback(new Error('两次输入密码不一致!'))
    } else {
        callback()
    }
}

const passwordrules = {
    //重置密码校验
    password: [{ validator: validatePass, trigger: 'blur' }],
    recheckPassword: [{ validator: validatePass2, trigger: 'blur' }]
}

const validateRoles = (rule, value, callback) => {
    if (value.length == 0) {
        callback(new Error('请选择所属角色！'))
    } else {
        callback()
    }
}
const roleFormRules = {
    //角色赋权校验规则
    roleList: [{ validator: validateRoles, trigger: 'blur' }]
}

const checkRightsDialog = ref(false)
const rightsDetail = ref({})
const rightsTableData = ref([])
const addOrEditTitle = ref('新增用户')
const addOrEditdialog = ref(false)
const dataDialog = ref(false) //数据权限赋权dialog
const roleDialog = ref(false) //角色赋权dialog
const ifAdd = ref(false) //是新增还是编辑
const deptlist = ref([]) //部门列表
const tableData = ref([])
const pgSize = [20, 50, 100, 200]
const multipleSelection = ref([]) //多选值
const userRoles = ref([]) //新增的所属角色
const userForm = ref({ companyId: '', deptid: '', userCode: '', telphone: '', password: '', checkPsw: '', useremail: '', realname: '', userstat: '', sysDataRightVo: '', roles: [] })

const dataForm = ref({ dRightId: '1' })
const roleForm = ref({
    //角色赋权数据
    deptId: '',
    roleList: []
})

const userFormRef = ref(null)
const validateUserPass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入密码'))
    } else {
        if (value.length > 15 || value.length < 5) {
            callback(new Error('密码为5-15个字符组成！'))
        }
        if (userForm.value.password !== '') {
            userFormRef.value.validateField('checkPsw')
        }
        callback()
    }
}

const validateUserPass2 = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== userForm.value.password) {
        callback(new Error('两次输入密码不一致!'))
    } else {
        callback()
    }
}



const validateTel = (rule, value, callback) => {
    var reg = /^((1\d{10})?|undefined|null)$/
    if (!reg.test(value)) {
        callback(new Error('登陆手机号格式不正确,请输入1开头的11位数字'))
    } else {
        return callback()
    }
}

const roleLists = ref([]) //角色赋权的所有角色多选框
const deptId = ref('')
const userRules = {
    deptid: [{ required: true, message: '请选择部门', trigger: 'blur' }],
    userCode: [{ required: true, message: '请输入员工ID', trigger: 'blur' }],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { validator: validateUserPass, trigger: 'blur' }
    ],
    checkPsw: [
        { required: true, message: '请重新输入密码', trigger: 'blur' },
        { validator: validateUserPass2, trigger: 'blur' }
    ],
    useremail: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
    telphone: [
        { required: true, message: '请输入登陆手机号', trigger: 'blur' },
        { validator: validateTel, trigger: 'blur' }
    ]
}

utils.getDataRights() //数据权限列表

const checkIfAdmin = () => {
    Ajax.post('/right/user/deptsroles').then(res => {
        if (res.code == 100) {
            ifAdmin.value = res.admin ? true : false
        } else {
            ElMessage.error('deptsroles接口出错')
        }
    })
}
checkIfAdmin() //判断是否admin

const getPaginationData = (data) => {
    tableData.value = data || []
}

//权限格式化
const projectsFmt = (row, col, cel) => {
    if (!cel.length) {
        return ''
    }
    let tmpArr = []
    cel.forEach((v) => {
        tmpArr.push(v.projectname)
    })
    return tmpArr.join(',')
}

//改变公司
const changeCompany = (val, list, callback) => {
    if (val) {
        if (list == 'deptlist_query') {
            queryForm.value.deptId = ''
        } else {
            userForm.value.deptid = ''
        }
        changeCompanyGetDepts(val, list, callback)
    } else {
        //清空公司数据
        if (list == 'deptlist_query') {
            queryForm.value.deptId = ''
            let query = queryForm.value
            query.deptId = ''
            query.roleId = ''
            queryForm.value = query

            deptlist_query.value = []
            rolelist_query.value = []
        } else {
            userForm.value.deptid = ''
        }
    }
}

//改变公司公用接口调用
const changeCompanyGetDepts = (val, list, callback) => {
    let targetList = []
    if (list == 'deptlist') {
        //判断内部、外部公司
        companylist.value.forEach((v) => {
            if (v.value == val) {
                ifOwn.value = v.property == '内部' ? true : false
            }
        })
    }
    Ajax.post('/right/dept/getDeptBycompanyId',{
        companyId: val
    }).then(res => {
        console.log(res)
        if (res.length > 0) {
            res.forEach((v) => {
                targetList.push({
                    value: v.deptid,
                    label: v.deptname
                })
            })
            if (list === 'deptlist' || list === 'deptlist_query') {
                userForm.value.deptid = targetList[0].value
                deptlist_query.value = targetList
            } else {
                deptlist_role.value = targetList
            }
            
        } else {
            if (list == 'deptlist') {
                userForm.value.deptid = ''
                userRoles.value = []
                userForm.value.roles = []
                deptlist_query.value = []
            } else {
                deptlist_role.value = []
            }
        }
        // this[list]=targetList
        if (callback) {
            callback()
        } else {
            //改变公司或者部门，没有callback传入
            if (list == 'deptlist') {
                userForm.value.deptid = targetList[0].value
                changeDept(userForm.value.deptid, 'userRoles')
            }
        }
    })
}

//改变部门
const changeDept = (val, list, callback) => {
    if (list == 'rolelist_query') {
        queryForm.value.roleId = ''
        rolelist_query.value = []
    }
    if (val) {
        let lists = []
        Ajax.post('/right/role/getByDeptId',{
            deptId: val
        }
        ).then(res => {
            if (res.success) {
                if (res.result) {
                    if (res.result.length > 0) {
                        res.result.forEach((v) => {
                            lists.push({
                                value: v.roleid,
                                label: v.rolename
                            })
                        })
                    } else {
                        lists = []
                    }
                    if(list === 'rolelist_query') {
                        rolelist_query.value = lists
                    } else {
                        roleLists.value = lists
                    }
                    // this[list] = lists
                } else {
                    // this[list]=[]
                }
                
                
                if (callback) {
                    callback()
                }
            } else {
                ElMessage.error('获取角色接口错误!')
            }
        })
    }
}

const pagination = ref(null)
//查询
const onQuery = () => {
    copyqueryForm.value = Object.assign({}, queryForm.value)
    nextTick(() => {
        pagination.value.query()
    })
}

const roleFmt = (row, col, val) => {
    let tmpArr = []
    if (row.roles.length > 0) {
        row.roles.forEach((v, i) => {
            tmpArr.push(v.rolename)
        })
    }
    return tmpArr.join(',')
}

//关闭dialog
const closeDialog = (form, dialog) => {
    // form.value.resetFields()
    // this[dialog]=false;
}

//表格多选值改变
const handleSelectionChange = (val) => {
    multipleSelection.value = val
}

//数据权限赋权
const dataEmpower = () => {
    if (ifCheckedRow()) {
        dataDialog.value = true
    }
}
//角色赋权
const roleEmpower = () => {
    if (ifCheckedRow()) {
        //已经选择表格行
        let datas = [],
            deptid = '',
            deptname = '',
            flag = true
        let vMultipleSelection = multipleSelection.value
        const selectOne = vMultipleSelection[0]
        const selectedRows = vMultipleSelection.length
        if (selectedRows.length == 1) {
            deptname = selectOne.deptname
        } else {
            vMultipleSelection.forEach((v, i) => {
                if (i === 0) {
                    deptname = vMultipleSelection[i].deptname
                }
                if (vMultipleSelection[i].deptname !== deptname) {
                    flag = false
                }
            })
        }
        if (!flag) {
            ElMessage.error('请选择同一个部门下的员工进行角色赋权！')
            return
        }
        changeCompanyGetDepts(selectOne.companyId, 'deptlist_role', () => {
            roleForm.value.deptId = selectOne.deptid
            changeDept(selectOne.deptid, 'roleLists')
        })
        roleDialog.value = true
    }
}

const ifCheckedRow = () => {
    let vMultipleSelection = multipleSelection.value
    const selectedRows = vMultipleSelection.length
    if (selectedRows < 1) {
        ElMessage.warning('请至少选择一条记录！')
        return false
    } else {
        return true
    }
}

//导出
const onExport = () => {
    onQuery()
    const { telphone, username, useremail, menuname, deptId, userstat, roleId, companyId, userCode, gradeId } = queryForm.value
    window.location.href =
        '/right/user/downloadXls?telphone=' +
        telphone.trim() +
        '&username=' +
        username.trim() +
        '&useremail=' +
        useremail.trim() +
        '&menuname=' +
        menuname.trim() +
        '&deptId=' +
        deptId +
        '&userstat=' +
        userstat +
        '&roleId=' +
        roleId +
        '&userCode=' +
        userCode.trim() +
        '&companyId=' +
        companyId +
        '&gradeId=' +
        gradeId
}

//OA同步
const OAsync = () => {
    syncDialog.value = true
}

//注销
const doDelete = (row) => {
    ElMessageBox.confirm('确认注销该账号?', '注销').then(() => {
        Ajax.post('/right/user/del',{
            userid: row.userid
        }
        ).then(res => {
            if (res.code == 100) {
                ElMessage.success('注销成功!')
                pagination.value.refresh()
            } else {
                ElMessage.error(res.msg)
            }
        })
    }).catch(() => {})
}

//账号解锁
const accUnlock = (row) => {
    ElMessageBox.confirm('您确定要解锁该用户吗??', '账号解锁').then(() => {
        Ajax.post('/right/user/unlockPhone',{
            userid: row.userid
        }
        ).then(res => {
            if (res.success) {
                ElMessage.success(res.result)
                pagination.value.refresh()
            } else {
                ElMessage.error(res.result)
            }
        })
    }).catch(() => {})
}

//数据权限赋权提交
const dataSubmit = () => {
    let vMultipleSelection = multipleSelection.value
    const userList = vMultipleSelection.map((v) => {
        return v.userid
    })
    Ajax
        .post('/right/user/dright/dataEmpower', {
            dRightId: dataForm.value.dRightId,
            userList: userList
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            if (res.success) {
                ElMessage.success(res.resultDes)
                pagination.value.refresh()
                dataDialog.value = false
                dataForm.value.dRightId = '1'
            } else {
                ElMessage.error(res.msg)
            }
        })
}

const roleFromRef = ref(null)
//角色赋权提交
const roleSubmit = () => {
    roleFromRef.value.validate((valid) => {
        if (valid) {
            let vMultipleSelection = multipleSelection.value
            const userList = vMultipleSelection.map((v) => {
                return v.userid
            })
            const params = {
                deptId: roleForm.value.deptId,
                roleList: roleForm.value.roleList,
                userList
            }
            // console.log(params)
            Ajax.post('/right/user/dright/userEmpower', params, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                if (res.success) {
                    ElMessage.success(res.resultDes)
                    pagination.value.refresh()
                    roleDialog.value = false
                } else {
                    ElMessage.error(res.resultDes)
                }
            })
        } else {
            console.log('error submit!!')
            return false
        }
    })
}

//同步提交
const syncFormRef = ref(null)
const OAsyncRef = ref(null)
const syncSubmit = () => {
    syncFormRef.value.validate((valid) => {
        if (valid) {
            Ajax.post('/right/user/syn/synOaToAicai', {
                code: syncForm.value.code.trim()
            }
            ).then(res => {
                if (res.result) {
                    ElMessage.success('同步成功！')
                    OAsyncRef.resetFields()
                    syncDialog.value = false
                    pagination.value.refresh()
                } else {
                    ElMessage.error(res.resultDes)
                }
            })
        }
    })
}

//重置密码提交
const passwordSubmit = () => {
    resetPswdFormRef.value.validate((valid) => {
        if (valid) {
            Ajax.post('/right/user/updatepass', {
                password: resetPswdForm.value.password,
                userid: resetPswdForm.value.userid
            }
            ).then(res => {
                if (res.code == 100) {
                    ElMessage.success('提交成功!')
                    resetPswdDialog.value = false
                    pagination.value.refresh()
                } else {
                    ElMessage.error(res.msg)
                }
            })
        }
    })
}

//查看权限
const checkRights = (row) => {
    rightsTableData.value = []
    Ajax.post('/right/user/get',{
        userid: row.userid
    }
    ).then(res => {
        if (res.code == 100) {
            checkRightsDialog.value = true
            rightsDetail.value = Object.assign({}, res.user)
            const roles = res.roleModlueResourceList
            let vRightsTableData = rightsTableData.value
            if (roles.length > 0) {
                roles.forEach((v) => {
                    let lis = []
                    const role = v.modlueResourceVos
                    if (role.length > 0) {
                        role.forEach((item) => {
                            let role_arr = []
                            const resource = item.resourceVoList
                            if (resource.length > 0) {
                                resource.forEach((each) => {
                                    role_arr.push(each.resourcename)
                                })
                            } else {
                            }
                            lis.push(`<p><strong>${item.modlueName}-></strong>${role_arr.join(',')}</p>`)
                        })
                    } else {
                    }
                    vRightsTableData.push({
                        role: v.rolename,
                        rights: lis.join('')
                    })
                    rightsTableData.value = vRightsTableData
                })
            } else {
                rightsTableData.value = []
            }
        } else {
            ElMessage.error('调用查看接口失败!')
        }
    })
}

//重置密码
const resetPassword = (row) => {
    resetPswdForm.value.userid = row.userid
    resetPswdDialog.value = true
}

//新增
const doAddDept = () => {
    Object.keys(userForm.value).forEach((key) => (userForm.value[key] = ''))
    let vUserForm = userForm.value
    vUserForm.roles = []
    addOrEditdialog.value = true
    vUserForm.sysDataRightVo = '1' //默认为0级权限
    vUserForm.userstat = '2' //默认为普通用户
    ifAdd.value = true
    addOrEditTitle.value = '新增用户'
    if (localStorage.getItem('addCompanyId') && localStorage.getItem('addDeptId')) {
        vUserForm.companyId = localStorage.getItem('addCompanyId')
        changeCompanyGetDepts(vUserForm.companyId, 'deptlist', () => {
            vUserForm.deptid = localStorage.getItem('addDeptId')
            changeDept(vUserForm.deptid, 'userRoles')
        })
    } else {
        vUserForm.companyId = companylist.value[0].value
        changeCompanyGetDepts(vUserForm.companyId, 'deptlist', () => {
            vUserForm.deptid = deptlist[0].value
            changeDept(vUserForm.deptid, 'userRoles')
        })
    }
    userForm.value = vUserForm
}

// //编辑
const editHandler = (row) => {
    ifAdd.value = false
    addOrEditdialog.value = true
    addOrEditTitle.value = '编辑用户'
    Ajax.post('/right/user/eget', {
        userid: row.userid
    }
    ).then(res => {
        if (res.code == 100) {
            const Data = res.user
            let userFormV = userForm.value
            userFormV.companyId = Data.company.id + ''
            userFormV.telphone = Data.username
            userFormV.sysDataRightVo = Data.sysDataRightVo.id ? ( Data.sysDataRightVo.id + '') : '1'

            userFormV.userid = Data.userid
            userFormV.useremail = Data.useremail
            userFormV.realname = Data.realname
            userFormV.userstat = Data.userstat + ''
            userFormV.userCode = Data.userCode

            changeCompanyGetDepts(userFormV.companyId, 'deptlist', () => {
                userFormV.deptid = Data.deptid
                changeDept(userForm.value.deptid, 'userRoles', () => {
                    if (Data.roles.length > 0) {
                        userFormV.roles = Data.roles.map((i) => {
                            return i.roleid + ''
                        })
                    } else {
                        userFormV.roles = []
                    }
                })
            })
        } else {
            ElMessage.error('eget调用失败！')
        }
    })
}

//新增、编辑提交
const onSubmit = () => {
    userFormRef.value.validate((valid) => {
        if (valid) {
            //校验通过
            let userFormV = userForm.value
            let params = Object.assign({}, userFormV)
            params.username = userFormV.telphone.trim()
            params.sysDataRightVo = { id: userFormV.sysDataRightVo }
            if (params.hasOwnProperty('checkPsw')) {
                delete params.checkPsw
            }
            if (userFormV.roles.length > 0) {
                params.roles = userFormV.roles.map((v, i) => {
                    return { roleid: v }
                })
            }
            localStorage.setItem('addCompanyId', userFormV.companyId)
            localStorage.setItem('addDeptId', userFormV.deptid)

            // console.log( params);
            let url
            if (addOrEditTitle.value === '新增用户') {
                url = '/right/user/add'
                params.userid = ''
            } else {
                url = '/right/user/edit'
            }
            Ajax.post(url, params, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                if (res.success) {
                    ElMessage.success('提交成功!')
                    // this.$refs.userForm.resetFields();
                    pagination.value.refresh()
                    addOrEditdialog.value = false
                } else {
                    userFormV.checkPsw = userFormV.password
                    if (res.resultDes) {
                        ElMessage.error(res.resultDes)
                    } else if (res.msg) {
                        ElMessage.error(res.msg)
                    }
                }
            })
        } else {
            console.log('error submit!!')
            return false
        }
    })
}

const onCance = () => {
    userFormRef.value.resetFields()
    userRoles.value = []
    deptlist.value = []
    addOrEditdialog.value = false
}
</script>
<style lang="scss">
</style>
