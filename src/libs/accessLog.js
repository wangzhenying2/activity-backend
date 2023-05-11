
/**
 *  Created by wangxiaoxiang on 2022/03/31
 *  前端监控埋点上报
 **/
import axios from 'axios'
import utils from './utils'

const accessLogRequest = (param) => {
    const url = location.hostname.match(/dev/) ? 'https://log-dev.shuyaotest.com/bk/log'
        : location.hostname.match(/-syao\d/) ? 'https://log' + location.hostname.match(/-syao\d/)[0] + '.shuyaotest.com/bk/log'
            : 'https://log.zhaojiling.com/bk/log'
    if (navigator.sendBeacon) {
        // const pmstr = []
        // for (const key in param) {
        //     if (Object.hasOwnProperty.call(param, key)) {
        //         pmstr.push(`${key}=${param[key]}`)
        //     }
        // }
        const blob = new Blob([JSON.stringify(param)], {
            type: 'application/json'
        })
        navigator.sendBeacon(url, blob)
    } else {
        axios.post(url, param)
    }
}

// 埋点日志上报
function accessLog({ eventType = 'page-access', eventDesc, url, ...restArgs } = {}) {
    if (url.match(/(exodus)/)) {
        return
    }
    const params = {
        system: '3.0',
        userName: utils.getCookie('userName'),
        nickName: utils.getCookie('realName'),
        eventTime: utils.dateFormat(new Date()),
        eventStamp: new Date().getTime(),
        pageTitle: document.title,
        eventType,
        eventDesc,
        url: url || window.location.href,
        referrer: eventType.indexOf('page') === 0 ? location.referrer : window.location.href,
        ...restArgs
    }

    params.extendData = typeof params.extendData === 'object' ? JSON.stringify(params.extendData) : ''
    if (location.href.indexOf('-dev') < 0) {
        return accessLogRequest(params)
    }
}

// 接口访问及数据处理
function apiAccessLog(request, response) {
    // 请求方式不同，参数获取方式差异
    // TODO：注意各个系统的传参方式可能不一样
    const reqParams = request.method.toUpperCase() === 'GET' ? request.params : request.body
    // 对埋点上报接口自身不再上报，否则当接口事件时会进入无限循环
    // if (!reqParams.eventType && !reqParams.system) {
    //     return
    // }
    const params = { eventType: 'api-access', url: '', request: JSON.stringify(reqParams), response: '', eventDesc: '' }

    // 相对地址处理
    params.url = (request.url.indexOf('http') === 0 ? '' : window.location.origin) + request.url

    const status = response.status
    if (status === 200) {
        let res = response.body
        res = res.ret || res
        // 存在success字段且为false
        // TODO：注意各个系统的判断方式可能不一样
        if (res.code !== 'E00000' && !res.success) {
            Object.assign(params, { eventType: 'api-false', response: res.resultDes || '', eventDesc: '接口校验失败提示', extendData: res.code })
        } else {
            // 正常的请求，埋点不上报参数
            params.request = ''
            params.eventType = 'api-access'
        }
    } else {
        Object.assign(params, { eventType: 'api-error', response: response.status, eventDesc: '接口访问异常错误码', extendData: response.body })
    }
    accessLog(params)
}

export { apiAccessLog, accessLog }
