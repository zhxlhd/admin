<template>
  <div>
      <div class="tbutton">
      <el-button plain class="el-icon-document" :disabled="buttonDisabled" @click="handleSubmit">提 交</el-button>
      <el-button plain class="el-icon-close" @click="backward" v-if="!mate.inline">取 消</el-button>
      <el-button plain class="el-icon-date"  @click="resetForm('ruleForm')">重 置</el-button>
    </div>
      <el-row>
        <el-form size="mini" :model="mate.values" :inline="mate.inline" :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="labelWidth">
          <template>
            
              <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['officeId'].label" :prop="object['officeId'].name">
                  <el-select clearable filterable  v-model="mate.values[object['officeId'].name]" style="width: 100%">
                      <el-option :label="item.label" :value="item.value" v-for="item of officeIdOptions" :key="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['customerId'].label" :prop="object['customerId'].name">
                  <el-select clearable filterable  @change="changeCode(mate.values[object['customerId'].name])" v-model="mate.values[object['customerId'].name]" style="width: 100%">
                      <el-option :label="item.label" :value="item.value" v-for="item of customerOptions" :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            

            <el-col :sm="12" :md="8" :lg="8">
              <el-form-item :label="object['customerName'].label" :prop="object['customerName'].name">
                <el-input :readonly="true" v-model="mate.values[object['customerName'].name]"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="8">
              <el-form-item :label="object['cusItemCode'].label" :prop="object['cusItemCode'].name">
                <el-input v-model="mate.values[object['cusItemCode'].name]"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="8">
              <el-form-item :label="object['cusItemName'].label" :prop="object['cusItemName'].name">
                <el-input v-model="mate.values[object['cusItemName'].name]"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="8">
              <el-form-item :label="object['cusItemExplain'].label" :prop="object['cusItemExplain'].name">
                <el-input v-model="mate.values[object['cusItemExplain'].name]"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="8">
              <el-form-item :label="object['selfItemCode'].label" :prop="object['selfItemCode'].name">
                <el-select clearable filterable  @change="changeItem(mate.values[object['selfItemCode'].name])" v-model="mate.values[object['selfItemCode'].name]" style="width: 100%">
                  <el-option :label="item.label" :value="item.value" v-for="item of selfItemCodeOptions" :key="item.value">
                    <span style="float: left;margin-right:30px">{{ item.label }}</span>
                    <span style="float: right; color:#212121; font-size: 13px">{{ item.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['selfItemName'].label" :prop="object['selfItemName'].name" >
                  <el-input :readonly="true" v-model="mate.values[object['selfItemName'].name]"></el-input>
                </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="8">
              <el-form-item :label="object['selfItemExplain'].label" :prop="object['selfItemExplain'].name">
                <el-input :readonly="true" v-model="mate.values[object['selfItemExplain'].name]"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['dateFrom'].label" :prop="object['dateFrom'].name">
              <el-date-picker clearable :readonly="true" type="date" v-model="mate.values[object['dateFrom'].name]" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['dateTo'].label" :prop="object['dateTo'].name">
              <el-date-picker clearable type="date" v-model="mate.values[object['dateTo'].name]" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
            
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['salesmanId'].label" :prop="object['salesmanId'].name">
              <el-select clearable filterable v-model="mate.values[object['salesmanId'].name]" style="width: 100%">
                <el-option :label="item.label" :value="item.value" v-for="item of object['salesmanId'].options" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
            
          </template>
        </el-form>
      </el-row>
  </div>
</template>

<script>
import { DateFormat, trimSpace } from '../../utils/util.js'
export default{
  data () {
    var validateRequired = (rule, value, callback) => {
      if (value === undefined || trimSpace(value) === '') {
        callback(new Error('该输入项为必输项'))
      } else {
        callback()
      }
    }
    return {
      buttonDisabled: false,
      object: {},
      lineform: {},
      customerOptions: [],
      selfItemCodeOptions: [],
      officeIdOptions: [],
      customerCode: '',
      rules: {
        customerId: [
          { required: true, message: '该输入项为必输项' },
          { validator: validateRequired, trigger: 'change' },
          { validator: validateRequired, trigger: 'blur' }
        ],
        selfItemCode: [
          { required: true, message: '该输入项为必输项' },
          { validator: validateRequired, trigger: 'change' },
          { validator: validateRequired, trigger: 'blur' }
        ]
      },
      labelPosition: 'right'
    }
  },
  props: {
    mate: Object
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
        width = '130px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  created () {
    this.mate.fields.map((i) => { this.object[i.name] = i })
    this.getCustomerCode()
    this.getUser()
    this.getSelfItemCode()
    this.getOfficeId()
  },
  methods: {
   // 业务员
    getUser () {
      var vm = this
      this.object['salesmanId'].options = []
      this.$root.ajaxData('/users/getUserDropdownList', {}, function (data) {
        data.map((item) => {
          vm.object['salesmanId'].options.push({ 'label': item.firstname+item.lastname, 'value': item.id })
        })
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
    },
    // 获取客户编码
    getCustomerCode () {
      var vm = this
      vm.customerOptions = []
      this.$root.ajaxData('/companys/companyInfo/4?dataOnly=true&nopaing=true', {}, function (data) {
        for (let i = 0; i < data.length; i++) {
          vm.customerOptions.push({ label: data[i].code + '  (' + data[i].name + ')', value: data[i].id, name: data[i].name })
        }
      }, 'GET')
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 修改客户编码
    changeCode (value) {
      try {
        var obj = this.customerOptions.find((item) => {
          return item.value === value
        })
        this.customerCode = obj.label
        this.mate.values.customerName = obj.name
      } catch (e) {
      }
    },

    // 获取系统物料编码
    getSelfItemCode () {
      var vm = this
      vm.selfItemCodeOptions = []
      this.$root.ajaxData('/materials/getMaterialDropdownList', {}, function (data) {
        for (let i = 0; i < data.length; i++) {
          vm.selfItemCodeOptions.push({ label: data[i].subcode, value: data[i].id, name: data[i].name, specification: data[i].specification })
        }
      }, 'GET')
    },

    // 修改系统物料编码
    changeItem (value) {
      try {
        var obj = this.selfItemCodeOptions.find((item) => {
          return item.value === value
        })
        this.mate.values.selfItemId = obj.value
        this.mate.values.selfItemCode = obj.label
        this.mate.values.selfItemExplain = obj.specification
        this.mate.values.selfItemName = obj.name
      } catch (e) {
      }
    },

    // 提交
    handleSubmit (ev) {
      this.buttonDisabled = true
      var vm = this
      this.mate.values.dateTo = DateFormat(this.mate.values.dateTo, 'yyyy-MM-dd')
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let url = vm.mate.url
          vm.mate.values.industryCategory = this.industryCategoryValue
          const values = vm.mate.values
          if (vm.mate.inline) {
            vm.mate.values = vm.defaultValues
          } else {
            if ((vm.mate.method) === 'PUT' && values.id) {
              url = '/purchase/smItemCross/batchUpdate' + '/'
            }
            const act = { url: url, ajax: true, method: vm.mate.method }
            act.next = this.mate.next || false
            this.$root.action(act, values, function (data) {
              if (data && data.next) {
                act.next = data.next
              }
            })
          }
        } else {
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          this.buttonDisabled = false
          return false
        }
      })
    },
    // 取消
    backward () {
      this.$root.monitor({ url: this.mate.next })
    }
  }
}
</script>

<style scoped lang="scss">
.el-form-item__label{
  line-height:inherit
}
.tbutton{
  margin: 5px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.el-form--inline.el-form--label-top .el-form-item__content{
  width:90%
}
.el-input__suffix {
  right:80px
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-input--mini .el-input__inner{
  width:80%
}
.el-button--mini {
  padding: 7px 9px;
}
</style>
