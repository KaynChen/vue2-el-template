<template>
  <section>
    <el-tabs v-model="activeName" class="p-purchase-tab" @tab-click="handleTabPane">
      <el-tab-pane label="基本信息" name="basicInformation"></el-tab-pane>
      <el-tab-pane label="操作记录" name="operationLog" v-if="['edit', 'detail'].includes($route.query.status)"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component ref="purchase" :is="activeName" :operateData="operateData"></component>
    </keep-alive>
  </section>
</template>

<script>
import { mapActions } from 'vuex'
import { orderStatus } from '../index'
import operationLog from '../components/operationLog'
import basicInformation from './components/basicInformation.vue'

import { operateLog } from '@/api/orderCenter/orderManagement'

export default {
  name: 'softwarePurchaseDetails',
  components: {
    basicInformation,
    operationLog
  },
  data() {
    return {
      activeName: 'basicInformation',
      operateData: []
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.$route.query.productCode) vm.$refs.purchase.handleToStock()
    })
  },
  mounted() {
    this.$nextTick(() => {
      const { orderStatus: orderStatusVal } = this.$route.query
      this.updateTagView({ tagRoute: this.$route, title: `软件采购订单/${orderStatus.has(orderStatusVal) ? orderStatus.get(orderStatusVal).name : '新增'}` })
    })
  },
  methods: {
    ...mapActions(['updateTagView']),
    handleTabPane(tab) {
      if (tab.name === 'operationLog') this.getOperateLog()
      else this.operateData = []
    },
    async getOperateLog() {
      try {
        this.operateData = await operateLog({ orderType: 1, purchaseId: this.$route.query.id })
      } catch (error) {}
    }
  }
}
</script>

<style lang="scss" scoped>
.p-purchase-tab {
  margin-left: -16px;
  margin-right: -16px;
  background-color: #fff;
  padding-left: 16px;
  padding-right: 16px;
  ::v-deep {
    .el-tabs__header {
      margin-bottom: 0;
    }
  }
}
</style>
