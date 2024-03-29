import request from '@/utils/request'

export function querySubIndustry() {
  return request({
    url: '/performance/detail/queryDownIndustry',
    method: 'post'
  })
}

// 当前查询条件合计
export function summaryCount(data) {
  return request({
    url: '/performance/summary/count',
    method: 'POST',
    data
  })
}

// 分页列表
export function queryByPage(data) {
  return request({
    url: '/performance/summary/page',
    method: 'POST',
    data
  })
}
