<template>
  <section>
    <el-tabs v-model="activeName" class="p-detail-tab" @tab-click="handleTabPane">
      <el-tab-pane label="基本信息" name="basicInformation"></el-tab-pane>
      <el-tab-pane label="操作记录" name="operationLog" v-if="['edit', 'detail'].includes($route.query.status)"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component :is="activeName" :operateData="operateData"></component>
    </keep-alive>
  </section>
</template>

<script>
import { mapActions } from 'vuex'
import { orderStatus } from '../index'
import operationLog from '../components/operationLog'
import basicInformation from './components/basicInformation.vue'

import { authOrderLog } from '@/api/orderCenter/orderManagement/softwareInventoryReplace'

export default {
  name: 'softwareInventoryReplaceDetails',
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
  mounted() {
    this.$nextTick(() => {
      const { orderStatus: orderStatusVal } = this.$route.query
      this.updateTagView({ tagRoute: this.$route, title: `库存换购订单/${orderStatus.has(orderStatusVal) ? orderStatus.get(orderStatusVal).name : '新增'}` })
    })
  },
  methods: {
    ...mapActions(['updateTagView']),
    handleTabPane(tab) {
      if (tab.name === 'operationLog') this.getOperateLog()
    },
    async getOperateLog() {
      try {
        const res = await authOrderLog(this.$route.query.id)
        this.operateData = res
      } catch (error) {}
    }
  }
}
</script>

<style lang="scss" scoped>
.p-detail-tab {
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
