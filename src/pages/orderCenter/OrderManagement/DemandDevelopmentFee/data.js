// 产品类型
export const productType = new Map([
  ['', { value: '', label: '全部' }],
  [1, { value: 1, label: '零售' }],
  [3, { value: 3, label: '餐饮' }],
  [4, { value: 4, label: '专卖' }],
  [5, { value: 5, label: '通用' }]
])

// 订单状态
export const orderStatus = new Map([
  ['', { value: '', label: '全部' }],
  [0, { value: 0, label: '未提交', name: '编辑' }],
  [5, { value: 5, label: '未提交（被退回）', name: '编辑' }],
  [10, { value: 10, label: '待受理', name: '详情' }],
  [20, { value: 20, label: '待审核', name: '详情' }],
  [30, { value: 30, label: '已审核', name: '详情' }]
])

// 付款状态
export const paymentStatus = new Map([
  [-1, { value: -1, label: '全部' }],
  [0, { value: 0, label: '未付款' }],
  [1, { value: 1, label: '部分付款' }],
  [2, { value: 2, label: '已付款' }]
])