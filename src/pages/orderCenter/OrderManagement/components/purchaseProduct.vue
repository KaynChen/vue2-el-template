<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" :destroy-on-close="true" @close="handleProductClose" title="选择产品" width="800px" class="p-address-con">
    <el-form size="small" :inline="true" label-width="70px" @submit.native.prevent>
      <el-form-item label="产品信息">
        <el-input v-model="productVal" maxlength="50" placeholder="请输入产品编码/名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="行业" v-if="$route.name === 'softwarePurchaseDetails'">
        <el-select v-model="industry" clearable placeholder="全部">
          <el-option v-for="item in industryOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" size="small" @click="find()">查询</el-button>
    </el-form>
    <el-table ref="product" :data="basicProductData" @select="handleSelect" @select-all="handleSelectAll" v-loading="checkProductTabLock">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="code" label="产品编码"></el-table-column>
      <el-table-column prop="name" label="产品名称"></el-table-column>
      <el-table-column prop="industryName" label="所属行业" width="100" v-if="$route.name === 'softwarePurchaseDetails'"></el-table-column>
    </el-table>
    <km-pagination :request="getProductPage" layout="prev, pager, next" :current-page.sync="currentPage" :page-size.sync="pageSize" :total="totalPage" />
    <div slot="footer">
      <el-button @click="$emit('update:visible', false)" size="small">取消</el-button>
      <el-button type="primary" @click="handleConfirm" size="small">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import NP from 'number-precision'
import { productInfo, queryIndustryInfo } from '@/api/orderCenter/orderManagement'

export default {
  data() {
    return {
      productVal: '',
      industry: '',
      checkProductTabLock: false,
      basicProductData: [],
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      selectMaps: new Map(),
      currentPageSelectSets: new Set(),
      industryOptions: []
    }
  },
  mounted() {
    this.getIndustryInfo()
  },
  methods: {
    find() {
      this.currentPage = 1
      this.getProductPage()
    },
    handleSelectAll(selection) {
      if (selection?.length) {
        selection.forEach(item => {
          this.selectMaps.set(item.code, item)
          this.currentPageSelectSets.add(item.code)
        })
      } else {
        this.currentPageSelectSets.forEach(item => this.selectMaps.delete(item))
        this.currentPageSelectSets.clear()
      }
    },
    handleSelect(selection, row) {
      if (selection.length > this.currentPageSelectSets.size) {
        this.selectMaps.set(row.code, row)
        this.currentPageSelectSets.add(row.code)
      } else {
        this.selectMaps.delete(row.code)
        this.currentPageSelectSets.delete(row.code)
      }
    },
    handleConfirm() {
      let Selections = []
      this.selectMaps.forEach(item => {
        Selections.push({
          productCode: item.code,
          productName: item.name,
          productCount: 1,
          productPrice: item.saleAmount,
          productAmount: NP.times(1, item.saleAmount),
          sourcePrice: NP.times(1, item.saleAmount),
          remark: ''
        })
      })
      this.$emit('productData', Selections)
      this.$emit('update:visible', false)
    },
    handleProductClose() {
      this.currentPage = 1
      this.productVal = ''
      this.industry = ''
      this.currentPageSelectSets.clear()
      this.selectMaps.clear()
    },
    async getIndustryInfo() {
      this.industryOptions = (await queryIndustryInfo({ enablePurchase: 0 })) || []
    },
    getProductPage: async function () {
      try {
        this.checkProductTabLock = true
        this.currentPageSelectSets.clear()
        const res = await productInfo({
          info: this.productVal.trim(),
          page: this.currentPage,
          rows: this.pageSize,
          orderType: this.$route.name === 'hardwarePurchaseDetails' ? 0 : 1,
          productIndustry: this.industry
        })
        this.basicProductData = res?.results ?? []
        this.totalPage = res.totalRecord ?? 0
        this.$nextTick(() => {
          if (this.basicProductData?.length) {
            this.basicProductData.forEach(item => {
              if (this.selectMaps?.size && this.selectMaps.has(item.code)) {
                this.currentPageSelectSets.add(item.code)
                this.$refs.product.toggleRowSelection(item, true)
              }
            })
          }
        })
      } catch (error) {
      } finally {
        this.checkProductTabLock = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.p-address {
  &-con {
    ::v-deep {
      .el-dialog__body {
        padding: 16px 20px;
      }
      .km-page-block {
        padding-bottom: 0;
      }
    }
  }
}
</style>
