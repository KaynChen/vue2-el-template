<template>
  <section>
    <el-tabs v-model="activeName" @tab-click="handleTabPane" class="p-detail-tab">
      <el-tab-pane label="基本信息" name="basicInformation"></el-tab-pane>
      <el-tab-pane label="操作记录" name="operationLog" v-if="['edit', 'detail', 'audit'].includes($route.query.status)"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component :is="activeName" :operateData="operateData"></component>
    </keep-alive>
  </section>
</template>

<script>
import { mapActions } from 'vuex'
import { orderStatus } from '../index'
import operationLog from '../components/operationLog.vue'
import basicInformation from './components/basicInformation.vue'

import { applyOrderLog } from '@/api/orderCenter/orderManagement/softwareInventoryApply'

export default {
  name: 'softwareInventoryApplyDetails',
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
      this.updateTagView({ tagRoute: this.$route, title: `软件分销订单/${orderStatus.has(orderStatusVal) ? orderStatus.get(orderStatusVal).name : '新增'}` })
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
        const res = await applyOrderLog({ id: this.$route.query.id })
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
  padding-left: 20px;
  padding-right: 20px;
  background-color: #fff;
  ::v-deep {
    .el-tabs__header {
      margin-bottom: 0;
    }
  }
}
</style>
