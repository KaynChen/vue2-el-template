<template>
  <el-form v-permission.page="'MERCHANT_SET_ADD'" :model="ruleForm" :rules="rules" size="small" ref="ruleForm" label-width="170px" class="com-edit-ruleForm xdd-btn-block__w240">
    <div class="com-edit-item">
      <div class="com-edit-title">
        <span>基本信息</span>
      </div>
      <div class="com-edit-block">
        <div class="com-edit-ruleForm__content">
          <el-form-item label="商户名称：" prop="companyName">
            <el-input v-model="ruleForm.companyName" maxlength="50" placeholder="商户名称需与营业执照一致"></el-input>
          </el-form-item>
          <el-form-item label="商户简称：" prop="shortName">
            <el-input v-model="ruleForm.shortName" maxlength="30" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="地区：" prop="districtCode">
            <area-select @change="areaChange"></area-select>
          </el-form-item>
          <el-form-item label="详细地址：" prop="address">
            <el-input v-model="ruleForm.address" maxlength="50" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="联系人：" prop="contactor">
            <el-input v-model="ruleForm.contactor" maxlength="30" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="联系人手机（账号）：" prop="mobile">
            <el-input v-model="ruleForm.mobile" maxlength="11" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="密码：" required>
            <el-input v-model="psw" :disabled="true" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="联系人邮箱：" prop="email">
            <el-input v-model="ruleForm.email" maxlength="30" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="业务员：">
            <selectCopy
              :value.sync="ruleForm.clerkId"
              placeholder=""
              filterable
              clearable
              :options="clerkOptions"
              :optionsItem="{ key: 'id', label: 'name', value: 'id' }"></selectCopy>
          </el-form-item>
        </div>
      </div>
    </div>

    <div class="com-edit-item">
      <div class="com-edit-title">
        <span>品牌信息</span>
      </div>
      <div class="com-edit-block">
        <div class="com-edit-ruleForm__content">
          <el-form-item label="品牌名称：" prop="merchantName">
            <el-input v-model="ruleForm.merchantName" maxlength="30"></el-input>
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
            <el-button type="primary" :loading="submitLoading" @click="submitForm">保存</el-button>
            <el-button @click="onCancel">取消</el-button>
          </el-form-item>
        </div>
      </div>
    </div>
  </el-form>
</template>

<script>
import { addShop, queryClerkList, queryTradeById, queryProductInfoByIndustryId, checkShopName } from '@/api/customer/merchant'
import BrandSelect from '@/components/brandSelect'
import AreaSelect from '@/components/areaSelect'
import PicUpload from '@/components/picUpload'
import picUploadMixin from '@/mixins/picUpload'
import { isMPRelaxed, isEmail } from '@/utils/common'
import selectCopy from '@/components/selectCopy'
import { getLocal } from '@/utils/storage'
export default {
  name: 'addMerchant',
  components: {
    BrandSelect,
    AreaSelect,
    PicUpload,
    selectCopy
  },
  mixins: [picUploadMixin],
  data() {
    const validatorMobile = (rule, value, callback) => {
      if (value.length === 0) {
        callback('请输入手机号')
      } else if (isMPRelaxed(value)) {
        callback()
      } else {
        callback('请输入正确的手机号')
      }
    }

    const validatorEmail = (rule, value, callback) => {
      if (value.length === 0) {
        callback('请输入邮箱')
      } else if (isEmail(value)) {
        callback()
      } else {
        callback('请输入正确的邮箱')
      }
    }

    const validatorTradeType = (rule, value, callback) => {
      const val = this.brandValue
      if (val?.length === 0) {
        callback('请选择品牌行业')
      } else {
        callback()
      }
    }

    const validatorCompanyName = (rule, value, callback) => {
      if (value === '') {
        callback('请输入商户名称')
      } else if (value !== this.checkShopName) {
        checkShopName({ name: value }).then(res => {
          if (res) {
            callback(res)
          } else {
            callback()
          }
        })
      } else {
        callback()
      }
    }

    return {
      checkShopName: '',
      uploadUrl: process.env.VUE_APP_BASE_API + '/oss/uploadFile',
      submitLoading: false,
      brandValue: [],
      erpProductOptions: [],
      industryOptions: [],
      clerkOptions: [],
      tradeTypeOptions: [],
      typeOptions: [
        { id: 1, name: '普通连锁（单品牌）' },
        { id: 2, name: '多品牌连锁（多公众号）' },
        { id: 3, name: '单店' }
      ],
      psw: 888888,
      options: [],
      ruleForm: {
        address: '',
        clerkId: '',
        companyName: '',
        contactor: '',
        districtCode: '',
        email: '',
        erpProductId: '',
        industryId: '',
        logo: '',
        merchantName: '',
        mobile: '',
        shortName: '',
        tradeTypeId: '',
        type: 2
      },
      rules: {
        companyName: {
          required: true,
          validator: validatorCompanyName,
          trigger: 'blur'
        },
        shortName: {
          required: true,
          message: '请输入商户简称',
          trigger: 'blur'
        },
        districtCode: {
          required: true,
          message: '请选择地址',
          trigger: 'change'
        },
        address: {
          required: true,
          message: '请输入详细地址',
          trigger: 'blur'
        },
        contactor: {
          required: true,
          message: '请输入联系人姓名',
          trigger: 'blur'
        },
        mobile: {
          required: true,
          validator: validatorMobile,
          trigger: 'blur'
        },
        email: {
          required: true,
          validator: validatorEmail,
          trigger: 'blur'
        },
        merchantName: {
          required: true,
          message: '请输入品牌名称',
          trigger: 'blur'
        },
        // logo: { required: true, message: '请选择图片' },
        tradeTypeId: {
          required: true,
          validator: validatorTradeType,
          trigger: 'change'
        },
        type: { required: true, message: '请选择商户类型', trigger: 'change' }
      }
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
  created() {
    this.queryClerkList()
    this.queryProductInfoByIndustryId()
    this.queryTradeById()
  },
  methods: {
    onRemove() {
      this.ruleForm.logo = ''
    },
    onUploadSuccess(res) {
      this.ruleForm.logo = res.data.path
    },
    areaChange(value) {
      if (value.length === 0) {
        this.ruleForm.districtCode = ''
      } else if (value.length === 2) {
        this.ruleForm.districtCode = value[1]
      } else {
        this.ruleForm.districtCode = value[2]
      }
    },
    queryProductInfoByIndustryId() {
      queryProductInfoByIndustryId({ industryId: 0 }).then(industryRes => {
        this.industryOptions = industryRes
      })
    },
    queryTradeById() {
      queryTradeById({ id: 0 }).then(res => {
        this.tradeTypeOptions = res
      })
    },
    queryClerkList() {
      queryClerkList().then(res => {
        this.clerkOptions = res
      })
      let usedUserInfo = JSON.parse(getLocal('userInfo'))
      if (usedUserInfo.clerkId) {
        this.ruleForm.clerkId = usedUserInfo.clerkId
      }
    },
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.submitLoading = true
          addShop(this.ruleForm)
            .then(() => {
              this.$message.success('保存成功！')
              this.$store.dispatch('delTagView', this.$route).then(() => {
                this.$router.push({ path: '/customer/merchant/merchantManage' })
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
        this.$router.push({ path: '/customer/merchant/merchantManage' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.com-edit-ruleForm {
  border-top: 16px solid #f7f8fa;
  border-bottom: 16px solid #f7f8fa;
  background-color: #fff;
}
.com-edit-block {
  display: flex;
  justify-content: center;
}
.com-edit-title {
  padding: 16px;
  border-bottom: 1px solid #e6e9f0;
  line-height: 1;
  color: #1f2e4d;
}
.com-edit-ruleForm__content {
  padding-top: 20px;
  width: auto;
  margin-right: 130px;
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

.avatar-uploader {
  height: 82px;
  overflow: hidden;
}
.avatar-uploader ::v-deep .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader ::v-deep .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon-block {
  display: inline-block;
  width: 80px;
  height: 80px;
  background-color: #f7f8fa;
}
.avatar-uploader-icon {
  margin-top: 15px;
  font-size: 18px;
  color: #8c939d;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
.avatar__msg {
  font-size: 14px;
  color: #cad1e0;
}
.avatar-uploader-text {
  display: block;
  font-size: 14px;
  line-height: 1;
  color: #8f9bb3;
}
</style>
