'use strict'
const name = '渠道管理平台' // page title

let apiObj = {
  '/commonApi': process.env.VUE_APP_BASE_API
}
console.log(apiObj)

function getProxyTable(apiObj) {
  let newApiObj = {}
  for (let item in apiObj) {
    newApiObj[item] = {
      target: apiObj[item],
      ws: true,
      changeOrigin: true,
      pathRewrite: {},
      proxyTimeout: 10 * 60 * 1000, // 10mins
      timeout: 10 * 60 * 1000 // 10mins
    }
    newApiObj[item]['pathRewrite']['^' + item] = ''
  }
  return newApiObj
}

module.exports = {
  // 如果是开发环境打包,那么输出的根目录为/kmchannel/
  publicPath: process.env.VUE_APP_FLAG === 'dev' && process.env.NODE_ENV === 'production' ? '/kmchannel/' : '/',
  outputDir: 'km-channel-' + process.env.VUE_APP_FLAG, // 打包输出目录名
  assetsDir: 'static',
  productionSourceMap: false, // 去掉生产环境.map文件
  // 开发时的配置
  devServer: {
    port: 80,
    open: false, // 不自动打开浏览器
    disableHostCheck: true,
    proxy: getProxyTable(apiObj)
  },
  configureWebpack: config => {
    config.name = name
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch').delete('preload')
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/assets/scss/variables.scss";@import "~@/assets/scss/mixin.scss";`
      }
    }
  }
}
