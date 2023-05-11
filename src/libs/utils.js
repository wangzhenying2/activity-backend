import {projectRights,dataRights} from './dictionary'
import { ElMessage } from 'element-plus'
import Ajax from './Ajax'

let utils = {
    //confirm
    confirm(vm,content,title,callback){
        vm.$confirm(content, title, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
        }).then(() => {
            callback()
        }).catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            })
        })
    },

    //项目权限列表
    getProjects(){
        Ajax.post('/right/dept/project').then(res=>{
            if(res.code==='100'){
                let tempArr=[]
                res.types.forEach((v)=>{
                    tempArr.push({
                        value:v.projectid,
                        label:v.projectname
                    })
                })
                projectRights.PROJCECT_RIGHTS_CHECKS =tempArr
            }else{
                ElMessage.error('权限列表接口调用失败!')
            }
        })
    },
    //数据权限列表
    getDataRights(){
        Ajax.post('/right/user/dright/query').then(res=>{
            if(res.success){
                let tempArr=[]
                if(res.result.rows.length>0){
                    res.result.rows.forEach((v)=>{
                        tempArr.push({
                            value:v.id,
                            label:v.gradeName
                        })
                    })
                    dataRights.DATA_RIGHTS_OPTS =tempArr
                }
                    
            }else{
                ElMessage.error('权限列表接口调用失败!')
            }
                
        })
    },
    saveCookie(name, value, domain, path, minSec) {
        const cookieEnabled = !!(navigator.cookieEnabled)
        if (name && cookieEnabled) {
            path = path || '/'
            if (typeof value === 'object') {
                value = JSON.stringify(value)
            }
            let exp
            if (minSec) {
                exp = new Date() // new Date("December 31, 9998");
                exp.setTime(exp.getTime() + minSec * 1000)
            } else {
                exp = new Date('9998-01-01')
            }
            let cookieString = `${name}=${encodeURI(value)}${minSec ? (`;expires=${exp.toGMTString()}`) : ''};path=${path};`
            if (domain) {
                cookieString += `domain=${domain};`
            }
            document.cookie = cookieString
            return true
        }
        return false
    },
    getCookie(name) {
        const cookieEnabled = !!(navigator.cookieEnabled)
        if (name && cookieEnabled) {
            const arr = document.cookie.match(new RegExp(`(^| )${name}=([^;]*)(;|$)`))
            if (arr !== null) {
                try {
                    return decodeURI(arr[2])
                } catch (error) {
                    return ''
                }
            }
        }
        return null
    },
    dateFormat(dt, fmt = 'yyyy-MM-dd hh:mm:ss') {
        let newDate = dt
        if (!dt) {
            return ''
        }
        if (typeof dt === 'string') {
        // dt = dt.replace(/-/g, '/') // IOS上只支持yyyy/MM/dd这种标准格式
            dt = /^\d+$/.test(dt) ? parseInt(dt) : dt.replace(/-/g, '/') // 传入的日期可能是个纯数字组成的字符串，如"1511107200000"
        }
        if (dt instanceof Date === false) {
            dt = new Date(dt)
        }
        if (!dt.getTime()) {
            return newDate
        }

        let opt = {
            'y+': dt.getFullYear().toString(), // 年
            'M+': (dt.getMonth() + 1).toString(), // 月
            'd+': dt.getDate().toString(), // 日
            'h+': dt.getHours().toString(), // 时
            'm+': dt.getMinutes().toString(), // 分
            's+': dt.getSeconds().toString() // 秒
        }

        for (const k in opt) {
            const ret = new RegExp('(' + k + ')').exec(fmt)
            if (ret) {
                if (/(y+)/.test(k)) {
                    fmt = fmt.replace(ret[1], opt[k].substring(4 - ret[1].length))
                } else {
                    fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
                }
            }
        }
        return fmt
    }
}
export default utils