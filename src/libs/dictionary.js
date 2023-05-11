//公司状态
export const COMPANY_STATUS = {'able':'有效','disable':'失效'}
//公司属性
export const COMPANY_PROP = {'内部':'内部','外部':'外部'}
export const COMPANY_PROP_OPTS = [
    {
        value:'内部',
        label:'内部'
    },
    {
        value:'外部',
        label:'外部'
    }
]

//部门列表
// export let deptlist = {
//     DEPT_LIST_OPTS :[]
// }
//项目权限列表
export let projectRights = {
    PROJCECT_RIGHTS_CHECKS:[]
}
//数据权限列表
export let dataRights = {
    DATA_RIGHTS_OPTS:[]
}
//项目是否显示状态
export const PROJECT_STATUS = {'0':'显示','1':'隐藏'}
export const PROJECT_STATUS_OPTS = [
    {
        value:'0',
        label:'显示'
    },
    {
        value:'1',
        label:'隐藏'
    }
]
//用户类别
export const USER_TYPE = {'1':'超级管理员','2':'普通用户'}
export const USER_TYPE_OPTS = [
    {
        value:'1',
        label:'超级管理员'
    },
    {
        value:'2',
        label:'普通用户'
    }
]
//菜单类型
export const MENU_TYPE = {0:'菜单',1:'按钮'}
export const MENU_TYPE_OPTS = [
    {
        value:1,
        label:'按钮'
    },
    {
        value:0,
        label:'菜单'
    }
]