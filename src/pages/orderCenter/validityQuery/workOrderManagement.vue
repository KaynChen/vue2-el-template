<template>
  <div class="app-container">
    <div class="search-box">
      <query-group className="xdd-btn-block__w240" :queryParams="queryParams" :queryFormList.sync="queryFormList" @search="handleFilter">
        <template v-slot:formfoot>
          <el-button v-if="showAdd" v-permission="'WORKORDERMANAGEMENT_ADD'" @click="handlePlus" icon="el-icon-plus" type="primary" size="small" plain class="float_right"
            >新增</el-button
          >
        </template>
      </query-group>
    </div>
    <div class="data-box">
      <base-table
        :columns="headers"
        :list="list"
        @getList="queryWorkOrderList"
        :loading="loading"
        :total="total"
        :page.sync="tableParam.page"
        :rows.sync="tableParam.rows"
        @viewResClick="viewResClick"></base-table>
    </div>
  </div>
</template>

<script>
import listMixins from '@/mixins/tableList'
import baseTable from '@/components/baseTable'
import queryGroup from '@/components/queryGroup'
import dayjs from 'dayjs'
import { queryProductList, queryWorkOrderList } from '@/api/dataCenter/dataCenter.js'
import { mapActions } from 'vuex'
import { tableMaxHeight } from '@/mixins/tableMaxHeight'

export default {
  name: 'workOrderManagement',
  mixins: [listMixins, tableMaxHeight],
  components: {
    baseTable,
    queryGroup
  },
  data() {
    return {
      queryFormList: [
        {
          type: 'daterange',
          label: '提交日期',
          value: [dayjs().subtract(30, 'days').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
        },
        {
          type: 'input',
          name: 'title',
          label: '工单信息',
          placeholder: '工单编号/标题/描述/提交人',
          value: ''
        },
        {
          type: 'select',
          name: 'orderType',
          label: '工单类型',
          value: '',
          options: [
            { value: '', label: '全部' },
            { value: '1', label: '问题' },
            { value: '2', label: '需求' }
          ]
        },
        {
          type: 'select',
          name: 'status',
          label: '状态',
          value: '',
          options: [
            { value: '', label: '全部' },
            { value: '1', label: '待处理' },
            { value: '2', label: '处理中' },
            { value: '3', label: '已处理' },
            { value: '9', label: '已关闭' }
          ]
        },
        {
          type: 'select',
          name: 'productNo',
          label: '产品',
          value: '',
          options: []
        }
      ],
      productOptions: [],
      list: [],
      total: 0,
      loading: false,
      showAdd: true,
      tableParam: {
        page: 1,
        rows: 10,
        sheetNo: ''
      },
      headers: [
        {
          key: 'sheetNo',
          title: '工单编号',
          width: '130'
        },
        {
          key: 'demandName',
          title: '工单标题'
        },
        {
          key: 'orderType',
          title: '工单类型',
          escape: row => {
            let str = ''
            switch (row.orderType) {
              case '1':
                str = '问题'
                break
              case '2':
                str = '需求'
                break
              default:
                str = '--'
                break
            }
            return str
          }
        },
        {
          key: 'productName',
          title: '产品'
        },
        {
          key: 'demandDec',
          title: '描述'
        },
        {
          key: 'operName',
          title: '提交人'
        },
        {
          key: 'orderDate',
          title: '提交时间',
          width: '180'
        },
        {
          key: 'status',
          title: '状态',
          width: '80'
        },
        {
          type: 'operate',
          title: '操作',
          width: '60',
          position: 'right',
          operates: [
            {
              name: '详情',
              emitKey: 'viewResClick'
            }
          ]
        }
      ]
    }
  },
  methods: {
    ...mapActions(['delCachedView']),
    handlePlus() {
      this.delCachedView({ name: 'workOrderManagementdetail' }).then(() => {
        this.$router.push({ path: '/customer/workorder/workOrderManagementdetail' })
      })
    },
    handleFilter(e) {
      Object.assign(this.tableParam, e)
      this.queryWorkOrderList()
    },
    viewResClick(e) {
      const { sheetNo, orderType } = e
      this.$router.push({ path: '/customer/workorder/workOrderdetail', query: { sheetNo, orderType } })
    },
    queryWorkOrderList() {
      this.loading = true
      queryWorkOrderList(this.tableParam)
        .then(res => {
          this.list = res.results || []
          this.total = res.totalCount || 0
          this.showAdd = true
        })
        .catch(() => {
          this.showAdd = false
        })
        .finally(() => {
          this.loading = false
        })
    },
    queryProductList() {
      this.productOptions = [{ value: '', label: '全部' }]
      queryProductList({
        productName: ''
      }).then(res => {
        const temp = res.map(res1 => {
          return {
            value: res1.productNo,
            label: res1.productName
          }
        })
        this.productOptions = [...this.productOptions, ...temp]
        this.queryFormList[this.queryFormList.length - 1].options = this.productOptions
      })
    }
  },
  activated: function () {
    this.handleFilter(this.queryParams)
  },
  mounted() {
    this.queryProductList()
    this.handleFilter(this.queryParams)
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  margin-left: -16px;
  margin-right: -16px;
  border-bottom: 16px solid #f7f8fa;
}
.float_right {
  float: right;
  margin-left: 20px;
}
</style>
