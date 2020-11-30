<template>
  <div>
    <el-row>
      <el-form size="mini" :disabled="showFlag" :model="mate.values" :inline="mate.inline" ref="ruleForm" :label-position="labelPosition" :rules="rules" label-width="190px">
        <div class="tabclass">
        <div class="title">开票规则</div>
          <el-row>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="mate.tabs[0].fields[1].label" :prop="mate.tabs[0].fields[1].name">
              <el-input v-model="mate.values['faceAmount']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="mate.tabs[0].fields[0].label" :prop="mate.tabs[0].fields[0].name">
              <el-select clearable v-model="mate.values['vatType']">
                <el-option :label="item.label" :value="item.value" v-for="item of vatTypeItem" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="mate.tabs[0].fields[6].label" :prop="mate.tabs[0].fields[6].name">
              <el-input v-model.trim="mate.values['drawer']"></el-input>
            </el-form-item>
          </el-col>
          </el-row>
          <el-row>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="mate.tabs[0].fields[13].label" :prop="mate.tabs[0].fields[13].name">
              <el-tooltip class="item" effect="light" content="1.航天开票软件：发票填开界面左下角的税收分类编码版本号。2.百望开票软件：商品和服务税收分类编码页面左下角的当前版本。" placement="bottom">
                <el-input v-model.trim="mate.values['versionNum']"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="mate.tabs[0].fields[7].label" :prop="mate.tabs[0].fields[7].name">
              <el-input v-model.trim="mate.values['checker']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="mate.tabs[0].fields[8].label" :prop="mate.tabs[0].fields[8].name">
              <el-input v-model.trim="mate.values['payee']"></el-input>
            </el-form-item>
          </el-col>

          </el-row>
          <el-row>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="mate.tabs[0].fields[12].label" :prop="mate.tabs[0].fields[12].name">
              <el-select clearable v-model="mate.values['autoRed']">
                <el-option :label="item.label" :value="item.value" v-for="item of autoMergeItem" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="mate.tabs[0].fields[11].label" :prop="mate.tabs[0].fields[11].name">
              <el-input v-model="mate.values['classCode']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="mate.tabs[0].fields[9].label" :prop="mate.tabs[0].fields[9].name">
              <el-select clearable v-model="mate.values['autoRemark']" placeholder="此备注将放在预制发票头中">
                <el-option :label="item.label" :value="item.value" v-for="item of autoRemarkItem" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          </el-row>
          <el-row>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="mate.tabs[0].fields[5].label" :prop="mate.tabs[0].fields[5].name" ref="mergesItem">
              <el-tooltip class="item" effect="light" content="如选择：不含税单价，物料编号。则生成预制发票时会把结算单中相同不含税单价、物料编号的物料合并开票" placement="bottom">
                <el-select filterable multiple :disabled="autoMergesItemDisAble" @change="mergeChange" v-model="mate.values['merges']">
                   <el-option :label="item.label" :value="item.value" :disabled="mergesItemDisAble" v-for="item of getItemOptions" :key="item.name"></el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
          </el-row>
        </div>
         
          <div class="tabclass">
          <div class="title">购方公司（采购商）</div>
          <el-row>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="mate.tabs[2].fields[0].label" :prop="mate.tabs[2].fields[0].name">
              <el-select clearable size="mini" v-model.trim="mate.values['buyerName']" placeholder="购方公司">
                <el-option
                  v-for="item in customerNameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="mate.tabs[2].fields[1].label" :prop="mate.tabs[2].fields[1].name">
              <el-input v-model.trim="mate.values['buyerTaxNumber']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="mate.tabs[2].fields[6].label" :prop="mate.tabs[2].fields[6].name">
              <el-input v-model.trim="mate.values['buyerPhone']"></el-input>
            </el-form-item>
          </el-col>
          
          </el-row>
          <el-row>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="mate.tabs[2].fields[9].label" :prop="mate.tabs[2].fields[9].name">
              <el-input type="textarea" :rows="2" v-model.trim="mate.values['buyerBankAccount']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="mate.tabs[2].fields[7].label" :prop="mate.tabs[2].fields[7].name">
              <el-tooltip class="item" effect="light" content="购方地址中请不要包含电话号码" placement="bottom">
                 <el-input type="textarea" :rows="2" v-model.trim="mate.values['buyerAddress']"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          </el-row>
          </div>
           <div class="tabclass">
            <div class="title">销方公司（供应商）</div>
          <el-row>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="mate.tabs[1].fields[0].label" :prop="mate.tabs[1].fields[0].name">
              <el-input readonly v-model.trim="mate.values['sellerName']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="mate.tabs[1].fields[1].label" :prop="mate.tabs[1].fields[1].name">
              <el-input v-model.trim="mate.values['sellerTaxNumber']"></el-input>
            </el-form-item>
          </el-col>
          </el-row>
          <el-row>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="mate.tabs[1].fields[2].label" :prop="mate.tabs[1].fields[2].name">
              <el-input type="textarea" :rows="2" v-model.trim="mate.values['sellerAddressPhone']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="mate.tabs[1].fields[3].label" :prop="mate.tabs[1].fields[3].name">
              <el-input type="textarea" :rows="2" v-model.trim="mate.values['sellerBankAccount']"></el-input>
            </el-form-item>
          </el-col>
         </el-row>
          </div>
      </el-form>
          <div class="tbutton" v-show="!showFlag">
            <el-button plain size="mini" class="el-icon-document" :disabled="handleSubmitDisable" @click="handleSubmit">提 交</el-button>
            <el-button plain size="mini" class="el-icon-close" @click="backward">取 消</el-button>
            <el-button tplain size="mini" class="el-icon-date"  @click="resetForm('ruleForm')">重 置</el-button>
       </div>
    </el-row>
  </div>
</template>

<script>

import Vue from 'vue'
import CountrySelect from './CountrySelect.vue'
import Addrselect from './address/Addrselect'
import addrArr from './address/addr-arr.js'

export default{
  components: {
    CountrySelect,
    Addrselect,
    'dict-selected': function index (resolve) {
      require(['../components/DictSelected.vue'], resolve)
    }
  },
  data () {
    var vm = this
    var checkClassCode = (rule, value, callback) => {
        if (value) {
          if(value.length !== 19){
            callback(new Error('请填写19位的税收分类代码!'));
          }else if (value.length == 19){
          this.$root.ajaxData('/tms/invoicerule/check?combcode=' + value, {}, function (data) {
             if (data.message == 1) {
                 callback();
             }else{
                 callback(new Error('请填写正确的税收分类代码!'));
             }
          }, 'GET')
         }
        }else {
           callback();
        }
    };
    var checkMerges = (rule, value, callback) => {
        if (value) {
          if(value.length == 0){
            callback(new Error('该输入项为必输项'));
          }else if(typeof(value)=='string' && value.split(",").indexOf('unit_price')!= -1 && value.split(",").indexOf('price')!= -1){
            callback(new Error('不能同时根据含税单价和不含税单价进行合并'));
          }else if(typeof(value)!='string' && value.indexOf('unit_price')!= -1 && value.indexOf('price')!= -1){
            callback(new Error('不能同时根据含税单价和不含税单价进行合并'));
          }else {
           callback();
           }
        }else {
           callback();
       }
    };
    var checkFaceAmount = (rule, value, callback) => {
        if (value) {
          if(isNaN(value)){
            callback('必须输入数字');
          }else {
            if(value<0){
              callback('必须输入大于0的数字');
            }else {
               callback();
            }
          }
        }else {
          callback('该输入项为必输项');
       }
    };
    var checkBuyerName = (rule, value, callback) => {
        if (value) {
          if(vm.mate.values.custName) {
            if(value == vm.mate.values.custName) {
               callback();
            }else {
              this.$root.ajaxData(`/tms/invoicerule/all/list?dataOnly=true&buyerName=${value}&sellerName=${this.mate.values['sellerName']}`, {}, function (data) {
                if(data.length>0){
                    callback(new Error('此销方公司和购方公司的开票规则已存在'));
                }else {
                    callback();
                }
              }, 'GET')
            }
          }else {
            this.$root.ajaxData(`/tms/invoicerule/all/list?dataOnly=true&buyerName=${value}&sellerName=${this.mate.values['sellerName']}`, {}, function (data) {
              if(data.length>0){
                  callback(new Error('此销方公司和购方公司的开票规则已存在'));
              }else {
                  callback();
              }
            }, 'GET')
          }
        }else {
           callback(new Error('该输入项为必输项'));
        }
    };
    return {
      handleSubmitDisable: false,
      customerNameOptions: [],
      getItemOptions: [],
      customerAdd: {},
      autoRemarkItemDisAble: false,
      cityAddrs: [],
      provAddrs: [],
      initprovselectedvalueAddr: '0',
      initcityselectedvalue: '0',
      autoMergesItemDisAble: false,
      autoSplitItemDisAble: false,
      splitItemDisAble: false,
      mergesItemDisAble: false,
      object: {},
      mateValue: {},
      disabledFlagAddr: false,
      disabledFlagBank: false,
      rules: {
        classCode:
         { required: false, validator: checkClassCode, trigger: 'blur' },
        sellerName: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        sellerTaxNumber: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        sellerAddressPhone: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        sellerBankAccount: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        buyerName: [
          { required: true, validator: checkBuyerName }
        ],
        buyerBankAccount: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        buyerTaxNumber: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        buyerCountry: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        buyerState: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        buyerCity: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        buyerEmail: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        buyerZipCode: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        buyerAddress: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        buyerPhone: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        autoSplit: [
          { required: true, message: '该输入项为必输项'}
        ],
        autoMerge: [
          { required: true, message: '该输入项为必输项'}
        ],
        faceAmount: [
          { required: true, validator: checkFaceAmount }
        ],
        split: [
          { required: true, message: '该输入项为必输项' }
        ],
        merges: [
          { required: true, validator: checkMerges }
        ],
        drawer: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        checker: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        payee: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        versionNum: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        vatType: [
          { required: true, message: '该输入项为必输项' }
        ],
        autoRed: [
          { required: true, message: '该输入项为必输项' }
        ]
      },
      autoSplitItem: [{
        value: '1',
        label: '是'
      }, {
        value: '0',
        label: '否'
      }],
      autoMergeItem: [{
        value: '1',
        label: '是'
      }, {
        value: '0',
        label: '否'
      }],
      autoRemarkItem: [{
        value: '1',
        label: '使用（备注将包含部门、不含税金额、税额、含税金额、发票数量、所属月份）'
      }, {
        value: '0',
        label: '不使用（请在预制发票头中填写备注）'
      }],
      customerPoSplitItem: [{
        value: 'customer_po',
        label: '客户采购订单号'
      }],
      vatTypeItem: [{
        value: 'SPECIAL_INVOICE_VAT',
        label: '增值税专用发票'
      }, {
        value: 'GENERAL_INVOICE_VAT',
        label: '增值税普通发票'
      }, {
        value: 'E_GENERA_INVOICE_VAT',
        label: '增值税电子发票'
      }]
    }
  },
  computed: {
    // a computed getter
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        // width = undefined
        width = '140px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '140px'
      } else if (this.mate.labelWidth === null) {
        width = '140px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  props: {
    mate: Object,
    labelPosition: {
      type: String
    },
    rowId: String,
    showFlag: Boolean
  },
  watch: {
    'rowId': function (val, oldVal) {
      this.showItem()
    }
  },
  created () {
    this.getItem()
    this.autoMergeChange()
    this.showItem()
    this.autoSplitChange()
    this._getCustomerName()
    this._getSellName()
  },
  mounted () {
  },
  methods: {
    // 获取客户名称
    _getCustomerName () {
      var vm = this
      this.$root.ajaxData('/companys/companyInfo/4?status=1&auditStatus=1&nopaging=1&dataOnly=true', {}, function (data) {
        for (var i = 0; i < data.length; i++) {
          data[i].value = data[i].name
        }
        vm.customerNameOptions = data
      })
    },
    // 获取销方公司名称
    _getSellName () {
      var vm = this
      this.$root.ajaxData(`/tenants/get/tenant?tenantId=${JSON.parse(window.sessionStorage.getItem('user')).tenantId}`, {}, function (data) {
         if(data.name){
            vm.mate.values['sellerName'] = data.name
         }
      })
    },
    provChange (val) {
      const oldVal = this.mate.values.buyerState
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
      this.mate.values.buyerState = val
    },
    cityChange (val) {
      const oldVal = this.mate.values.buyerCity
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
      this.mate.values.buyerCity = val
    },
    mergeChange () {
      //console.log("this.mate.values['merges'][0]" +this.mate.values['merges'][0])
      //console.log("this.mate.values['merges']" +this.mate.values['merges'])
      if(this.mate.values['merges'].indexOf('all_item') != -1 && this.mate.values['merges'].length == 1){
        this.getItemOptions = []
        this.getItemOptions.push({ 'label': '塑胶类制品全物料合并', 'value': 'all_item' })
        this.mate.values['merges'] = []
        //this.mate.values['merges']是数组 要用push
        this.mate.values['merges'].push('all_item')
      }else {
        this.getItemOptions = []
        this.getItemOptions.push({ 'label': '物料编号', 'value': 'item_code' })
        this.getItemOptions.push({ 'label': '不含税单价', 'value': 'unit_price' })
        this.getItemOptions.push({ 'label': '规格型号', 'value': 'model' })
        this.getItemOptions.push({ 'label': '含税单价', 'value': 'price' })
        if(this.mate.values['merges'].indexOf('all_item') != -1){
          this.mate.values['merges'] = []
        }
      }

      if(this.mate.values['merges'].length == 0){
         if(this.mate.values['autoSplit'] == 1){
          //除了塑胶类制品全物料合并其他都恢复
          this.getItemOptions = []
          this.getItemOptions.push({ 'label': '物料编号', 'value': 'item_code' })
          this.getItemOptions.push({ 'label': '不含税单价', 'value': 'unit_price' })
          this.getItemOptions.push({ 'label': '规格型号', 'value': 'model' })
          this.getItemOptions.push({ 'label': '含税单价', 'value': 'price' })
         }else{
         //恢复下拉框
         this.getItemOptions = []
         this.getItemOptions.push({ 'label': '含税单价', 'value': 'price' })
         this.getItemOptions.push({ 'label': '物料编号', 'value': 'item_code' })
         this.getItemOptions.push({ 'label': '不含税单价', 'value': 'unit_price' })
         this.getItemOptions.push({ 'label': '规格型号', 'value': 'model' })
         this.getItemOptions.push({ 'label': '塑胶类制品全物料合并', 'value': 'all_item' })
         }
      }
      // this.getItemOptions.forEach(e1 => {
      //   this.mate.values['merges'].forEach(e2 => {
      //     if (e1.value === e2) {
      //       e1.disabled = true
      //     }
      //   })
      // })
    },
    inputChangeAddr (val) {
      this.customerAdd = { 'nameZH': val }
      if (val === this.$t('China')) {
        this.disabledFlagAddr = false
      } else {
        this.disabledFlagAddr = true
        this.initprovselectedvalueAddr = ''
        this.initcityselectedvalue = ''
      }
    },
    autoMergeChange () {
      if (this.mate.values['autoMerge'] == 0) {
        this.mate.values['merges'] = []
        this.autoMergesItemDisAble = true
        this.rules.merges[0].required = false
        // 选择不合并后把红色的校验提示清掉
        if(this.$refs['mergesItem']){
           this.$refs['mergesItem'].clearValidate()
        }
      } else {
        this.autoMergesItemDisAble = false
        this.rules.merges[0].required = true
      }
    },
    autoRemarkChange () {
      if (this.mate.values['autoRemark'] == 0) {
        this.mate.values['remark'] = ''
        this.autoRemarkItemDisAble = true
      } else {
        this.autoRemarkItemDisAble = false
      }
    },
    autoSplitChange () {
      if (this.mate.values['autoSplit'] == 0) {
        this.mate.values['split'] = ''
        this.autoSplitItemDisAble = true
        this.rules.split[0].required = false
        if (this.$refs['splitItem']) {
          this.$refs['splitItem'].clearValidate()
        }
        //不拆分的情况下 如果合并字段没有全物料拆分，就把他加上
        //console.log("beforelength"+this.getItemOptions.length)
        if(this.getItemOptions.length<5){
          this.getItemOptions.push({ 'label': '塑胶类制品全物料合并', 'value': 'all_item' })
          //console.log("afterlength"+this.getItemOptions.length)
        }
      } else if(this.mate.values['autoSplit'] == 1){
         //console.log("else "+1111111)
        //选择是的话合并维度置为空 防止先选全物料合并，再把是否拆分选为是的情况
        this.mate.values['merges'] = []

        this.autoSplitItemDisAble = false
        this.rules.split[0].required = true

        //如果拆分维度是是的话，就不显示全物料合并
        this.getItemOptions = []
        this.getItemOptions.push({ 'label': '物料编号', 'value': 'item_code' })
        this.getItemOptions.push({ 'label': '不含税单价', 'value': 'unit_price' })
        this.getItemOptions.push({ 'label': '规格型号', 'value': 'model' })
        this.getItemOptions.push({ 'label': '含税单价', 'value': 'price' })
      }
    },
    showItem () {
      const vm = this
      if(this.mate.values.id == null){
        // 最大票面金额
        this.mate.values['faceAmount'] = '99999.99'
        // 发票类型 
        this.mate.values['vatType'] = 'SPECIAL_INVOICE_VAT'
        // 默认不开红字autoRed
        this.mate.values['autoRed'] = '0'
        //是否合并默认是 是
        this.mate.values['autoMerge'] = "1"
        //新增时需要默认选中按单价和物料合并
        //this.mate.values['merges']本来是数组，虽然此处赋值是字符串，但是会调用下面的split方法，把字符串转成数组
        this.mate.values['merges'] = "unit_price,item_code"
        //是否备注默认填否
        // this.mate.values['autoRemark'] = '1'
      }
      // 回显多选下拉框
      if (this.mate.values['merges'].length != 0) {
        var ss = this.mate.values['merges'].split(',')
        this.mate.values['merges'] = ss
        //console.log("ss "+ss)
      }
      // 目前split是下拉框 不能用多选下拉框的方式回显
      // if (this.mate.values['split']) {
      //   var ss = vm.mate.values['split'].split(',')
      //   vm.mate.values['split'] = ss
      // }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleSubmit () {
      var mate = {}
      var vm = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 把多选下拉框转成string 不然提交到后台是数组
          var abc = this.mate.values['merges'].toString()
          this.mate.values.merges = abc

          this.mate.values.status = 1
          mate = this.mate.values
          if (mate.drawer.trim() == mate.checker.trim() && mate.checker.trim() == mate.payee.trim()) {
             this.$message({
              type: 'error',
              message: '开票人、复核人、收款人不能是同一个'
            })
            return
          }
          // 点击提交之后把提交按钮置灰
          this.handleSubmitDisable = true
          if (this.mate.method === 'PUT' && mate.id) {
            this.$root.ajaxData('/tms/invoicerule/update/' + mate.id, mate, function (data) {
              // 拿到返回值后把提交按钮恢复
              vm.handleSubmitDisable = true
              if (data.code === 500) {
                return
              }
              vm.$root.monitor({ url: '/tms/invoicerule/all/list' })
            }, 'PUT')
          } else if (this.mate.method === 'POST') {
            this.$root.ajaxData('/tms/invoicerule/save', mate, function (data) {
              vm.handleSubmitDisable = true
              if (data.code === 500) {
                return
              }
              vm.$root.monitor({ url: '/tms/invoicerule/all/list' })
            }, 'POST')
          }
        } else {
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          return
        }
      })
    },
    // handleSubmit (ev) {
    //   this.buttonDisabled = true
    //   var vm = this
    //   var mate = {}
    //   const mateMateFormerHeader = this.mate.mateFormerHeader
    //   const mateMateListRows = this.mate.mateList.rows
    //   mate.mateFormerHeader = mateMateFormerHeader.values
    //   mate.mateList = mateMateListRows
    //   if (mateMateFormerHeader.method === 'PUT' && mateMateFormerHeader.values.id) {
    //     this.$root.ajaxData('/tms/invoicerule/update/' + mateMateFormerHeader.values.id, mate.mateFormerHeader, function (data) {
    //       if (data.code === 500) {
    //         vm.buttonDisabled = false
    //         return
    //       }
    //       vm.$root.monitor({ url: '/tms/invoicerule/all/list' })
    //     }, 'PUT')
    //   } else if (mateMateFormerHeader.method === 'POST') {
    //     this.$root.ajaxData('/tms/invoicerule/save', mate.mateFormerHeader, function (data) {
    //       if (data.code === 500) {
    //         vm.buttonDisabled = false
    //         return
    //       }
    //       vm.$root.monitor({ url: '/tms/invoicerule/all/list' })
    //     }, 'POST')
    //   }
    // },
    backward () {
      this.$root.monitor({ url: '/tms/invoicerule/all/list' })
    },
    // 多选下拉框只能用Ajax方法填值??
    getItem () {
      var vm = this
      this.getItemOptions = []
      this.$root.ajaxData('/tms/invoicerule/getItem', {}, function (data) {
        data.map((item) => {
          vm.getItemOptions.push({ 'label': item.key, 'value': item.label })
        })
      }, 'GET')
    }
  }
}
</script>

<style scoped lang="scss">
.tabclass{
    margin-bottom: 55px
}
.title {
  font-size: 18px;
  color: #333;
  font-weight: normal;
  margin: 20px 0 10px 30px;
}
.el-form-item__label{
  line-height:inherit
}
.el-form--inline>* {
  margin-right:10px
}
.el-form--inline .el-form-item {
  width:200px;
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
}
/** tree-select **/
*{
  padding:0;
  margin:0;
}

li{
  list-style:none;
}

.ats-tree{
  vertical-align: top;
}

.hidden{
  display:none;
}
h4{
  margin-top:40px;
  margin-bottom:10px;
}
h5 {
  color: red;
}
.el-select{
  width:100%;
}
.el-date-editor.el-input{
  width:100%;
}
.el-form-item {
    margin: 15px 20px 2px 0px;
}
.el-form-item.is-required .el-form-item__label:before{
  content:''
}
.el-form-item.is-required .el-form-item__label:after{
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
// .el-select>.el-input {
//   position: relative;
//   width: 80%;
// }
.el-input--mini .el-input__inner{
  width:80%
}
.el-input__suffix {
  right:80px;
}
.el-dialog__header {
  padding: 10px 10px 0;
}
.el-dialog__body {
  padding: 10px 10px;
}
.fbutton {
  position: relative;
  margin: 5px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.el-button--mini {
  padding: 7px 9px;
}
.tbutton {
  margin: 20px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
</style>