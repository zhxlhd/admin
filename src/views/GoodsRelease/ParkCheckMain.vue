/**
 * 电镀行业-商品发布-园区入驻模块
 */
<template>
  <div>
    <div class="query" >
      <el-row :gutter="20">
        <el-form :model="formSearch" :inline="mate.inline" size="mini">
          <el-col :sm="5" :md="3" :lg="3">
            <el-form-item>
              <el-select v-model="formSearch.parkCode" placeholder="请选择园区" clearable>
                <el-option
                  v-for="item in parkCodes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="5" :md="3" :lg="3">
            <el-form-item>
                <dict-selected v-model="formSearch.state" dictType="eleGardenState" placeholder="请选择状态"></dict-selected>
            </el-form-item>
          </el-col>          
          <el-col :sm="5" :md="4" :lg="4">
            <el-form-item>
              <el-button @click="query()" size="mini">查询</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <Boxer :mate="mate.mateList" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
      <div slot="main">
        <el-row>
          <el-col :span="24">
            <el-table size="mini" max-height="500" highlight-current-row  ref="table" :data="mate.mateList.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column v-if="col.isShow" v-for="(col,index) of mate.mateList.columns" v-bind:key="col.name+index" :formatter="col.formatter" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              </el-table-column>
              <el-table-column  fixed="right" label="操作" :width="actionWidth" v-if="mate.mateList.actions">
                <template slot-scope="scope">
                  <k-btn v-for="act of mate.mateList.actions" v-bind:key="act.action" size="mini" :act="act" :icon="act.icon" :row="scope.row" @action="confirm"></k-btn>
                </template>
              </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" class="page">
      <el-col :span="12">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            layout="total, prev, pager, next, sizes"
            :total="mate.mateList.total"
            :page-sizes ="[5,10,15,20,30]"
            :page-size="size">
        </el-pagination>
      </el-col>
      </el-row>
    </div>
  </Boxer>
  <el-dialog title="园区入驻申请" :visible.sync="dialogFormVisible" width="30%">
    <el-form size="mini" :model="formInfo" ref="ruleForm" :rules="rules" :label-width="labelWidth">
      <el-form-item label="入驻园区" prop="parkCode">
        <el-select v-model="formInfo.parkCode" placeholder="请选择园区" :disabled="showDisabled" clearable>
            <el-option
                v-for="item in parkCodes"
                :key="item.value"
                :value="item.value"
                :label="item.label">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系人" prop="contact">
        <el-input v-model="formInfo.contact" placeholder="输入内容" :disabled="showDisabled"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="contactTel">
        <el-input v-model="formInfo.contactTel" placeholder="输入内容" :disabled="showDisabled"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button plain="" size="mini" @click="DialogClickCancel()">取消</el-button>
      <el-button type="primary" size="mini" @click="dialogFormVisible = false; DialogClickOK()">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import {validateMobile} from '../../utils/validates/validates.js'
var validatePhone = (rule, value, callback) => {
  if (!validateMobile(value)) {
    callback(new Error('请输入正确的11位手机号'))
  } else {
    callback()
  }
}
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    KBtn,
    Boxer,
    quillEditor,
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    }
  },
  props: {
    mate: Object,
  },
  computed: {
    actionWidth: function () {
      return this.mate.mateList.actions.length * 60 + 30
    },
     // a computed getter
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        // width = undefined
        width = '100px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '100px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  data () {
    return {
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      hasSelected: false,
      labelPosition: 'right',
      page: 1,
      size: 5,
      sortValues: {},
      action: null,
      word: this.$t('query'),
      object: {},                          // 放columns
      rowId: {},             // 点击table前面的框框
      msgBoxButton: true,
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      },
      formSearch: {
        parkCode: '',
        state: ''
      },
      formInfo: {
          parkCode: '',
          contact: '',
          contactTel: ''
      },
      parkCodes: [],
      dialogFormVisible: false,
      showDisabled: false,
      rules: {
        parkCode: [{ required: true, message: '该输入项为必输项', trigger: 'change' }],
        contact: [{ required: true, message: '该输入项为必输项', trigger: 'blur' }],
        contactTel: [{ required: true, message: '该输入项为必输项', trigger: 'blur' },
         { validator: validatePhone, trigger: 'blur' }],
      },
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.formatterBefore(this.mate.mateList.columns)
      this.mate.mateList.localName = this.mate.localName
      // this.$nextTick(function () {
      //   this.rowSelect()
      // })
    }
  },
  created () {
    this.formatterBefore(this.mate.mateList.columns)
    // console.log(this.mate.mateList.columns)
    // console.log(this.mate.mateList.rows)
  },
  updated () {
    if (this.$refs.myQuillEditor) {
      this.$nextTick(function () {
        this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler)
      })
    }
  },
  mounted () {
      this.getParkCodes()
  },
  methods: {
    // 获取园区列表
    getParkCodes () {
        var vm = this
        this.$root.ajaxData('/electro/el/park-apply/get-park', {}, function (data) {
            console.log(data)
            for (let i = 0; i < data.length; i++) {
                vm.parkCodes.push({ label: data[i].name, value: data[i].id, key: data[i].id })
            }
        }, 'GET')
    },

    // 查询
    query () {
      this.allowSearch = true;
      this.getData('paging');
    },

    DialogClickOK () {
      var vm = this
      this.$refs.ruleForm.validate((valid) => {
        if(valid){
          let url = '/electro/el/park-apply/all-list'
          let params = this.formInfo
          if (!params.id) {
            this.$root.ajaxData('/electro/el/park-apply/add', params, function (data) {
              vm.$root.monitor({ url, method: 'GET' })
            }, 'POST')
          }else {
            this.$root.ajaxData(`/electro/el/park-apply/update/${params.id}`, params, function (data) {
              vm.$root.monitor({ url, method: 'GET' })
            }, 'PUT')
          }
        }
        else {
          this.dialogFormVisible = true
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          return
        }
      })
    },

    DialogClickCancel () {
        this.dialogFormVisible = false
    },

    // 界面按钮功能
   handleButton (btn) {
      let vm = this
      let url = this.mate.mateList.dataApi
      let row = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      const rowt = this.multipleSelection.map((r) => r.id)
      const parkCtatus = this.multipleSelection.map((q) => q.state)
      const parkCtate = ''
      // 园区入驻列表新增
      if (btn.action === 'add') {
          this.formInfo = {}
          this.dialogFormVisible = true
          this.showDisabled = false
          return
      }
      
      // 园区入驻列表列表删除
      if (btn.action === 'delParkC') {
        var isDelParkC = false
        for(let i=0;i<parkCtatus.length;i++) {
          this.parkCtate = parkCtatus[i]
          if (this.parkCtate === '6' || this.parkCtate === '8' || this.parkCtate === '9') {
            isDelParkC = true
          } 
        }
        if (isDelParkC === true) {
          vm.$message({
            message: '该状态下不能删除',
            type: 'warning'
          })
          return
        } 
        else {
          this.$confirm('此操作将此数据删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$root.ajaxData('/electro/el/park-apply/delete',rowt, function (data) {
              vm.$root.monitor({ url, method: 'GET' })
            }, 'PUT')
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
          return
        }
      }

      // 园区入驻列表提交申请
      if (btn.action === 'submitApply') {
        var isSubmitApply = false
        for(let i=0;i<parkCtatus.length;i++) {
          this.parkCtate = parkCtatus[i]
          if (this.parkCtate > '0') {
            isSubmitApply = true
          }
        }
        if (isSubmitApply === true) {
          vm.$message({
            message: '只有新建状态可以提交申请',
            type: 'warning'
          })
          return
        }
        this.$root.ajaxData('/electro/el/park-apply/apply/6', rowt, function (data) {
        vm.$root.monitor({ url, method: 'GET' })
        }, 'PUT')
        return
      }

      // 园区入驻列表撤回申请
      if (btn.action === 'recallApply') {
        var isRecallApply = false
        for(let i=0;i<parkCtatus.length;i++) {
          this.parkCtate = parkCtatus[i]
          if (this.parkCtate !== '6') {
            isRecallApply = true
          }
        }
        if (isRecallApply === true) {
          vm.$message({
            message: '只有已申请状态才能撤回',
            type: 'warning'
          })
          return
        }
        this.$root.ajaxData('/electro/el/park-apply/apply/7', rowt, function (data) {
          vm.$root.monitor({ url, method: 'GET' })
        }, 'PUT')
        return
      }

      // 园区入驻列表通过
      if (btn.action === 'passParkC') {
        var isPassParkC = false
        for(let i=0;i<parkCtatus.length;i++) {
          this.parkCtate = parkCtatus[i]
          if (this.parkCtate !== '6') {
            isPassParkC = true
          }
        }
        if (isPassParkC === true) {
          vm.$message({
            message: '只有已申请状态才能通过',
            type: 'warning'
          })
          return
        }
        this.$root.ajaxData('/electro/el/park-apply/approval/8', rowt, function (data) {
          vm.$root.monitor({ url, method: 'GET' })
        }, 'PUT')
        return
      }

      // 园区入驻列表驳回
      if (btn.action === 'rejectParkC') {
        var isRejectParkC = false
        for(let i=0;i<parkCtatus.length;i++) {
          this.parkCtate = parkCtatus[i]
          if (this.parkCtate !== '6') {
            isRejectParkC = true
          }
        }
        if (isRejectParkC === true) {
          vm.$message({
            message: '只有已申请状态才能驳回',
            type: 'warning'
          })
          return
        }
        this.$root.ajaxData('/electro/el/park-apply/approval/3', rowt, function (data) {
          vm.$root.monitor({ url, method: 'GET' })
        }, 'PUT')
        return
      }

      // 园区入驻列表取消
      if (btn.action === 'cancelParkC') {
        var isCancelParkC = false
        for(let i=0;i<parkCtatus.length;i++) {
          this.parkCtate = parkCtatus[i]
          if (this.parkCtate !== '8') {
            isCancelParkC = true
          }
        }
        if (isCancelParkC === true) {
          vm.$message({
            message: '只有已通过状态才能取消',
            type: 'warning'
          })
          return
        }
        this.$root.ajaxData('/electro/el/park-apply/cancel/9', rowt, function (data) {
          vm.$root.monitor({ url, method: 'GET' })
        }, 'PUT')
        return
      }
      this.$root.handleAction(btn, row, function () {
        vm.getData()
      })
    },

    // 列表操作按钮
    confirm (act, row) {
      var vm = this
      if (act.action === 'editParkC') {
        if(row.state === '0' || row.state === '6'){
          this.dialogFormVisible = true
          this.showDisabled = false
          this.formInfo = row
          return
        }else {
          vm.$message({
            message: '该状态不可编辑',
            type: 'warning'
          })
          return
        }
      }
      if (act.action === 'checkParkC') {
        this.dialogFormVisible = true
        this.showDisabled = true
        this.formInfo = row
        return
      }
    },
    // table表格中勾选的选项，val是勾选的对象
    handleSelectionChange (val) {
      this.$emit('actionSelected', val)
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.size = val
      this.getData('paging')
    },
    handleCurrentChange (val) {
      this.page = val
      this.changePage = true
      this.getData('paging')
    },
    handleAction (act, row) {
      var vm = this
      this.$root.handleAction(act, row, function () {
        vm.getData()
      })
    },
    getData (flag) {
      let url = '/electro/el/park-apply/search-list'; // 分页、搜索查询接口
      let vm = this;
      // 查询
      if (this.allowSearch && !this.changePage) {
        // 查询参数
         const params = {
          'parkCode' : this.formSearch.parkCode || '',
          'state' : this.formSearch.state || '',
        }
        this.$root.ajaxData(url, params, function (data) {
          vm.mate.mateList.rows = data.data.mate.rows;
          vm.mate.mateList.total = data.data.mate.total;
        }, 'POST')
        return;
      }
      // 查询获取、分页
      if (this.allowSearch && this.changePage) {
        // 查询参数
        const params = {
          'parkCode' : this.formSearch.parkCode || '',
          'state' : this.formSearch.state || '',
          'pageNum': this.page,
          'pageSize': this.size,
        }
        this.$root.ajaxData(url, params, function (data) {
          vm.mate.mateList.rows = data.data.mate.rows;
          vm.mate.mateList.total = data.data.mate.total;
        }, 'POST')
        return;
      }
      // 直接分页请求
      const params = {
        'pageNum': this.page,
        'pageSize': this.size,
      }
      this.$root.ajaxData(url, params, function (data) {
        vm.updateData(data)
      }, 'POST')
    },
    updateData (data) {
      if (data.data.mate.rows) {
        this.mate.mateList.rows = data.data.mate.rows
        // rowsContent用于判断波次批次管理中拣料出库动作是否可以进行
        this.rowsContent = data.data.mate.rows
      }
      // 获取到包括元数据的所有数据，因为数据量太大，上面只获取到明细行的元数据和数据
      // if (data.mate.mateList.rows) {
      //   this.mate.rows = data.mate.mateList.rows
      // }
      if (data.data.mate.total) {
        this.total = data.data.mate.total
      } else {
        this.total = 0
      }
      if (data.data.mate.selected) {
        this.mate.mateList.selected = data.data.mate.selected
      }
    },
    sortChange: function (sort) {
      if (!sort || !sort.column || !sort.column.sortable) {
        return
      }
      this.sortValues = {
        order: sort.order,
        column: sort.prop
      }
      this.getData('sort')
    },
    formatter (field) {
      return function (row, col) {
        if (field.switch) {
          return field.switch[row[col.property]]
        }
        return row[col.property]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .page {
    margin-top: 20px;
  }

  .main-block .search {
      display: inline-block;
      margin-left: 30px;
      margin-top: -13px;
  }
  .el-form--inline .el-form-item {
    margin-bottom: 0
  }

  .el-table .cell, .el-table th>div {
    padding-right: 0;
  }
  .leftMargin{
    float:left;
    margin-left:10px;
  }
  .leftFloat form{
    float:left;
    display:inline-block;
  }
  .leftFloat div{
    float:left;
    display:inline-block;
    width:250px;
    height:38px;
    margin:0px 15px 0 0;
  }
  .button{
    margin-top:10px;
  }
  .el-form-item {
    margin: 10px 10px 2px 0px;
  }
  .checkboxClass{
    width: 30%;
    padding-bottom: 10px;
    box-sizing: border-box;
    margin-left: 15px;
  }
  .el-dialog{
    /*background: #eee;*/
  }
  .select-button{
    margin-top: 20px;
  }
  .detailLine{
    position: relative;
  }
  .definedLine{
    position: absolute;
    right: 0px;
  }
  .tableTop{
    position: absolute;
    margin-bottom: 50px;
  }
  .el-table td, .el-table th {
    height: 30px;
  }
  .detailTable{
    margin-top: 40px;
  }
  .qbutton{
    margin: 10px 0 5px;
    button {
      padding: 7px 15px;
      background-color: #fff;
      cursor: pointer;
    }
  }
  .query {
    // margin: 1px 0;
    margin-bottom: 15px;
    // .search {
    //   margin-left: 5px;
    //   button {
    //     // padding: 7px 15px;
    //     background-color: #fff;
    //     cursor: pointer;
    //   }
    // }
  }
  .el-dialog__header {
    padding: 10px 10px 0;
  }
  .el-dialog__body {
    padding: 10px 10px;
  }
</style>
