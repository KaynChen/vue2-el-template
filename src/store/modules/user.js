import { routeTree, convertRouter, MD5Util, deepClone, resetRedirect } from '@/utils'
import { setLocal, removeLocal } from '@/utils/storage'
import { login, getMenuInfo, logout, popUpsByAuditStatus, queryBaseInfo } from '@/api/login'
import { constantRoutes, asyncRouterMap } from '@/router/routes'
import router from '@/router'

const state = {
  routes: [], // 路由权限
  btns: [],
  xftAuditStatus: false
}

const getters = {
  routes: state => state.routes,
  btns: state => state.btns,
  xftAuditStatus: state => state.xftAuditStatus
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    const abnormalRouter = { path: '*', redirect: '/404', code: 'KM_DEFAULT_CODE', hidden: true }
    // 拼装首页子路由
    if (routes.length > 0) {
      constantRoutes.forEach(item => {
        if (item.name === 'home') item.children = item.children.concat(routes[0].children)
        return item
      })
    }
    state.routes = routes.concat(constantRoutes).concat(abnormalRouter)
  },
  SET_BTNS: (state, btns) => {
    state.btns = state.btns.concat(btns)
  },
  SET_AUDITSTATUS: (state, status) => {
    state.xftAuditStatus = status
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
          popUpsByAuditStatus().then(res => commit('SET_AUDITSTATUS', Boolean(res)))
          setLocal('token', response.token)
          // 重新设置异步路由里面的重定向地址
          const treeRoute = routeTree(response.menus)
          const convertTreeRouter = convertRouter(treeRoute, asyncRouterMap)
          let redirectList = resetRedirect(convertTreeRouter)
          commit('SET_ROUTES', [...redirectList])
          router.addRoutes(state.routes)
          queryBaseInfo()
            .then(info => {
              setLocal('userInfo', JSON.stringify(Object.assign(response.userInfo, info)))
            })
            .catch(() => {
              setLocal('userInfo', JSON.stringify(response.userInfo))
            })
            .finally(() => {
              resolve()
            })
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  Logout({ commit }) {
    return new Promise(resolve => {
      logout()
        .then(() => {
          removeLocal('token')
          removeLocal('userInfo')
          window.location.reload()
          resolve()
        })
        .catch(error => {})
    })
  },

  // 前端 登出
  FedLogOut({ commit }) {
    return new Promise(resolve => {
      commit('SET_ROUTES', [])
      removeLocal('token')
      removeLocal('userInfo')
      resolve()
    })
  },

  // 获取路由信息
  GetMenuInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getMenuInfo()
        .then(res => {
          // 重新设置异步路由里面的重定向地址
          const treeRoute = routeTree(res)
          const convertTreeRouter = convertRouter(treeRoute, asyncRouterMap)
          let redirectList = resetRedirect(convertTreeRouter)
          commit('SET_ROUTES', [...redirectList])
          resolve()
        })
        .catch(error => {
          commit('SET_ROUTES', [...constantRoutes])
          reject(error)
        })
    })
  },
  // 添加按钮权限
  SetBtns({ commit }, list) {
    commit('SET_BTNS', list)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
