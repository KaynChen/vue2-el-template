import { getLocal, setLocal, removeLocal } from '@/utils/token'
import MD5Util from '@/utils/MD5Util'
import { login, getMenuInfo } from '@/api/login'
import routeTree from '@/utils/routeTree'
import { constantRoutes, asyncRouterMap } from '@/router/routes'
import router from '@/router'

// 深拷贝 - 工具函数
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

// 递归输出路由树
export function convertRouter(menu = [], asyncRouterMap = []) {
  if (menu) {
    const accessedRouters = []
    menu = Array.from(menu)
    asyncRouterMap = Array.from(asyncRouterMap)
    asyncRouterMap.forEach(asyncRouterItem => {
      menu.forEach(item => {
        const temp = { ...asyncRouterItem }
        let tempArr = deepClone(accessedRouters)
        // 判断是不是没有code值和children项，没有的话就添加
        if (!temp.code && !temp.children) {
          let isRepeat = tempArr.filter(i => i.name === temp.name && i.path === temp.path)
          // 过滤重复的添加的路由
          if (!isRepeat.length) accessedRouters.push(temp)
        }
        // 如果code和前端路由的code一致，那么添加的异步路由中
        if (temp.code === item.code) {
          if (item.children && item.children.length) {
            temp.children = convertRouter(item.children, temp.children)
          }
          accessedRouters.push(temp)
        }
      })
    })
    return accessedRouters
  } else {
    return []
  }
}

// 返回重定向的路径（都是子项目里面的第一个元素地址，children[0].path）
export function returnRedirectPath(obj) {
  let path = obj.path + '/'
  if (obj.children && obj.children.length) {
    path += returnRedirectPath(obj.children[0])
  }
  return path
}

// 为菜单重新设置重定向地址
export function resetRedirect(asyncRouterMap) {
  Array.from(asyncRouterMap).forEach(item => {
    if (!item.redirect) {
      item.redirect = returnRedirectPath(item).lastIndexOf('/') >= 0 ? returnRedirectPath(item).substring(0, returnRedirectPath(item).lastIndexOf('/')) : returnRedirectPath(item)
    }
  })
  return asyncRouterMap
}
// console.info(constantRoutes)
const state = {
  token: getLocal('token'), // 用户token
  routes: [], // 路由权限
  userInfo: getLocal('userInfo') // 用户信息
}

const getters = {
  routes: state => state.routes
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    let userData = deepClone(userInfo)
    userData.password = MD5Util.md5(userData.password)
    const { userName, password, codeKey } = userData
    return new Promise((resolve, reject) => {
      login({ userName: userName.replace(/\s/g, ''), password: password.replace(/\s/g, ''), codeKey: codeKey })
        .then(response => {
          commit('SET_ROUTES', routeTree(response.menus))
          setLocal('token', response.token)
          setLocal('userInfo', JSON.stringify(response.userInfo))
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // user logout
  Logout({ commit }) {
    return new Promise(resolve => {
      removeLocal('token')
      removeLocal('userInfo')
      resolve()
    })
  },
  // 获取路由信息
  GetMenuInfo({ commit }) {
    return new Promise((resolve, reject) => {
      let asyncRoutes = []
      getMenuInfo()
        .then(res => {
          // 重新设置异步路由里面的重定向地址
          let redirectList = resetRedirect(convertRouter(routeTree(res), asyncRouterMap))
          const abnormalRouter = { path: '*', redirect: '/404', code: 'KM_DEFAULT_CODE', hidden: true }
          asyncRoutes = [...redirectList, abnormalRouter]
          resolve()
        })
        .catch(error => {
          router.push({ name: 'login' })
          reject(error)
        })
      commit('SET_ROUTES', [...constantRoutes, ...asyncRoutes])
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
