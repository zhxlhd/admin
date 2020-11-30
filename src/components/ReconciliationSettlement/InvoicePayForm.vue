<template>
  <div>
    <el-row>
      <el-form size="mini" :model="mate.values" :inline="mate.inline" ref="ruleForm" :rules="rules" :label-position="labelPosition" :label-width="labelWidth">
        <template>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['invoiceNum'].label" :prop="object['invoiceNum'].name">
              <el-input v-model="mate.values['invoiceNum']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['invoiceDate'].label" :prop="object['invoiceDate'].name">
              <el-date-picker clearable type="date" v-model="mate.values['invoiceDate']"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['officeId'].label" :prop="object['officeId'].name">
               <el-select clearable filterable   v-model="mate.values[object['officeId'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of officeIdOptions" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['invoiceType'].label" :prop="object['invoiceType'].name">
              <dict-selected v-model="mate.values['invoiceType']" dictType="invoiceType" :initValue="mate.values['invoiceType']"></dict-selected>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['companyCode'].label" :prop="object['companyCode'].name">
               <el-select clearable filterable  @change="changeCompanyCode(mate.values[object['companyCode'].name])" v-model="mate.values[object['companyCode'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of companyCodeOptions" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['companyName'].label" :prop="object['companyName'].name">
              <el-input :readonly="true" v-model="mate.values['companyName']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['currency'].label" :prop="object['currency'].name">
              <dict-selected @input="inputCurrency" v-model="mate.values['currency']" dictType="currency" :initValue="mate.values['currency']"></dict-selected>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['invoiceAmount'].label" :prop="object['invoiceAmount'].name">
              <el-input :readonly="true" v-model="mate.values['invoiceAmount']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['remark'].label" :prop="object['remark'].name">
              <el-input v-model="mate.values['remark']"></el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
  </div>
</template>

<script>
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
import Vue from 'vue'
export default{
  components: {
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    }
  },
  data () {
    return {
      object: {},
      companyCodeOptions: [],
      officeIdOptions: [],
      rules: {
        companyCode: [
          { required: true, message: '该选项为必输项', trigger: 'blur' }
        ],
        currency: [
          { required: true, message: '该选项为必输项', trigger: 'blur' }
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
    this.getCompanyCode()
    this.getOfficeId()
  },
  methods: {
        // 获取到机构
    getOfficeId () {
      const vm = this
      this.$root.ajaxData('/users/office', {}, function (data) {
        data.forEach(i => {
          vm.officeIdOptions.push({ 'label': i.orgName, 'value': i.officeId })
            // 只有一个机构，就将机构放进去
          if (!vm.mate.values.id) {
            if (vm.officeIdOptions.length === 1) {
              vm.mate.values.officeId = vm.officeIdOptions[0].value
            }
          }
        })
      }, 'GET')
    },
    inputCurrency (val) {
      this.$emit('changeCurrency', val)
    },
    // 获取供应商编号
    getCompanyCode () {
      var vm = this
      vm.companyCodeoptions = []
      this.$root.ajaxData('/companys/companyInfo/3?status=1&auditStatus=1&nopaging=1&dataOnly=true', {}, function (data) {
        for (let i = 0; i < data.length; i++) {
          vm.companyCodeOptions.push({ label: data[i].code + '  (' + data[i].name + ')', value: data[i].code, name: data[i].name })
        }
      }, 'GET')
    },
    // 修改供应商编号
    changeCompanyCode (value) {
      const vm = this
      this.companyCodeOptions.find((item) => {
        if (item.value === value) {
          Vue.set(vm.mate.values, 'companyName', item.name)
        }
      })
    }
  }
}
</script>

<style scoped>
.el-form--inline>* {
  margin-right:10px
}
 .el-form-item__label{
  line-height:inherit
}
.el-form-item{
  margin: 15px 20px 2px 0px;
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
</style>