import axios from 'axios'
import qs from 'qs'
import { ElMessage } from 'element-plus'
axios.defaults.baseURL = '/'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 请求拦截器
axios.interceptors.request.use(
    config => {
        // TODO: 部分接口以json格式请求，待统一
        if (config.headers && config.headers['Content-Type'] && config.headers['Content-Type'].includes('json')) {
            return config
        }
        config.data = qs.stringify(config.data) // 转为formdata数据格式
        return config
    },
    error => Promise.error(error)
)
// 返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) => {
    // 对响应数据做些事
    if (!res.status === 200) {
        return Promise.reject(res)
    }
    return res
}, (error) => {
    console.log('error', error)
    if (error.message && error.message.indexOf('timeout') > -1) {
        ElMessage.error('请求超时，请刷新页面重试')
    }
    const status = error.response ? error.response.status : 500
    
    switch (status) {
    case 400:
        ElMessage.error('对不起，请求的参数错误，请确认后重试')
        break
    case 401:
        ElMessage.closeAll()
        ElMessage.error({
            message: '登录超时，请重新登录',
            duration: 2000,
            onClose() {
                window.location.href = '/views/login'
            }
        })
        break
    case 403:
        ElMessage.closeAll()
        ElMessage.error({
            message: '对不起，你没有权限进行此项操作',
            duration: 2000,
            onClose() {}
        })
        break
    case 404:
        ElMessage.closeAll()
        ElMessage.error('对不起，你请求的服务不存在')
        break
    case 422:
        ElMessage.error('您提交的数据格式不正确，请重新检查')
        break
    case 500:
        ElMessage.closeAll()
        ElMessage.error('服务器内部可能正在升级,请稍后再试')
        break
    default:
        ElMessage.error('对不起，系统繁忙，请稍后再试，错误代码(' + status + ')')
    }
    return Promise.reject(error)
})
const methods = ['post', 'get', 'delete']
const Ajax = {}
methods.forEach((method) => {
    Ajax[method] = function(url, pms = {}, ops = {}) {
        const request = method === 'get' ? axios.get(url, { params: pms }) : method === 'post' ? axios.post(url, pms, ops) : axios.delete(url, { data: pms })
        return request.then(response => {
            const res = response.data
            // 统一登录拦截
            if (res.code == -999 || res.r == -999) {
                ElMessage.closeAll()
                ElMessage.error({
                    message: '登录超时，请重新登录',
                    duration: 2000,
                    onClose() {
                        window.location.href = '/views/login'
                    }
                })
                return Promise.reject(res)
            }
            if (res.code == -998 || res.r == -998) {
                ElMessage.closeAll()
                ElMessage.error({
                    message: '对不起，你没有权限进行此项操作，请重新登录',
                    duration: 2000,
                    onClose() {
                        window.location.href = '/views/login'
                    }
                })
                return Promise.reject(res)
            }
            return Promise.resolve(res)
        }, error => {
            return Promise.reject(error)
        })
    }
})
export default Ajax
