<template>
  <div>
    <div class="com-edit-wrapper">
      <el-form :model="ruleForm" :rules="rules" size="small" ref="ruleForm" label-suffix=":" label-width="150px" class="com-edit-ruleForm xdd-btn-block__w240">
        <div class="com-edit-item">
          <div class="com-edit-title">
            <span>基本信息</span>
          </div>
          <div class="com-edit-block">
            <div class="com-edit-ruleForm__content">
              <el-form-item label="代理商名称" prop="name">
                <el-input v-model.trim="ruleForm.name" :disabled="ruleForm.propertyType === 1 && $route.meta.name === 'editAgent'" maxlength="50" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="类型">
                <span v-if="$route.name === 'addAgent'">享钱代理商</span>
                <span v-else>{{ ['科脉经销商', '享钱代理商'][ruleForm.propertyType - 1] }}</span>
              </el-form-item>
              <el-form-item label="地区" prop="districtCode">
                <area-select :areaList="areaValue" :key="areaKey" @change="areaChange"></area-select>
              </el-form-item>
              <el-form-item label="运营者手机(账号)" prop="mobile">
                <el-input v-if="!isEdit" v-model="ruleForm.mobile" maxlength="11" onkeyup="this.value = this.value.replace(/[^\d]/g,'');" placeholder=""></el-input>
                <span v-else>{{ ruleForm.mobile }}</span>
              </el-form-item>
              <el-form-item v-if="!isEdit" label="密码" required>
                <el-input v-model="psw" :disabled="true" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="代理商角色" prop="roleId">
                <el-select v-model="ruleForm.roleId" placeholder="请选择代理商角色">
                  <el-option v-for="item in agentRoleOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="联系人邮箱" prop="email">
                <el-input v-model="ruleForm.email" maxlength="30" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="BD经理" prop="channelManagerId" class="item-block">
                <el-select v-model="ruleForm.channelManagerId" placeholder="请选择BD经理">
                  <el-option v-for="item in channelManagerOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
                <el-button type="text" class="item-btn" @click="dialogVisible = true">管理</el-button>
              </el-form-item>
              <el-form-item label="代理商分成比例" prop="proportion" class="icon-block">
                <el-input v-model="ruleForm.proportion" placeholder="0至100"></el-input>
                <el-popover
                  :close-delay="0"
                  placement="top"
                  width="350"
                  trigger="hover"
                  content="代理商分润 =（商户成本费率-代理商成本费率）*代理商分润比例，100表示分润全额返给代理商，0表示代理商不参与分润">
                  <img :src="questionIcon" slot="reference" alt="提示" class="e-icon-question icon-question" />
                </el-popover>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="com-edit-item">
          <div class="com-edit-title">
            <span>公司信息</span>
          </div>
          <div class="com-edit-block">
            <div class="com-edit-ruleForm__content">
              <el-form-item label="法人" prop="legalPerson">
                <el-input v-model="ruleForm.legalPerson" maxlength="10" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="营业执照" prop="businessLicense">
                <pic-upload
                  :uploadUrl="uploadUrl"
                  :imageUrl="ruleForm.businessLicense"
                  :fileServer="ossFileServe"
                  :showIconClose="true"
                  @on-remove="onRemove"
                  @on-success="onUploadSuccess">
                </pic-upload>
              </el-form-item>
              <el-form-item label="商务姓名" prop="contact">
                <el-input v-model="ruleForm.contact" maxlength="30" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="商务手机" prop="telephone">
                <el-input v-model="ruleForm.telephone" maxlength="11" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="QQ" prop="qq">
                <el-input v-model="ruleForm.qq" maxlength="20" placeholder=""></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="com-edit-item">
          <div class="com-edit-title">
            <span>开票信息</span>
          </div>
          <div class="com-edit-block">
            <div class="com-edit-ruleForm__content">
              <el-form-item label="地址" maxlength="50" prop="detailAddress">
                <el-input v-model="ruleForm.detailAddress" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="纳税人识别号" maxlength="30" prop="taxpayerNo">
                <el-input v-model="ruleForm.taxpayerNo" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="电话" maxlength="20" prop="taxpayerTelephone">
                <el-input v-model="ruleForm.taxpayerTelephone" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="银行账号" maxlength="30" prop="bankAccount">
                <el-input v-model="ruleForm.bankAccount" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="开户行" maxlength="30" prop="openingBank">
                <el-input v-model="ruleForm.openingBank" placeholder=""></el-input>
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
    <el-dialog title="BD经理管理" width="510px" :visible.sync="dialogVisible">
      <el-form :model="BDForm" ref="BDForm" :inline="true" size="small">
        <el-form-item label="BD经理名称" required>
          <el-input style="width: 200px" maxlength="30" v-model.trim="BDForm.channelName" placeholder="请输入BD经理名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addBD">增加BD经理</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="channelData" tooltip-effect="dark" max-height="450px">
        <el-table-column label="BD经理名称">
          <template slot-scope="scope">
            <el-input size="small" v-model.trim="scope.row.name" maxlength="30" style="width: 100%"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleDel(scope.$index, scope.row.id, scope.row.name)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="onComfirm">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryRole, queryChannel, addAgent, deleteChannel, addChannel, queryAgentById, queryDistricDto, checkAgentName, checkChannelName } from '@/api/customer/agent'
import areaSelect from '@/components/areaSelect'
import PicUpload from '@/components/picUpload'
import picUploadMixin from '@/mixins/picUpload'
import { deepClone } from '@/utils'
import { isMPRelaxed, isEmail, isPositiveNumber } from '@/utils/common'

export default {
  name: 'BaseEdit',
  components: {
    areaSelect,
    PicUpload
  },
  mixins: [picUploadMixin],
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
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

    const validatorProportion = (rule, value, callback) => {
      if (value === '') {
        callback('请输入代理商分成比例')
      } else if (!(isPositiveNumber(value) && Number(value) >= 0 && Number(value) <= 100)) {
        callback('请输入0至100的数字')
      } else {
        callback()
      }
    }

    const validatorName = (rule, value, callback) => {
      if (value === '') {
        callback('请输入代理商名称')
      } else if (value !== this.validatorName) {
        checkAgentName({ name: value }).then(res => {
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
      questionIcon: require('@/assets/images/icon/questioin.png'),
      arrBD: [],
      validatorName: '',
      uploadUrl: process.env.VUE_APP_BASE_API + '/oss/uploadFile',
      submitLoading: false,
      areaKey: 0,
      areaValue: [],
      BDForm: {
        channelName: ''
      },
      channelData: [],
      psw: 888888,
      channelManagerOptions: [],
      agentRoleOptions: [],
      dialogVisible: false,
      options: [],
      ruleForm: {
        bankAccount: '',
        businessLicense: '',
        channelManagerId: '',
        contact: '',
        detailAddress: '',
        districtCode: '',
        email: '',
        id: 0,
        legalPerson: '',
        mobile: '',
        name: '',
        openingBank: '',
        proportion: '',
        qq: '',
        roleId: '',
        taxpayerNo: '',
        taxpayerTelephone: '',
        telephone: '',
        propertyType: 2
      },
      rules: {
        name: [
          { required: true, validator: validatorName, trigger: 'blur' },
          { min: 1, max: 50, message: '长度在1到50个字符', trigger: 'blur' }
        ],
        districtCode: {
          required: true,
          message: '请选择地区',
          trigger: 'change'
        },
        mobile: {
          required: true,
          validator: validatorMobile,
          trigger: 'blur'
        },
        roleId: [{ required: true, message: '请选择代理商角色', trigger: 'change' }],
        email: {
          required: true,
          validator: validatorEmail,
          trigger: 'blur'
        },
        channelManagerId: [{ required: true, message: '请选择BD经理', trigger: 'change' }],
        proportion: [{ required: true, validator: validatorProportion, trigger: 'blur' }]
      }
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.BDForm.channelName = ''
        this.channelData = deepClone(this.channelManagerOptions)
        this.arrBD = []
      }
    }
  },
  created() {
    if (this.isEdit) {
      // 编辑时获取代理商基本信息
      this.queryAgentById()
    }
    this.queryRole()
    this.queryChannel()
  },
  methods: {
    onRemove() {
      this.ruleForm.businessLicense = ''
    },
    onUploadSuccess(res) {
      this.ruleForm.businessLicense = res.data.path
    },
    // 编辑时获取代理商基本信息
    async queryAgentById() {
      const res = await queryAgentById({ id: Number(this.$route.query.id) })
      this.ruleForm = res
      this.validatorName = res.name

      if (res.districtCode) {
        const areaRes = await queryDistricDto({ code: res.districtCode })
        this.areaValue[0] = areaRes.provinceCode
        this.areaValue[1] = areaRes.cityCode
        if (areaRes.zoneCode) {
          this.areaValue[2] = areaRes.zoneCode
        }
      }

      this.areaKey += 1
    },
    areaChange(value) {
      this.areaValue = value

      if (value.length === 0) {
        this.ruleForm.districtCode = ''
      } else if (value.length === 2) {
        this.ruleForm.districtCode = value[1]
      } else {
        this.ruleForm.districtCode = value[2]
      }
    },
    addBD() {
      const name = this.BDForm.channelName
      if (name === '') return this.$message.error('请输入BD经理名称')

      if (this.arrBD.includes(name)) {
        return this.$message.error('该BD经理已经存在')
      }

      checkChannelName({ name }).then(res => {
        if (res) {
          return this.$message.error(res)
        }

        this.channelData.push({ id: '', name })
        this.arrBD.push(name)
        this.BDForm.channelName = ''
      })
    },
    queryChannel() {
      queryChannel().then(res => {
        this.channelManagerOptions = res
        this.channelData = deepClone(res)
      })
    },
    async handleDel(index, id, name) {
      try {
        if (id) {
          await deleteChannel({ id })
        } else {
          this.arrBD.splice(this.arrBD.indexOf(name), 1)
        }
        this.channelData.splice(index, 1)
        // this.arrBD.push(name)
      } catch {}
    },
    async onComfirm() {
      try {
        await addChannel(this.channelData)
        await this.queryChannel()
        this.dialogVisible = false
        this.$message.success('操作成功！')
      } catch {}
    },
    queryRole() {
      queryRole({ type: 1 }).then(res => {
        this.agentRoleOptions = res
      })
    },
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.submitLoading = true
          addAgent(this.ruleForm)
            .then(() => {
              this.$message.success('保存成功！')
              this.$store.dispatch('delTagView', this.$route).then(() => {
                this.$router.push({ path: '/customer/agent/agentManage' })
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
        this.$router.push({ path: '/customer/agent/agentManage' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.com-edit-wrapper {
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
.icon-block,
.item-block {
  position: relative;
}
.icon-question {
  position: absolute;
  left: 250px;
  top: 8px;
  width: 16px;
  font-size: 16px;
  color: #cad1e0;
}
.item-btn {
  position: absolute;
  left: 250px;
  top: 8px;
  font-size: 14px;
}
</style>
