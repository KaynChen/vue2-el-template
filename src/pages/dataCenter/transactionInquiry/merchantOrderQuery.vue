<template>
  <div class="app-container">
    <div class="search-box">
      <div class="xdd_tip"><i class="el-icon-info"></i>只支持查询近一年内的交易流水，单次查询日期的最长跨度为31天</div>
      <el-form :inline="true" :model="formData" @submit.native.prevent label-width="100px" ref="form" size="small" class="xdd-btn-block__w240">
        <el-row>
          <el-col>
            <el-form-item label="商户名称" prop="shopId">
              <select-page
                :request="queryMerchantAdminPage"
                :bvalue.sync="formData.shopId"
                :name="'companyName'"
                :width="'240px'"
                searchName="id"
                id="id"
                :placeholder="'商户名称'">
              </select-page>
            </el-form-item>
            <el-form-item label="交易时间">
              <el-date-picker
                :clearable="false"
                @blur="datePickerBlur"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="pickerOptions"
                end-placeholder="结束日期"
                range-separator="至"
                start-placeholder="开始日期"
                type="datetimerange"
                v-model="formData.transactionTime"
                value-format="timestamp"></el-date-picker>
              <el-button :disabled="isSubtract" @click="setSearchTime('subtract')" class="pure-btn_space" size="small" type="default">前一天</el-button>
              <el-button :disabled="isAdd" @click="setSearchTime('add')" size="small" type="default">后一天</el-button>
            </el-form-item>
            <el-form-item label="门店名称" prop="storeName">
              <select-page
                :request="getStorePage"
                :bvalue.sync="formData.stores"
                :name="'name'"
                :isMultiple="true"
                searchName="storeName"
                :width="'240px'"
                :parame="{ adminId: formData.shopId || '' }"
                id="id"
                placeholder="门店名称">
              </select-page>
            </el-form-item>
            <el-form-item label="收银员" prop="cashier">
              <select-page
                :request="queryClerkPageByStore"
                :bvalue.sync="formData.clerkInfos"
                :name="'name'"
                searchName="name"
                :width="'240px'"
                :isMultiple="true"
                :parame="{ storeId: formData.stores || '' }"
                id="id"
                :placeholder="'收银员'">
              </select-page>
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentCode">
              <selectCopy
                class="order_sel"
                @change="getPaymentScenario"
                filterable
                :value.sync="formData.paymentCode"
                :options="paymentData"
                :optionsItem="{ key: 'code', label: 'name', value: 'code' }" />
            </el-form-item>
            <el-form-item label="支付场景" prop="paymentScenarioCode">
              <selectCopy
                class="order_sel"
                :value.sync="formData.paymentScenarioCode"
                filterable
                :options="paymentScenarioData"
                :optionsItem="{ key: 'code', label: 'name', value: 'code' }" />
            </el-form-item>
            <el-form-item label="交易金额" prop="paymentScenarioCode">
              <div class="el-input2" style="display: flex; justify-content: space-between">
                <el-input-number ref="startAmount" v-model="formData.startAmount" controls-position="right" :min="0" placeholder="0" style="width: 108px"></el-input-number>
                <span style="margin: 0 8px"> - </span>
                <el-input-number
                  ref="endAmount"
                  v-model="formData.endAmount"
                  controls-position="right"
                  :min="0"
                  :max="999999.99"
                  placeholder="999999.99"
                  style="width: 108px"></el-input-number>
              </div>
            </el-form-item>
            <el-form-item label="交易状态" prop="tradingStatusCode">
              <el-select class="order_sel" collapse-tags multiple v-model="formData.tradingStatusCode">
                <el-option :key="item.codes" :label="item.name" :value="item.codes" v-for="item in tradingStatusData"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button :loading="searchLock" @click="handleSearch" size="small" type="primary">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 内容展示区域 -->
    <div class="data-box" v-loading="tabLock">
      <el-table :max-height="tableMaxHeight" :data="tabData" ref="table">
        <el-table-column label="商户名称" prop="shopName"></el-table-column>
        <el-table-column label="门店名称" prop="storeName">
          <template slot-scope="scope"> {{ scope.row.merchantName }}({{ scope.row.storeName }}) </template>
        </el-table-column>
        <el-table-column :width="110" label="交易时间" prop="createDate"></el-table-column>
        <el-table-column :min-width="134" label="支付订单号" prop="orders"></el-table-column>
        <el-table-column label="确认码" prop="confirmCode"></el-table-column>
        <el-table-column label="收银员" prop="workerName">
          <template slot-scope="scope">
            {{ scope.row.workerName ? scope.row.workerName : '' }}
          </template>
        </el-table-column>
        <el-table-column label="支付方式" prop="methodPluginName"></el-table-column>
        <el-table-column label="交易状态" prop="orderStatusName"></el-table-column>
        <el-table-column align="right" label="交易金额" prop="amount"></el-table-column>
        <el-table-column align="right" label="申请退款金额" prop="refundAmount" :width="106"></el-table-column>
        <el-table-column align="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleDetails(scope.row)" size="small" type="text">详情</el-button>
            <el-button @click="handleDelRow(scope.row)" size="small" type="text" v-if="scope.row.paymentStatus === 3 || scope.row.paymentStatus === 4">退款详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="el-pagination-box">
        <el-pagination
          v-if="pageTotal"
          :current-page="pageNo"
          :page-size="pageSize"
          :page-sizes="[10, 30, 50]"
          :total="pageTotal"
          @current-change="handleTabCurrent"
          @size-change="handleTabSize"
          background
          layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="centerDialogVisible" right title="导出记录">
      <el-table :data="exportList" style="width: 100%" v-loading="exportLoading">
        <el-table-column label="文件名称">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="导出时间" prop="downloadTime"></el-table-column>
        <el-table-column label="操作人" prop="operator">
          <template slot-scope="scope">
            <div>{{ scope.row.operator }}</div>
            <div>{{ scope.row.loginName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-link :disabled="scope.row.status !== 1" :href="scope.row.url" :underline="false" target="_blank">
              <el-button :disabled="scope.row.status !== 1" size="small" type="text" v-if="permissonCheckMenus('TRANSACTION_MERCHANT_EXPORT_DOWNLOAD')">下载</el-button>
            </el-link>
            <template v-if="permissonCheckMenus('TRANSACTION_MERCHANT_EXPORT_DEL')">
              <el-button @click="deleteExprot(scope.row)" size="small" style="margin-left: 5px" type="text">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination
          :current-page="exportPage"
          :page-size="exportPageSize"
          :page-sizes="[10, 30, 50]"
          :total="exportPageTotal"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          background
          layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </el-dialog>
    <order-detail-dialog :dialogTitle="dialogTitle" :form="dialogForm" ref="orderDetailDialog" type="order" />
    <order-detail-dialog :dialogTitle="dialogTitle" :form="dialogForm2" ref="orderDetailDialog2" type="refund" />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import selectPage from '@/components/selectPage2'
import orderDetailDialog from './components/orderDetailDialog'
import {
  queryAllCondition,
  queryStorePage,
  queryMerchantAdminPage,
  queryClerkPageByStore,
  queryPaySceneByType,
  queryAllTradeStatus,
  queryMerchantOrderPage,
  queryExportRecord,
  deleteRecord,
  detail,
  refundOrderdetail
} from '@/api/transtionManagement'
import selectCopy from '@/components/selectCopy'
let minTime = ''
let maxTime = ''
export default {
  name: 'merchantOrderQuery',
  components: {
    orderDetailDialog,
    selectPage,
    selectCopy
  },
  data() {
    return {
      exportPage: 1,
      exportPageSize: 10,
      exportPageTotal: 0,
      pageNo: 1,
      pageSize: 10,
      pageTotal: 0,
      searchLock: false,
      orderDetailVisible: false,
      orderDetailVisible2: false,
      centerDialogVisible: false,
      dialogTitle: '订单详情',
      exportLoading: true,
      dialogForm: {},
      dialogForm2: {},
      tabLock: false,
      exportList: [],
      tabData: [],
      // 类型select
      tradingChannelData: [],
      tradingTypeData: [],
      paymentData: [],
      paymentScenarioData: [{ code: '', name: '全部' }],
      tradingStatusData: [],
      formData: {
        transactionTime: [dayjs().startOf('day').valueOf(), dayjs().endOf('day').valueOf()],
        shopId: '',
        stores: '',
        tradingChanneCode: '',
        tradingTypeCode: '',
        paymentCode: '',
        paymentScenarioCode: '',
        tradingStatusCode: ['2', '3', '4'],
        clerkInfos: '',
        startAmount: '',
        endAmount: ''
      },
      // 选择弹窗

      pickerOptions: {
        onPick: ({ minDate }) => {
          if (minDate) {
            const day31 = 31 * 24 * 3600 * 1000
            maxTime = minDate.getTime() + day31
            minTime = minDate.getTime() - day31
          }
        },
        disabledDate: time => {
          if (maxTime) {
            return (
              time.getTime() >= dayjs().endOf('day').valueOf() ||
              time.getTime() <= dayjs().subtract(12, 'months').valueOf() ||
              time.getTime() >= maxTime ||
              time.getTime() <= minTime
            )
          }
          return time.getTime() >= dayjs().endOf('day').valueOf() || time.getTime() <= dayjs().subtract(12, 'months').valueOf()
        }
      }
    }
  },
  watch: {
    'formData.transactionTime': {
      handler(newVal) {
        if (newVal === null) {
          this.formData.transactionTime = [dayjs().startOf('day').valueOf(), dayjs().endOf('day').valueOf()]
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    isSubtract() {
      if (dayjs(this.formData.transactionTime[0]).startOf('day').subtract(1, 'days').valueOf() === dayjs().startOf('day').subtract(6, 'months').valueOf()) {
        return true
      } else {
        return false
      }
    },
    tableMaxHeight() {
      return document.documentElement.clientHeight - 56 - 48 - 64 - 32 - 210
    },
    isAdd() {
      if (dayjs(this.formData.transactionTime[1]).startOf('day').valueOf() === dayjs().startOf('day').valueOf()) {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    const conditionType = [
      { type: 1, name: 'tradingChannelData' },
      { type: 2, name: 'tradingTypeData' },
      { type: 3, name: 'paymentData' }
    ]
    conditionType.forEach(item => {
      this.getConditionType(item.type).then(res => {
        this[item.name] = [{ code: '', name: '全部' }, ...res]
      })
    })
    this.getAllTradeStatus()
  },
  mounted() {
    this.$refs.startAmount.$el.childNodes[2].childNodes[1].value = ''
    this.$refs.endAmount.$el.childNodes[2].childNodes[1].value = ''
  },
  methods: {
    datePickerBlur() {
      maxTime = ''
      minTime = ''
    },
    remoteMethod(value) {
      // 当没有输入任何值或者输入新的值的时候，就把相关数据进行情况
      if (!value || (this.searchString !== '' && value !== this.searchString)) {
        this.selectPageNo = 1
        this.searchString = ''
        this.isMaxPage = false
        this.shopList = []
      }
      // 只有value有值的时候才去请求接口
      if (value) {
        let data = {
          name: value,
          page: this.selectPageNo,
          rows: 10
        }
        import('@/api/setting/account').then(async module => {
          const res = await module.queryPage(data)
          // 如果分页返回有数据，就将数据加入list，如果接口返回数据长度不为10，则说明为最后一页
          if (res.results && res.results.length !== 0) {
            this.shopList = this.shopList.concat(res.results)
            this.searchString = value
            if (res.results?.length !== 10) {
              this.isMaxPage = true
            }
          }
        })
      }
    },
    loadMore() {
      // 如果不是最后一页就加载下一页
      if (!this.isMaxPage) {
        this.selectPageNo++
        this.remoteMethod(this.searchString)
      }
    },
    // 如果点击了清除按钮则将相关数据清空
    shopClear() {
      this.isMaxPage = false
      this.shopList = []
      this.searchString = ''
      this.selectPageNo = 1
    },
    // 每次focus都将相关数据清空
    shopFocus() {
      this.isMaxPage = false
      this.shopList = []
      this.searchString = ''
      this.selectPageNo = 1
    },
    async handleDetails(row) {
      this.dialogForm = {}
      const data = {
        orderId: row.id,
        shopId: row.shopId
      }
      try {
        const res = await detail(data)
        if (!res) {
          this.$message('暂无数据')
          return
        }
        this.dialogForm = res
        this.dialogForm.shopName = row.shopName
        this.$refs.orderDetailDialog.orderDetailVisible = true
      } catch {}
    },
    async handleDelRow(row) {
      this.dialogForm = {}
      const data = {
        dataSource: 1,
        paySn: row.id,
        sn: ''
      }
      try {
        const res = await refundOrderdetail(data)
        if (!res) {
          this.$message('暂无数据')
          return
        }
        res.shopName = row.shopName
        res.paymentAmount = row.paymentAmount
        res.orderStatusName = row.orderStatusName
        this.dialogForm2 = res
        this.dialogForm2.shopName = row.shopName
        this.$refs.orderDetailDialog2.orderDetailVisible = true
      } catch {}
    },
    handleCurrentChange(val) {
      this.exportPage = val
      this.exportRecord()
    },
    handleSizeChange(val) {
      this.exportPage = 1
      this.exportPageSize = val
      this.exportRecord()
    },
    async deleteExprot(row) {
      this.$confirm('确定要删除这条导出记录吗？', '删除', {
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            try {
              instance.confirmButtonLoading = true
              deleteRecord({ id: row.id }).then(() => {
                this.$message.success('删除成功')
                this.exportRecord()
              })
            } catch (error) {
            } finally {
              instance.confirmButtonLoading = false
              done()
            }
          } else done()
        }
      })
    },
    async exportRecord() {
      this.centerDialogVisible = true
      this.exportLoading = true
      const data = {
        page: this.exportPage,
        rows: this.exportPageSize
      }
      try {
        const res = await queryExportRecord(data)
        this.exportPageTotal = res.totalCount
        this.exportList = res.results
        this.exportLoading = false
      } catch {}
    },
    handleTabCurrent(val) {
      this.pageNo = val
      this.getQueryPage()
    },
    handleTabSize(val) {
      this.pageNo = 1
      this.pageSize = val
      this.getQueryPage()
    },
    handleReset() {
      this.formData.stores = ''
      this.formData.clerkInfos = ''
      this.formData.shopId = ''
      this.formData.startAmount = ''
      this.formData.endAmount = ''
      this.tabData = []
      this.$refs.form.resetFields()
      this.$set(this.formData, 'transactionTime', [dayjs().startOf('day').valueOf(), dayjs().endOf('day').valueOf()])
    },
    handleSearch() {
      if (this.formData.shopId) {
        if (this.formData.transactionTime[1] - this.formData.transactionTime[0] > 60 * 24 * 60 * 1000 * 31) {
          this.$message.error('统计时间间隔不超过31天')
          return false
        }
        if (this.formData.startAmount < 0 || this.formData.endAmount < 0) {
          this.$message.error('金额不能为负数')
          return false
        }

        if ((this.formData.startAmount && !this.formData.endAmount) || (!this.formData.startAmount && this.formData.endAmount)) {
          this.$message.error('请输入交易金额范围')
          return false
        }
        if (this.formData.startAmount > this.formData.endAmount) {
          this.$message.error('最小金额不能大于最大金额')
          return false
        }
        this.pageNo = 1
        this.searchLock = true
        this.getQueryPage()
          .catch(() => {})
          .finally(() => {
            this.searchLock = false
          })
      } else {
        this.$message.error('请先选择商户')
      }
    },
    async getQueryPage() {
      if (this.formData.tradingStatusCode.includes(0)) {
        this.formData.tradingStatusCode.push(5)
      }
      let paymentStatus = []
      if (this.formData.tradingStatusCode.length > 0 && this.formData.tradingStatusCode.includes('')) {
        paymentStatus = JSON.parse(JSON.stringify(this.formData.tradingStatusCode.filter(item => item !== '')))
      } else {
        paymentStatus = JSON.parse(JSON.stringify(this.formData.tradingStatusCode))
      }
      const data = {
        page: this.pageNo,
        rows: this.pageSize,
        startDate: dayjs(this.formData.transactionTime[0]).format('YYYY-MM-DD HH:mm:ss'),
        endDate: dayjs(this.formData.transactionTime[1]).format('YYYY-MM-DD HH:mm:ss'),
        payChannelType: this.formData.tradingChanneCode ? this.formData.tradingChanneCode : '', // 交易渠道
        orderTypes: this.formData.tradingTypeCode !== '' ? [this.formData.tradingTypeCode] : [], // 交易类型集合
        paymentMethods: this.formData.paymentCode !== '' ? [this.formData.paymentCode] : [], // 支付方式集合
        paymentPlugins: this.formData.paymentScenarioCode !== '' ? [this.formData.paymentScenarioCode] : [], // 支付场景集合
        paymentStatus: paymentStatus.length > 0 ? paymentStatus.toString().split(',').map(Number) : [], // 交易状态集合
        shopId: this.formData.shopId, // 商户ID
        // shopId: 70, // 商户ID
        stores: this.formData.stores ? [this.formData.stores] : [], // 门店ID集合
        clerkInfos: this.formData.clerkInfos ? [this.formData.clerkInfos] : [], // 门店ID集合
        startAmount: this.formData.startAmount || null, // 门店ID集合
        endAmount: this.formData.endAmount || null // 门店ID集合
      }
      this.tabLock = true
      try {
        const res = await queryMerchantOrderPage(data)
        this.tabData = res.results || []
        this.pageNo = res.page
        this.pageTotal = res.totalCount
      } catch (error) {
      } finally {
        this.tabLock = false
      }
    },

    queryMerchantAdminPage(e) {
      return queryMerchantAdminPage(e)
    },
    getStorePage(e) {
      return queryStorePage(e)
    },
    queryClerkPageByStore(e) {
      return queryClerkPageByStore(e)
    },

    async getAllTradeStatus() {
      const res = await queryAllTradeStatus()
      this.tradingStatusData = [{ codes: '', name: '全部' }, ...res]
      this.formData.tradingStatusCode = ['2', '3', '4']
    },
    async getPaymentScenario() {
      this.formData.paymentScenarioCode = ''
      this.paymentScenarioData = []
      if (this.formData.paymentCode) {
        const res = await queryPaySceneByType({
          payType: this.formData.paymentCode
        })
        this.paymentScenarioData = [{ code: '', name: '全部' }, ...res]
      }
    },
    getConditionType(type = 1) {
      const res = queryAllCondition({ conditionType: type })
      return res || []
    },
    setSearchTime(status) {
      let varyStartDate = dayjs(this.formData.transactionTime[0])
      let varyEndDate = dayjs(this.formData.transactionTime[1])
      if (status === 'add') {
        varyStartDate = varyStartDate.add(1, 'days')
        varyEndDate = varyEndDate.add(1, 'days')
      } else if (status === 'subtract') {
        varyStartDate = varyStartDate.subtract(1, 'days')
        varyEndDate = varyEndDate.subtract(1, 'days')
      }
      this.$set(this.formData, 'transactionTime', [varyStartDate.valueOf(), varyEndDate.valueOf()])
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  margin-left: -16px;
  margin-right: -16px;
  border-bottom: 16px solid #f7f8fa;
}
.action-box {
  ::v-deep .el-select {
    width: 100%;
  }
}
.xdd_tip {
  background: #e5edfd;
  border: 1px solid #a6c4fe;
  padding: 8px 30px;
  margin-bottom: 20px;
  color: #3d4966;
  font-size: 14px;
}
.el-input2 {
  ::v-deep {
    .el-input {
      width: 100%;
    }
    .el-input-number__increase,
    .el-input-number__decrease {
      width: 25px;
    }
    .el-input-number.is-controls-right .el-input__inner {
      padding-left: 10px;
    }
    .el-input-number .el-input__inner {
      text-align: left;
    }
    .el-input-number.is-controls-right .el-input__inner {
      padding-right: 25px;
    }
  }
}
.xdd_tip i {
  color: #3377ff;
}
.el-pagination-box {
  text-align: right;
  margin-top: 20px;
  background: #fff;
  padding-bottom: 20px;
}
.page-box {
  text-align: right;
  padding: 20px 0;
}
.xdd_row {
  display: flex;
}

.order_sel {
  width: 100%;
}
.paymentScenarioCod {
  ::v-deep.el-form-item__content {
    justify-content: space-between;
    display: flex;
  }
}
.pure {
  &-btn {
    &_space {
      margin-left: 15px;
    }
  }
  &-dialog {
    &-orderItem {
      display: flex;
      font-size: 15px;
      margin-bottom: 10px;
    }
    &-orderLeft {
      flex: 1;
    }
    &-orderRight {
      flex: 1;
    }
  }
}
</style>
