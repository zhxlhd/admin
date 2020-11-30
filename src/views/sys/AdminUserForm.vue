<template>
  <div>
    <div class="tbutton">
      <el-button plain class="el-icon-document"  @click="handleSubmit">{{word}}</el-button>     <!--默认为提交，如果有需要可以将其设置为查询-->
      <el-button plain class="el-icon-close" @click="backward" v-if="!mate.inline">取 消</el-button>
      <el-button plain class="el-icon-date"  @click="resetForm('ruleForm')">重 置</el-button>
    </div>
    <el-row>
      <el-form size="mini" :model="formerValues" :inline="mate.inline" :rules="rules" :label-position="labelPosition" ref="ruleForm" :label-width="labelWidth">
        <template>

          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['name'].label" :prop="object['name'].name" :rules="ruleUsername">
              <el-input type="email" v-model="formerValues['name']" :disabled="disabledEdit"  ></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['firstname'].label" :prop="object['firstname'].name">
              <el-input v-model="formerValues['firstname']" :disabled="disabledEdit"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['lastname'].label" :prop="object['lastname'].name">
              <el-input v-model="formerValues['lastname']" :disabled="disabledEdit"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['sex'].label" :prop="object['sex'].name">
                <el-select clearable filterable v-model="formerValues[object['sex'].name]" :disabled="disabledEdit">
                <el-option :label="item.label" :value="item.value" v-for="(item,index) of object['sex'].options" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['telephone'].label" :prop="object['telephone'].name">
              <el-input type="number" v-model="formerValues['telephone']" :disabled="disabledEdit"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['email'].label" :prop="object['email'].name">
              <el-input type="email" v-model="formerValues['email']" :disabled="disabledEdit"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['workno'].label" :prop="object['workno'].name">
              <el-input v-model="formerValues['workno']" :disabled="disabledEdit"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['idType'].label" :prop="object['idType'].name">
                <el-select clearable filterable v-model="formerValues[object['idType'].name]" :disabled="disabledEdit">
                <el-option :label="item.label" :value="item.value" v-for="(item,index) of object['idType'].options" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['idnumber'].label" :prop="object['idnumber'].name">
              <el-input v-model="formerValues['idnumber']" :disabled="disabledEdit"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['address'].label" :prop="object['address'].name">
              <el-input v-model="formerValues['address']" :disabled="disabledEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['zipcode'].label" :prop="object['zipcode'].name">
              <el-input v-model="formerValues['zipcode']" :disabled="disabledEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12" :lg="20">
            <el-form-item :label="object['mutiFlag'].label" :prop="object['mutiFlag'].name" >
              <el-radio-group v-model="formerValues['mutiFlag']" @change="changeMuti">
                    <el-radio label="1" >是</el-radio>
                    <el-radio label="0" >否</el-radio>
                  </el-radio-group>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>

    <div class="detailLine">
      <h3 style="color:#a1afc5">明细行</h3>
      <div class="buttonAdd">
        <el-button size="mini" plain @click="addDetail" :disabled="showView">新增</el-button>
        <el-button size="mini" class="el-icon-download" plain @click="downloadLine">下载模板</el-button>
      </div>
      <el-table size="mini" highlight-current-row ref="table" :data="mateLineListRowsData" border   style="width: 100%;">
        <el-table-column type="selection" width="50" id="tableSel"></el-table-column>
        <el-table-column type="index"  label="序号" min-width="50"></el-table-column>
        <el-table-column :label="lineColumn['userCompanyName'].label" :min-width="lineColumn['userCompanyName'].width" :prop="lineColumn['userCompanyName'].name">
        </el-table-column>
        <el-table-column :label="lineColumn['orgName'].label" :min-width="lineColumn['orgName'].width" :prop="lineColumn['orgName'].name">
        </el-table-column>
        <el-table-column :label="lineColumn['roleName'].label" :min-width="lineColumn['roleName'].width" :prop="lineColumn['roleName'].name">
        </el-table-column>
        <el-table-column show-overflow-tooltip :label="lineColumn['supplierName'].label" :min-width="lineColumn['supplierName'].width" :prop="lineColumn['supplierName'].name">
        </el-table-column>
        <el-table-column :label="lineColumn['remark'].label" :min-width="lineColumn['remark'].width" :prop="lineColumn['remark'].name">
        </el-table-column>
         <el-table-column label="操作" min-width="280">
          <template slot-scope="scope">
            <el-button size="mini"  @click="editLine(scope.$index,scope.row)">编辑</el-button>
            <el-button size="mini" @click="deleteDetail(scope.$index)" :disabled="showView">删除</el-button>
            <el-button size="mini" @click="handleImport(scope.row)" :disabled="showView">导入</el-button>
            <el-button size="mini" @click="migration(scope.row)" :disabled="showView">迁移</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="editDialogTitle" :visible.sync="editDialog"   width="800px">
      <div>
      <el-form size="mini" :model="lineFormerValues" :rules="lineRules" :label-position="labelPosition" ref="lineFormerValues" :label-width="labelWidth" :inline-message="true">
        <el-form-item label="归属公司" prop="lineCompanyName" >
          <el-select size="mini" v-model="lineFormerValues.lineCompanyName" @change="changeCompanyName">
            <el-option :label="item.label" :value="item.value" v-for="(item, index) of userCompanyOption" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归属机构" prop="lineOrgId" >
          <el-select filterable size="mini" v-model="lineFormerValues.lineOrgId" @change="changeOrgName">
            <el-option :label="item.label" :value="item.value" v-for="(item, index) of orgIdOptions" :key="index"></el-option>
          </el-select>
        </el-form-item>
      
        <el-form-item label="角色" prop="lineRoleId" >
          <el-select size="mini" v-model="lineFormerValues.lineRoleId" @change="changeRoleName">
            <el-option :label="item.label" :value="item.value" v-for="(item, index) of roleIdOptions" :key="index" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="userId" v-show="showUserNameField" :rules="isUserRequired">
          <!-- <el-input size="mini"  v-model="lineFormerValues.userName" ></el-input> -->
          <el-select v-model="lineFormerValues.userId" @change="changeUserName" filterable>
            <el-option
              :label="item.firstname+item.lastname"
              :value="item.id"
              v-for="item of usersList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分配供应商" prop="supplierCompanyList" v-show="showField">
          <el-button size="mini" @click="showTransfer">分配</el-button>
        </el-form-item>
    
        <el-form-item label="备注" prop="lineRemark" v-show="showField">
          <el-input size="mini"  v-model="lineFormerValues.lineRemark" ></el-input>
        </el-form-item>
      </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelLine">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitLine">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配供应商" :visible.sync="dialogTableVisible"   width="800px">
      <el-transfer  filterable  :titles="['未选中供应商', '选中的供应商']" v-model="dialogValue" :data="supplierOptions"  class="dialogTransfer"  > </el-transfer>
      <el-button size="mini" @click="confirmDialog">确定</el-button>
      <el-button size="mini" @click="cancelDialog">取消</el-button>
    </el-dialog>
    <!-- 导入/上传文件 -->
    <input type="file" ref="excelFile" style="display:none" @change="fileUpload" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
  </div>
</template>
<script>
import sha1 from 'node-sha1'
import { DateFormat } from '../../utils/util.js'
import { isPositiveEmail, trimSpace } from '../../utils/util.js'
import SERVICES from '@/services';
import axios from '@/utils/http';
export default {
  data () {
    var validateExitUsername = (rule, value, callback) => {
      var vm = this
      this.$root.ajaxData('/register/checkUserName?userName=' + this.formerValues.name, {}, function (data) {
        if (data.statusCode !== 200 && vm.formerValues.name !== vm.oldName) {
          callback(new Error(vm.$t('checkUsername')))
        } else {
          callback()
        }
      })
    }
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
    return {
      // 穿梭框
      dialogTableVisible: false,
      lineFormerValues:{},
      editDialog:false,
      disabledEdit: false,
      labelPosition: 'right',
      object: {},
      mateLineListRowsData: [],
      lineColumn: {},
      editDialogTitle:"新增",
      formerValues: {
        name: ''
      },
      showView: false,
      lineRules:{
        lineCompanyName: [
          { required: true, message: '该选项为必输项', trigger: 'blur' }
        ],
        lineOrgId: [
          { required: true, message: '该选项为必输项', trigger: 'blur' }
        ],
        lineRoleId: [
          { required: true, message: '该选项为必输项', trigger: 'blur' }
        ],
      },
      rules: {
        firstname: [
          { required: true, message: '该选项为必输项', trigger: 'blur' }
        ],
        lastname: [
          { required: true, message: '该选项为必输项', trigger: 'blur' }
        ]
      },
      ruleUsername: [
        { required: true, message: '该选项为必输项', trigger: 'blur' },
        { validator: validateUser, trigger: 'blur' },
        { validator: validateExitUsername, trigger: 'blur' }
      ],
      userCompanyOption: [],
      orgIdOptions:[],
      roleIdOptions:[],
      rowIndex: 0,
      // 供应商
      supplierOptions: [],
      dialogValue: [],
      oldName:"",
      lineId : '',     // 行id
      vendorName: '',  // 归属公司
      holdData: {},    // 暂存行数据
      showField: true,  // 字段显示隐藏
      usersList:[],    // 迁移弹框用户下拉值
      migrationUserId: '',   // 迁移用户Id
      showUserNameField: false, // 显示/隐藏用户名字段
      isMigration: false,  // 判断是否为迁移操作
      isUserRequired: {},  // 动态校验
      currentSupplierName: '', // 当前行供应商
    }
  },
  props: {
    word: {
      default: '提 交'
    },
    mate: Object
  },
  created () {
    const vm = this
    this.mate.mateFormerHeader.fields.map((i) => { this.object[i.name] = i })
    this.mate.mateList.columns.map((i) => { this.lineColumn[i.name] = i })
    this.formerValues = this.mate.mateFormerHeader.values
    // 没有引入Vue实例 使用this 2019-02-14
    this.$set(this.formerValues, 'name', this.mate.mateFormerHeader.values.username)
    this.$set(this.formerValues, 'word', this.mate.mateFormerHeader.values.password)
    if (this.mate.mateList.rows) {
      this.mateLineListRowsData = this.mate.mateList.rows
    }
    // 存在Id属于修改功能
    if (this.mate.mateFormerHeader.values.id) {
      // 保存当前“是否为多公司员工”的值
      this.formerValues['mutiFlag'] = this.mate.mateFormerHeader.values.mutiFlag
      // 保存当前用户名 用来判断用户名是否修改
      this.oldName = this.mate.mateFormerHeader.values.username
      // 遍历行列表将供应商字符串转换为数组
      vm.mateLineListRowsData.forEach(item => {
        // 存在null 空字符串情况 进行修改  根据后台要求修改为用 # 分割 2020-05-07
        if (item.supplierName && item.supplierName.split('#')) {
          item.supplierCompanyList = item.supplierName.split('#')
        } else {
          item.supplierCompanyList = []
        }
      })
      this.changeMuti(this.formerValues['mutiFlag'])
    } else {
      this.formerValues['mutiFlag'] = '0'
      this.changeMuti(this.formerValues['mutiFlag'])
    }
  },
  components: {
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    }
  },
  computed: {
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
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
     * 下载模板
     * @param void
     * @return void
     */
    downloadLine() {
      // 下载模板接口
      let url = 'users/downloadVendorFile';
      // 下载模板命名
      let fileName = '用户导入供应商模板';
      // 下载模板接口方法
      let methods = 'POST';
      // 下载模板
      SERVICES.BASE.downTemplateExcel(url, methods, fileName);
    },
    /**
     * 导入按钮
     * @param void
     * @return void
     */
    handleImport (row) {
      this.lineId = row.id;
      this.vendorName = row.userCompanyName;
      if (row.supplierName == null || row.supplierName == undefined || row.supplierName == '') {
        this.currentSupplierName = '';
      }else {
        this.currentSupplierName  = row.supplierName;
      }
      this.$refs.excelFile.click();
    },
    fileUpload(file) {
      // 导入模板接口
      let url = 'users/importVendorNameFile';
      // 导入模板接口方法
      let methods = 'POST';
      // 导入数据
      let formdata = new FormData();
      formdata.append('file', file.target.files[0]);
      formdata.append('lineId', this.lineId);
      formdata.append('vendorName', this.vendorName);
      formdata.append('currentSupplierName', this.currentSupplierName);
      SERVICES.BASE.uploadTemplateExcel(url, methods, formdata, this.uploadSuccess);
    },
    /**
    * 导入成功
    */
    uploadSuccess(res){
      if (res.statusCode == 200) {
        this.$message({
          type: 'success',
          message: res.message
        });
        let dataObj = this.mateLineListRowsData.find(item => item.id == this.lineId);
        dataObj.supplierName = res.data.supplierString;
        dataObj.supplierCompanyList = res.data.supplierList;
      } else if (res.statusCode == 500) {
        this.$message({
          type: 'warning',
          message: res.message
        });
        this.$refs.excelFile.value = '';
      }
    },
    /**
     * 迁移
     */
    migration(row) {
      // 判断所选行供应商是否为空
      if(row.supplierName === '' || row.supplierName === null) {
        this.$message({
          type: 'warning',
          message: '该行供应商为空无法迁移'
        })
        return;
      };
      this.isMigration = true;
      this.holdData = {...row};
      this.editDialogTitle = '迁移';
      this.editDialog = true;
      this.showField = false;
      this.showUserNameField = true;
      this.getUsersList();
      this.lineFormerValues = {};
      if (this.isMigration) {
        this.isUserRequired = { required: true, message: '该输入项为必输项',trigger: 'change' };
      }
    },
    /**
     * 迁移弹框获取用户下拉值
     * @param void
     * @return void
     */
    getUsersList () {
      let _this = this;
      let url = '/users/multiTenant/list?dataOnly=111&all=111'
      axios.get(url).then(res => {
        let data = res.data;
        if (data.length=='0') return;
        data.forEach((item,index) => {
          if (item.userType === '1') {
            data.splice(index,1)
          }
        })
        this.usersList = data;
      })
    },
    /**
     * 迁移弹框选择用户名称
     */
    changeUserName (val) {
      if (val) {
        this.usersList.forEach(item => {
          if (val === item.id) {
            this.migrationUserId = item.username
          }
        })
      }
    },
    editLine(index,val){
      this.isMigration = false;
      this.showField = true;
      this.showUserNameField = false;
      this.editDialogTitle = '修改'
      this.editDialog = true
      this.lineFormerValues = val
      this.lineFormerValues.lineCompanyName = val.userCompanyName
      this.lineFormerValues.lineOrgId = val.userMultiComOrgId
      this.lineFormerValues.lineRoleId = val.roleId
      this.lineFormerValues.lineRemark = val.remark
      this.lineFormerValues.lineRoleName = val.roleName
      this.lineFormerValues.lineOrgName = val.orgName
      this.lineFormerValues.lineInvalidDate = val.invalidDate
      this.dialogValue = val.supplierCompanyList
      this.rowIndex = index
      this.getData(val.userCompanyName)
    },
    getData(val){
      var suppliserOption = []
      this.orgIdOptions = []
      this.roleIdOptions = []
      var vm = this
      this.$root.ajaxData(`/offices/muti/company/name?companyName=${val}&&rolenopage=11`, {}, function (data) {
        data.office.forEach(item => {
          vm.orgIdOptions.push({ value: item.id, label: item.name })
        })
        data.role.forEach(item => {
          vm.roleIdOptions.push({ value: item.id, label: item.name })
        })
        let supplierCompanyList = [...new Set(data.supplierCompanyList)]; // 数组去重 key报错 2019-02-04
        supplierCompanyList.forEach((item, index) => {
          suppliserOption.push({
            label: item,
            key: item
          })
        })
        vm.supplierOptions = suppliserOption
      }, 'GET')
    },
    /**
     * 公司名切换获取机构、角色
     * @param {String} val 
     */
    changeCompanyName(val){
      this.lineFormerValues.lineOrgId = ''
      this.$set(this.lineFormerValues,"lineRoleId",'')
      this.dialogValue = []
      this.getData(val)
    },
    /**
     * 机构Id切换将机构名匹配存储
     * @param {String} val 
     */
    changeOrgName(val){
      this.orgIdOptions.forEach(item=>{
        if(item.value === val){
          this.lineFormerValues.lineOrgName = item.label
        }
      })
      this.$set(this.lineFormerValues,"lineRoleId",'')
      this.dialogValue = []
    },
    /**
     * 角色Id切换将角色名匹配存储
     * @param {String} val 
     */
    changeRoleName(val){
      this.$forceUpdate()
      this.roleIdOptions.forEach(item=>{
        if(item.value === val){
          this.lineFormerValues.lineRoleName = item.label
        }
      })
    },
    /** 展示穿梭框
     * @return void
     */
    showTransfer () {
      this.dialogTableVisible = true
    },
    /** 是否为多公司员工
     * 切换是否为多公司员工的值，请求对应的归属公司列表
     * @param {String} val 是否为多公司员工的 value
     * @return void 
     */
    changeMuti (val) {
      var vm = this
      var user = JSON.parse(window.sessionStorage.getItem('user'))
      if (val === '0') {
        this.$root.ajaxData('/tenants/get/tenant?tenantId=' + user.tenantId, {}, function (data) {
          vm.userCompanyOption = [{value: data.name}]
          vm.mateLineListRowsData = vm.mateLineListRowsData.filter((item) => item.userCompanyName === vm.userCompanyOption[0].value )
        })
      } else {
        vm.userCompanyOption = []
        this.$root.ajaxData('/tenants/get/tenant?tenantId=' + user.tenantId, {}, function (data) {
          var companyname = data.name
          vm.$root.ajaxData(`/dic/cg?code=${companyname}`, {}, function (data) {
            data.forEach(item => {
              vm.userCompanyOption.push({
                value: item.value
              })
            })
          })
        })
      }
    },
    // 新增明细行
    addDetail () {
      this.isMigration = false;
      this.showField = true;
      this.showUserNameField = false;
      this.editDialog = true
      this.lineFormerValues = {}
      this.rowIndex = ''
      this.editDialogTitle = '新增'
      this.dialogValue = []
      this.$nextTick(() =>{
        this.$refs['lineFormerValues'].clearValidate();
      })
    },
    /**
     * 删除明细行
     * @param {String} val 行index
     */
    deleteDetail (val) {
      this.mateLineListRowsData.splice(val, 1)
    },
    /**
     * 重置
     * @param {String} formName form
     */
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    /**
     * 返回
     */
    backward () {
      this.$root.monitor({ url: '/users/multiTenant/list' })
    },
    /**
     * 提交
     */
    handleSubmit () {
      var vm = this
      let params = []
      // 明细行没有，不允许提交 明细行任意一行的机构、角色、组织空不能提交
      var isEmpty = true
      if (this.mateLineListRowsData.length === 0) {
        isEmpty = false
      }
      this.mateLineListRowsData.forEach(item => {
        if (!item.userCompanyName || !item.roleId || !item.userMultiComOrgId) {
          isEmpty = false
        }
      })
      if (isEmpty) {
        params = JSON.parse(JSON.stringify(this.mateLineListRowsData))
        params.forEach(item => {
          item.userId = vm.mate.mateFormerHeader.values.id
        // item.officeId = params[0].officeId
          item.invalidDate = DateFormat(item.invalidDate, 'yyyy-MM-dd')
        })
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            var mate = {}
            mate.mateList = params
            mate.mateFormerHeader = this.mate.mateFormerHeader.values
            mate.mateFormerHeader.username = vm.formerValues.name
            // 存在ID为修改提交
            if (this.mate.mateFormerHeader.values.id) {
              this.$root.ajaxData('/users/updateUser', mate, function (data) {
                if(data.statusCode === 40024){
                  vm.$message({
                    type: 'warning',
                    message: '用户是没有分配本租户的公司角色'
                  })
                  return
                }
                vm.backward()
              }, 'PUT')
            } else {
              this.$root.ajaxData('/users/addUser', mate, function (data) {
                if(data.statusCode === 40024){
                  vm.$message({
                    type: 'warning',
                    message: '用户是没有分配本租户的公司角色'
                  })
                  return
                }
                vm.backward()
              }, 'POST')
            }
          }
        }
      )
      } else {
        this.$message({
          type: 'warning',
          message: '请填写归属公司、归属机构、角色!!!'
        })
        return
      }
    },
    // 穿梭框确定
    confirmDialog () {
      this.dialogTableVisible = false
    },
    // 穿梭框关闭
    cancelDialog () {
      this.dialogTableVisible = false
    },
    // 明细行保存
    submitLine(){
      this.$refs.lineFormerValues.validate((valid) => {
        if(valid){
          var newLine = {}
          newLine = this.lineFormerValues
          newLine.userCompanyName = this.lineFormerValues.lineCompanyName
          newLine.userMultiComOrgId = this.lineFormerValues.lineOrgId
          newLine.roleId = this.lineFormerValues.lineRoleId
          newLine.remark = this.lineFormerValues.lineRemark
          newLine.roleName = this.lineFormerValues.lineRoleName
          newLine.orgName = this.lineFormerValues.lineOrgName
          // 迁移      
          if (this.isMigration) {
            // 判断相同用户相同机构
            if(this.migrationUserId === this.formerValues.name && this.lineFormerValues.lineOrgId === this.holdData.officeId) {
              this.$message({
                type: 'warning',
                message: '相同用户相同机构无需迁移，请重新选择'
              })
              return;
            };
            newLine.supplierCompanyList = this.holdData.supplierCompanyList;
            this.lineFormerValues.supplierName = this.holdData.supplierName;
            let isOk = false;   // 判断相同用户下供应商迁移
            let migrationOther = true;    // 判断给不同用户迁移供应商
            let isSameCompany = false;    // 判断相同用户迁移不同公司
            let lineIndex = '';   // 定义行index
            let mate = {};       // 给不同用户迁移供应商参数或者相同用户不同公司
            mate.id = this.holdData.id;
            mate.userId = newLine.userId;
            mate.orgName = newLine.orgName;
            mate.userCompanyName = newLine.userCompanyName;
            mate.roleName = newLine.roleName;
            mate.companyPermission = this.holdData.supplierName;
            mate.officeId = newLine.userMultiComOrgId;
            mate.roleId = newLine.roleId;
            // 判断迁移用户是否为当前用户
            if (this.migrationUserId !== this.formerValues.name) {
              isOk = false;
              migrationOther = true;
              isSameCompany = false;
            } 
            // 相同用户迁移不同公司
            else if (this.holdData.userCompanyName !== this.lineFormerValues.userCompanyName) {
              isSameCompany = true;
            }
            else {
              this.mateLineListRowsData.forEach((item,index) => {
                // 相同用户明细行不存在该机构，迁移新增
                if (item.lineOrgId !== String(this.lineFormerValues.lineOrgId)) {
                  isOk = true;
                  migrationOther = false;
                  isSameCompany = false;
                } 
                // 相同用户明细行存在该机构，迁移编辑
                else if (item.lineOrgId == String(this.lineFormerValues.lineOrgId)) {
                  isOk = false;
                  migrationOther = false;
                  isSameCompany = false;
                  lineIndex = index;
                }
              })
            }
            if (isOk && !migrationOther && !isSameCompany) {
              this.mateLineListRowsData.push(newLine);
              this.editDialog = false;
            }else if (!isOk && !migrationOther && !isSameCompany){
              this.$set(this.mateLineListRowsData,lineIndex,newLine);
              this.editDialog = false;
            } else if (!isOk && migrationOther && !isSameCompany) {
              let _this = this
              axios.post('/users/transferUserRoleVendor', mate).then(res => {
                if (res.data.statusCode == 200) {
                  _this.$message({
                    type: 'success',
                    message: res.data.message
                  })
                  _this.editDialog = false;
                } else if (res.data.statusCode == 100){
                  _this.$message({
                    type: 'warning',
                    message: `${res.data.message},请重新选择`
                  })
                  _this.editDialog = true;
                }
              })
            };
            if (isSameCompany) {
              let _this = this
              axios.post('/users/transferUserRoleVendor', mate).then(res => {
                if (res.data.statusCode == 200) {
                  _this.$message({
                    type: 'success',
                    message: res.data.message
                  })
                  _this.editDialog = false;
                  _this.backward();
                } else if (res.data.statusCode == 100){
                  _this.$message({
                    type: 'warning',
                    message: `${res.data.message},请重新选择`
                  })
                  _this.editDialog = true;
                }
              })
            }
          }
          // 判断是否是新增或新增后再次修改
          else if(this.lineFormerValues.id || this.rowIndex){
            this.lineFormerValues.supplierCompanyList = this.dialogValue;
            // 根据后台要求修改为用 # 分割 2020-05-07
            this.lineFormerValues.supplierName = this.dialogValue.join("#");
            this.$set(this.mateLineListRowsData,this.rowIndex,newLine);
            this.editDialog = false;
          } else {
            this.lineFormerValues.supplierCompanyList = this.dialogValue;
            // 根据后台要求修改为用 # 分割 2020-05-07
            this.lineFormerValues.supplierName = this.dialogValue.join("#")
            this.mateLineListRowsData.push(newLine);
            this.editDialog = false;
          }
        }
      })
    },
    // 明细行取消
    cancelLine(){
      this.editDialog = false
    }
  }
}
</script>

<style lang="scss">
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
// .el-form-item.is-required .el-form-item__label:after{
//   content: '*';
//   color: #ff4949;
//   margin-right: 4px;
// }
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
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-input--mini .el-input__inner{
  width:100%
}
.el-select {
  width: 100%;
}
.el-dialog__body .el-transfer-panel {
  width: 280px !important;
}
</style>
