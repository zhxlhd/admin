<template>
  <div>
    <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
      <div slot="main">
        <el-row>
          <el-col :span="24">
            <el-table size="mini" highlight-current-row @row-click="rowClick" ref="table" :data="mate.mateList.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" max-height="200" style="width: 100%; margin-top:15px">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column v-for="(col,index) of mate.mateList.columns" v-bind:key="col.name+index" :formatter="col.formatter" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              </el-table-column>
              <el-table-column  fixed="right" label="操作" :width="actionWidth" v-if="mate.mateList.actions">
                <template slot-scope="scope">
                  <k-btn v-for="act of mate.mateList.actions" v-bind:key="act.action" size="mini" :act="act" :icon="act.icon" :row="scope.row"></k-btn>
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
      <el-table size="mini" v-if="showFlag" :data="mateListRows" border  class="tableTop">
        <el-table-column v-if="col.isShow" :formatter="col.formatter" v-for="col of mate.mateList.lineColumns" :key="col.id" :label="col.label" :prop="col.name" :min-width="col.width">
        </el-table-column>
      </el-table>
    </div>
  </template>
  </div>
</template>

<script>
import { API_GATEWAY } from '@/config/index.js'
import SearchForm from '../../components/SearchForm'
import { LANGS } from '../../i18n/lang'
import KBtn from '../../components/KBtn.vue'
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
    mate: Object
  },
  data () {
    return {
      pageSize: 5,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      multipleDialogSelection: [],
      langs: LANGS,
      hasSelected: false,
      searchValues: {},
      page: 0,
      sortValues: {},
      action: null,
      dialogTableVisible: false,          // dialog开关
      showFlag: false,                    // 下面表格的开关
      object: {},                          // 放columns
      rowId: {},             // 点击table前面的框框
      rowsContent: [],              // 获取到明细行中的数据
      lineSelected: [],               // 存放全部的label
      msgBoxButton: true,
      dialogDetailLine: false,
      dialogInvoice: false,
      qty: 0,
      mateLineListRowsData: {},
      dialogColumn: {},
      dialogGathering: false,           // 取消核销发票弹出框
      gatherings: [],                   // 取消核销发票条数
      mateListRows: []                  // 核销发票明细行
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
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },
  created () {
    let mateList = this.mate.mateList
    this.mateLineListRowsData = this.mate.mateLineList.rows
    this.mate.mateLineList.columns.map((i) => { this.dialogColumn[i.name] = i })
    this.formatterBefore(mateList.columns)
    this.formatterBefore(mateList.lineColumns)
    this.rowsContent = mateList.rows
    mateList.localName = this.mate.localName
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
  mounted () {
    this.rowSelect()
  },
  methods: {
    changeTrandeAmount (amount, trade) {
      if (trade > amount) {
        this.messageModel ('收款金额不能大于发票余额', 'warning')
      }
    },
    // 取消核销发票
    dialogSubmitGathering () {
      const vm = this
      const mate = {}
      mate.mateFormerHeader = this.multipleSelection[0]
      const id = this.multipleSelection[0].id
      mate.mateList = this.gatherings
      if (this.gatherings.length === 0) {
        this.messageModel ('请勾选需要取消的核销发票', 'warning')
        return
      }
      this.dialogGathering = false
      this.$root.ajaxData('/purchase/cancellation/payment/abolishInvoice/' + id, mate, function () {
        vm.$root.monitor({ url: '/purchase/invoice/paymented/all/list' })
        vm.mateListRows = []
      }, 'PUT')
    },
    updated () {
      this.showFlag = false
    },
    rowClick (row) {
      this.showFlag = true
      var vm = this
      this.$root.ajaxData(this.mate.mateList.url + '/' + row.id, {}, function (data) {
        vm.mateListRows = data
      }, 'GET')
    },
    back () {
      this.dialogTableVisible = false
    },
    messageModel (message, type) {
      this.$message({
        message: message,
        type: type
      })
    },
    handleButton (btn) {
      var vm = this
      let row = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      this.rowId = row
      if (btn.action === 'addDetailBill') {
        this.$emit('action', btn)
        return
      }
      if (btn.action === 'updataDetailBill') {
        const select = this.multipleSelection[0]
        if (select.state === '1') {
          this.messageModel ('该收款单已取消', 'warning')
          return
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {})
        return
      }
      if (btn.action === 'verificationCancel') {
        const vm = this
        const select = this.multipleSelection[0]
        if (select.state === '1') {
          this.messageModel ('该收款单已取消', 'warning')
          return
        }
        if (select.uncancAmount === 0) {
          this.messageModel ('该收款单核销已完成', 'warning')
          return
        }
        this.dialogInvoice = true
        this.$root.ajaxData('/purchase/invoice/payment/needPay?currency=' + select.currency + '&companyCode=' + select.companyCode, {}, function (data) {
          data.rows.map(i => {
            i.tradeAmount = null
          })
          vm.mateLineListRowsData = data.rows
        })
        return
      }
      if (btn.action === 'verificationCancelDbl') {
        const select = this.multipleSelection[0]
        if (select.state === '1') {
          this.messageModel ('该收款单已取消', 'warning')
          return
        }
        this.dialogGathering = true
        return
      }
      if (btn.action === 'updateStatus') {
        if (this.mateListRows.length !== 0) {
          this.messageModel ('存在核销发票，不能取消', 'warning')
          return
        }
      }
      this.$root.handleAction(btn, row, function () {
        vm.$root.monitor({ url: '/purchase/invoice/paymented/all/list' })
      })
    },
    rowSelect () {
      this.mate.mateList.rows.forEach(row => {
        let select = (row.id && this.mate.mateList.selected && this.mate.mateList.selected.findIndex(id => id == row.id) !== -1)
        this.$refs.table.toggleRowSelection(row, (select === true))
      })
    },
    handleSelectionChange (val) {
      this.$emit('actionSelected', val)
      this.multipleSelection = val
    },
    handleDialogSelectionChange (val) {
      this.multipleDialogSelection = val
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
      let mateList = this.mate.mateList
      if (data.mate.rows) {
        mateList.rows = data.mate.rows
        this.rowsContent = data.mate.rows
      }
      if (data.mate.total) {
        mateList.total = data.mate.total
      } else {
        mateList.total = 0
      }
      if (data.mate.selected) {
        mateList.selected = data.mate.selected
      }
      this.$nextTick(function () {
        this.rowSelect()
      })
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
    getEtagStyle (v) {
      if (v) {
        return 'success'
      }
      return 'gray'
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
  .buttonMargin {
    margin-top: 20px;
  }
</style>
