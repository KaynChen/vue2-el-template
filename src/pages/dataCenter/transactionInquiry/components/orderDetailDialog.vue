<template>
  <div>
    <el-dialog :title="dialogTitle" :visible.sync="orderDetailVisible" :width="'883px'" custom-class="p-dialog-order">
      <div class="table-content" v-if="this.type === 'order'">
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">商户名称: </span>
            <span class="table-item-text">{{ form.shopName }}</span>
          </div>
          <div class="table-item-content left-content">
            <span class="table-item-title">门店名称: </span>
            <span class="table-item-text">{{ form.storeName }}</span>
          </div>
        </div>
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">交易时间: </span>
            <span class="table-item-text">{{ form.createDate }}</span>
          </div>
          <div class="table-item-content left-content">
            <span class="table-item-title">支付订单号: </span>
            <span class="table-item-text">{{ form.orders }}</span>
          </div>
        </div>
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">支付流水号: </span>
            <span class="table-item-text">{{ form.tradeNo }}</span>
          </div>
          <div class="table-item-content left-content">
            <span class="table-item-title">线下订单号: </span>
            <span class="table-item-text">{{ form.thirdSn }}</span>
          </div>
        </div>
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">支付完成时间: </span>
            <span class="table-item-text">{{ form.paymentDate }}</span>
          </div>
          <div class="table-item-content left-content">
            <span class="table-item-title">收银员: </span>
            <span class="table-item-text">{{ form.workerName ? form.workerName : '' }}</span>
          </div>
        </div>
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">支付方式: </span>
            <span class="table-item-text">{{ form.methodPluginName }}</span>
          </div>
          <div class="table-item-content left-content">
            <span class="table-item-title">交易状态: </span>
            <span class="table-item-text">{{ form.orderStatusName }}</span>
          </div>
        </div>
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">交易金额: </span>
            <span class="table-item-text">{{ form.amount }}</span>
          </div>
          <div class="table-item-content left-content">
            <span class="table-item-title">商家优惠金额: </span>
            <span class="table-item-text">{{ form.shopCouponAmount }}</span>
          </div>
        </div>
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">平台优惠金额: </span>
            <span class="table-item-text">{{ form.platformCouponAmount }}</span>
          </div>
          <div class="table-item-content left-content">
            <span class="table-item-title">用户实付金额: </span>
            <span class="table-item-text">{{ form.paymentAmount }}</span>
          </div>
        </div>
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">交易手续费: </span>
            <span class="table-item-text">{{ form.shopFee ? form.shopFee : 0 }}</span>
          </div>
          <div class="table-item-content left-content">
            <span class="table-item-title">申请退款金额: </span>
            <span class="table-item-text">{{ form.refundAmount }}</span>
          </div>
        </div>
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">平台优惠退还: </span>
            <span class="table-item-text">{{ form.refundCouponAmount }}</span>
          </div>
          <div class="table-item-content left-content">
            <span class="table-item-title">退还用户金额: </span>
            <span class="table-item-text">{{ form.realRefundAmount }}</span>
          </div>
        </div>
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">商家实退: </span>
            <span class="table-item-text">{{ form.busRealRefundAmount }}</span>
          </div>
        </div>
      </div>
      <div class="table-content" v-if="this.type === 'refund'">
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">退款时间: </span>
            <span class="table-item-text">{{ form.refundDate }}</span>
          </div>
          <div class="table-item-content">
            <span class="table-item-title">退款订单号: </span>
            <span class="table-item-text">{{ form.refundSn }}</span>
          </div>
        </div>
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">退款流水号: </span>
            <span class="table-item-text">{{ form.refundNo }}</span>
          </div>
          <div class="table-item-content">
            <span class="table-item-title">退款状态: </span>
            <span class="table-item-text">{{ form.refundStatusName }}</span>
          </div>
        </div>
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">申请退款金额: </span>
            <span class="table-item-text">{{ form.amount }}</span>
          </div>
          <div class="table-item-content">
            <span class="table-item-title">商家优惠退款: </span>
            <span class="table-item-text">{{ form.refundMdisCountAmount }}</span>
          </div>
        </div>
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">平台优惠退款: </span>
            <span class="table-item-text">{{ form.refundCouponAmount }}</span>
          </div>
          <div class="table-item-content">
            <span class="table-item-title">退还用户金额: </span>
            <span class="table-item-text">{{ form.refundAmount }}</span>
          </div>
        </div>
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">退款人员: </span>
            <span class="table-item-text">{{ form.refundPerson }}</span>
          </div>
          <div class="table-item-content"></div>
        </div>
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">商户名称: </span>
            <span class="table-item-text">{{ form.shopName }}</span>
          </div>
          <div class="table-item-content">
            <span class="table-item-title">门店名称: </span>
            <span class="table-item-text">{{ form.tradeStore }}</span>
          </div>
        </div>
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">交易时间: </span>
            <span class="table-item-text">{{ form.tradeDate }}</span>
          </div>
          <div class="table-item-content">
            <span class="table-item-title">支付订单号: </span>
            <span class="table-item-text">{{ form.sn }}</span>
          </div>
        </div>
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">支付流水号: </span>
            <span class="table-item-text">{{ form.tradeNo }}</span>
          </div>
          <div class="table-item-content">
            <span class="table-item-title">线下订单号: </span>
            <span class="table-item-text">{{ form.thirdSn }}</span>
          </div>
        </div>
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">支付完成时间: </span>
            <span class="table-item-text">{{ form.paymentDate }}</span>
          </div>
          <div class="table-item-content">
            <span class="table-item-title">收银员: </span>
            <span class="table-item-text">{{ form.workerName ? form.workerName : '' }}</span>
          </div>
        </div>
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">支付方式: </span>
            <span class="table-item-text">{{ form.methodPluginName }}</span>
          </div>
          <div class="table-item-content">
            <span class="table-item-title">交易状态: </span>
            <span class="table-item-text">{{ form.orderStatusName }}</span>
          </div>
        </div>
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">交易金额: </span>
            <span class="table-item-text">{{ form.totalAmount }}</span>
          </div>
          <div class="table-item-content">
            <span class="table-item-title">商家优惠金额: </span>
            <span class="table-item-text">{{ form.shopCouponMemo }}</span>
          </div>
        </div>
        <div class="table-item">
          <div class="table-item-content left-content">
            <span class="table-item-title">平台优惠金额: </span>
            <span class="table-item-text">{{ form.platformCouponMemo }}</span>
          </div>
          <div class="table-item-content">
            <span class="table-item-title">用户实付金额: </span>
            <span class="table-item-text">{{ form.paymentAmount }}</span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer right">
        <el-button style="width: 80px" type="primary" @click="orderDetailVisible = false" size="small">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'orderDetailDialog',
  props: {
    dialogTitle: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default: null
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      orderDetailVisible: false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .p-dialog-order {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
  ::v-deep .el-dialog__body {
    flex: 1;
    overflow: auto;
  }
}
.center {
  text-align: center;
}

.table-content {
  border: 1px solid #e6e9f0;
  width: 820px;
  margin: 10px 10px -10px;
  .table-item {
    border-bottom: 1px solid #e6e9f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .table-item-content {
      font-size: 14px;
      color: #3d4966;
      width: 50%;
      display: flex;
      padding: 15px 0;
      .table-item-title {
        width: 130px;
        text-align: right;
        margin-right: 14px;
      }
      .table-item-text {
        width: 70%;
      }
    }
    .left-content {
      border-right: 1px solid #e6e9f0;
    }
  }
  .dialog-footer {
    button {
      position: relative;
      right: -1px;
    }
  }
  .table-item:last-child {
    border-bottom: none;
  }
}
</style>
