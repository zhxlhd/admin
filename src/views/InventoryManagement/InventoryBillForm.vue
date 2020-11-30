<template>
  <div>
    <el-row>
      <el-form class="invyBillForm" size="mini" :model="mate.values" :inline="mate.inline" :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="labelWidth">
        <template>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['orgId'].label" :prop="object['orgId'].name">
            <el-select   clearable   filterable v-model="mate.values[object['orgId'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of orgOptions" :key="item.name"></el-option>
              </el-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['inventoryName'].label" :prop="object['inventoryName'].name">
            <el-input v-model="mate.values[object['inventoryName'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['inventoryDate'].label" :prop="object['inventoryDate'].name">
            <el-date-picker clearable type="date" v-model="mate.values[object['inventoryDate'].name]" :editable="false"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['inventoryRemark'].label" :prop="object['inventoryRemark'].name">
            <el-input v-model="mate.values[object['inventoryRemark'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['inventoryType'].label" :prop="object['inventoryType'].name">
            <el-select clearable v-model="mate.values[object['inventoryType'].name]" @change="resetDate">
              <el-option :label="item.label" :key="item.name" :value="item.value" v-for="item of object['inventoryType'].options"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['touchStartDate'].label" :prop="object['touchStartDate'].name">
            <el-date-picker clearable type="date" v-model="mate.values[object['touchStartDate'].name]" :editable="false" :disabled="isTouch"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['touchEndDate'].label" :prop="object['touchEndDate'].name">
            <el-date-picker clearable type="date" v-model="mate.values[object['touchEndDate'].name]" :editable="false" :disabled="isTouch"></el-date-picker>
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
      object: {},
      input: '',
      orgOptions: [],
      isTouch: false,
      rules: {
        orgId: [
            { required: true, message: '该输入项为必输项' },
            { validator: validateRequired, trigger: 'change' }
        ],
        inventoryName: [
            { required: true, message: '该输入项为必输项' },
            { validator: validateRequired, trigger: 'change' }
        ]
      },
      labelPosition: 'right'
    }
  },
  components: {
    'tree-selected': function index (resolve) {
      require(['../../components/TreeSelected.vue'], resolve)
    },
    treeSelect
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

    var options = [{ value: 1, label: '全盘盘点' }, { value: 2, label: '动碰盘点' }]
    this.object['inventoryType'].options = options

    if (this.mate.values.id == null) {
      this.mate.values['inventoryType'] = 2
      this.mate.values['inventoryDate'] = new Date()
      this.mate.values['touchStartDate'] = new Date()
      this.mate.values['touchEndDate'] = new Date()
    }

    if (this.mate.values.inventoryType === 1) {
      this.mate.values['touchStartDate'] = ''
      this.mate.values['touchEndDate'] = ''
      this.isTouch = true
    }
    this.getOrg()
  },
  methods: {
    getOrg () {
      var vm = this
      this.orgOptions = []
      this.$root.ajaxData('/org/inventory/getOrgByOfficeId?ids=', {}, function (data) {
        data.map((item) => {
          vm.orgOptions.push({ 'label': item.name, 'value': item.id })
        })
      }, 'GET')
    },
    resetDate (val) {
      if (val === 1) {
        this.mate.values['touchStartDate'] = ''
        this.mate.values['touchEndDate'] = ''
        this.isTouch = true
      } else {
        this.isTouch = false
      }
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
.el-input__suffix {
  right:80px
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-input--mini .el-input__inner{
  width:80%
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
.invyBillForm .el-icon-caret-bottom {
   top:50%;height:50%;
}
</style>
