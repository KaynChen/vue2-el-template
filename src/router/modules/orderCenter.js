import { _import } from '@/utils'
import Layout from '@/layout'
import kmContainer from '@/components/km-container'

const orderCenter = {
  path: '/orderCenter',
  name: 'orderCenter',
  code: 'ORDERCENTER',
  component: Layout,
  meta: {
    title: '订单管理',
    name: 'orderCenter'
  },
  children: [
    {
      path: 'orderManagement',
      name: 'orderManagement',
      code: 'ORDERCENTER_ORDERMANAGEMENT',
      component: kmContainer,
      meta: {
        title: '订单管理',
        icon: 'el-icon-menu',
        name: 'orderManagement'
      },
      children: [
        {
          path: 'softwareAuthorization',
          component: _import('orderCenter/OrderManagement/SoftwareAuthorization'),
          name: 'softwareAuthorization',
          code: 'ORDERCENTER_ORDERMANAGEMENT_SOFTWAREAUTHORIZATION',
          meta: { title: '软件授权订单', name: 'softwareAuthorization', cache: true }
        },
        {
          path: 'softwareAuthorizationDetails',
          component: _import('orderCenter/OrderManagement/SoftwareAuthorization/softwareAuthorizationDetails'),
          name: 'softwareAuthorizationDetails',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          meta: { title: '软件授权订单详情', name: 'softwareAuthorizationDetails', cache: true }
        },
        {
          path: 'softwarePurchaseOrder',
          component: _import('orderCenter/OrderManagement/SoftwarePurchaseOrder'),
          name: 'softwarePurchaseOrder',
          code: 'ORDERCENTER_ORDERMANAGEMENT_SOFTWAREPURCHASEORDER',
          meta: { title: '软件采购订单', name: 'softwarePurchaseOrder', cache: true }
        },
        {
          path: 'softwarePurchaseDetails',
          component: _import('orderCenter/OrderManagement/SoftwarePurchaseOrder/softwarePurchaseDetails'),
          name: 'softwarePurchaseDetails',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          meta: { title: '软件采购订单详情', name: 'softwarePurchaseDetails', cache: true }
        },
        {
          path: 'softwareInventoryApply',
          component: _import('orderCenter/OrderManagement/SoftwareInventoryApply'),
          name: 'softwareInventoryApply',
          code: 'ORDERCENTER_ORDERMANAGEMENT_SOFTWAREINVENTORYAPPLY',
          meta: { title: '软件分销订单', name: 'softwareInventoryApply', cache: true }
        },
        {
          path: 'softwareInventoryApplyDetails',
          component: _import('orderCenter/OrderManagement/SoftwareInventoryApply/softwareInventoryApplyDetails'),
          name: 'softwareInventoryApplyDetails',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          meta: { title: '软件库存申请单详情', name: 'softwareInventoryApplyDetails', cache: true }
        },
        {
          path: 'hardwarePurchaseOrder',
          component: _import('orderCenter/OrderManagement/HardwarePurchaseOrder'),
          name: 'hardwarePurchaseOrder',
          code: 'ORDERCENTER_ORDERMANAGEMENT_HARDWAREPURCHASEORDER',
          meta: { title: '硬件采购订单', name: 'hardwarePurchaseOrder', cache: true }
        },
        {
          path: 'hardwarePurchaseDetails',
          component: _import('orderCenter/OrderManagement/HardwarePurchaseOrder/hardwarePurchaseDetails'),
          name: 'hardwarePurchaseDetails',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          meta: { title: '硬件采购订单详情', name: 'hardwarePurchaseDetails', cache: true }
        },
        {
          path: 'demandDevelopmentFee',
          component: _import('orderCenter/OrderManagement/DemandDevelopmentFee/demandDevelopmentFee'),
          name: 'demandDevelopmentFee',
          code: 'ORDERCENTER_ORDERMANAGEMENT_DEMANDDEVELOPMENTFEE',
          meta: { title: '需求开发订单', name: 'demandDevelopmentFee', cache: true }
        },
        {
          path: 'demandDevelopmentFeeDetails',
          component: _import('orderCenter/OrderManagement/DemandDevelopmentFee/demandDevelopmentFeeDetails'),
          name: 'demandDevelopmentFeeDetails',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          meta: { title: '需求开发收费单详情', name: 'demandDevelopmentFeeDetails', cache: true }
        },
        {
          path: 'erpAuthorizedTransfer',
          component: _import('orderCenter/OrderManagement/ErpAuthorizedTransfer/erpAuthorizedTransfer'),
          name: 'erpAuthorizedTransfer',
          code: 'ORDERCENTER_ORDERMANAGEMENT_ERPAUTHORIZEDTRANSFER',
          meta: { title: 'ERP授权变更申请', name: 'erpAuthorizedTransfer', cache: true }
        },
        {
          path: 'erpAuthorizedTransferDetails',
          component: _import('orderCenter/OrderManagement/ErpAuthorizedTransfer/erpAuthorizedTransferDetails'),
          name: 'erpAuthorizedTransferDetails',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          meta: { title: 'erp授权变更单详情', name: 'erpAuthorizedTransferDetails', cache: true }
        },
        {
          path: 'softwareUpdateOrder',
          component: _import('orderCenter/OrderManagement/SoftwareUpdateOrder/softwareUpdateOrder'),
          name: 'softwareUpdateOrder',
          code: 'ORDERCENTER_ORDERMANAGEMENT_SOFTWAREUPDATEORDER',
          meta: { title: '软件升级订单', name: 'softwareUpdateOrder', cache: true }
        },
        {
          path: 'softwareUpdateOrderDetails',
          component: _import('orderCenter/OrderManagement/SoftwareUpdateOrder/softwareUpdateOrderDetails'),
          name: 'softwareUpdateOrderDetails',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          meta: { title: '软件升级订单详情', name: 'softwareUpdateOrderDetails', cache: true }
        },
        {
          path: 'ysOrder',
          component: _import('orderCenter/OrderManagement/ysOrder/index'),
          name: 'ysOrder',
          code: 'ORDERCENTER_YOUSHU',
          meta: { title: '有数订单', name: 'ysOrder' }
        },
        {
          path: 'ysOrderDetail',
          component: _import('orderCenter/OrderManagement/ysOrder/details'),
          name: 'ysOrderDetail',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          meta: { title: '有数订单详情', name: 'ysOrderDetail', cache: true }
        },
        {
          path: 'ewechatOrder',
          component: _import('ewechat/order'),
          name: 'ewechatOrder',
          code: 'ORDERCENTER_EWECHAT_ORDER',
          meta: { title: '企微订单', name: 'ewechatOrder', cache: true }
        },
        {
          path: 'ewechatOrderDetail',
          component: _import('ewechat/orderDetail'),
          name: 'ewechatOrderDetail',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          meta: { title: '企微订单详情', name: 'ewechatOrderDetail', cache: true }
        }
      ]
    },
    {
      path: 'validityQuery',
      name: 'validityQuery',
      code: 'ORDERCENTER_VALIDITYQUERY',
      redirect: { name: 'takeawayPeriod' },
      component: kmContainer,
      meta: {
        title: '有效期查询',
        icon: 'el-icon-menu',
        name: 'validityQuery'
      },
      children: [
        {
          path: 'takeawayPeriod',
          component: () => import('@/pages/orderCenter/validityQuery/takeawayPeriod.vue'),
          name: 'takeawayPeriod',
          code: 'ORDERCENTER_VALIDITYQUERY_TAKEAWAYPERIOD',
          meta: { title: '享钱外卖有效期', name: 'takeawayPeriod', cache: true }
        }
      ]
    }
  ]
}
export default orderCenter
