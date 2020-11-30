<!-- 销售定价新增页面 -->
<template>
  <div>
     <div class="tbutton">
      <el-button plain class="el-icon-document" :disabled="buttonDisabled" @click="handleSubmit">提 交</el-button>
      <el-button plain class="el-icon-close" @click="backward">取 消</el-button>
       <el-button plain class="el-icon-date"  @click="resetForm('SmPriceFormSheetForm')">重 置</el-button>
     </div>
    <!--价目表头form-->
     <el-row>
      <el-form size="mini" :model="mate.mateFormerHeader.values" :label-position="labelPosition" ref="SmPriceFormSheetForm" :rules="rules" :label-width="labelWidth">
        <template>
         
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['priceName'].label" :prop="object['priceName'].name">
              <el-input v-model="mate.mateFormerHeader.values[object['priceName'].name]" @blur="blurName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['officeId'].label" :prop="object['officeId'].name">
              <el-select clearable  v-model="mate.mateFormerHeader.values[object['officeId'].name]" filterable placeholder="请选择">
                <el-option v-for="item in officeIdOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['customerId'].label" :prop="object['customerId'].name">
              <el-select @change="changeCustomerId"  v-model="mate.mateFormerHeader.values[object['customerId'].name]" filterable placeholder="请选择">
                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['address'].label" :prop="object['address'].name">
              <el-select clearable @change="changeAddress"  v-model="mate.mateFormerHeader.values[object['address'].name]" filterable placeholder="请选择">
                <el-option v-for="item in addressOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['salesmanId'].label" :prop="object['salesmanId'].name">
              <el-select clearable  v-model="mate.mateFormerHeader.values[object['salesmanId'].name]" filterable placeholder="请选择">
                <el-option v-for="item in manOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['requestBasis'].label" :prop="object['requestBasis'].name">
              <dict-selected v-model="mate.mateFormerHeader.values[object['requestBasis'].name]" dictType="requestBasis" :initValue="mate.mateFormerHeader.values[object['requestBasis'].name]"></dict-selected>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['createAt'].label" :prop="object['createAt'].name">
              <el-date-picker clearable  readonly v-model="mate.mateFormerHeader.values[object['createAt'].name]" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">      
            <el-form-item :label="object['currency'].label" :prop="object['currency'].name">
              <el-select v-model="mate.mateFormerHeader.values[object['currency'].name]" filterable placeholder="请选择">
                <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>  

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['paymentMode'].label" :prop="object['paymentMode'].name">
              <dict-selected v-model="mate.mateFormerHeader.values[object['paymentMode'].name]" dictType="paymentMode" :initValue="mate.mateFormerHeader.values[object['paymentMode'].name]"></dict-selected>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['paymentCondition'].label" :prop="object['paymentCondition'].name">
              <dict-selected v-model="mate.mateFormerHeader.values[object['paymentCondition'].name]" dictType="paymentMethod" :initValue="mate.mateFormerHeader.values[object['paymentCondition'].name]"></dict-selected>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['taxRate'].label" :prop="object['taxRate'].name">
               <dict-selected :clearable="false" @input="visibleChangeTax(mate.mateFormerHeader.values[object['taxRate'].name])" v-model="mate.mateFormerHeader.values[object['taxRate'].name]" dictType="tax" :initValue="mate.mateFormerHeader.values[object['taxRate'].name]"></dict-selected>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['countermanId'].label" :prop="object['countermanId'].name">
              <el-select clearable  v-model="mate.mateFormerHeader.values[object['countermanId'].name]" filterable placeholder="请选择">
                <el-option v-for="item in manOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['type'].label" :prop="object['type'].name">
               <dict-selected v-model="mate.mateFormerHeader.values['type']" dictType="yes_no" :initValue="mate.mateFormerHeader.values['type']"></dict-selected>
            </el-form-item>
          </el-col>

        </template>
      </el-form>
    </el-row>
    <!--价目表明细list-->
    <KTable :mate="mate.mateListLine" @actionSelected="handleSelected" class="KTable-margin-top" @handleAction="handleAction" @action="handleKtable"></KTable>
   

    <el-dialog title="填写价目表明细" width="80%" :visible.sync="dialogFormVisible">
      <el-row>
        <el-form size="mini" :model="mate.mateFormerLine.values" :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="labelWidth">
          
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['itemId'].label" :prop="dialogObject['itemId'].name" >
              <el-select clearable  @change="changeItem(mate.mateFormerLine.values[dialogObject['itemId'].name])" @visible-change="changeItemName" v-model="mate.mateFormerLine.values[dialogObject['itemId'].name]" filterable placeholder="请选择">
                <el-option v-for="item in itemSubcodeOptions" :key="item.value" :label="item.label" :value="item.value">
                  <span style="float: left;margin-right:30px">{{ item.label }}</span>
                  <span style="float: right; color:#212121; font-size: 13px">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['itemName'].label" :prop="dialogObject['itemName'].name">
              <el-input readonly v-model="mate.mateFormerLine.values[dialogObject['itemName'].name]"></el-input>
            </el-form-item>
          </el-col>

           <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['itemSpecification'].label" :prop="dialogObject['itemSpecification'].name">
              <el-input readonly v-model="mate.mateFormerLine.values[dialogObject['itemSpecification'].name]"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['unit'].label" :prop="dialogObject['unit'].name">
              <el-input readonly v-model="mate.mateFormerLine.values[dialogObject['unit'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['price'].label" :prop="dialogObject['price'].name">
              <el-input  @blur="blurPrice" v-model="mate.mateFormerLine.values[dialogObject['price'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['priceNotax'].label" :prop="dialogObject['priceNotax'].name">
              <el-input  readonly v-model="mate.mateFormerLine.values[dialogObject['priceNotax'].name]"></el-input>
            </el-form-item>
          </el-col>
          
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['dateFrom'].label" :prop="dialogObject['dateFrom'].name">
              <el-date-picker :picker-options="pickerBeginDateBefore" clearable v-model="mate.mateFormerLine.values[dialogObject['dateFrom'].name]" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['dateTo'].label" :prop="dialogObject['dateTo'].name">
              <el-date-picker clearable v-model="mate.mateFormerLine.values[dialogObject['dateTo'].name]" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['applicationDate'].label" :prop="dialogObject['applicationDate'].name">
              <el-date-picker disabled clearable v-model="mate.mateFormerLine.values[dialogObject['applicationDate'].name]" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="sbutton">
        <el-button @click="dialogSubmit">确 定</el-button>
        <el-button @click="dialogBackward">取 消</el-button>
      </div>
    </el-dialog>
  </div>  
</template>
<script>
import Vue from 'vue'
import { DateFormat, trimSpace, isPositivenumber } from '../../utils/util.js'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
function toDecimal (x) {
  var f = parseFloat(x)
  if (isNaN(f)) {
    return
  }
  f = Math.round(x * 100) / 100
  return f
}
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    KTable: function index (resolve) {
      require(['../../components/KTable.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    }
  },
  data () {
    var validatePositivenumberPrice = (rule, value, callback) => {
      if (value === undefined || trimSpace(value) === '') {
        callback(new Error('该输入项为必输项'))
      } else {
        if (!isPositivenumber(trimSpace(value))) {
          callback(new Error('请输入正数'))
        } else {
          callback()
        }
      }
    }
    return {
      buttonDisabled: false,
      selectedIds: [],
      dialogFormVisible: false,
      btn: {},
      row: {},
      labelPosition: 'right',
      dialogObject: {},
      object: {},
      rules: {
        priceName: [
           { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        customerId: [
           { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        currency: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
        ],
        taxRate: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        itemId: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
        ],
        price: [
            { required: true, message: '该输入项为必输项', trigger: 'blur' },
            { validator: validatePositivenumberPrice, trigger: 'blur' }
        ]
      },
      officeIdOption: [],
      itemSubcodeOptions: [],
      addressOptions: [],
      subcode: '',
      objectColumns: {},
      customerOptions: [],
      manOptions: [],
      list: {},
      customerData: [],
      addressList: [],
      priceList: [],
      pickerBeginDateBefore: {
        // disabledDate (time) {
        //   return time.getTime() > Date.now()
        // }
      },
      currencyOptions: [],     // 币种下拉选项
    }
  },
  props: {
    mate: Object
  },
  created () {
    this.mate.mateFormerLine.fields.map((i) => { this.dialogObject[i.name] = i })
    this.mate.mateFormerHeader.fields.map((i) => { this.object[i.name] = i })
    this.mate.mateListLine.columns.map((i) => { this.objectColumns[i.name] = i })
    this.list = this.mate.mateListLine
    this.getMaterial()
    this.getCustomer()
    this.getMan()
    this.getOfficeId()
    this.getCurrency()
  },
  computed: {
    // a computed getter
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        // width = undefined
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
  methods: {
    /**
     * 获取币种下拉选项
     */
    getCurrency () {
      var vm = this
      this.$root.ajaxData('/currency/new/down', {}, function (data) {
        data.forEach(item => {
          vm.currencyOptions.push({'lable': item.symbol, 'value': item.symbol})
          // if (vm.currencyOptions.length !== 0) { //注释手动设置默认值(会影响到修改时候的赋值) 请区分新建和修改 (是否有id) 用value而不是symbol 2020-03-30 
          //   vm.$set(vm.mate.mateFormerHeader.values,'currency',vm.currencyOptions[0].symbol)
          // }
        })
      }, 'GET')
    },
    changeCustomerId (val) {
      const vm = this
      vm.addressOptions = []
      this.customerData.forEach((item) => {
        if (item.id === val) {
          vm.addressList = item.addressList
          vm.priceList = item.financeList
          if (item.addressList) {
            for (let i = 0; i < item.addressList.length; i++) {
              vm.addressOptions.push({ label: item.addressList[i].name, value: item.addressList[i].id, key: item.addressList[i].id })
            }
          }
        }
      })
    },
    // changeAddress (val) {
    //   var vm = this
    //   for (var i = 0; i < vm.priceList.length; i++) {
    //     if (vm.priceList[i].id === val) {
    //       Vue.set(vm.mate.mateFormerHeader.values, 'currency', vm.priceList[i].currency)
    //       Vue.set(vm.mate.mateFormerHeader.values, 'paymentMode', vm.priceList[i].paymentMode)
    //       Vue.set(vm.mate.mateFormerHeader.values, 'paymentCondition', vm.priceList[i].paymentCondition)
    //       Vue.set(vm.mate.mateFormerHeader.values, 'taxRate', vm.priceList[i].taxRate)
    //       Vue.set(vm.mate.mateFormerHeader.values, 'requestBasis', vm.priceList[i].requestBasis)
    //     } else {
    //       vm.mate.mateFormerHeader.values[vm.object['currency'].name] = ''
    //       vm.mate.mateFormerHeader.values[vm.object['paymentMode'].name] = ''
    //       vm.mate.mateFormerHeader.values[vm.object['paymentCondition'].name] = ''
    //       vm.mate.mateFormerHeader.values[vm.object['taxRate'].name] = ''
    //       vm.mate.mateFormerHeader.values[vm.object['requestBasis'].name] = ''
    //     }
    //   }
    // },
    getOfficeId () {
      var user = window.sessionStorage.getItem('user')
      if (user) {
        user = JSON.parse(user)
      }
      var vm = this
      this.$root.ajaxData('/users/office', {}, function (data) {
        data.forEach((i) => {
          vm.officeIdOption.push({ 'label': i.name, 'value': i.id })
          if (vm.officeIdOption.length !== 0) {
            Vue.set(vm.mate.mateFormerHeader.values, 'officeId', vm.officeIdOption[0].value)
          }
        })
      }, 'GET')
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    getCustomer () {
      var vm = this
      this.$root.ajaxData('/companys/companyInfo/4?status=1&auditStatus=1&nopaging=1&dataOnly=true', {}, function (data) {
        vm.customerData = data
        for (let i = 0; i < data.length; i++) {
          vm.customerOptions.push({ label: data[i].name, value: data[i].id, key: data[i].id })
        }
        if (vm.mate.mateFormerHeader.values.customerId) {
          vm.customerData.forEach((item) => {
            if (item.id === vm.mate.mateFormerHeader.values.customerId) {
              vm.addressList = item.addressList
              vm.priceList = item.financeList
              if (item.addressList) {
                for (let i = 0; i < item.addressList.length; i++) {
                  vm.addressOptions.push({ label: item.addressList[i].name, value: item.addressList[i].id, key: item.addressList[i].id })
                }
              }
            }
          })
        }
      }, 'GET')
    },
    getMan () {
      var vm = this
      this.$root.ajaxData('/purchase/reqPurchase/getUsers', {}, function (data) {
        for (let i = 0; i < data.length; i++) {
          vm.manOptions.push({ label: data[i].username, value: data[i].id, key: data[i].id })
        }
      }, 'GET')
    },
    blurPrice () {
      var price = this.mate.mateFormerLine.values.price
      var tax = this.mate.mateFormerHeader.values.taxRate
      var priceNotax = toDecimal(price / (1 + tax / 100))
      this.$set(this.mate.mateFormerLine.values, 'priceNotax', priceNotax)
    },
    handleSelected (val) {
      this.selectedIds = []
      // map方法也可以
      val.map((i) => this.selectedIds.push(i.lineNum))
      // 每次点击都会执行这个函数，要点击两下的时候，this.selectedIds里面包括了前面一次的数据，所以会有重复，要去重
      var arr = []
      var json = {}
      for (var i = 0; i < this.selectedIds.length; i++) {
        if (!json[this.selectedIds[i]]) {
          json[this.selectedIds[i]] = 1
          arr.push(this.selectedIds[i])
        }
      }
      this.selectedIds = arr
    },
    handleAction () {

    },
    handleKtable (btn, row) {
      this.btn = btn
      this.row = row
      if (this.btn.action === 'addDetailBill') {
        // 明细行新增
        this.dialogFormVisible = true
        this.mate.mateFormerLine.values.applicationDate = this.mate.mateFormerHeader.values.createAt
      } else if (this.btn.action === 'updataDetailBill') {
        // 明细行修改
        this.dialogFormVisible = true
        for (var m = 0; m < this.mate.mateListLine.rows.length; m++) {
          if (this.mate.mateListLine.rows[m].lineNum === this.selectedIds[this.selectedIds.length - 1]) {
            this.mate.mateListLine.rows[m].price = String(this.mate.mateListLine.rows[m].price)
            this.mate.mateFormerLine.values = Object.assign({}, this.mate.mateListLine.rows[m])
            return true
          }
        }
      } else if (this.btn.action === 'deleteQuotation') {
        // 明细行删除
        for (var j = 0; j < this.mate.mateListLine.rows.length; j++) {
          for (var k = 0; k < this.selectedIds.length; k++) {
            if (this.mate.mateListLine.rows[j].lineNum === this.selectedIds[k]) {
              // splice(i, 1),从i开始的那一条，删除一条
              this.mate.mateListLine.rows.splice(j, 1)
              // 删除了一条之后，就将剩余从新排序
            }
          }
          for (var l = 0; l < this.mate.mateListLine.rows.length; l++) {
            this.mate.mateListLine.rows[l].lineNum = l + 1
          }
        }
      }
    },
    handleSubmit () {
      // 提交
      var mate = {}
      var vm = this
      if(this.mate.mateListLine.rows.length === 0){
        this.$message({
          type: 'warning',
          message: '明细行不能为空'
        })
        return
      }
      this.$refs['SmPriceFormSheetForm'].validate((valid) => {
        if (valid) {
          this.mate.mateFormerHeader.values.createAt = DateFormat(this.mate.mateFormerHeader.values.createAt, 'yyyy-MM-dd HH:mm:sss')
          mate.mateFormerHeader = this.mate.mateFormerHeader.values
          mate.mateList = this.mate.mateListLine.rows
          if (this.mate.mateFormerHeader.method === 'PUT') {
            this.$root.ajaxData('/purchase/smPrice/batchUpdate/' + this.mate.mateFormerHeader.values.id, mate, function () {
              vm.$root.monitor({ url: '/purchase/smPrice/all/list' })
            }, 'PUT')
          } else {
            this.$root.ajaxData('/purchase/smPrice/batchSave', mate, function () {
              vm.$root.monitor({ url: '/purchase/smPrice/all/list' })
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
    backward () {
      // 取消
      this.$root.monitor({ url: '/purchase/smPrice/all/list' })
    },
    dialogSubmit () {
      this.mate.mateFormerLine.values.dateFrom = DateFormat(this.mate.mateFormerLine.values.dateFrom, 'yyyy-MM-dd');
      this.mate.mateFormerLine.values.dateTo = DateFormat(this.mate.mateFormerLine.values.dateTo, 'yyyy-MM-dd');
      this.mate.mateFormerLine.values.applicationDate = DateFormat(this.mate.mateFormerLine.values.applicationDate, 'yyyy-MM-dd');
      if (this.mate.mateFormerLine.values.dateTo) {
        if (this.mate.mateFormerLine.values.dateTo < this.mate.mateFormerLine.values.dateFrom) {
          this.$message({
            type: 'warning',
            message: '终止日期不能小于起始日期'
          })
          return
        }
      }
      for (var i = 0; i < this.mate.mateListLine.rows.length; i++) {
        if (this.mate.mateFormerLine.values.itemId === this.mate.mateListLine.rows[i].itemId && (this.mate.mateFormerLine.values.lineNum !== this.mate.mateListLine.rows[i].lineNum)) {
          if (this.mate.mateListLine.rows[i].dateTo) {
            if (this.mate.mateFormerLine.values.dateFrom < this.mate.mateListLine.rows[i].dateTo) {
              this.$message({
                type: 'warning',
                message: '该物料在该期间已有定价，请勿重复定价'
              })
              return
            }
          } else {
            this.$message({
              type: 'warning',
              message: '该物料已有定价，请勿重复定价'
            })
            return
          }
        }
      }
      if (this.selectedIds.length == 0) {
        this.mate.mateFormerLine.values.lineNum = (this.list.rows.length + 1)
        // 拷贝
        this.mate.mateFormerLine.values.itemSubcode = this.subcode
        const mateFormerValues = Object.assign({}, this.mate.mateFormerLine.values)
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.list.rows.push(mateFormerValues)
            this.list.rows.itemSubcode = this.subcode
            this.dialogFormVisible = false
            // 清空数据
            this.mate.mateFormerLine.values = {}
            // this.$refs['ruleForm'].resetFields()
          } else {
            this.$notify.error({
              title: '消息',
              message: '数据验证未通过'
            })
            this.dialogFormVisible = true
          }
        })
      } else {
        for (var i = 0; i < this.mate.mateListLine.rows.length; i++) {
          if (this.mate.mateFormerLine.values.lineNum === this.mate.mateListLine.rows[i].lineNum) {
            const mateFormerValues1 = Object.assign({}, this.mate.mateFormerLine.values)
            this.$refs.ruleForm.validate((valid) => {
              if (valid) {
                // splice将i行数据删除，并将mateFormerValues1填充进去
                if (this.mate.mateFormerLine.values.itemId === this.mate.mateListLine.rows[i].itemId) {
                  this.mate.mateListLine.rows.splice(i, 1, mateFormerValues1)
                } else {
                  this.mate.mateListLine.rows.splice(i, 1, mateFormerValues1)
                  this.mate.mateListLine.rows[i].itemSubcode = this.subcode
                }
                this.dialogFormVisible = false
                this.mate.mateFormerLine.values = {}
              } else {
                this.$notify.error({
                  title: '消息',
                  message: '数据验证未通过'
                })
                this.dialogFormVisible = true
              }
            })
          }
        }
      }
    },
    dialogBackward () {
      // 清空数据
      this.dialogFormVisible = false
      this.mate.mateFormerLine.values = {}
    },
    getMaterial () {
      var vm = this
      this.$root.ajaxData('/materials/getMaterialDropdownList', {}, function (data) {
        for (let i = 0; i < data.length; i++) {
          vm.itemSubcodeOptions.push({ label: data[i].subcode, value: data[i].id, unit: data[i].unit, name: data[i].name, specification: data[i].specification })
        }
      }, 'GET')
    },
    changeItem (value) {
      try {
        var obj = this.itemSubcodeOptions.find((item) => {
          return item.value === value
        })
        this.$set(this.mate.mateFormerLine.values, 'itemName', obj.name)
        this.$set(this, 'subcode', obj.label)
        this.$set(this.mate.mateFormerLine.values, 'unit', obj.unit)
        this.$set(this.mate.mateFormerLine.values, 'itemSpecification', obj.specification)
      } catch (e) {
      }
    },
    changeItemName (flag) {
      if (!flag) {
        for (var i = 0; i < this.mate.mateListLine.rows.length; i++) {
          if (this.mate.mateFormerLine.values.itemId === this.mate.mateListLine.rows[i].itemId) {
            if (this.mate.mateListLine.rows[i].dateTo) {
              this.mate.mateFormerLine.values.dateFrom = this.mate.mateListLine.rows[i].dateTo
            } else {
              this.$message({
                type: 'warning',
                message: '该物料已有定价，请勿重复定价'
              })
              return
            }
          } else {
            this.mate.mateFormerLine.values.dateFrom = this.mate.mateFormerHeader.values.createAt
          }
        }
      }
    },
    blurName (val) {
    },
    visibleChangeTax (val) {
      var price
      var priceNotax
      for (var i = 0; i < this.mate.mateListLine.rows.length; i++) {
        price = this.mate.mateListLine.rows[i].price
        priceNotax = price * (1 - val / 100)
        this.mate.mateListLine.rows[i].priceNotax = toDecimal(priceNotax)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-date-editor, .el-select{
  width: 100%;
}
.el-form-item__label{
  line-height:inherit !important
}
.KTable-margin-top{
  margin-top:20px;
}
.button1{
  margin-top:20px;
}
.el-form-item {
    margin: 15px 20px 2px 0px;
}
.button{
  margin-top:20px;
}
.table-margin{
  margin-top:20px;
}
 .tbutton{
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.el-form-item--mini.el-form-item {
  margin: 6px;
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
.el-dialog__header {
  padding: 10px 10px 0;
}
.el-dialog__body {
  padding: 10px 10px;
}
.el-button--mini {
  padding: 7px 9px;
}
.sbutton {
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
</style>

