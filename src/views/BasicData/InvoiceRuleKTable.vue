<template>
  <div>
    <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
      <span slot="searchForm" class="leftMargin">
        <el-button  size="mini" type="primary" v-if="mate.mateSearch" class="el-icon-search" @click="showSearchPopover">搜索</el-button>
      </span>
      <div slot="main">
      <div class="query">
        <el-row :gutter="20" v-show="showAdvancedSearchPopover">
          <el-form :model="mate.mateSearch.values" :inline="mate.inline">
            <el-col :sm="6" :md="4" :lg="4">
              <el-select clearable v-model="mate.mateSearch.values['name']" size="mini">
                <el-option :label="item.label" :value="item.value" v-for="item of titleOptions" :key="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :sm="6" :md="4" :lg="4">
              <el-select clearable v-model="mate.mateSearch.values['operator']" size="mini">
                <el-option :label="item.label" :value="item.value" v-for="item of operatorOptions" :key="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :sm="6" :md="4" :lg="4">
              <el-input clearable v-model="mate.mateSearch.values['value']" size="mini"></el-input>
            </el-col>
            <el-col :sm="6" :md="4" :lg="4">
              <div class="search">
                <el-button @click="query" size="mini">查询</el-button>
              </div>
            </el-col>
          </el-form>
        </el-row>
      </div>
        <el-row>
          <el-col :span="24">
            <el-table size="mini" highlight-current-row ref="table" :data="mate.mateList.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;">
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

     <el-dialog title="查看详情" :visible.sync="dialogVisible" width="80%" >
       <el-row>
         <el-row>
             <InvoiceRuleForm :showFlag="true" :rowId="rowId" :mate="mate.mateFormerHeader" ref="InvoiceRuleForm"></InvoiceRuleForm>
         </el-row>
       </el-row>
    </el-dialog>

  </div>
</template>

<script>
import Vue from 'vue'
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
    },
    InvoiceRuleForm: function index (resolve) {
      require(['../../components/InvoiceRuleForm.vue'], resolve)
    }
  },
  props: {
    mate: Object,
    mateFormerHeaderId: String
  },
  data () {
    return {
      titleOptions: [],
      showAdvancedSearchPopover: false,
      pageSize: 15,
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
      rowId: '',             // 点击table前面的框框
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
      this.titleOptions = this.mate.mateSearch.fields[0].options
      this.operatorOptions = this.mate.mateSearch.fields[1].options

      this.formatterBefore(this.mate.mateList.columns)
      this.formatterBefore(this.mate.mateList.lineColumns)
      this.rowsContent = this.mate.mateList.rows
      // Vue.set(this.mate.mateList, 'localName', this.mate.localName)
      this.mate.mateList.localName = this.mate.localName
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },
  created () {
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
  // 需要添加刷新消息
  methods: {
    query () {
      const mate = [this.mate.mateSearch.values]
      this.searchValues = mate
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
    confirm (act, row) {
      this.mate.mateFormerHeader.values = row
      this.rowId = row.id
      this.dialogVisible = true
      return false

    },
    updated () {
      this.showFlag = false
    },
    back () {
      this.dialogTableVisible = false
    },
    handleButton (btn) {
      var vm = this
      const row = { id: this.multipleSelection.map((r) => r.id) }
      let ids = row.id
      ids = ids.join()
      // 开票规则修改
      if (btn.action === 'editInvoiceRule') {
        if(this.multipleSelection.length>1){
          this.$message({
              teyp: 'warning',
              message: '至多选择一条修改！'
          });
          return;
        }
        if (this.multipleSelection[0].state === '1') {
          this.$message({
            teyp: 'warning',
            message: '该发票已经确定，不能再修改'
          });
          return;
        }
      }

      // 开票规则删除
      // if (btn.action === 'deleteInvoiceRule') {
      //   const rowt = { id: this.multipleSelection.map((r) => r.id) }
      //   this.$http.delete(BASEAPI + '/tms/invoicerule/batch/del' + '?ids=' + rowt.id)
      //     .then(response => {
      //       if (response.data.statusCode !== 200) {
      //         vm.$message({
      //           type: 'warning',
      //           message: '删除失败'
      //         })
      //         return
      //       } else {
      //         vm.$message({
      //           type: 'success',
      //           message: '删除成功'
      //         })
      //         vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
      //           vm.mate.mateList.rows = data.mate.mateList.rows
      //         }, 'GET')
      //       }
      //     })
      //   return
      // }

      if (btn.action === 'deleteInvoiceRule') {
        this.$confirm(btn.confirm.msg, this.$t('toast.prompt'), {
          confirmButtonText: btn.confirm.confirmButtonText,
          cancelButtonText: btn.confirm.cancelButtonText,
          type: 'warning'
        }).then(() => {
          vm.$root.ajaxData(btn.url, row.id, function () {
            vm.$root.monitor({ url: '/tms/invoicerule/all/list' })
            vm.$message({
              type: 'info',
              message: '删除成功'
            })
          }, 'POST')
        }).catch(() => {
          vm.$message({
            type: 'info',
            message: this.$t('toast.canceled')
          })
        })
        return;
      }

      this.$root.handleAction(btn, row, function () {
        vm.getData()
      })
    },
    rowSelect () {
      this.mate.mateList.rows.forEach(row => {
        /* eslint-disable */
        let select = (row.id && this.mate.mateList.selected && this.mate.mateList.selected.findIndex(id => id == row.id) !== -1)
        /* eslint-enable */
        this.$refs.table.toggleRowSelection(row, (select === true))
      })
      // this.mate.selected = [];
    },
    // table表格中勾选的选项，val是勾选的对象
    handleSelectionChange (val) {
      this.$emit('actionSelected', val)
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
      // 入库管理中，添加明细表单，删除刷新，需要带表头的id
      // if (this.mate.dataApi === '/inbound/bill/lines/list') {
      //   url = this.mate.dataApi + '/' + this.mateFormerHeaderId
      // }
      let param = {
        search: this.searchValues,
        page: this.page,
        sort: this.sortValues
      }
      var vm = this
      if (flag && url.indexOf('?') === -1) {
        // url += '-q?' + (this.toUriParams(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page
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
      // 获取到包括元数据的所有数据，因为数据量太大，上面只获取到明细行的元数据和数据
      // if (data.mate.mateList.rows) {
      //   this.mate.rows = data.mate.mateList.rows
      // }
      if (data.mate.total) {
        this.mate.mateList.total = data.mate.total
      } else {
        this.mate.mateList.total = 0
      }
      if (data.mate.selected) {
        this.mate.mateList.selected = data.mate.selected
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
      // this.getData('search')
    },
    todoEssearch (data) {
      // this.$emit('essearch', data)
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
</style>
