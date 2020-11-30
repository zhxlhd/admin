<template>
  <div>
    <el-row>
      <el-form size="mini" :model="mate.values" :inline="mate.inline" :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="labelWidth">
        <template>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['orgId'].label" :prop="object['orgId'].name">
            <el-select clearable v-model="mate.values[object['orgId'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of orgOption" :key="item.name"></el-option>
              </el-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['packageDate'].label" :prop="object['packageDate'].name">
            <el-date-picker clearable type="date" v-model="mate.values[object['packageDate'].name]" :editable="false"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['grossWeightKg'].label" :prop="object['grossWeightKg'].name">
            <el-input v-model="mate.values[object['grossWeightKg'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['netWeightKg'].label" :prop="object['netWeightKg'].name">
            <el-input v-model="mate.values[object['netWeightKg'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['longCm'].label" :prop="object['longCm'].name">
            <el-input v-model="mate.values[object['longCm'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['wideCm'].label" :prop="object['wideCm'].name">
            <el-input v-model="mate.values[object['wideCm'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['highCm'].label" :prop="object['highCm'].name">
            <el-input v-model="mate.values[object['highCm'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['productName'].label" :prop="object['productName'].name">
            <el-input v-model="mate.values[object['productName'].name]"></el-input>
          </el-form-item>
        </el-col>

        </template>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'
import treeSelect from '../../components/tree-select/tree.vue'
function trimSpace (str) {
  try {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
  } catch (e) {
    return str
  }
}

function isPositivenumber (val) {
  var reg = new RegExp('^(([1-9]+[0-9]*.{1}[0-9]+)|([0].{1}[1-9]+[0-9]*)|([1-9][0-9]*)|([0][.][0-9]+[1-9]*))$')
  return reg.test(val)
}

export default{
  data () {
    var validateRequired = (rule, value, callback) => {
      if (value == undefined || trimSpace(value) == '') {
        callback(new Error('该输入项为必输项'))
      } else {
        callback()
      }
    }

    var validatePositivenumber = (rule, value, callback) => {
      if (value == undefined || trimSpace(value) == '') {
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
      object: {},
      labelPosition: 'right',
      orgOption: [],
      rules: {
        orgId: [
          { required: true, message: '该输入项为必输项' },
          { validator: validateRequired, trigger: 'change' }
        ],
        packageDate: [
          { required: true, message: '该输入项为必输项' },
          { validator: validateRequired, trigger: 'change' }
        ],
        grossWeightKg: [
          { required: true, message: '该输入项为必输项' },
          { validator: validatePositivenumber, trigger: 'change' },
          { validator: validatePositivenumber, trigger: 'blur' }
        ],
        netWeightKg: [
          { required: true, message: '该输入项为必输项' },
          { validator: validatePositivenumber, trigger: 'change' },
          { validator: validatePositivenumber, trigger: 'blur' }
        ],
        productName: [
          { required: true, message: '该输入项为必输项' },
          { validator: validateRequired, trigger: 'change' }
        ]
      }
    }
  },
  components: {
    'tree-selected': function index (resolve) {
      require(['../../components/TreeSelected.vue'], resolve)
    },
    treeSelect
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
        width = '100px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  created () {
    this.mate.fields.map((i) => { this.object[i.name] = i })
    var vm = this
    this.$root.ajaxData('/org/inventory/getOrgByOfficeId?ids=', {}, function (data) {
      data.map((i) => {
        vm.orgOption.push({ 'label': i.name, 'value': i.id })
        if (vm.orgOption.length !== 0) {
          Vue.set(vm.mate.values, 'orgId', vm.orgOption[0].value)
        }
      })
    })
  },
  methods: {

  }
}
</script>

<style scoped>
  .el-form-item__label{
  line-height:inherit
}
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
.el-input__suffix {
  right:80px
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-input--mini .el-input__inner{
  width:80%
}
</style>
