<template>
  <div v-permission.page="'BRAND_SET_ADD'" class="com-edit-wrapper">
    <el-form :model="ruleForm" :rules="rules" size="small" ref="ruleForm" label-width="150px" class="com-edit-ruleForm xdd-btn-block__w240">
      <div class="com-edit-item" style="padding-top: 0">
        <div class="com-edit-block">
          <div class="com-edit-ruleForm__content">
            <el-form-item label="商户：" prop="adminId">
              <select-page
                style="width: 240px"
                :isMaxPage="isMaxPage"
                :options="selectOptions"
                @remoteMethod="remoteSelect"
                @selectPageMore="selectPageMore('merchant')"
                @resetSelectPage="resetSelectPage"
                @changeSelectPage="changeSelectPage"
                label="companyName"
                value="id"
                placeholder="商户"></select-page>
            </el-form-item>
            <el-form-item label="品牌名称：" prop="name">
              <el-input v-model="ruleForm.name" maxlength="30" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="品牌LOGO：">
              <pic-upload :uploadUrl="uploadUrl" :imageUrl="ruleForm.logo" :fileServer="ossFileServe" :showIconClose="true" @on-remove="onRemove" @on-success="onUploadSuccess">
              </pic-upload>
            </el-form-item>
            <el-form-item label="品牌行业：" prop="tradeTypeId">
              <brand-select v-model="brandValue"></brand-select>
            </el-form-item>
            <el-form-item label="ERP行业：" prop="industryId" class="msg-block">
              <el-select v-model="ruleForm.industryId" placeholder="请选择行业" clearable>
                <el-option v-for="item in industryOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
              <span class="msg">注：使用科脉ERP才需要选择此项</span>
            </el-form-item>
            <el-form-item label="ERP产品：" prop="erpProductId" class="msg-block">
              <el-select v-model="ruleForm.erpProductId" placeholder="请选择产品" clearable>
                <el-option v-for="item in erpProductOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
              <span class="msg">注：使用科脉ERP才需要选择此项</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="submitLoading" @click="submitForm()">保存</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { queryShopListByPage, queryProductInfoByIndustryId, addMerchant, checkMerchant } from '@/api/customer/merchant'
import BrandSelect from '@/components/brandSelect'
import PicUpload from '@/components/picUpload'
import picUploadMixin from '@/mixins/picUpload'
import selectPage from '@/components/selectPage/selectPage'

export default {
  name: 'addBrand',
  components: {
    BrandSelect,
    PicUpload,
    selectPage
  },
  mixins: [picUploadMixin],
  data() {
    const validatorTradeType = (rule, value, callback) => {
      if (this.brandValue?.length === 0) callback('请选择品牌行业')
      else callback()
    }
    const validatorName = (rule, value, callback) => {
      if (value !== this.validatorName) {
        checkMerchant({ name: value, adminId: this.ruleForm.adminId }).then(res => {
          if (res) callback(res)
          else callback()
        })
      } else {
        callback()
      }
    }
    return {
      validatorName: '',
      uploadUrl: process.env.VUE_APP_BASE_API + '/oss/uploadFile',
      submitLoading: false,
      brandValue: [],
      erpProductOptions: [],
      industryOptions: [],
      adminOptions: [],
      ruleForm: {
        adminId: '',
        erpProductId: '',
        id: '',
        industryId: '',
        logo: '',
        name: '',
        tradeTypeId: ''
      },
      rules: {
        adminId: { required: true, message: '请选择商户', trigger: 'change' },
        name: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { validator: validatorName, trigger: 'blur' }
        ],
        tradeTypeId: { required: true, validator: validatorTradeType, trigger: 'change' }
      },
      imageUrl: '',
      isMaxPage: false,
      selectOptions: [],
      selectPageNo: 1,
      searchString: ''
    }
  },
  watch: {
    'ruleForm.industryId': function (val) {
      this.ruleForm.erpProductId = ''
      if (val === '') {
        this.erpProductOptions = []
      } else {
        queryProductInfoByIndustryId({ industryId: val }).then(erpProductRes => {
          this.erpProductOptions = erpProductRes
        })
      }
    },
    brandValue(val) {
      if (val.length > 0) {
        this.ruleForm.tradeTypeId = val[1]
      } else {
        this.ruleForm.tradeTypeId = ''
      }
    }
  },
  mounted() {
    this.queryProductInfoByIndustryId()
    this.remoteSelect()
  },
  methods: {
    selectPageMore() {
      if (!this.isMaxPage) {
        this.selectPageNo++
        this.remoteSelect(this.searchString)
      }
    },
    resetSelectPage() {
      this.selectOptions = []
      this.selectPageNo = 1
      this.isMaxPage = false
      this.searchString = ''
    },
    changeSelectPage(value) {
      this.ruleForm.adminId = value
    },
    remoteSelect: async function (query) {
      if (!!this.searchString && query !== this.searchString) {
        this.resetSelectPage()
      }
      const data = {
        page: this.selectPageNo,
        rows: 10,
        id: query
      }
      const res = await queryShopListByPage(data)
      if (res?.results && res.results.length !== 0) {
        this.searchString = query
        this.selectOptions = this.selectOptions.concat(res.results)
        if (res.results.length !== 10) this.isMaxPage = true
      }
    },
    onRemove() {
      this.ruleForm.logo = ''
    },
    onUploadSuccess(res) {
      this.ruleForm.logo = res.data.path
    },
    queryProductInfoByIndustryId() {
      queryProductInfoByIndustryId({ industryId: 0 }).then(industryRes => {
        this.industryOptions = industryRes
      })
    },
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.submitLoading = true
          addMerchant(this.ruleForm)
            .then(() => {
              this.$message.success('保存成功!')
              this.$store.dispatch('delTagView', this.$route).then(() => {
                this.$router.push({ path: '/customer/merchant/brandHome' })
              })
            })
            .finally(() => {
              this.submitLoading = false
            })
        }
      })
    },
    onCancel() {
      this.$store.dispatch('delTagView', this.$route).then(() => {
        this.$router.push({ path: '/customer/merchant/brandHome' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.com-edit-wrapper {
  border-top: 16px solid #f7f8fa;
}
.com-edit-block {
  display: flex;
  justify-content: center;
}
.com-edit-title {
  padding: 0 16px 16px;
  border-bottom: 1px solid #e6e9f0;
  line-height: 1;
  color: #1f2e4d;
}
.com-edit-ruleForm__content {
  padding-top: 20px;
  width: 390px;
}
.msg-block {
  position: relative;
}
.msg {
  position: absolute;
  left: 250px;
  width: 250px;
  font-size: 14px;
  color: #cad1e0;
}
</style>
