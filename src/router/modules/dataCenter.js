import { _import } from '@/utils'
import Layout from '@/layout'
import kmContainer from '@/components/km-container'
const dataCenter = {
  path: '/dataCenter',
  name: 'dataCenter',
  code: 'DATACENTER',
  component: Layout,
  meta: {
    title: '数据中心',
    name: 'dataCenter'
  },
  children: [
    {
      path: 'transactionInquiry',
      name: 'transactionInquiry',
      code: 'DATACENTER_TRANSACTIONINQUIRY',
      redirect: { name: 'merchantOrderQuery' },
      component: kmContainer,
      meta: {
        title: '交易数据',
        name: 'transactionInquiry'
      },
      children: [
        {
          path: 'merchantOrderQuery',
          component: () => import('@/pages/dataCenter/transactionInquiry/merchantOrderQuery.vue'),
          name: 'merchantOrderQuery',
          code: 'DATACENTER_TRANSACTIONINQUIRY_MERCHANTORDERQUERY',
          meta: { title: '交易流水查询', name: 'merchantOrderQuery' }
        },
        {
          path: 'singleOrderQuery',
          component: () => import('@/pages/dataCenter/transactionInquiry/singleOrderQuery.vue'),
          name: 'singleOrderQuery',
          code: 'DATACENTER_TRANSACTIONINQUIRY_SINGLEORDERQUERY',
          meta: { title: '单笔订单查询',name: 'singleOrderQuery' }
        },
        {
          path: 'refundOrderQuery',
          component: () => import('@/pages/dataCenter/transactionInquiry/refundOrderQuery.vue'),
          name: 'refundOrderQuery',
          code: 'DATACENTER_TRANSACTIONINQUIRY_REFUNDORDERQUERY',
          meta: { title: '退款订单查询',name: 'refundOrderQuery' }
        }
      ]
    }
  ]
}
export default dataCenter
