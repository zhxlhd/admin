/**
 * 对账开票-融资方-融资申请列表
 */
<template>
  <div>
    <div class="query" >
      <el-row :gutter="20">
        <el-form :model="formSearch" :inline="mate.inline" size="mini">
          <el-col :sm="5" :md="3" :lg="3">
            <el-form-item>
              <el-select v-model="formSearch.applyCompanyName" placeholder="请选择申请公司" clearable :disabled="showDisabled">
                <el-option
                  v-for="item in applyCompanyNames"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>   
          <el-col :sm="5" :md="3" :lg="3">
            <el-form-item>
              <dict-selected v-model="formSearch.state" dictType="financingState" :initValue="formSearch.state" placeholder="请选择状态"></dict-selected>
            </el-form-item>
          </el-col>      
          <el-col :sm="5" :md="4" :lg="4">
            <el-form-item>
              <el-button @click="query()" size="mini">查找</el-button>
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
            :current-page.sync="mate.mateList.page"
            layout="total, prev, pager, next, sizes"
            :total="mate.mateList.total"
            :page-sizes ="[5,10,15,20,30]"
            :page-size="size">
        </el-pagination>
      </el-col>
      </el-row>
    </div>
  </Boxer>
   <el-dialog title="选择审批人" :visible.sync="dialogTableVisible"   width="400px" class="personDialog">
     <el-form>
       <el-form-item label="审批人" prop="aduitPerson" label-position='right'>
          <el-select  size="mini" v-model="aduitform.aduitPerson"  filterable>
            <el-option :label="item.label" :value="item.value" v-for="item of userOptions" :key="item.id" ></el-option>
          </el-select>
       </el-form-item>
     </el-form>
     <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="confirmDialog" type="primary">确定</el-button>
      <el-button size="mini" @click="cancelDialog">取消</el-button>
     </span>
    </el-dialog>
    <el-dialog title="审批流程" :visible.sync="aduitVisible"   width="800px" >
      <el-table size="mini" :data="processlist" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="用户名" prop="operationUserId"></el-table-column>
        <el-table-column align="center" label="操作人"  prop="operationUserName"></el-table-column>
        <el-table-column align="center" label="流程节点" prop="processType"></el-table-column>
        <el-table-column align="center" label="操作时间"  prop="updateString"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelLineDialog">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { DateFormat } from '../../utils/util.js'
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import KBtn from '../../components/KBtn.vue'
import { API_GATEWAY, tradeHallUrl } from '@/config/index.js'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import { type } from 'os';
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
      return this.mate.mateList.actions.length * 60 + 60
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
      dialogTableVisible: false,
      aduitVisible: false,
      rejectFlag:true,
      processlist: [],
      dialogValue: [],
      userOptions: [],
      aduitform: {
        aduitPerson: ''
      },
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
        financeCompanyName: '',
        financeMethod: '',
        status: ''
      },
      applyCompanyNames: [],
      rowId: ''
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
    this._getCompanyName()
  },
  methods: {
    // 查询
    query() {
      this.allowSearch = true;
      this.getData('paging');
    },
    // 确认审批人弹出框
    confirmDialog(){
      var vm = this
      if(this.aduitform.aduitPerson){
        this.dialogTableVisible = false
        this.$root.ajaxData(`/purchase/finance/editStatus/${this.rowId}?status=2&userId=${this.aduitform.aduitPerson}`, {},function (data) {
          vm.$root.monitor({ url: '/purchase/finance/applyList?isSupply=1', method: 'GET' })
        }, 'PUT')
      } else {
         this.$message({
            type: 'warning',
            message: '请选择审批人'
          })
          return
      }
    },
    // 取消审批人弹出框
    cancelDialog(){
      this.dialogTableVisible = false
    },
    // 流程关闭弹出框
    cancelLineDialog(){
      this.aduitVisible = false
    },
    // 获取申请公司
    _getCompanyName () {
      var vm = this
      vm.applyCompanyNames = []
      this.$root.ajaxData('/purchase/finance/findCompany', {}, function (data) {
        for(let i = 0; i < data.length; i++) {
           vm.applyCompanyNames.push({ label: data[i].applyCompanyName, value: data[i].applyCompanyName, key: data[i].id })
        }
      }, 'GET')
    },

    // 界面按钮功能
    handleButton (btn) {
      
      let vm = this
      let url = this.mate.mateList.dataApi
      let row = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      const rowt = this.multipleSelection.map((r) => r.id)
      const rowState = this.multipleSelection[0].status
      const financeMethod = this.multipleSelection[0].financeMethod
      const processStatusCode = this.multipleSelection[0].processStatusCode
      // 融资申请列表通过
      if (btn.action === 'passFinance') {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '只能勾选一条数据'
          })
          return
        }
        if (rowState !== '1') {
          this.$message({
            type: 'warning',
            message: '只有待审批状态允许通过'
          })
        } else {
          if(financeMethod === '3'&&processStatusCode!="05") {
             this.rowId = rowt
             
             this.userOptions = []
             this.aduitform.aduitPerson = ''
             //校验
             this.$root.ajaxData(`/purchase/finance/checkUser/${rowt}`, {},function (data) {
               if(data.code==='error'){
                 return false;
               }
                 vm.dialogTableVisible = true
            }, 'PUT')

             this.$root.ajaxData('/users/getUserDropdownList', {}, function (data) {
              data.forEach(i => {
                vm.userOptions.push({ 'label': (i.firstname+i.lastname), 'value': i.id })
            })}, 'GET')


            
          } else {
             this.$root.ajaxData(`/purchase/finance/editStatus/${rowt}?status=2`, {},function (data) {
              vm.$root.monitor({ url: '/purchase/finance/applyList?isSupply=1', method: 'GET' })
            }, 'PUT')
          }
        }
        return
      }
      // 融资申请列表驳回
      if (btn.action === 'discardFinance') {
        vm.rejectFlag=true;
        if(this.multipleSelection[0].processStatusCode==='30'&&financeMethod === '3'){
                    this.$message({
            type: 'warning',
            message: '审批通过不能驳回'
          })
          return
        }
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '只能勾选一条数据'
          })
          return
        }
        if (rowState !== '1') {
          this.$message({
            type: 'warning',
            message: '只有待审批状态允许驳回'
          })
        } else {
        if(financeMethod === '3') {
             //校验
             this.$root.ajaxData(`/purchase/finance/checkUser/${rowt}`, {},function (data) {
               if(data.code==='error'){
          vm.rejectFlag=false;
                 vm.aduitVisible=false;
                 return false;
               }else{
          vm.$prompt('请输入驳回意见', '提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            vm.$root.ajaxData(`/purchase/finance/editStatus/${rowt}?status=3&rejected=`+value, {},function (data) {
              if (data.statusCode === 200) {
                vm.$root.monitor({ url: '/purchase/finance/applyList?isSupply=1', method: 'GET' })
              }
            }, 'PUT')
          }).catch(() => {
            vm.$message({
              type: 'info',
              message: '已取消驳回'
            })
          })
       

          return  true;

               }

            }, 'PUT')
        }else
        {
          this.$prompt('请输入驳回意见', '提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            this.$root.ajaxData(`/purchase/finance/editStatus/${rowt}?status=3&rejected=`+value, {},function (data) {
              if (data.statusCode === 200) {
                vm.$root.monitor({ url: '/purchase/finance/applyList?isSupply=1', method: 'GET' })
              }
            }, 'PUT')
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消驳回'
            })
          })
        }

        }
        return
      }

      // 融资申请列表拒绝
      if (btn.action === 'rejectFinance') {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '只能勾选一条数据'
          })
          return
        }
        if (rowState !== '1') {
          this.$message({
            type: 'warning',
            message: '只有待审批状态允许拒绝'
          })
        } else {
          this.$confirm('确定将此融资申请数据拒绝, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$root.ajaxData(`/purchase/finance/editStatus/${rowt}?status=4`, {},function (data) {
              if (data.statusCode === 200) {
                vm.$root.monitor({ url: '/purchase/finance/applyList?isSupply=1', method: 'GET' })
              }
            }, 'PUT')
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消拒绝'
            })
          })
        }
        return
      }
      this.$root.handleAction(btn, row, function () {
        vm.getData()
      })
    },

    // 列表操作按钮
    confirm (act, row) {
      var vm = this
      // 查看
      if (act.action === 'checkFinance') {
        this.$root.monitor({url: act.url + row.id + '?isEdit=0' + '&isSupply=1'})
        return
      }
      // 审批流程
      if (act.action === 'aduitLine') {
        this.aduitVisible = true
        this.$root.ajaxData(`/purchase/finance/queryProcess/${row.id}`, {},function (data) {
          vm.processlist = data.mate.mateList
        }, 'POST')
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
      let url = `/purchase/finance/simpleSearch?pageNum=${this.page}&pageSize=${this.size}`; // 分页、搜索查询接口
      let vm = this;
      // 查询
      if (this.allowSearch && !this.changePage) {
        // 查询参数
         const params = {
          'applyCompanyName' : this.formSearch.applyCompanyName || '',
          'status' : this.formSearch.state || '',
        }
        this.$root.ajaxData(url, params, function (data) {
          vm.mate.mateList.rows = data.mate.mateList.rows;
          vm.mate.mateList.total = data.mate.mateList.total;
        }, 'POST')
        return;
      }
      // 查询获取、分页
      if (this.allowSearch && this.changePage) {
        // 查询参数
        const params = {
          'applyCompanyName' : this.formSearch.applyCompanyName || '',
          'status' : this.formSearch.state || '',
          'pageNum': this.page,
          'pageSize': this.size,
        }
        this.$root.ajaxData(url, params, function (data) {
          vm.mate.mateList.rows = data.mate.mateList.rows;
          vm.mate.mateList.total = data.mate.mateList.total;
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
      if (data.mate.mateList.rows) {
        this.mate.mateList.rows = data.mate.mateList.rows
        // rowsContent用于判断波次批次管理中拣料出库动作是否可以进行
        this.rowsContent = data.mate.mateList.rows
      }
      // 获取到包括元数据的所有数据，因为数据量太大，上面只获取到明细行的元数据和数据
      // if (data.mate.mateList.rows) {
      //   this.mate.rows = data.mate.mateList.rows
      // }
      if (data.mate.mateList.total) {
        this.total = data.mate.mateList.total
      } else {
        this.total = 0
      }
      // if (data.data.mate.selected) {
      //   this.mate.mateList.selected = data.data.mate.selected
      // }
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
<style lang="scss">
.personDialog{
  .el-dialog__body {
    padding: 5px 30px;
  }
}
</style>
