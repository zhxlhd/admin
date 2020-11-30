<template>
  <div>
    <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
      <span slot="search" class="leftMargin">
        <search-form v-if="mate.mateList.essearch" :essearch="mate.mateList.essearch" @essearch="todoEssearch"> </search-form>
        <Formor v-else-if="mate.mateList.search" :mate="mate.mateList.search" v-on:search="search" class="leftFloat" :word="word"></Formor>
      </span>
      <div slot="main">
        <el-row>
          <el-col :span="24">
            <el-table size="mini" highlight-current-row @row-click="rowClick" ref="table" :data="mate.mateList.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" max-height="200" style="width: 100%;">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column v-if="col.isShow" v-for="(col,index) of mate.mateList.columns" v-bind:key="col.name+index" :formatter="col.formatter" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              </el-table-column>
              <el-table-column  fixed="right" label="操作" :width="actionWidth" v-if="mate.mateList.actions">
                <template scope="scope">
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
            :page-size="pageSize">
        </el-pagination>
      </el-col>
      </el-row>
    </div>
  </Boxer>
  <!--下面的明细表格-->
  <template>
    <div class="detailLine">
      <el-table v-if="showFlag" :data="mate.mateList.lineRows" border  class="tableTop">
        <el-table-column v-if="col.isShow" :formatter="col.formatter" v-for="col of mate.mateList.lineColumns" :key="col.id" :label="col.label" :prop="col.name" :min-width="col.width">
        </el-table-column>
      </el-table>
    </div>
  </template>

    <el-dialog  :visible.sync="dialogFormVisible" size="tiny">
      <el-form>
      <el-form-item label="驳回原因">
          <el-input   v-model="cause"></el-input>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false; DialogClickOK()">确 定</el-button>
      </div>
    </el-dialog>

     <el-dialog title="查看详情" :visible.sync="dialogVisible"   width="80%" size="large" >
       <el-row>
      <el-row>
         <DialogForm :mate="mate.mateFormerHeader" formModel="dialog" ></DialogForm>
         </el-row>
         <el-row>
         <template>
          <el-table size="mini" :data="mate.mateList.lineRows" border style="width: 100%;" class="detailTable">
            <el-table-column :formatter="col.formatter" v-for="col of mate.mateList.lineColumns" :key="col.id" :label="col.label" :prop="col.name" :width="col.width">
          </el-table-column>
          </el-table>
         </template>
         </el-row>
       </el-row>
    </el-dialog>
  </div>
</template>

<script>
import SearchForm from '../../components/SearchForm'
import { LANGS } from '../../i18n/lang'
import KBtn from '../../components/KBtn.vue'
import { API_GATEWAY } from '@/config/index.js'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
const BASEAPI = `${API_GATEWAY}/api`
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    SearchForm,
    KBtn,
    Boxer,
    Formor: function index (resolve) {
      require(['../../components/Formor.vue'], resolve)
    },
    DialogForm: function index (resolve) {
      require(['../../components/DialogForm.vue'], resolve)
    }
  },
  props: {
    mate: Object,
    mateFormerHeaderId: String
  },
  data () {
    return {
      pageSize: 5,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      langs: LANGS,
      hasSelected: false,
      searchValues: {},
      page: 0,
      sortValues: {},
      action: null,
      dialogTableVisible: false,          // dialog开关
      tableData: [],
      word: this.$t('query'),
      showFlag: false,                    // 下面表格的开关
      object: {},                          // 放columns
      fit: false,
      dialogVisible: false,
      dialogFormVisible: false,
      valueStatus: '',
      dialogAuditVisible: false,
      dialogUpdateVisible: false,
      cause: '',
      auditStatus: '',
      rowsContent: [],              // 获取到明细行中的数据
      urlName: '',
      fileName: '',
      checkAll: false,
      checkedLabel: [],
      isIndeterminate: true,
      lineSelected: [],               // 存放全部的label
      lineSelectedDetail: [],         // 存放全部的明细行label
      msgBoxButton: true,
      dialogDetailLine: false
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.formatterBefore(this.mate.mateList.columns)
      this.formatterBefore(this.mate.mateList.lineColumns)
      this.rowsContent = this.mate.mateList.rows
      this.mate.mateList.localName = this.mate.localName
    }
  },
  created () {
    this.formatterBefore(this.mate.mateList.columns)
    this.formatterBefore(this.mate.mateList.lineColumns)
    this.rowsContent = this.mate.mateList.rows
    this.mate.mateList.localName = this.mate.localName
  },
  computed: {
    actionWidth: function () {
      return this.mate.mateList.actions.length * 60 + 30
    }
  },
  // 需要添加刷新消息
  methods: {
    confirm (act, row) {
      var vm = this
      if (act.action === 'addChild') {
        this.mate.mateFormerHeader.values = row
        this.dialogVisible = true
        return false
      }
    },
    rowClick (row) {
      this.showFlag = true
      var vm = this
      this.$root.ajaxData(this.mate.mateList.url + '/' + row.id, {}, function (data) {
        vm.mate.mateList.lineRows = data
      }, 'GET')
    },
    DialogClickOK () {
      var vm = this
      const rowt = { id: this.multipleSelection.map((r) => r.id) }
      this.$root.ajaxData(this.btn.url + 2 + '?ids=' + rowt.id + '&approvalComments=' + this.cause, {}, function (data) {
        vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
          vm.mate.mateList.rows = data.mate.mateList.rows
        }, 'GET')
      }, 'PUT')
      this.cause = ''
    },
    handleButton (btn) {
      var vm = this
      let row = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      // 请购单修改
      if (btn.action === 'editPurchase') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state === '3') {
            vm.$message({
              message: this.$t('alreadyAgree'),
              type: 'warning'
            })
            return
          }
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {})
        return
      }
      // 请购单提交审批
      if (btn.action === 'submitStatus') {
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state === '0') {
            this.$root.ajaxData(btn.url + '/' + 1 + '?ids=' + rowt.id, {}, function (data) {
              vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
                vm.mate.mateList.rows = data.mate.mateList.rows
              }, 'GET')
            }, 'PUT')
            return
          } else {
            vm.$message({
              message: this.$t('Already approve'),
              type: 'warning'
            })
            return
          }
        }
      }
      // 请购单状态审核
      if (btn.action === 'updateStatus') {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state === '3') {
            vm.$message({
              type: 'warning',
              message: vm.$t('examined') })
            return
          }
        }
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$root.ajaxData(btn.url + '/' + 3 + '?ids=' + rowt.id, {}, function (data) {
          vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
            vm.mate.mateList.rows = data.mate.mateList.rows
          }, 'GET')
        }, 'PUT')
        this.btn = btn
        return
      }
      // 请购单驳回
      if (btn.action === 'difStatus') {
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state === '2') {
            vm.$message({
              type: 'warning',
              message: '已驳回'
            })
            return false
          }
        }
        for (var j = 0; j < this.multipleSelection.length; j++) {
          if (this.multipleSelection[j].state === 102) {
            vm.$message({
              type: 'warning',
              message: '已审批，不能驳回'
            })
            return false
          }
        }
        this.dialogFormVisible = true
        this.btn = btn
        return
      }
      // 请购单删除
      if (btn.action === 'deletePurchase') {
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$http.delete(BASEAPI + '/purchase/reqPurchase/batchDelete' + '?ids=' + rowt.id)
          .then(response => {
            if (response.data.statusCode === 40015) {
              vm.$message({
                type: 'warning',
                message: '已审批不能删除'
              })
              return false
            } else {
              vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
                vm.mate.mateList.rows = data.mate.mateList.rows
              }, 'GET')
            }
          })
        return
      }
      // 请购单生成采购订单
      if (btn.action === 'addPur') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
       // this.$root.handleAction(btn, row, function () {})
        this.$http.get(BASEAPI + '/purchase/reqPurchase/genPurchaseOrder' + '/' + row.id)
          .then(response => {
            if (response.data.statusCode === 40013) {
              vm.$message({
                type: 'warning',
                message: vm.$t('No approval')
              })
              return false
            } else if (response.data.statusCode === 40014) {
              vm.$message({
                type: 'warning',
                message: vm.$t('inquiry')
              })
              return false
            } else if (response.data.statusCode === 40017) {
              vm.$message({
                type: 'warning',
                message: vm.$t('generated')
              })
              return false
            } else {
              vm.$message({
                type: 'success',
                message: vm.$t('Ocompleted')
              })
            }
          })
        return
      }
      // 采购退货修改     采购询价修改
      if (btn.action === 'updateInquiry') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {})
        return
      }
      // 采购退货生成出库单
      if (btn.action === 'createOutBoundBill') {
        const vm = this
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.ajaxData('/purchase/purchase/returns/checkExistOutboundBill/' + row.id, {}, function (data) {
          if (data.statusCode === 10002) {
            vm.$message({
              message: data.message,
              type: 'warning'
            })
            return
          } else {
            vm.$root.handleAction(btn, row, function () {})
          }
        }, 'GET')
        return
      }
      // 采购询价审批
      if (btn.action === 'shenpiInquiry') {
        for (i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].auditStatus === '1') {
            vm.$message({
              type: 'warning',
              message: vm.$t('Already approve')
            })
            return
          }
        }
        this.btn = btn
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$root.ajaxData(this.btn.url + 1 + '?ids=' + rowt.id, {}, function (data) {
          if (data.data !== null && data.data !== '') {
            vm.$message({
              type: 'warning',
              message: data.data + '没找到供应商'
            })
            return
          }
          vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
            vm.mate.mateList.rows = data.mate.mateList.rows
          }, 'GET')
        }, 'PUT')
        return
      }
      // 采购询价驳回
      if (btn.action === 'bohuiInquiry') {
        if (this.multipleSelection[0].status !== 'undefined') {
          this.auditStatus = this.multipleSelection[0].auditStatus             // 将需要改变的那一行的状态显示在弹出框上
        }
        this.btn = btn
        if (this.auditStatus === '1') {
          vm.$message({
            type: 'warning',
            message: vm.$t('noclose')
          })
          return false
        }
        this.dialogFormVisible = true
        this.btn = btn
        return
      }
      this.$root.handleAction(btn, row, function () {
        vm.getData()
      })
    },
    // table表格中勾选的选项，val是勾选的对象
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData('paging')
    },
    handleCurrentChange (val) {
      this.page = val
      this.getData('paging')
    },
    handleAction (act, row) {
      var vm = this
      this.$root.handleAction(act, row, function () {
        vm.getData()
      })
    },
    getData (flag) {
      let url = this.mate.mateList.dataApi
      let param = {
        search: this.searchValues,
        page: this.page,
        sort: this.sortValues
      }
      var vm = this
      if (flag && url.indexOf('?') === -1) {
        url += '-q?' + 'search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        param = null
      } else if (flag && url.indexOf('?') !== -1) {
        url += '&search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        param = null
      }
      this.$root.ajaxData(url, param, function (data) {
        vm.updateData(data)
      })
    },
    updateData (data) {
      if (data.mate.rows) {
        this.mate.mateList.rows = data.mate.rows
        // rowsContent用于判断波次批次管理中拣料出库动作是否可以进行
        this.rowsContent = data.mate.rows
      }
      if (data.mate.total) {
        this.mate.mateList.total = data.mate.total
      } else {
        this.mate.mateList.total = 0
      }
      if (data.mate.selected) {
        this.mate.mateList.selected = data.mate.selected
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
    search (data) {
      this.$emit('actionSearch', data)
      this.searchValues = data
      this.page = 0
    },
    todoEssearch (data) {
      this.searchValues = data
      const vm = this
      this.$root.ajaxData(this.mate.mateList.essearch.url, JSON.stringify(data), function (data) {
        vm.updateData(data)
      }, 'POST')
    },
    formatter (field) {
      return function (row, col) {
        if (field.switch) {
          return field.switch[row[col.property]]
        }
        return row[col.property]
      }
    },
    toUriParams (data) {
      return Object.keys(data).filter(i => !!data[i]).map(i => i + '=' + data[i]).join('&')
    }
  }
}
</script>

<style scoped>
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
    margin: 15px 20px 2px 0px;
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
  .el-dialog__header {
    padding: 10px 10px 0;
  }
  .el-dialog__body {
    padding: 10px 10px;
  }
</style>
