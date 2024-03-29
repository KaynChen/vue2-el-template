import axios from 'axios'
import store from '@/store'
import { getLocal } from '@/utils/storage'
import { Message, MessageBox } from 'element-ui'
// import { errorLog } from '@/utils' // 异常状态码封装

let config = {
  timeout: 60 * 1000, // request timeout 60s
  withCredentials: false, // 跨域请求时是否需要凭证
  baseURL: process.env.VUE_APP_BASE_API // url = base url + request url
}

const service = axios.create(config)

service.interceptors.request.use(
  config => {
    if (getLocal('token')) {
      config.isOld && (config.headers['Content-Type'] = 'application/x-www-form-urlencoded') // json格式的不需要
      config.headers['token'] = getLocal('token') // 从localStorage拿token, 放到每个请求头
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.data
    const code = response.data?.code
    if (code === 0) return res.data
    else if (code === 195001) {
      MessageBox.confirm('超时未操作或账号在其他设备登录，请重新登录', '重新登录', {
        confirmButtonText: '重新登录',
        type: 'warning',
        showClose: false,
        showCancelButton: false,
        closeOnClickModal: false, // 遮罩层点击不能关闭MessageBox
        beforeClose: action => {
          if (action === 'cancel') {
            location.reload()
          } else {
            store.dispatch('FedLogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          }
        }
      }).catch(() => {})
      return Promise.reject(res.data || res.msg)
    } else {
      // 异常状态码优化，暂时直接取后台返回msg信息
      // const hasErrorCode = Object.keys(errorLog).includes(String(code))
      Message({
        // message: hasErrorCode ? errorLog[String(code)] : res.data || res.msg,
        message: res.data || res.msg,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(res && (res.data || res.msg))
    }
  },
  error => {
    if (error.message.includes('timeout of')) {
      Message({
        message: '系统繁忙,请稍后再试~~',
        type: 'error',
        duration: 3 * 1000
      })
    } else {
      Message({
        message: error.msg || (error.response && error.response.data.msg) || '网络繁忙,请稍后再试~~',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error && (error.data || error.msg))
  }
)

export default service
