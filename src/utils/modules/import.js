// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
export default function _import(file) {
  if (process.env.NODE_ENV === 'development') return require('@/pages/' + file).default
  else return () => import('@/pages/' + file)
}
