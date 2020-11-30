<template>
  <div>
    <div class="tbutton">
        <el-button plain class="el-icon-document"  @click="handleSubmit">提 交</el-button>
        <el-button plain class="el-icon-close" @click="backward">取 消</el-button>
        <el-button plain class="el-icon-date"  @click="resetForm('ruleForm')">重 置</el-button>
    </div>
    <el-row>
      <el-form size="mini" :model="mate.values" :inline="mate.inline" :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="labelWidth">
          <template>
            <el-row>
             <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['name'].label" :prop="object['name'].name">
                  <el-input  v-model="mate.values[object['name'].name]"></el-input>
                </el-form-item>
             </el-col>

             <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['sequenceName'].label" :prop="object['sequenceName'].name" :rules="sequenceNameRule">
                  <el-input   :disabled="show" v-model="mate.values[object['sequenceName'].name]"></el-input>
                </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['remark'].label" :prop="object['remark'].name">
                  <el-input  v-model="mate.values[object['remark'].name]"></el-input>
                </el-form-item>
            </el-col>
            </el-row>
            <el-row>
            <el-col :sm="24" :md="24" :lg="24">
                <el-form-item :label="object['reset'].label" :prop="object['reset'].name">
                    <el-radio-group v-model="mate.values[object['reset'].name]" size="mini">
                        <el-radio label="1" >每天</el-radio>
                        <el-radio label="2" >每周</el-radio>
                        <el-radio label="3" >每月</el-radio>
                        <el-radio label="4" >每年</el-radio>
                        <el-radio label="5" >自动增长</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
            </el-row>
            <el-row>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['length'].label" :prop="object['length'].name">
                    <el-input-number v-model="mate.values[object['length'].name]" controls-position="right"  :min="1" :max="20"></el-input-number>
                </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['initValue'].label" :prop="object['initValue'].name">
                  <el-input-number v-model="mate.values[object['initValue'].name]" controls-position="right"  :min="1" :max="20"></el-input-number>
                </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['step'].label" :prop="object['step'].name">
                   <el-input-number v-model="mate.values[object['step'].name]" controls-position="right"  :min="1" :max="20"></el-input-number>
                </el-form-item>
            </el-col>
            </el-row>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['ruleView'].label" :prop="object['ruleView'].name">
                  <el-input readonly v-model="mate.values[object['ruleView'].name]"></el-input>
                </el-form-item>
            </el-col>
          
          </template>
      </el-form>
    </el-row>
      <div class="fbutton">
        <el-button  class="el-icon-plus" plain @click="add">新 增</el-button>
        <el-button class="el-icon-delete" plain  @click="del" >删 除</el-button>
      </div>  
      <el-table size="mini" :data="tableData"  border fit highlight-current-row style="width: 100%" @selection-change="tableSelected"> 
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column :label="object['items'].children[2].label" :prop="object['items'].children[2].name" :width="object['items'].children[2].width">
            <template slot-scope="scope">
              <el-select size="mini" clearable  v-model="scope.row[object['items'].children[2].name]"   filterable  allow-create>
                   <el-option :label="item.label" :value="item.value" v-for="item of object['items'].children[2].options" :key="item.id" ></el-option>
              </el-select>
            </template>
        </el-table-column>
        <el-table-column :label="object['items'].children[3].label" :prop="object['items'].children[3].name" :width="object['items'].children[3].width">
            <template slot-scope="scope">
               <el-select size="mini" clearable  v-model="scope.row[object['items'].children[3].name]"  >
                   <el-option :label="item.label" :value="item.value" v-for="item of object['items'].children[3].options" :key="item.id"></el-option>
              </el-select>
            </template>
        </el-table-column>
      </el-table>
  </div>  
</template>
<script>
import { trimSpace } from '../../utils/util.js'
export default {
  data () {
    var checkSequenceName = (rule, value, callback) => {
      if (value === undefined || trimSpace(value) === '' || value == null) {
        callback(new Error('该输入项为必输项'))
      } else {
        this.$root.ajaxData('/sys/seqno/check?sequenceName=' + value, {}, function (data) {
             if (data.message === '1'){
                callback(new Error('该编码规则已存在'))
             }else {
                callback()
             }
          }, 'GET')
      }
    }
    return {
      tableData: [{ 'no': '', 'type': '', 'format': '', 'delimiter': '' }],
      labelPosition: 'right',
      selectedPrices: [],
      object: {},
      rules: {
        name: { required: true, message: '该输入项为必输项', trigger: 'blur' }
      },
      sequenceNameRule: { required: true, validator: checkSequenceName, trigger: 'blur' },
      tableArray: [],
      show: false
    }
  },
  watch: {
    tableData: {
      handler: function (val, old) {
        var list = ''
        var list1 = ''
        for (var i = 0; i < val.length; i++) {
          list = '{' + val[i].format + '}' + val[i].delimiter
          list1 += list
        }
        this.mate.values.ruleView = list1
      },
      deep: true
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
        width = '130px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '130px'
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
    if (this.mate.values.id) {
      this.show = true
      this.tableData = this.mate.values.items
      this.sequenceNameRule = {}
    }
  },
  methods: {
    tableSelected (val) {
      this.selectedPrices = val
    },
    add () {
      this.tableData.push({ 'no': '', 'type': '', 'format': '', 'delimiter': '' })
    },
    del () {
      if (this.selectedPrices.length === 0) {
        this.$message({
          message: this.$t('seladata'),
          type: 'warning'
        })
        return
      }
      for (var i = 0; i < this.tableData.length; i++) {
        for (var j = 0; j < this.selectedPrices.length; j++) {
          if (this.tableData[i].no === this.selectedPrices[j].no) {
            this.tableData.splice(i, 1)
          }
        }
        for (var l = 0; l < this.tableData.length; l++) {
          this.tableData[l].no = l + 1
        }
      }
      this.selectedPrices = []
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleSubmit () {
      var vm = this
      this.tableArray = []
      for (var i = 0; i < this.tableData.length; i++) {
        for (var j = 0; j < this.object['items'].children[2].options.length; j++) {
          if (this.tableData[i].format === this.object['items'].children[2].options[j].value) {
            this.tableData[i].type = this.object['items'].children[2].options[j].type
            break
          } else {
            this.tableData[i].type = 0
          }
        }
        this.tableData[i].no = i + 1
      }
      this.mate.values.items = this.tableData

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
         if (this.mate.method === 'PUT') {
            this.$root.ajaxData('/sys/seqno/' + this.mate.values.id, this.mate.values, function (data) {
              vm.$root.monitor({ url: '/sys/seqno/list' })
            }, 'PUT')
          } else {
            this.$root.ajaxData('/sys/seqno', this.mate.values, function (data) {
              vm.$root.monitor({ url: '/sys/seqno/list' })
            }, 'POST')
          }
        }else {
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          return false
        }
      })
    },
    backward () {
      this.$root.monitor({ url: '/sys/seqno/list' })
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
.hidden{
  display:none;
}
h4{
  margin-top:40px;
  margin-bottom:10px;
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
.tbutton{
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.fbutton {
  margin: 20px 0 10px;
  float: left;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
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