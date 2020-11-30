<template>
  <div>
    <el-row>
      <el-form :model="mateValues"  :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="labelWidth" size="mini">
        <template>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['officeId'].label" :prop="object['officeId'].name">
              <el-select :disabled="state" clearable filterable @change="changeOffice" v-model="mateValues['officeId']" @visible-change="visibleChangeOffice">
                <el-option :label="item.label" :value="item.value" v-for="item of officeIdOptions" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['companyId'].label" :prop="object['companyId'].name">
              <el-select :disabled="state" clearable @change="changeCompany" filterable v-model="mateValues['companyId']">
                <el-option :label="item.label" :value="item.value" v-for="item of companyIdOptions" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['address'].label" :prop="object['address'].name">
              <el-select :disabled="state" clearable @change="changeAddress" filterable v-model="mateValues['address']">
                <el-option :label="item.label" :value="item.value" v-for="item of object['address'].options" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['currency'].label" :prop="object['currency'].name" >
              <dict-selected :rowId="rowId" v-model="mateValues['currency']" dictType="currencyType" :initValue="mateValues['currency']"></dict-selected>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  :label="object['paymentCondition'].label" :prop="object['paymentCondition'].name">
              <dict-selected  :rowId="rowId" v-model="mateValues['paymentCondition']" :initValue="mateValues['paymentCondition']" dictType="paymentMethod"></dict-selected>
            </el-form-item>
          </el-col>

          <!--库存组织-->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['orgId'].label" :prop="object['orgId'].name">
              <el-select :disabled="state" clearable @change="changeOrgId" filterable v-model="mateValues['orgId']">
                <el-option :label="item.label" :value="item.value" v-for="item of orgIdOptions" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['buyer'].label" :prop="object['buyer'].name">
              <el-select :disabled="state" clearable filterable v-model="mateValues['buyer']">
                <el-option :label="item.label" :value="item.value" v-for="item of buyerOptions" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['tax'].label" :prop="object['tax'].name" >
              <dict-selected :rowId="rowId" v-model="mateValues['tax']" dictType="tax" :initValue="mateValues['tax']"></dict-selected>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['contact'].label" :prop="object['contact'].name">
              <el-select :disabled="state" clearable filterable  v-model="mateValues['contact']">
                <el-option :label="item.label" :value="item.value" v-for="item of contactOptions" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['explain'].label" :prop="object['explain'].name">
              <el-input :disabled="state" v-model="mateValues['explain']"></el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
  </div>
</template>


<script>
import treeSelect from '../../components/tree-select/tree.vue'
export default {
  components: {
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    },
    treeSelect
  },
  data () {
    return {
      object: {},                 // 用来代替从父组件总获取到的数据 mate.filed
      companyData: [],
      addressData: [],
      priceData: [],
      officeIdOptions: [],
      companyIdOptions: [],
      contactOptions: [],
      buyerOptions: [],
      orgIdOptions: [],
      labelPosition: 'right',
      mateValues: {},
      state: false,           // 如果状态是变更中,则头不能修改
      rowId: '',
      rules: {
        officeId: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
        ],
        companyId: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
        ],
        address: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
        ],
        paymentCondition: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
        ],
        orgId: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
        ],
        buyer: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
        ],
        contact: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
        ],
        currency: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
        ],
        tax: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
        ]
      }
    }
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
  props: {
    mate: Object
  },
  created () {
    this.mate.fields.map((i) => { this.object[i.name] = i })
    if (this.mate.values.state === '5') {
      this.state = true
      this.rowId = '5'
    }
    this.mateValues = this.mate.values
    this.getContact()
    this.getCompanyId()
    this.getOfficeId()
    this.getAuditor()
      // 如果库存机构有值，则需要获取库存组织的值
    // if (this.mateValues['officeId']) {
    //   this.changeOffice(this.mateValues['officeId'])
    // }
  },
  methods: {
    // 审核人、采购人都是一样的
    getAuditor () {
      const vm = this
      vm.object['auditor'].options = []
      vm.buyerOptions = []
      this.$root.ajaxData('/users/getUserDropdownList', {}, function (data) {
        data.forEach(i => {
          vm.object['auditor'].options.push({ 'label': (i.firstname+i.lastname), 'value': i.id })
          vm.buyerOptions.push({ 'label': (i.firstname+i.lastname), 'value': i.id })
        })
      }, 'GET')
    },
      // 头的库存组织改变时，明细行中的库存组织也要显示
    changeOrgId (val) {
      this.$emit('getOrgId', val)
    },
      // 机构改变时
    changeOffice (val) {
      const vm = this
        // 将数据传给父组件、父组件中的明细行中有库存组织
      this.$emit('getOffice', val)
        // 在改变了之后要清空
      vm.orgIdOptions = []
      this.$root.ajaxData(`/org/inventory/getOrgByOfficeId?ids=${val}`, {}, function (data) {
        if(data.length){
          data.forEach((item) => {
            vm.orgIdOptions.push({ 'label': item.name, 'value': item.id })
          })
        }
        // if (data.mate.rows !== []) {
        //   data.mate.rows.forEach(i => {
        //     vm.orgIdOptions.push({ 'label': i.name, 'value': i.id })
        //     // 机构改变，获取库存组织，如库存组织只有一个，需要将这一个放进库存组织中的input框
        //   })
        // }
      });
    },
      // 获取到机构
    getOfficeId () {
      const vm = this
      vm.officeIdOptions = []
      this.$root.ajaxData('/users/office', {}, function (data) {
        data.forEach(i => {
          vm.officeIdOptions.push({ 'label': i.orgName, 'value': i.officeId })
            // 只有一个机构，就将机构放进去
          if (!vm.mate.values.id) {
            if (vm.officeIdOptions.length === 1) {
              vm.mateValues['officeId'] = vm.officeIdOptions[0].value
              vm.changeOffice(vm.mateValues['officeId'])
            }
          }
        })
      }, 'GET')
    },
    // 获取到机构
    getOrgId () {
      const vm = this
      vm.officeIdOptions = []
      this.$root.ajaxData('/users/office', {}, function (data) {
        data.forEach(i => {
          vm.officeIdOptions.push({ 'label': i.orgName, 'value': i.officeId })
          // 只有一个机构，就将机构放进去
          if (!vm.mate.values.id) {
            if (vm.officeIdOptions.length === 1) {
              vm.mateValues['officeId'] = vm.officeIdOptions[0].value
              vm.changeOffice(vm.mateValues['officeId'])
            }
          }
        })
      }, 'GET')
    },
    visibleChangeOffice (flag) {
      var vm = this
      if (!flag) {
        vm.mateValues['orgId'] = ''
      }
    },
    getContact () {
      var vm = this
      this.contactOptions = []
      this.$root.ajaxData('/users/getUserDropdownList', {}, function (data) {
        data.forEach((i) => {
          vm.contactOptions.push({ 'label': (i.firstname+i.lastname), 'value': i.id })
        })
      }, 'GET')
    },
    getCompanyId () {
      var vm = this
      this.companyIdOptions = []
      this.$root.ajaxData('/companys/companyInfo/3?auditStatus=1&nopaging=1&status=1&dataOnly=true', {}, function (data) {
        data.forEach((i) => {
          vm.companyData = data
          vm.companyIdOptions.push({ 'label': i.name, 'value': i.id })
        })
      }, 'GET')
    },
    changeCompany (val) {
      var vm = this
      vm.object['address'].options = []
      for (let i = 0; i < this.companyData.length; i++) {
        if (val === this.companyData[i].id) {
          if (this.companyData[i].addressList.length === 0) {
            vm.$message({
              message: '请维护供应商信息',
              type: 'warning'
            })
          } else {
            this.addressData = this.companyData[i].addressList
            this.priceData = this.companyData[i].financeList
            for (let j = 0; j < this.companyData[i].addressList.length; j++) {
              vm.object['address'].options.push({ 'label': this.companyData[i].addressList[j].name, 'value': this.companyData[i].addressList[j].name })
            }
          }
        } else {
          this.mateValues.address = ''
        }
      }
    },
    changeAddress (val) {
      for (let i = 0; i < this.addressData.length; i++) {
        if (val === this.addressData[i].name) {
          this.addressId = this.addressData[i].id
            // 选择了地点之后，需要将地点中的币种和付款条件放进去
          this.$set(this.mateValues, 'currency', this.addressData[i].currency)
          this.$set(this.mateValues, 'paymentCondition', this.addressData[i].payment)
        }
      }
      for (let i = 0; i < this.priceData.length; i++) {
        if (this.addressId === this.priceData[i].id) {
          this.$set(this.mateValues, 'tax', this.priceData[i].taxRate)
        }
      }
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
</style>
