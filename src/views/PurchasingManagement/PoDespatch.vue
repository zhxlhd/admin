<template>
  <div>
    <el-row>
      <el-form :model="mate.values" :inline="mate.inline" label-position="right" ref="ruleForm" :rules="rules">
        <template>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="object['despatchNumber'].label" :prop="object['despatchNumber'].name">
            <el-input v-model="mate.values[object['despatchNumber'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="object['orgId'].label" :prop="object['orgId'].name">
            <tree-select
            :removeUrl="object['orgId'].removeUrl"
            :treeProps="object['orgId'].treeProps"
            v-model="mate.values['orgId']"
            :multiple="false"
            :placeholder="object['orgId'].placeholder"
          ></tree-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="object['acceptBillSide'].label" :prop="object['acceptBillSide'].name">
            <el-input v-model="mate.values[object['acceptBillSide'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="object['unit'].label" :prop="object['unit'].name">
            <el-input v-model="mate.values[object['unit'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="object['qty'].label" :prop="object['qty'].name">
            <el-input v-model="mate.values[object['qty'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="object['promiseDate'].label" :prop="object['promiseDate'].name">
            <el-date-picker clearable type="date" v-model="mate.values[object['promiseDate'].name]" :editable="false"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="object['requiredDate'].label" :prop="object['requiredDate'].name">
            <el-date-picker clearable type="date" v-model="mate.values[object['requiredDate'].name]" :editable="false"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="object['moneyAmount'].label" :prop="object['moneyAmount'].name">
            <el-input v-model="mate.values[object['moneyAmount'].name]"></el-input>
          </el-form-item>
        </el-col>

         <el-col :sm="12" :md="8" :lg="6">
           <el-form-item :label="object['invoiceMatchItem'].label" :prop="object['invoiceMatchItem'].name">
             <el-input v-model="mate.values[object['invoiceMatchItem'].name]"></el-input>
           </el-form-item>
         </el-col>

         <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="object['state'].label" :prop="object['state'].name">
              <el-select clearable v-model="mate.values[object['state'].name]" :placeholder="object['state'].placeholder">
                <el-option :label="item.label" :value="item.value" v-for="item of object['state'].options" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
         </el-col>

        </template>
      </el-form>
    </el-row>

    <div class="sbutton">
      <el-button type="primary" @click="handleSubmit">提 交</el-button>
      <el-button @click="backward" v-if="!mate.inline">取 消</el-button>
    </div>
  </div>
</template>

<script>
import treeSelect from '../../components/tree-select/tree.vue'
import { DateFormat, trimSpace, isPositiveinteger, isPositivenumber } from '../../utils/util.js'
export default{
  data () {
    var validateRequired = (rule, value, callback) => {
      if (value === undefined || value === null || trimSpace(value) === '') {
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

    var validatePositivenumber = (rule, value, callback) => {
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
      form: {},
      object: {},
      rules: {
        despatchNumber: [
            { required: true, message: '该输入项为必输项' },
            { validator: validateRequired, trigger: 'change' }
        ],
        orgId: [
            { required: true, message: '该输入项为必输项' },
            { validator: validateRequired, trigger: 'change' }
        ],
        acceptBillSide: [
            { required: true, message: '该输入项为必输项' },
            { validator: validateRequired, trigger: 'change' }
        ],
        unit: [
            { required: true, message: '该输入项为必输项' },
            { validator: validateRequired, trigger: 'change' }
        ],
        qty: [
            { required: true, message: '该输入项为必输项' },
            { validator: validatePositiveinteger, trigger: 'change' },
            { validator: validatePositiveinteger, trigger: 'blur' }
        ],
        moneyAmount: [
            { required: true, message: '该输入项为必输项' },
            { validator: validatePositivenumber, trigger: 'change' },
            { validator: validatePositivenumber, trigger: 'blur' }
        ],
        state: [
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
  created () {
    this.mate.fields.map((i) => { this.object[i.name] = i })
    this.form = this.mate
  },
  methods: {
    handleSubmit () {
      var mate = {}
      var vm = this

      var ruleRes = ''
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          ruleRes = 'no'
        }
      })
      if (ruleRes === 'no') {
        vm.$message({
          message: this.$t('Data Check No Pass'),
          type: 'warning'
        })
        return
      }
      this.form.values.promiseDate = DateFormat(this.form.values.promiseDate, 'yyyy-MM-dd')
      this.form.values.requiredDate = DateFormat(this.form.values.requiredDate, 'yyyy-MM-dd')

      mate = this.form.values

      if (this.mate.method === 'POST') {
        this.$root.ajaxData('/purchase/po/despatch/batchSave', mate, function () {
          vm.$root.monitor({ url: '/purchase/po/despatch/all/list' })
        }, 'POST')
      } else {
        this.$root.ajaxData('/purchase/po/despatch/batchUpdate' + '/' + mate.id, mate, function () {
          vm.$root.monitor({ url: '/purchase/po/despatch/all/list' })
        }, 'PUT')
      }
    },
    backward () {
      this.$root.monitor({ url: '/purchase/po/despatch/all/list' })
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
.sbutton{
  margin-top:50px;
}
</style>
