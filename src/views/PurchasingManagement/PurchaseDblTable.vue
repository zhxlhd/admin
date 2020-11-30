<!-- 采购退货 -->
<template>
  <div>
    <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
     <span slot="searchForm" class="leftMargin">
      <el-button  size="mini" type="primary" class="el-icon-search" @click="showSearchPopover">搜索</el-button>
    </span>
      <div slot="main">
        <div class="query">
          <multiple-query :mate="mate" :inline="mate.inline" v-if="mate.mateSearch" v-show="showAdvancedSearchPopover" @queryData="queryData"></multiple-query>
        </div>
        <el-row>
          <el-col :span="24">
            <el-table size="mini" highlight-current-row @row-click="rowClick" ref="table" :data="mate.mateList.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" max-height="250" style="width: 100%;">
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
            :page-size="pageSize">
        </el-pagination>
      </el-col>
      </el-row>
    </div>
  </Boxer>
  <!--下面的明细表格-->
  <template>
    <div class="detailLine">
      <div class="definedLine">
      </div>
      <el-table size="mini" v-if="showFlag" :data="mate.mateList.lineRows" border  class="tableTop">
        <el-table-column v-if="col.isShow" :formatter="col.formatter" v-for="col of mate.mateList.lineColumns" :key="col.id" :label="col.label" :prop="col.name" :min-width="col.width">
        </el-table-column>
      </el-table>
    </div>
  </template>

    <el-dialog  :visible.sync="dialogFormVisible" width="30%">
      <el-form>
      <el-form-item label="驳回原因">
          <el-input   v-model="cause"></el-input>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false; DialogClickOK()">确 定</el-button>
      </div>
    </el-dialog>

     <el-dialog title="查看详情" :visible.sync="dialogVisible"   width="80%" >
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
import { LANGS } from '../../i18n/lang'
import KBtn from '../../components/KBtn.vue'
import { API_GATEWAY } from '@/config/index.js'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import MultipleQuery from '@/components/query/MultipleQueryForm'
import QueryMixins from '../../mixins/QueryMixins'

const BASEAPI = `${API_GATEWAY}/api`
export default {
  mixins: [ColumnFormatterMixin, QueryMixins],
  components: {
    KBtn,
    Boxer,
    MultipleQuery,
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
      showAdvancedSearchPopover: false,
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
    this.mate.mateSearch.fields.map((i) => { this.object[i.name] = i })
    this.titleOptions = this.mate.mateSearch.fields[0].options
    this.operatorOptions = this.mate.mateSearch.fields[1].options
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
    query () {
      this.mate.mateList.lineRows = null
      const mate = [this.mate.mateSearch.values]
      const vm = this
      const url = this.mate.mateSearch.url
      this.$root.ajaxData(url, mate, function (data) {
        vm.mate.mateList.rows = data.mate.rows
        vm.mate.mateList.total = data.mate.total
      }, 'POST')
    },
    showSearchPopover () {
      this.showAdvancedSearchPopover = !this.showAdvancedSearchPopover
    },
    handleChange () {
    },
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
      const vm = this
      let row = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      // 采购退货生成出库单
      if (btn.action === 'createOutBoundBill') {
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
      if (btn.action === 'updateInquiry') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        vm.$root.handleAction(btn, row, function () {})
        return
      }
      this.$root.handleAction(btn, row, function () {
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

<style scoped lang="scss">
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
    right: 10px;
    button {
      padding: 7px 15px;
      background-color: #fff;
      cursor: pointer;
    }
  }
  .tableTop{
    position: absolute;
    margin-top: 50px;
  }
  .el-table td, .el-table th {
    height: 30px;
  }
  .detailTable{
    margin-top: 40px;
  }
  .query {
    // margin: 1px 0;
    margin-bottom: 15px;
    .search {
      margin-left: 5px;
      button {
        padding: 7px 15px;
        background-color: #fff;
        cursor: pointer;
      }
    }
  }
  .el-dialog__header {
    padding: 10px 10px 0;
  }
  .el-dialog__body {
    padding: 10px 10px;
  }
</style>
