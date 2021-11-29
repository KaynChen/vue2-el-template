<template>
  <section class="p-repast-con">
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <span class="p-card-title">商户信息</span>
      </div>
      <el-form :model="form" size="small" :disabled="$route.query.status === 'detail'" :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="经销商">
          <el-input disabled :value="`${userBaseInfo.agentId ? '[' + userBaseInfo.agentId + ']' : ''}${userBaseInfo.name}`"></el-input>
        </el-form-item>
        <el-form-item label="商户名称" class="is-required">
          <el-select v-model="form.merchantDTO.merchantName" @change="handleMerchantInfo" placeholder="请输入名称/商户号" filterable clearable>
            <el-option v-for="item in custListData" :key="item.CustId" :label="item.CustNameExpand" :value="item.CustId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户号">
          <el-input :value="form.merchantDTO.merchantNo" disabled placeholder="请先选择商户"></el-input>
        </el-form-item>
        <el-form-item label="商户版本">
          <el-input :value="cyVersionMap.get(form.merchantDTO.merchantVersion)" disabled></el-input>
        </el-form-item>
        <el-form-item label="关联产品">
          <el-input :value="form.merchantDTO.relationProductName" disabled></el-input>
        </el-form-item>
        <el-form-item label="门店总数">
          <el-input :value="form.merchantDTO.storeCount" disabled></el-input>
        </el-form-item>
        <el-form-item label="应用模块">
          <el-select v-model="form.merchantDTO.applicationModule" @change="handleApplicationModule" clearable>
            <el-option label="门店" :value="101"></el-option>
            <el-option label="电子发票" :value="102" v-if="form.merchantDTO.merchantVersion !== '2'"></el-option>
            <el-option label="积分商城" :value="103" v-if="form.merchantDTO.merchantVersion === '1'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="延期时长">
          <el-select v-model="form.merchantDTO.delayHour" @change="handleDelayHour" clearable>
            <el-option v-for="item in delayTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="e-product-choose" v-if="['add', 'edit'].includes($route.query.status)">
        <template v-if="[101, 102].includes(form.merchantDTO.applicationModule) && form.merchantDTO.merchantNo">
          <el-button type="primary" size="small" plain @click="handleProductVisible">选择授权对象</el-button>
        </template>
        <el-button type="primary" size="small" plain @click="getProductStock" :disabled="form.detailDTOList.length === 0" :loading="checkProductStockLoad">刷新库存</el-button>
      </div>
      <el-table :data="form.detailDTOList" class="p-information-tab">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="shopName" label="门店名称/商户/税号"></el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">{{ scope.row.shopType === 101 ? '门店' : scope.row.shopType === 102 ? '电子发票' : '积分商城' }}</template>
        </el-table-column>
        <el-table-column label="当前有效期">
          <template slot-scope="scope">{{ scope.row.currentValidTime | formatTime }}</template>
        </el-table-column>
        <el-table-column label="延期后有效期">
          <template slot-scope="scope">{{ scope.row.delayValidTime | formatTime }}</template>
        </el-table-column>
        <el-table-column prop="orderInventory" label="下单时库存"></el-table-column>
        <el-table-column prop="useInventory" label="消耗库存"></el-table-column>
        <el-table-column label="备注" class-name="e-column-remark">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.remark" :disabled="$route.query.status === 'detail'" maxlength="100" clearable class="e-product_remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="$route.query.status !== 'detail'">
          <template slot-scope="scope">
            <el-popconfirm class="el-button el-button--text" @confirm="form.detailDTOList.splice(scope.$index, 1)" placement="top-start" title="确定删除所选数据吗？">
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :visible.sync="checkProductVisible" @close="productVal = ''" :close-on-click-modal="false" title="选择授权对象" width="700px" class="p-address-con">
      <el-form size="small" :inline="true" label-width="80px" @submit.native.prevent>
        <el-form-item label="授权信息">
          <el-input v-model="productVal" maxlength="30" :placeholder="`请输入${form.merchantDTO.applicationModule === 101 ? '门店名称' : '税号'}`" clearable></el-input>
        </el-form-item>
        <el-button type="primary" size="small" @click="getProductPage">查询</el-button>
      </el-form>
      <el-table ref="product" :data="basicProductData" v-loading="checkProductTabLock">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column :prop="form.merchantDTO.applicationModule === 101 ? 'BranchName':'TaxpayerNum'" label="门店名称/税号"></el-table-column>
        <el-table-column prop="shopType" label="类型">
          <template slot-scope="scope">{{ scope.row.shopType === 101 ? '门店' : '电子发票' }}</template>
        </el-table-column>
        <el-table-column label="有效期">
          <template slot-scope="scope">{{scope.row.KMValidity || new Date() | formatTime}}</template>
        </el-table-column>
      </el-table>
      <km-pagination :request="getProductPage" layout="prev, pager, next" :current-page.sync="currentPage" :page-size.sync="pageSize" :total="totalPage" />
      <div slot="footer">
        <el-button @click="checkProductVisible = false" size="small">取消</el-button>
        <el-button type="primary" @click="handleConfirm" size="small">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { delayTimes, cyVersionMap } from '../data'

import {
  authOrderWcyCustList,
  authOrderWcyCustInfo,
  queryByAgentProduct,
  authOrderWcyBranchList,
  authOrderWcyTaxpayerNum,
  queryByAgentProductAndModule
} from '@/api/orderCenter/orderManagement/softwareAuthorization'

export default {
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    userBaseInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      delayTimes,
      cyVersionMap,
      custListData: [],
      isCustListPage: false,
      merchantInfo: [],
      productStockObj: {},
      checkProductVisible: false,
      productVal: '',
      checkProductTabLock: false,
      basicProductData: [],
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      checkProductStockLoad: false
    }
  },
  filters: {
    formatTime(val) {
      return dayjs(val).format('YYYY-MM-DD')
    }
  },
  watch: {
    'form.detailDTOList': {
      handler(newVal) {
        return (this.form.authOrderDTO.inventoryAmount = newVal.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.useInventory
        }, 0))
      },
      deep: true
    }
  },
  methods: {
    handleConfirm() {
      const Selections = this.$refs.product.selection.map(item => {
        return {
          shopName: this.form.merchantDTO.applicationModule === 101 ? item.BranchName : '电子发票',
          shopCode: this.form.merchantDTO.applicationModule === 101 ? item.BranchNo : item.TaxpayerNum,
          shopType: item.shopType,
          currentValidTime: item.KMValidity ? `${item.KMValidity} 00:00:00` : dayjs().format('YYYY-MM-DD 00:00:00'),
          delayValidTime: this.setDelayValidTime(item.KMValidity),
          orderInventory: this.productStockObj?.totalAmount ?? 0,
          useInventory: this.form.merchantDTO.delayHour,
          productCode: this.merchantInfo.productCode,
          remark: ''
        }
      })
      this.form.detailDTOList = this.form.detailDTOList.concat(Selections)
      this.getProductStock().then(() => (this.checkProductVisible = false))
    },
    handleDelayHour(val) {
      this.form.detailDTOList.forEach(item => {
        item.delayValidTime = item.currentValidTime ? this.setDelayValidTime(item.currentValidTime) : ''
        item.useInventory = val
      })
    },
    async handleZbProduct() {
      try {
        const res = await queryByAgentProductAndModule({ moduleId: this.form.merchantDTO.applicationModule === 102 ? 'DZFP' : 'JFSC', productCode: this.merchantInfo.productCode })
        this.merchantInfo.productCode = res?.productId ?? ''
        if (!this.merchantInfo.productCode) this.$message({ type: 'warning', message: '找不到对应的周边产品' })
      } catch (error) {}
    },
    async handleApplicationModule(val) {
      this.form.merchantDTO.delayHour = 1
      if (this.$route.query.status === 'edit' || val === 101) {
        if (this.form.merchantDTO.merchantNo) {
          this.merchantInfo = await this.getWcyCustInfo()
          this.merchantInfo.productCode = this.custListData.find(item => item.CustId === this.merchantInfo.CustId).productCode
        } else this.$message({ type: 'warning', message: '请先选择商户' })
      }
      if (val !== 101) await this.handleZbProduct()
      if (val === 103 && this.merchantInfo.productCode) {
        this.form.detailDTOList = [
          {
            shopName: this.merchantInfo.CustName,
            shopCode: this.merchantInfo.CustId,
            shopType: 103,
            currentValidTime: `${this.merchantInfo.KMValidity} 00:00:00`,
            delayValidTime: this.setDelayValidTime(this.merchantInfo.KMValidity),
            orderInventory: this.productStockObj?.totalAmount ?? 0,
            useInventory: this.form.merchantDTO.delayHour,
            productCode: this.merchantInfo.productCode,
            remark: ''
          }
        ]
        this.getProductStock()
      } else this.form.detailDTOList = []
    },
    getWcyCustInfo() {
      return authOrderWcyCustInfo({ cust: this.form.merchantDTO.merchantNo })
    },
    async handleMerchantInfo(val) {
      if (val) {
        try {
          this.form.merchantDTO.merchantNo = val
          this.merchantInfo = await this.getWcyCustInfo()
          this.merchantInfo.productCode = this.custListData.find(item => item.CustId === this.merchantInfo.CustId).productCode
          const { IsHadWxGzhForOss: merchantVersion, BranchCount: storeCount, productionTypeName: relationProductName } = this.merchantInfo
          this.form.merchantDTO = Object.assign(this.form.merchantDTO, { merchantVersion, storeCount, relationProductName, delayHour: 1, applicationModule: 101 })
        } catch (error) {}
      } else this.form.merchantDTO = Object.assign(this.form.merchantDTO, { merchantNo: '', merchantVersion: '', relationProductName: '', storeCount: '', applicationModule: '' })
      this.form.detailDTOList = []
    },
    async getProductStock() {
      try {
        this.checkProductStockLoad = true
        const productCode = this.merchantInfo.productCode || this.form.authOrderDTO.productCode
        this.productStockObj = await queryByAgentProduct({ agentId: this.userBaseInfo.agentId, productCode })
        this.form.detailDTOList.forEach(item => {
          item.orderInventory = this.productStockObj?.totalAmount ?? 0
        })
      } catch (error) {
      } finally {
        this.checkProductStockLoad = false
      }
    },
    handleProductVisible() {
      this.checkProductVisible = true
      this.getProductPage()
    },
    async getProductPage() {
      try {
        this.checkProductTabLock = true
        const isNum = new RegExp(/^\d{1,}$/).test(this.productVal)
        const storeData = { branch: isNum ? this.productVal : '', branchname: !isNum && this.productVal ? this.productVal : '', cust: this.form.merchantDTO.merchantNo }
        const res =
          this.form.merchantDTO.applicationModule === 101 ? await authOrderWcyBranchList(storeData) : await authOrderWcyTaxpayerNum({ cust: this.form.merchantDTO.merchantNo })
        this.basicProductData = res.map(item => {
          item.shopType = this.form.merchantDTO.applicationModule
          return item
        })
      } catch (error) {
      } finally {
        this.checkProductTabLock = false
      }
    },
    async getCustList() {
      const res = await authOrderWcyCustList({ cust: '', custname: '', organ: this.userBaseInfo.organNo, type: 0 })
      this.custListData = res
      this.custListData.forEach(item => (item.CustNameExpand = `${item.CustName ? item.CustName : ''}（${item.CustId}）`))
    },
    setDelayValidTime(date) {
      const countTime = dayjs(date).isAfter(dayjs().format('YYYY-MM-DD')) ? date : dayjs().format('YYYY-MM-DD')
      return dayjs(countTime)
        .add(this.form.merchantDTO.delayHour, 'year')
        .format('YYYY-MM-DD 00:00:00')
    }
  }
}
</script>

<style lang="scss" scoped>
.p-repast-con {
  padding-bottom: 70px;
}
.p-information {
  &-tab {
    /deep/ {
      .el-input__inner {
        text-align: right;
      }
      .e-column-remark {
        .cell {
          display: inline-block;
        }
      }
    }
    .e-select-con {
      /deep/ .el-input {
        width: 100%;
        &__inner {
          text-align: left;
        }
      }
    }
  }
  &-con {
    padding-bottom: 70px;
  }
}
.p-card {
  border-top: 16px solid #f7f8fa;
  &-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /deep/ {
      .el-button {
        font-size: 16px;
      }
    }
  }
}
.p-address {
  &-con {
    /deep/ {
      .el-dialog__body {
        padding: 16px 20px;
      }
      .km-page-block {
        padding-bottom: 0px;
      }
    }
  }
}
.e-product {
  &-choose {
    text-align: right;
    padding-bottom: 10px;
  }
  &_remark {
    width: 100%;
    /deep/ .el-input__inner {
      text-align: left !important;
    }
  }
}
.e-column-remark {
  .cell {
    display: inline-block;
  }
}
</style>