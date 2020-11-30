<template>
  <div>
    <el-row>
      <el-form :model="mate.values" :inline="mate.inline" ref="ruleForm" :rules="rules" :label-position="labelPosition" :label-width="labelWidth">
        <template>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['sheetNumber'].label" :prop="object['sheetNumber'].name">
            <el-input  disabled v-model="mate.values[object['sheetNumber'].name]"></el-input>
          </el-form-item>
        </el-col>

         <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['officeId'].label" :prop="object['officeId'].name">
            <el-select clearable v-model="mate.values[object['officeId'].name]" :placeholder="object['officeId'].placeholder">
              <el-option :label="item.label" :value="item.value" v-for="item of officeIdOptions" :key="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['type'].label" :prop="object['type'].name">
            <el-select clearable v-model="mate.values[object['type'].name]" :placeholder="object['type'].placeholder">
              <el-option :label="item.label" :value="item.value" v-for="item of object['type'].options" :key="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['answerMode'].label" :prop="object['answerMode'].name">
             <dict-selected v-model="mate.values[object['answerMode'].name]" dictType="answerMode" :initValue="mate.values[object['answerMode'].name]"></dict-selected>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['acceptGoodsSide'].label" :prop="object['acceptGoodsSide'].name">
             <tree-select
                        :removeUrl="object['acceptGoodsSide'].removeUrl"
                        :treeProps="object['acceptGoodsSide'].treeProps"
                        v-model="mate.values['acceptGoodsSide']"
                        :multiple="false"
                        :placeholder="object['acceptGoodsSide'].placeholder"
                      >
                      </tree-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['expire'].label" :prop="object['expire'].name">
            <el-date-picker clearable type="date" v-model="mate.values[object['expire'].name]" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['acceptBillSide'].label" :prop="object['acceptBillSide'].name">
            <tree-select
                        :removeUrl="object['acceptBillSide'].removeUrl"
                        :treeProps="object['acceptBillSide'].treeProps"
                        v-model="mate.values['acceptBillSide']"
                        :multiple="false"
                        :placeholder="object['acceptBillSide'].placeholder"
                      >
                      </tree-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['buyer'].label" :prop="object['buyer'].name">
           <el-select clearable v-model="mate.values[object['buyer'].name]" :placeholder="object['buyer'].placeholder">
              <el-option :label="item.label" :value="item.value" v-for="item of buyerOptions" :key="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['currency'].label" :prop="object['currency'].name">
            <dict-selected v-model="mate.values[object['currency'].name]" dictType="currencyType" :initValue="mate.values[object['currency'].name]"></dict-selected>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['paymentMethod'].label" :prop="object['paymentMethod'].name">
             <dict-selected v-model="mate.values[object['paymentMethod'].name]" dictType="paymentMode" :initValue="mate.values[object['paymentMethod'].name]"></dict-selected>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['explain'].label" :prop="object['explain'].name">
            <el-input v-model="mate.values[object['explain'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['requiredApproval'].label" :prop="object['requiredApproval'].name">
            <dict-selected v-model="mate.values[object['requiredApproval'].name]" dictType="requiredApproval" :initValue="mate.values[object['requiredApproval'].name]"></dict-selected>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['dateFrom'].label" :prop="object['dateFrom'].name">
            <el-date-picker clearable type="date" v-model="mate.values[object['dateFrom'].name]"  placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['dateTo'].label" :prop="object['dateTo'].name">
            <el-date-picker clearable type="date" v-model="mate.values[object['dateTo'].name]"  placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>

        </template>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import treeSelect from '../../components/tree-select/tree.vue'
function trimSpace (str) {
  try {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
  } catch (e) {
    return str
  }
}

function isPositiveinteger (val) {
  if (val === 0) {
    return true
  } else {
    var reg = new RegExp('^[1-9]*[1-9][0-9]*$')
    return reg.test(val)
  }
}

export default{
  components: {
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    },
    treeSelect
  },
  data () {
    var validateRequired = (rule, value, callback) => {
      if (value === undefined || trimSpace(value) === '') {
        callback(new Error('该输入项为必输项'))
      } else {
        callback()
      }
    }

    var validatePositiveinteger = (rule, value, callback) => {
      if (value === undefined || trimSpace(value) === '') {
        callback(new Error('该输入项为必输项'))
      } else {
        if (!isPositiveinteger(trimSpace(value))) {
          callback(new Error('请输入正整数'))
        } else {
          callback()
        }
      }
    }

    var validatePositiveintegerCM = (rule, value, callback) => {
      if (value === undefined || trimSpace(value) === '') {
        callback()
      } else {
        if (!isPositiveinteger(trimSpace(value))) {
          callback(new Error('请输入正整数'))
        } else {
          callback()
        }
      }
    }

    return {
      object: {},
      companyOptions: [],
      buyerOptions: [],
      officeIdOptions: [],
      rules: {
        type: [
          { required: true, message: '该输入项为必输项' },
          { validator: validateRequired, trigger: 'change' }
        ],
        currency: [
          { required: true, message: '该输入项为必输项' }
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
    mate: Object,
    labelPosition: {
      type: String
    }
  },
  created () {
    this.mate.fields.map((i) => { this.object[i.name] = i })

    // this.companyOptions.push({ value: this.mate.values.companyId, label: this.mate.values.companyName })

    var options = [{ value: 1, label: '是' }, { value: 0, label: '否' }]
    this.object['requiredApproval'].options = options
    this.getUser()// 获取申请人、编制人
    this.getOfficeId()
  },
  methods: {
    /* visibleCompanyId (flag) {
      var vm = this
      vm.companyOptions = []
      if (flag) {
        this.$root.ajaxData('/companys/getCompanyDropdownList/3', {}, function (data) {
          for (let i = 0; i < data.length; i++) {
            vm.companyOptions.push({ 'label': data[i].name, 'value': data[i].id })
          }
        }, 'GET')
      }
    }*/
    getUser () {
      var vm = this
      this.$root.ajaxData('/purchase/reqPurchase/getUsers', {}, function (data) {
        for (let i = 0; i < data.length; i++) {
          vm.buyerOptions.push({ label: data[i].username, value: data[i].id, key: data[i].id })
        }
      }, 'GET')
    },
    getOfficeId () {
      const vm = this
      this.$root.ajaxData('/users/office', {}, function (data) {
        data.forEach(i => {
          vm.officeIdOptions.push({ 'label': i.orgName, 'value': i.officeId })
            // 只有一个机构，就将机构放进去
          if (vm.officeIdOptions.length === 1) {
            vm.mate.values.officeId = vm.officeIdOptions[0].value
          }
        })
      }, 'GET')
    }
  }
}
</script>

<style scoped>
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
  margin:0;
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
</style>