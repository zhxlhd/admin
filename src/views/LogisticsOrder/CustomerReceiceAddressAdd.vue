<!-- created by hezhiqiang on 2019/12/23 -->
<!-- 客户收货地址新增模块表单 -->
<template>
  <div>
    <!-- 头部button Start-->
    <div class="tbutton">
      <el-button size="mini" plain class="el-icon-document" :disabled="submitBtnDisabled" @click="handleSubmit">提 交</el-button>
      <el-button size="mini" plain class="el-icon-close" @click="backward">取 消</el-button>
    </div>
    <!-- 头部button End-->
    <el-form size="mini" :model="mateForm" :inline="mate.inline" label-position="right" ref="ruleForm" :rules="rules" :label-width="labelWidth">
      <el-row>
        <!-- 机构 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.officeId.label" :prop="headForm.officeId.name">
            <el-select
              :disabled="showDisabled"
              v-model="mateForm.officeId"
              placeholder="请选择机构">
              <el-option
                v-for="item in officeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 客户 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.companyName.label" :prop="headForm.companyName.name">
            <el-select
              :disabled="showDisabled"
              v-model="mateForm.companyName"
              placeholder="请选择客户">
              <el-option
                v-for="item in customerOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 国家 -->
        <el-col :sm="24" :md="12" :lg="9">
          <el-form-item :label="headForm.country.label" :prop="headForm.country.name">
            <country-select @input="inputChangeAddr" v-model="mateForm.country" :customerAdd="customerAdd" ref="CountrySelect"></country-select>
          </el-form-item>
        </el-col>
        <!-- 省 -->
        <el-col :sm="24" :md="12" :lg="5">
          <el-form-item :label="headForm.province.label" :prop="headForm.province.name">
            <addrselect
                :disabledFlag="flagDisabled"
                :initselectedvalue="initprovselectedvalueAddr"
                :addrs="provAddrs"
                v-model="mateForm.province"
                @change="provChange"
                class="select-31"
                id="prov_select"
                name="prov" 
                placeholder="省" lazy ref="Addrselect">
              </addrselect>
          </el-form-item>
        </el-col>
        <!-- 市 -->
        <el-col :sm="24" :md="12" :lg="5">
          <el-form-item :label="headForm.city.label" :prop="headForm.city.name">
            <addrselect
              :disabledFlag="flagDisabled"
              :initselectedvalue="initcityselectedvalueAddr"
              :addrs="cityAddrs"
              v-model="mateForm.city"
              @change="cityChange"
              class="select-31"
              id="city_select"
              name="city" 
              placeholder="市" lazy>
            </addrselect>
          </el-form-item>
        </el-col>
        <!-- 区 -->
        <el-col :sm="24" :md="12" :lg="5">
          <el-form-item :label="headForm.county.label" :prop="headForm.county.name">
            <addrselect
              :disabledFlag="flagDisabled"
              :initselectedvalue="initregionselectedvalueAddr"
              :addrs="regionAddrs"
              v-model="mateForm.county"
              @change="regionChange"
              class="select-31"
              id="region_select"
              name="region" 
              placeholder="区" lazy>
            </addrselect>
          </el-form-item>
        </el-col>
        <!-- 详细地址 -->
        <el-col :sm="24" :md="24" :lg="17">
          <el-form-item :label="headForm.detailAddress.label" :prop="headForm.detailAddress.name">
            <el-input
              :disabledFlag="showDisabled"
              maxlength="50"
              show-word-limit
              v-model="mateForm.detailAddress">
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 收货人 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.consignee.label" :prop="headForm.consignee.name">
            <el-input
              :disabledFlag="showDisabled"
              v-model="mateForm.consignee">
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 收货人电话 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.consigneePhone.label" :prop="headForm.consigneePhone.name">
            <el-input
              :disabledFlag="showDisabled"
              v-model="mateForm.consigneePhone">
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 收货人邮箱 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.consigneeEmail.label" :prop="headForm.consigneeEmail.name">
            <el-input
              :disabledFlag="showDisabled"
              v-model="mateForm.consigneeEmail">
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 通知人 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.notifier.label" :prop="headForm.notifier.name">
            <el-input
              :disabledFlag="showDisabled"
              v-model="mateForm.notifier">
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 通知人电话 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.notifierPhone.label" :prop="headForm.notifierPhone.name">
            <el-input
              :disabledFlag="showDisabled"
              v-model="mateForm.notifierPhone">
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 通知人邮箱 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.notifierEmail.label" :prop="headForm.notifierEmail.name">
            <el-input
              :disabledFlag="showDisabled"
              v-model="mateForm.notifierEmail">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import CountrySelect from '@/components/CountrySelect.vue';
import Addrselect from '@/components/address/Addrselect'
import addrArr from '@/components/address/addr-arr.js'
import { LOGISTICS_ORDER_API } from "@/services/apis"
import SERVICES from "@/services"
import { isPositiveEmail,trimSpace } from '../../utils/util.js';
// 根据id获取市/区数据函数
function getAddrsArrayById (id = 0) {
  return addrArr[id].map(item => {
    return {
      'text': item[1],
      'value': item[0]
    }
  })
}
export default {
  components: {
    Addrselect,
    CountrySelect,
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入手机号"));
      } else if (!this.isCellPhone(value)) {
        callback(new Error("请输入正确的手机号!"));
      } else {
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入邮箱"));
      }else if (!isPositiveEmail(trimSpace(value))) {
        callback(new Error('请输入正确的邮箱!'));
      } else {
        callback();
      }
    };
    return {
      mateForm: {},                      
      headForm: {},                      // 头部表单字段
      showDisabled: false,               // 表单字段显示隐藏
      officeOptions: [],                 // 机构下拉选项
      customerOptions: [],               // 客户下拉选项
      flagDisabled: true,                // 省市县显示隐藏
      initprovselectedvalueAddr: '0',
      initcityselectedvalueAddr: '0',
      initregionselectedvalueAddr: '0',
      provAddrs: getAddrsArrayById(0),   // 省
      cityAddrs: [],                     // 市
      regionAddrs: [],                   // 县/区
      rules: {
        officeName: [{ required: true, message: '该输入项为必输项', trigger: ['blur','change'] }],      // 机构
        companyName: [{ required: true, message: '该输入项为必输项', trigger: ['blur','change'] }],     // 客户
        detailAddress: [{ required: true, message: '该输入项为必输项', trigger: 'blur' }],   // 详细地址
        consignee: [{ required: true, message: '该输入项为必输项', trigger: 'blur' }],       // 收货人
        consigneePhone: [{ required: true, trigger: 'blur', validator: validatePhone }],  // 收货人电话
        consigneeEmail: [{ required: true, trigger: 'blur', validator: validateEmail }],  // 收货人邮箱
        notifier: [{ required: true, message: '该输入项为必输项', trigger: 'blur' }],        // 通知人
        notifierPhone: [{ required: true, trigger: 'blur', validator: validatePhone }],   // 通知人电话
        notifierEmail: [{ required: true, trigger: 'blur', validator: validateEmail }],   // 通知人邮箱
      },
    }
  },
  props: {
    mate: Object
  },
  computed: {
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        width = '100px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '100px'
      } else if (this.mate.labelWidth === null) {
        width = '100px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  created () {
    this.mateForm = this.mate.mateFormerHeader.values
    this.mate.mateFormerHeader.fields.map((i) => { this.headForm[i.name] = i })
    if(this.mateForm.isEdit && this.mateForm.id){
      this.showDisabled = true
    }else if(!this.mateForm.isEdit && this.mateForm.id) {
      this.flagDisabled = false
      this.customerAdd = { 'nameZH': this.mateForm.country }
      this.initprovselectedvalueAddr = this.mateForm.province
      this.initcityselectedvalueAddr = this.mateForm.city
      this.initregionselectedvalueAddr = this.mateForm.county
      this.provAddrs = getAddrsArrayById(0)
      this.cityAddrs = getAddrsArrayById(this.initprovselectedvalueAddr)
      this.regionAddrs = getAddrsArrayById(this.initcityselectedvalueAddr)
    }
  },
  mounted () {
    // 获取机构
    this.getOffice()
    // 获取客户名称
    this.getCustomerName()
  },
  methods: {
    //检查手机号
	  isCellPhone(val) {
      if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
        return false;
      } else {
        return true;
      }
    },
    /**
     * 获取机构
     * @param void
     * @return void
     */
    getOffice () {
      SERVICES.RECEICE_ADDRESS.getOfficeName().then(res => {
        let data = res.data
        if (data.length) {
          data.forEach(item => {
            this.officeOptions.push({
              'label': item.name,
              'value': item.id,
              'key': item.id,
            })
            if (this.mateForm.officeId = item.id) {
              this.mateForm.officeName = item.name
            }
          })
        }
      })
    },
    /**
     * 获取客户名称
     * @param void
     * @return void
     */
    getCustomerName () {
      SERVICES.RECEICE_ADDRESS.getCustomerName().then(res => {
        let data = res.data
        if (data.length) {
          data.forEach(item => {
            this.customerOptions.push({
              'label': item.name,
              'value': item.name,
              'key': item.id,
            })
            this.mateForm.companyId = item.id
            this.mateForm.companyCode = item.code
          })
        }
      })
    },
    /**
     * 改变国家输入框值
     */
    inputChangeAddr (val) {
      this.customerAdd = { 'nameZH': val }
      if (val === this.$t('China')) {
        this.flagDisabled = false
      } else {
        this.flagDisabled = true
        this.initprovselectedvalueAddr = ''
        this.initcityselectedvalueAddr = ''
        this.initregionselectedvalueAddr = ''
      }
    },
    /**
     * 改变省
     */
    provChange (val) {
      const oldVal = this.mateForm.province
      if (val !== '') {
        if (val !== oldVal) {
          if (val !== '0' && val !== 0) {
            this.cityAddrs = getAddrsArrayById(val)
          } else {
            this.cityAddrs = []
          }
          this.citySelected = '0'
        }
      } else {
        this.cityAddrs = []
      }
    },
    /**
     * 改变市
     */
    cityChange (val) {
      const oldVal = this.mateForm.city
      if (val !== '') {
        if (val !== oldVal) {
          if (val !== '0' && val !== 0) {
            this.regionAddrs = getAddrsArrayById(val)
          } else {
            this.regionAddrs = []
          }
          this.regionSelected = '0'
        }
      } else {
        this.regionAddrs
      }
    },
    /**
     * 改变县/区
     */
    regionChange (val) {
    },
    // 提交
    handleSubmit () {
      this.submitBtnDisabled = true
      let params = this.mateForm
      let _this = this
      this.$refs.ruleForm.validate((valid) => {
        if(valid){
          // 新增保存
          if (!this.mateForm.id) {
            SERVICES.RECEICE_ADDRESS.save(params).then(res => {
              let status = res.data.statusCode;
              if(status === 200){
                _this.backToList();
              }else if(status === 500){
                _this.submitBtnDisabled = false;
              }
            })
          }
          // 修改保存
          else {
            SERVICES.RECEICE_ADDRESS.save(params).then(res => {
              let status = res.data.statusCode;
              if(status === 200){
                _this.backToList();
              }else if(status === 500){
                _this.submitBtnDisabled = false;
              }
            })
          }
        }
        else {
          this.submitBtnDisabled = false;
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          return
        }
      })
    },
    /**
     * 取消返回提货单列表页面
     * @param void
     * @return void
     */
    backward() {
      if(this.isEdit){
        this.$confirm("数据未提交,是否离开当前页面?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.backToList();
        }).catch(() => {
          this.$message({
            type: "info",
            message: "取消离开"
          });
        });
      }else{
        this.backToList();
      }
    },
    /**
     * 刷新tab页签
     * @param void
     * @return void
     */
    backToList () {
      this.$root.monitor({ url: LOGISTICS_ORDER_API.CUSTOMER_RECEICE_ADDRESS_LIST });
    }
  }
}
</script>

<style scoped lang="scss">
  .el-form--inline>* {
    margin-right:10px
  }
  .el-form-item{
    margin: 15px 20px 2px 0px;
  }
  .leftFloat .el-row{
    float:left;
    width:250px;
  }
  .leftFloat .el-row input{
    width:250px;
  }
  .leftFloat .el-form-item{
    margin: 5px 10px 5px 5px;
  }
  .leftFloat .button{
    float:left;
  }
  .el-form--inline .el-form-item {
    width:200px;
    display: inline-block;
    margin-right: 10px;
    vertical-align: top;
  }
  .el-form-item.is-required .el-form-item__label:before{
    content:''
  }
  .el-form-item.is-required .el-form-item__label:after{
    content: '*';
    color: #ff4949;
    margin-right: 4px;
  }
  .el-cascader{
    width:100%;
  }
  .el-select{
    width:100%;
  }
  .hidden{
    display:none;
  }
  h4{
    margin-top:40px;
    margin-bottom:10px;
  }
  .el-select{
    width:100%;
  }
  .el-date-editor.el-input{
    width:100%;
  }
  .el-form--inline.el-form--label-top .el-form-item__content{
    width:90%
  }
  .leftFloat .el-form--inline .el-form-item{
    margin-right:10px;
  }
  .el-input__suffix {
    right:68px
  }
  .el-form-item--mini.el-form-item {
    margin: 6px;
  }
  .el-input--mini .el-input__inner{
    width:80%
  }
  .hbutton {
    margin-bottom: 20px;
  }
  .basicInfo{
    margin-bottom: 30px;
  }
  .materialInfo{
    margin-bottom: 30px;
  }
</style>
