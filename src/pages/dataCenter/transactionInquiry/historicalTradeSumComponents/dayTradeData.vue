<template>
  <div>
    <div class="search-box">
      <div class="xdd_tip"><i class="el-icon-info"></i>单次查询日期的最长跨度为31天；查询对象为“全部” 或 代理商过滤时，结果会包括下级代理商的交易数据</div>
      <el-form :inline="true" :model="form" label-suffix=":" @submit.native.prevent label-width="80px" ref="form" size="small" class="xdd-btn-block__w240">
        <el-row>
          <el-col>
            <el-form-item label="日期">
              <el-date-picker
                v-model="form.time"
                type="daterange"
                :clearable="false"
                class="search-date"
                range-separator="至"
                :picker-options="pickerOptions"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @blur="clearDisabled"
                value-format="yyyy-MM-dd">
              </el-date-picker>
              <el-button @click="setSearchTime('yesterday')" class="pure-btn_space" size="small" type="default">昨天</el-button>
              <el-button @click="setSearchTime('week')" size="small" type="default">近7天</el-button>
              <el-button @click="setSearchTime('month')" size="small" type="default">近30天</el-button>
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentCode">
              <el-select style="width: 240px" @change="payMethodChange" filterable clearable v-model="form.payMethod" placeholder="全部">
                <el-option v-for="item in paymentList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="支付场景">
              <el-select style="width: 240px" clearable filterable v-model="form.payPlugin" placeholder="全部">
                <el-option v-for="item in payPluginList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="查询对象" prop="paymentCode">
              <selectCopy
                class="order_sel"
                filterable
                :value.sync="form.searchObject"
                @change="searchObjectChange"
                :options="searchObjectList"
                :optionsItem="{ key: 'id', label: 'name', value: 'id' }" />
            </el-form-item>
            <el-form-item label="对象内容" prop="paymentCode">
              <select-page
                style="width: 240px"
                :value="form.ObjContent"
                @remoteMethod="remoteMethod"
                @loadMore="loadMore"
                id="id"
                :name="selectPageName"
                :disabled="form.searchObject === ''"
                :options="ObjContentList"
                :isMaxPage="isMaxPage"
                @focus="selectPageFocus"
                @change="selectPageChange"
                @clear="selectPageClear">
              </select-page>
            </el-form-item>
            <el-form-item label="" prop="paymentCode">
              <el-button type="primary" class="km-archive-search" :loading="cxLoading" @click="getList">查询</el-button>
              <el-button :loading="exportLoad" @click="downLoadTradeDataExcel" v-permission="'DATACENTER_TRANSACTIONINQUIRY_HISTORICALTRADESUM_EXPORT'">导出</el-button>
              <el-button @click="handleExportLists" v-permission="'DATACENTER_TRANSACTIONINQUIRY_HISTORICALTRADESUM_EXPORT'">导出记录</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 内容展示区域 -->
    <div class="data-box" v-loading="tableLoading">
      <el-row>
        <el-col :span="4" class="sum-card-item">
          <div class="sum-card">
            <div class="sum-card-title">
              交易总额(元)
              <el-tooltip effect="dark" placement="top">
                <div slot="content">当前过滤条件的交易总额<br />(未扣除退款订单金额)</div>
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
              </el-tooltip>
            </div>
            <div class="sum-card-money">{{ tableData.payAmount }}</div>
          </div>
        </el-col>
        <el-col :span="4" class="sum-card-item">
          <div class="sum-card">
            <div class="sum-card-title">
              交易笔数
              <el-tooltip effect="dark" placement="top">
                <div slot="content">当前过滤条件的交易笔数<br />(未扣除退款订单笔数)</div>
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
              </el-tooltip>
            </div>
            <div class="sum-card-money">{{ tableData.payCount }}</div>
          </div>
        </el-col>
        <el-col :span="4" class="sum-card-item">
          <div class="sum-card">
            <div class="sum-card-title">
              客单价(元)
              <el-tooltip effect="dark" placement="top">
                <div slot="content">交易总额/交易笔数</div>
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
              </el-tooltip>
            </div>
            <div class="sum-card-money">{{ tableData.unitAmount }}</div>
          </div>
        </el-col>
        <el-col :span="4" class="sum-card-item">
          <div class="sum-card">
            <div class="sum-card-title">
              商家优惠(元)
              <el-tooltip effect="dark" placement="top">
                <div slot="content">
                  由商家承担的参与微信/支付宝/银联<br />
                  活动的优惠券核销金额
                </div>
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
              </el-tooltip>
            </div>
            <div class="sum-card-money">{{ tableData.shopCouponAmount }}</div>
          </div>
        </el-col>
        <el-col :span="4" class="sum-card-item">
          <div class="sum-card">
            <div class="sum-card-title">
              商家实退(元)
              <el-tooltip effect="dark" placement="top">
                <div slot="content">
                  退还用户银行卡或零钱账户的<br />
                  金额+平台优惠券退款金额
                </div>
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
              </el-tooltip>
            </div>
            <div class="sum-card-money">{{ tableData.merchantRefundAmount }}</div>
          </div>
        </el-col>
        <el-col :span="4" class="sum-card-item">
          <div class="sum-card">
            <div class="sum-card-title">
              商家实收(元)
              <el-tooltip effect="dark" placement="top">
                <div slot="content">交易总额-商家优惠-商家实退</div>
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
              </el-tooltip>
            </div>
            <div class="sum-card-money">{{ tableData.receiptAmount }}</div>
          </div>
        </el-col>
      </el-row>
      <!-- ECHARTS -->
      <div id="eChart" v-if="tableData.cashierMockDTOS" style="width: 100%; height: 400px"></div>
      <!-- TABLE -->
      <el-table :data="tableData.cashierMockDTOS" ref="table">
        <!-- <el-table :max-height="tableMaxHeight" :data="tableData.cashierMockDTOS" ref="table"> -->
        <el-table-column label="日期" prop="payDate"></el-table-column>
        <el-table-column align="right" label="交易总额(元)" prop="payAmount"></el-table-column>
        <el-table-column align="right" label="交易笔数" prop="payCount"></el-table-column>
        <el-table-column align="right" label="客单价(元)" prop="unitAmount"></el-table-column>
        <el-table-column align="right" label="商家优惠(元)" prop="shopCouponAmount"></el-table-column>
        <el-table-column align="right" label="商家实退(元)" prop="merchantRefundAmount"></el-table-column>
        <el-table-column align="right" label="商家实收(元)" prop="receiptAmount"></el-table-column>
        <el-table-column label="操作" fixed="right" align="right">
          <template slot-scope="scope">
            <el-button v-if="[1, 2, ''].includes(form.searchObject)" @click="detail(scope.row)" type="text" size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <exportEecord :exportType="2" ref="exportEecord"></exportEecord>
  </div>
</template>

<script>
import selectPage from '@/components/selectPage'
import dayjs from 'dayjs'
import { getLocal } from '@/utils/storage'
import {
  paymentMethodVoList,
  cashierData,
  queryNewAgentPage,
  queryShopListByPage,
  queryStorePage,
  paymentPluginVoList,
  downLoadTradeDataExcel
} from '@/api/dataCenter/historiyTrade'
import selectCopy from '@/components/selectCopy'
import exportEecord from '@/components/exportEecord'
let maxTime = ''
let minTime = ''
export default {
  name: 'dayTradeData',
  components: {
    selectPage,
    selectCopy,
    exportEecord
  },
  data() {
    return {
      exportLoad: false, // 导出
      questionIcon: require('@/assets/images/icon/questioin.png'),
      selectPageNo: 1,
      activeIndex: '1',
      isMaxPage: false,
      selectPageName: '',
      form: {
        time: [],
        payMethod: '',
        searchObject: '',
        ObjContent: '',
        payPlugin: ''
      },
      payPluginList: [{ id: '', name: '全部' }],
      paymentList: [],
      ObjContentList: [],
      searchObjectList: [
        { id: '', name: '全部' },
        { id: 1, name: '代理商' },
        { id: 2, name: '商户' },
        { id: 3, name: '门店' }
      ],
      tableLoading: false,
      tableData: {
        payAmount: 0,
        payCount: 0,
        unitAmount: 0,
        merchantRefundAmount: 0,
        shopCouponAmount: 0,
        receiptAmount: 0,
        cashierMockDTOS: []
      },
      searchString: '',
      eChartsDateList: [],
      eChartsDataList: [],
      cxLoading: false,
      pickerOptions: {
        onPick: ({ minDate }) => {
          if (minDate) {
            const day31 = 30 * 24 * 3600 * 1000
            maxTime = minDate.getTime() + day31
            minTime = minDate.getTime() - day31
          }
        },
        disabledDate: time => {
          if (maxTime) {
            return time.getTime() > dayjs().endOf('day').valueOf() - 24 * 3600 * 1000 || time.getTime() > maxTime || time.getTime() < minTime
          }
          return time.getTime() > dayjs().endOf('day').valueOf() - 24 * 3600 * 1000
        }
      }
    }
  },
  computed: {
    tableMaxHeight() {
      return document.documentElement.clientHeight - 56 - 48 - 64 - 32 - 210
    },
    isSalesman() {
      return Boolean(JSON.parse(getLocal('userInfo')).clerkId)
    }
  },
  mounted() {
    this.getpaymentMethodVoList()
    this.getList()
  },
  created() {
    if (this.isSalesman) {
      this.searchObjectList = [
        { id: '', name: '全部' },
        { id: 2, name: '商户' },
        { id: 3, name: '门店' }
      ]
    }
    this.form.time = [dayjs().subtract(7, 'days').format('YYYY-MM-DD'), dayjs().subtract(1, 'days').format('YYYY-MM-DD')]
  },
  methods: {
    handleExportLists() {
      this.$refs.exportEecord.exportVisible = true
    },
    async downLoadTradeDataExcel() {
      this.exportLoad = true
      try {
        await downLoadTradeDataExcel({ ...this.initSubData() })
        this.$message({ type: 'success', message: '数据文件生成中，请稍后在导出记录中下载' })
      } catch (error) {
      } finally {
        this.exportLoad = false
      }
    },
    async payMethodChange(value) {
      let childs = ''
      this.payPluginList = []
      this.form.payPlugin = ''
      this.paymentList.forEach(item => {
        if (item.id === value) {
          childs = item.childs.split(',')
        }
      })
      let data = {
        childs
      }
      try {
        let res = await paymentPluginVoList(data)
        this.payPluginList = res
        this.payPluginList.unshift({ id: '', name: '全部' })
      } catch (error) {}
    },
    clearDisabled() {
      maxTime = ''
      minTime = ''
    },
    searchObjectChange() {
      this.form.id = null
      this.form.ObjContent = null
      this.isMaxPage = false
      this.ObjContentList = []
      this.searchString = ''
      this.selectPageNo = 1
    },
    async remoteMethod(value) {
      // 当输入新的值的时候，就把相关数据进行清空
      if (value !== this.searchString) {
        this.selectPageNo = 1
        this.searchString = ''
        this.isMaxPage = false
        this.ObjContentList = []
      }
      // 只有value有值的时候才去请求接口
      let data = {
        id: value || '',
        page: this.selectPageNo,
        rows: 10
      }
      try {
        let res
        if (this.form.searchObject === 1) {
          res = await queryNewAgentPage(data)
          this.selectPageName = 'name'
        } else if (this.form.searchObject === 2) {
          res = await queryShopListByPage(data)
          this.selectPageName = 'companyName'
        } else if (this.form.searchObject === 3) {
          res = await queryStorePage(data)
          this.selectPageName = 'name'
        }
        // 如果分页返回有数据，就将数据加入list，如果接口返回数据长度不为10，则说明为最后一页
        if (res.results && res.results.length !== 0) {
          this.ObjContentList = this.ObjContentList.concat(res.results)
          this.searchString = value
          if (res.results?.length !== 10) {
            this.isMaxPage = true
          }
        } else {
          this.isMaxPage = true
        }
      } catch (error) {}
    },
    loadMore() {
      // 如果不是最后一页就加载下一页
      if (!this.isMaxPage) {
        this.selectPageNo++
        this.remoteMethod(this.searchString)
      }
    },
    selectPageFocus() {
      this.isMaxPage = false
      this.ObjContentList = []
      this.searchString = ''
      this.selectPageNo = 1
      if (!this.form.ObjContent) {
        this.remoteMethod()
      }
    },
    selectPageChange(value) {
      this.form.id = value
      this.ObjContentList.forEach(item => {
        if (item.id === value) {
          if (this.form.searchObject === 2) {
            this.form.ObjContent = item.companyName
          } else {
            this.form.ObjContent = item.name
          }
        }
      })
    },
    // 如果点击了清除按钮则将相关数据清空
    selectPageClear() {
      this.isMaxPage = false
      this.ObjContentList = []
      this.searchString = ''
      this.selectPageNo = 1
      this.form.id = null
    },
    handleSelect(key) {
      this.activeIndex = String(key)
    },
    setSearchTime(type) {
      switch (type) {
        case 'yesterday':
          this.form.time = [dayjs().subtract(1, 'days').format('YYYY-MM-DD'), dayjs().subtract(1, 'days').format('YYYY-MM-DD')]
          break
        case 'week':
          this.form.time = [dayjs().subtract(7, 'days').format('YYYY-MM-DD'), dayjs().subtract(1, 'days').format('YYYY-MM-DD')]
          break
        case 'month':
          this.form.time = [dayjs().subtract(30, 'days').format('YYYY-MM-DD'), dayjs().subtract(1, 'days').format('YYYY-MM-DD')]
          break
      }
    },
    initSubData() {
      let data = {
        type: 2,
        adminId: this.form.searchObject === 2 ? this.form.id : '',
        agentId: this.form.searchObject === 1 ? this.form.id : '',
        storeId: this.form.searchObject === 3 ? this.form.id : '',
        startTime: this.form.time ? this.form.time[0] : '',
        endTime: this.form.time ? this.form.time[1] : '',
        payMethod: this.form.payMethod,
        payPlugin: this.form.payPlugin
      }
      return data
    },
    async getList() {
      this.tableLoading = true
      try {
        const res = await cashierData({ ...this.initSubData() })
        this.tableData = res
        this.eChartsDateList = []
        this.eChartsDataList = []
        if (this.tableData.cashierMockDTOS) {
          this.tableData.cashierMockDTOS.forEach(item => {
            this.eChartsDateList.push(item.payDate)
            this.eChartsDataList.push(item.receiptAmount)
          })
          this.$nextTick(() => {
            this.loadingChart()
          })
          this.tableData.cashierMockDTOS = this.tableData.cashierMockDTOS.reverse()
        }
      } catch (error) {
      } finally {
        this.tableLoading = false
      }
    },
    detail(row) {
      this.$router.push({
        name: 'historicalTradeSumDetail',
        query: { type: 2, payDate: row.payDate, payMethod: this.form.payMethod, searchObject: this.form.searchObject, id: this.form.id }
      })
    },
    async getpaymentMethodVoList() {
      try {
        const res = await paymentMethodVoList()
        this.paymentList = res
        this.paymentList.unshift({ id: '', name: '全部' })
      } catch (error) {}
    },
    loadingChart() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('eChart'))
      // 指定图表的配置项和数据
      let option = {
        tooltip: {
          padding: [18, 16],
          backgroundColor: '#FFFFFF',
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              type: 'dashed'
            }
          },
          formatter: params => {
            return `
              <div style="font-weight: 400;color: #3D4966;box-shadow: 0 4px 16px 0 rgba(31, 46, 77, 0.2);padding: 18px 16px">
                <p style="font-size: 12px;margin-bottom: 12px">
                  ${params[0].axisValueLabel}
                </p>
                <p style="font-size: 18px;">
                  <span class="echart-tooltip-bot-title">商家实收:</span>${params[0].data}
                </p>
              </div>
            `
          }
        },
        xAxis: {
          boundaryGap: false,
          data: this.eChartsDateList,
          axisLine: {
            show: false,
            lineStyle: {
              type: 'solid',
              color: '#D3DBEB',
              width: '1'
            }
          },
          axisLabel: {
            color: '#3D4966',
            fontWeight: 400,
            fontSize: 14
          }
        },
        yAxis: {
          axisLine: {
            show: false,
            lineStyle: {
              type: 'solid',
              color: '#D3DBEB',
              width: '1'
            }
          },
          axisLabel: {
            color: '#3D4966',
            fontWeight: 400,
            fontSize: 14
          },
          splitLine: {
            lineStyle: {
              color: '#E6E9F0',
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: '销量',
            type: 'line',
            data: this.eChartsDataList,
            itemStyle: {
              color: '#3377FF'
            },
            label: {
              show: true,
              position: 'top',
              fontSize: 15
            }
            // symbol:'circle'
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
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
.xdd_tip {
  background: #e5edfd;
  border: 1px solid #a6c4fe;
  padding: 8px 16px;
  margin-bottom: 20px;
  color: #3d4966;
  font-size: 14px;
}
.sum-card-item {
  padding: 0 8px;
  .sum-card {
    height: 108px;
    border-radius: 4px;
    border: 1px solid #e6e9f0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .sum-card-title {
      font-size: 14px;
      font-weight: 400;
      color: #3d4966;
      margin-bottom: 3px;
    }
    .sum-card-money {
      margin-top: 3px;
      font-size: 30px;
      font-weight: 500;
      color: #1f2e4d;
    }
  }
}
.sum-card-item:first-child {
  padding-left: 0;
}
.sum-card-item:last-child {
  padding-right: 0;
}
.el-pagination-box {
  text-align: right;
  margin-top: 20px;
  background: #fff;
  padding-bottom: 20px;
}
.xdd_tip i {
  color: #3377ff;
}
.search-date {
  margin-right: 12px;
}
.echart-tooltip-box {
  .echart-tooltip-top {
    font-size: 12px;
    font-weight: 400;
    color: #3d4966;
  }
  .echart-tooltip-bot {
    font-size: 18px;
    font-weight: 400;
    color: #3d4966;
  }
}
.e-icon-question {
  width: 14px;
  height: 14px;
  margin: 2px 0 0 2px;
}
</style>
