<template>
  <div>
     <div class="tbutton">
    <el-button plain class="el-icon-document"  @click="handleSubmit">{{word}}</el-button>     <!--默认为提交，如果有需要可以将其设置为查询-->
    <el-button plain class="el-icon-close" @click="backward" v-if="!mate.inline">取 消</el-button>
    <el-button plain class="el-icon-date"  @click="resetForm('ruleForm')">重 置</el-button>
  </div>
  <el-row>
  <el-form size="mini" :model="formerValues" :inline="mate.inline" :label-position="labelPosition" :rules="rules" ref="ruleForm" :label-width="labelWidth">
    <template>

      <el-col :sm="24" :md="12" :lg="8">
        <el-form-item :label="object['name'].label" :prop="object['name'].name" :rules="ruleUsername">
          <el-input type="email" v-model="formerValues['name']" :disabled="showEdit" ></el-input>
        </el-form-item>
      </el-col>

      <!-- <el-col :sm="24" :md="12" :lg="8">
        <el-form-item  v-show="!mate.mateFormerHeader.values.id" :label="object['word'].label" :prop="object['word'].name" :rules="ruleWord">
          <el-input type="password" v-model="formerValues['word']"></el-input>
        </el-form-item>
      </el-col> -->

      <el-col :sm="24" :md="12" :lg="8">
        <el-form-item :label="object['firstname'].label" :prop="object['firstname'].name">
          <el-input v-model="formerValues['firstname']"></el-input>
        </el-form-item>
      </el-col>

      <el-col :sm="24" :md="12" :lg="8">
        <el-form-item :label="object['lastname'].label" :prop="object['lastname'].name">
          <el-input v-model="formerValues['lastname']"></el-input>
        </el-form-item>
      </el-col>

      <el-col :sm="24" :md="12" :lg="8">
        <el-form-item :label="object['sex'].label" :prop="object['sex'].name">
            <el-select clearable filterable v-model="formerValues[object['sex'].name]">
            <el-option :label="item.label" :value="item.value" v-for="item of object['sex'].options" :key="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :sm="24" :md="12" :lg="8">
        <el-form-item :label="object['telephone'].label" :prop="object['telephone'].name">
          <el-input type="number" v-model="formerValues['telephone']"></el-input>
        </el-form-item>
      </el-col>

      <el-col :sm="24" :md="12" :lg="8">
        <el-form-item :label="object['email'].label" :prop="object['email'].name">
          <el-input type="email" v-model="formerValues['email']"></el-input>
        </el-form-item>
      </el-col>

      <el-col :sm="24" :md="12" :lg="8">
        <el-form-item :label="object['workno'].label" :prop="object['workno'].name">
          <el-input v-model="formerValues['workno']"></el-input>
        </el-form-item>
      </el-col>

      <el-col :sm="24" :md="12" :lg="8">
        <el-form-item :label="object['idType'].label" :prop="object['idType'].name">
            <el-select clearable filterable v-model="formerValues[object['idType'].name]">
            <el-option :label="item.label" :value="item.value" v-for="item of object['idType'].options" :key="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :sm="24" :md="12" :lg="8">
        <el-form-item :label="object['idnumber'].label" :prop="object['idnumber'].name">
          <el-input v-model="formerValues['idnumber']"></el-input>
        </el-form-item>
      </el-col>

      <el-col :sm="24" :md="12" :lg="8">
        <el-form-item :label="object['address'].label" :prop="object['address'].name">
          <el-input v-model="formerValues['address']"></el-input>
        </el-form-item>
      </el-col>

      <el-col :sm="24" :md="12" :lg="8">
        <el-form-item :label="object['zipcode'].label" :prop="object['zipcode'].name">
          <el-input v-model="formerValues['zipcode']"></el-input>
        </el-form-item>
      </el-col>

      <!-- <el-col :sm="24" :md="12" :lg="8">
        <el-form-item>
          <el-button size="mini" @click="openDialog">数据权限过滤</el-button>
        </el-form-item>
      </el-col> -->
    </template>
  </el-form>
  </el-row>

  <el-dialog title="数据权限过滤" :visible.sync="dialogTableVisible" class="dialogTransfer" width="60%" id="dialogTransfer" :close-on-click-modal="closeOnClickModal" before-close="cancelDialog">
    <el-transfer filterable v-model="value1" :data="dataDialog" :titles="['未选中供应商', '选中的供应商']" :panelWidth="panelWidth" style="margin-bottom: 20px"></el-transfer>
    <el-button size="mini" @click="confirmDialog">确定</el-button>
    <el-button size="mini" @click="cancelDialog">取消</el-button>
  </el-dialog>

  <div class="detailLine">
    <h3 style="color:#a1afc5">明细行</h3>
    <div class="buttonAdd">
      <el-button plain @click="addDetail" :disabled="showView">新增</el-button>
      <el-button plain @click="deleteDetail" :disabled="showView">删除</el-button>
    </div>
    <el-table size="mini" highlight-current-row ref="table" :data="mateLineListRowsData" border  @selection-change="handleSelectionChange"  style="width: 100%;">
      <el-table-column type="selection" width="50" id="tableSel"></el-table-column>
      <el-table-column :label="lineColumn['line'].label" :min-width="lineColumn['line'].width" :prop="lineColumn['line'].name"></el-table-column>
      <el-table-column :label="lineColumn['orgId'].label" :min-width="lineColumn['orgId'].width" :prop="lineColumn['orgId'].name">
        <template slot-scope="scope">
          <el-cascader
            clearable
            filterable
            size="mini"
            change-on-select
            expand-trigger="hover"
            :options="cascateOption"
            v-model="scope.row['orgId']"
            separator="-"
            v-show="!scope.row.editOrgFlag"
            @change="handleChange(scope.row['orgId'])">
          </el-cascader>
          <el-cascader
            clearable
            filterable
            change-on-select
            size="mini"
            expand-trigger="hover"
            :options="cascateOption"
            v-model="scope.row['orgId']"
            separator="-"
            disabled
            v-show="scope.row.editOrgFlag"
            @change="handleChange(scope.row['orgId'])">
          </el-cascader>
        </template>
      </el-table-column>
      <el-table-column :label="lineColumn['supplierCompanyList'].label" :min-width="lineColumn['supplierCompanyList'].width" :prop="lineColumn['supplierCompanyList'].name">
        <template slot-scope="scope">
          <el-select multiple filterable size="mini" clearable v-model="scope.row['supplierCompanyList']"  v-show="!scope.row.editFlag">
            <el-option :label="item.label" :value="item.value" v-for="item of companyOptions" :key="item.id"></el-option>
          </el-select>
          <el-select multiple filterable size="mini" clearable v-model="scope.row['supplierCompanyList']"  disabled v-show="scope.row.editFlag">
            <el-option :label="item.label" :value="item.value" v-for="item of companyOptions" :key="item.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="lineColumn['roleId'].label" :min-width="lineColumn['roleId'].width" :prop="lineColumn['roleId'].name">
        <template slot-scope="scope">
          <el-select size="mini" clearable v-model="scope.row['roleId']"  v-show="!scope.row.editFlag">
            <el-option :label="item.label" :value="item.value" v-for="item of userRoleOption" :key="item.id"></el-option>
          </el-select>
          <el-select  size="mini" clearable v-model="scope.row['roleId']"  disabled v-show="scope.row.editFlag">
            <el-option :label="item.label" :value="item.value" v-for="item of userRoleOption" :key="item.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="lineColumn['remark'].label" :min-width="lineColumn['remark'].width" :prop="lineColumn['remark'].name">
        <template slot-scope="scope">
          <el-input size="mini" v-show="!scope.row.editFlag" v-model="scope.row[lineColumn['remark'].name]" ></el-input>
          <el-input size="mini" disabled v-show="scope.row.editFlag" v-model="scope.row[lineColumn['remark'].name]" ></el-input>
        </template>
      </el-table-column>
       <el-table-column :label="lineColumn['invalidDate'].label" :min-width="lineColumn['invalidDate'].width" :prop="lineColumn['remark'].name">
        <template slot-scope="scope">
           <el-date-picker size="mini" clearable type="date" v-model="scope.row[lineColumn['invalidDate'].name]"></el-date-picker>
        </template>
      </el-table-column>
    </el-table>
  </div>

  </div>
</template>
<script>
import { API_GATEWAY } from '@/config/index.js'
import sha1 from 'node-sha1'
import { isPositiveEmail, trimSpace, isPositivePassword } from '../../utils/util.js'
export default {
  data () {
    var validateUser = (rule, value, callback) => {
      if (value === undefined || trimSpace(value) === '') {
        callback(new Error('该输入项为必输项'))
      } else {
        if (!isPositiveEmail(trimSpace(value))) {
          callback(new Error('请输入正确的邮箱'))
        } else {
          callback()
        }
      }
    }
      // 校验密码长度 字符
    var validateBlurPassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('请输入含有数字,字母的8-16位密码'))
      }
      if (value.length > 16) {
        callback(new Error('请输入含有数字,字母的8-16位密码'))
      }
      if (!isPositivePassword(trimSpace(value))) {
        callback(new Error('请输入含有数字,字母的8-16位密码'))
      } else {
        callback()
      }
    }
    var validateExitUsername = (rule, value, callback) => {
      var vm = this
      this.$root.ajaxData('/register/checkUserName?userName=' + this.formerValues.name, {}, function (data) {
        if (data.statusCode !== 200) {
          callback(new Error(vm.$t('checkUsername')))
        } else {
          callback()
        }
      })
    }
    return {
      closeOnClickModal: false,
      panelWidth: '280',
      dataDialog: [],
      value1: [],
      dialogTableVisible: false,
      cascateOption: [],
      labelPosition: 'right',
      object: {},
      showEdit: false,
      multipleSelection: [],
      mateLineListRowsData: [{ 'line': 1, 'orgId': [], 'roleId': [], 'remark': '' }],
      lineColumn: {},
      formerValues: {},
      showView: false,
      companyOptions: [],
      rules: {
        firstname: [
          { required: true, message: '该选项为必输项', trigger: 'blur' }
        ],
        lastname: [
          { required: true, message: '该选项为必输项', trigger: 'blur' }
        ]
      },
      // ruleWord: [
      //   { required: true, message: '该选项为必输项', trigger: 'blur' },
      //   { validator: validateBlurPassword, trigger: 'blur' }
      // ],
      ruleUsername: [
           { required: true, message: '请输入邮箱地址', trigger: 'blur' },
           { validator: validateUser, trigger: 'blur' },
           { validator: validateExitUsername, trigger: 'blur' }
      ],
      userRoleOption: []
    }
  },
  props: {
    word: {
      default: '提 交'
    },
    mate: Object,
    formModel: {
      type: String,
      default: 'page' // page or dialog
    },
    option: {
      type: Object,
      default: () => {}
    }
  },
  created () {
    const vm = this
    this.mate.mateFormerHeader.fields.map((i) => { this.object[i.name] = i })
    this.mate.mateList.columns.map((i) => { this.lineColumn[i.name] = i })
    this.formerValues = this.mate.mateFormerHeader.values
    this.formerValues.name = this.mate.mateFormerHeader.values.username
    this.formerValues.word = this.mate.mateFormerHeader.values.password
    this.value1 = this.mate.supplierIds
    this.valueCopy = this.mate.supplierIds
    if (this.mate.mateList.rows) {
      this.mateLineListRowsData = this.mate.mateList.rows
    }
    var user = window.sessionStorage.getItem('user')
    if (user) {
      user = JSON.parse(user)
    }
    this.userRoleOption.push(...this.mate.mateList.extObj)
    for (let i = 0; i < this.userRoleOption.length; i++) {
      this.userRoleOption[i].label = this.userRoleOption[i].name
      this.userRoleOption[i].value = this.userRoleOption[i].id
    }
    // 归属机构获取到的数据
    this.$root.ajaxData('/offices/tree/list?dataOnly=true', {}, function (data) {
      vm.orgChange(data)
      vm.cascateOption = data
    }, 'GET')
    // 获取供应商
    this.$root.ajaxData('/companys/companyInfo/3?status=1&auditStatus=1&nopaging=1&dataOnly=true', {}, function (data) {
      for (let i = 0; i < data.length; i++) {
        vm.companyOptions.push({value: data[i].name})
      }
    }, 'GET')
    // 将获取到的数据变成数组
    for (let i = 0, len = this.mate.mateList.rows.length; i < len; i++) {
      if (this.mate.mateList.rows[i].companyPermission) {
        this.mate.mateList.rows[i].supplierCompanyList = this.mate.mateList.rows[i].companyPermission.split(',')
      }
    }
    if (this.mate.mateFormerHeader.values.id !== '') {
      if (this.mate.mateFormerHeader.values.userType === '1' && user.username === 'admin') {
        this.showView = false
        for (var i = 0; i < this.mate.mateList.rows.length; i++) {
          if (this.mate.mateList.rows[i].id !== '') {
            this.mate.mateList.rows[i].editFlag = false
            this.mate.mateList.rows[i].editOrgFlag = true
          }
        }
      }
      if (this.mate.mateFormerHeader.values.userType === '1' && user.username !== 'admin') {
        this.showView = true
        for (i = 0; i < this.mate.mateList.rows.length; i++) {
          if (this.mate.mateList.rows[i].id !== '') {
            this.mate.mateList.rows[i].editFlag = true
            this.mate.mateList.rows[i].editOrgFlag = true
          }
        }
      }
    } else {
      this.showView = false
    }
    if (this.mate.mateFormerHeader.values.id) {
      this.showEdit = true
      this.ruleUsername = {}
      // this.ruleWord = {}
    }
  },
  components: {
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
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
  methods: {
    // 数据权限分配确定
    confirmDialog () {
      this.dialogTableVisible = false
      this.valueCopy = this.value1
    },
    cancelDialog () {
      this.dialogTableVisible = false
      this.value1 = this.valueCopy
    },
    // 数据权限分配按钮
    openDialog () {
      this.dialogTableVisible = true
      var vm = this
      this.$root.ajaxData('/companys/companyInfo/3?cols=name,id&dataOnly=true&nopaging=true&status=1&auditStatus=1', {}, function (data) {
        for (var i = 0; i < data.length; i++) {
          data[i].key = data[i].name
          data[i].label = data[i].name
        }
        vm.dataDialog = data
      })
    },
    // 使用递归函数调用
    orgChange (data) {
      for (const i of data) {
        i.label = i.name
        i.value = i.id
        if (i.children) {
          this.orgChange(i.children)
        }
      }
    },
    handleSelectionChange (val) {
      this.$emit('actionSelected', val)
      this.multipleSelection = val
    },
    // 新增明细行
    addDetail () {
      const line = this.mateLineListRowsData.length + 1
      this.mateLineListRowsData.push({ 'line': line, 'id': '' })
    },
    deleteDetail () {
      if (this.mate.mateList.rows) {
      // 判断list中有的值和用户选择的值是否一致，若一致则将其删除
        for (var j = 0; j < this.mate.mateList.rows.length; j++) {
          for (var k = 0; k < this.multipleSelection.length; k++) {
            if (this.multipleSelection[k].id !== '') {
              this.$message({
                type: 'warning',
                message: '不能删除'
              })
              return
            }
            if (this.mate.mateList.rows[j].line === this.multipleSelection[k].line) {
              // splice(i, 1),从i开始的那一条，删除一条
              this.mate.mateList.rows.splice(j, 1)
              // 删除了一条之后，就将剩余从新排序
            }
          }
          for (var l = 0; l < this.mate.mateList.rows.length; l++) {
            this.mate.mateList.rows[l].line = l + 1
          }
        }
      } else {
        for (var i = 0; i < this.mateLineListRowsData.length; i++) {
          for (k = 0; k < this.multipleSelection.length; k++) {
            if (this.mateLineListRowsData[i].line === this.multipleSelection[k].line) {
              this.mateLineListRowsData.splice(i, 1)
            }
          }
        }
        for (i = 0; i < this.mateLineListRowsData.length; i++) {
          this.mateLineListRowsData[i].line = i + 1
        }
      }
    },
    handleChange (val) {
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    backward () {
      this.$root.monitor({ url: '/users/list' })
    },
    handleSubmit (ev) {
      var vm = this
      if (this.mateLineListRowsData.length === 0) {
        this.$message({
          type: 'warning',
          message: '请为该用户分配角色和归属机构'
        })
        return false
      }
      for (var j = 0; j < this.mateLineListRowsData.length; j++) {
        if (!this.mateLineListRowsData[j].roleId) {
          this.$message({
            type: 'warning',
            message: '请分配角色'
          })
          return false
        }
        if (this.mateLineListRowsData[j].orgId.length === 0) {
          this.$message({
            type: 'warning',
            message: '请分配机构'
          })
          return false
        }
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          var url = vm.mate.mateFormerHeader.url
          if (this.mateLineListRowsData.length && this.mateLineListRowsData[0].orgId) {
            this.mateLineListRowsData.map(i => {
              if (i.orgId.length) {
                i.officeId = i.orgId[i.orgId.length - 1]
              }
            })
          }
          vm.formerValues.password = vm.formerValues.word
          vm.formerValues.username = vm.formerValues.name
          // 数据分配权限， 现在是分配的客户
          vm.formerValues.supplierIds = vm.valueCopy
          if (vm.mate.mateFormerHeader.method === 'PUT') {
            var values = { 'mateList': vm.mateLineListRowsData, 'mateFormerHeader': vm.formerValues}
            this.$root.ajaxData('/users/updateUser', values, function () {
              vm.$root.monitor({ url: '/users/list' })
            }, 'PUT')
          } else {
            this.formerValues.password = sha1(this.mate.mateFormerHeader.values.password)
            values = { 'mateList': vm.mateLineListRowsData, 'mateFormerHeader': vm.formerValues}
            this.$root.ajaxData(url, values, function (data) {
              if (data.statusCode === 40018) {
                vm.$message({
                  type: 'warning',
                  message: '用户邮箱不正确'
                })
                return false
              } else {
                vm.$root.monitor({ url: '/users/list' })
              }
            }, 'POST')
          }
        } else {
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
// .el-form-item__label{
//   line-height:inherit
// }
.el-form--inline>* {
  margin-right:10px
}
.el-form-item{
  margin: 22px 20px 2px 0;
}
.el-form-item{
  margin-bottom:2px;
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
  width:90%;
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
.el-form-item {
    margin: 15px 20px 2px 0px;
}
.tbutton{
  margin: 5px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.detailLine {
  margin-top: 10px;
  .buttonAdd {
    position: relative;
    margin: 3px 0;
    button {
      padding: 7px 15px;
      background-color: #fff;
      cursor: pointer;
    }
  }
}
// .el-date-editor.el-input, .el-date-editor.el-input__inner {
//   width: 100%;
// }
// .el-input__suffix {
//   right:68px
// }
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-input--mini .el-input__inner{
  width:100%
}
.el-select {
  width: 100%;
}
// #dialogTransfer .el-transfer .el-transfer-panel {
//   width: 280px !important;
// }
.el-dialog__body .el-transfer-panel {
  width: 280px !important;
}
// .el-transfer-panel .el-transfer{
//   width: 280px !important;
// }
</style>
