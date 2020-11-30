<template>
<div>
  
  <Boxer :mate="mate" :hasSelected="hasSelected" @action="handleButton" ref="Boxer">
    <div slot="main">
      <el-row>
        <el-col :span="24">
          <el-table size="mini" max-height="250" highlight-current-row ref="table" :data="mate.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;">
              <el-table-column type="selection" width="50" id="tableSel"></el-table-column>
              <el-table-column  v-if="col.isAdd" :formatter="col.formatter" v-for="col of mate.columns" v-bind:key="col.name" :label="col.label" :prop="col.name" :width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!-- <el-row type="flex" justify="center" class="page" >
      <el-col :span="12">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="mate.page"
            layout="prev, pager, next,total"
            :total="mate.total"
            :page-size="pageSize">
        </el-pagination>
      </el-col>
      </el-row> -->
    </div>
  </Boxer>
  

</div>
</template>

<script>
import SearchForm from '../SearchForm.vue'
import KBtn from '../KBtn.vue'
import Boxer from '../Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    SearchForm,
    KBtn,
    Boxer,
    Formor: function index (resolve) {
      require(['../Formor.vue'], resolve)
    }
  },
  props: {
    mate: Object,
    transferType: String
  },
  data () {
    return {
      pageSize: 5,
      currentPage: '',
      multipleSelection: [],
      hasSelected: false,
      searchValues: {},
      page: 0,
      sortValues: {},
      action: null,
      dialogTableVisible: false,
      dialogPriceVisible: false,         // dialog开关
      tableData: [],
      word: '查 询',
      priceColumns: {},
      object: {}                        // 放column
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.formatterBefore(this.mate.columns)
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },
  created () {
    // this.getData()
    this.formatterBefore(this.mate.columns)
  },
  computed: {
    actionWidth: function () {
      return this.mate.actions.length * 60 + 30
    }
  },
  mounted () {
    this.rowSelect()
  },
  // 需要添加刷新消息
  methods: {
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    handleButton (btn) {
      if (btn.action === 'addLine') {
        this.$emit('action', btn)
        return
      }
      if (btn.action === 'deleteLine') {
        this.$emit('action', btn)
        return
      }
    },
    rowSelect () {
      if (this.mate.rows !== undefined) {
        this.mate.rows.forEach(row => {
          /* eslint-disable */
          let select = (row.id && this.mate.selected && this.mate.selected.findIndex(id => id == row.id) !== -1)
          /* eslint-enable */
          this.$refs.table.toggleRowSelection(row, (select === true))
        })
      }
      // this.mate.selected = [];
    },
    // table表格中勾选的选项，val是勾选的对象
    handleSelectionChange (val) {
      this.$emit('actionSelected', val)
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData('daging')
    },
    handleCurrentChange (val) {
      this.page = val
      this.getData('paging')
    },
    handleAction (act, row) {
      if (act.action === 'addPrice') {
        this.dialogPriceVisible = true
        this.mate.rows.priceList = row.priceList
        return false
      }
    },
    getData (flag) {
      let url

      // 入库管理中，添加明细表单，删除刷新，需要带表头的id
      if (this.mate.dataApi === '/purchase/recon/pre/list') {
        url = '/purchase/recon/addReconLine?supplierName=' + this.mateFormerSupplierName + '&currency=' + this.mateFormerCurrency
      }
      if (this.mate.dataApi === '/purchase/recon/getUnSettlementRecon') {
        url = '/purchase/recon/getUnSettlementRecon?reconCode=' + this.mateFormerReconCode
      }
      let param = {
        search: this.searchValues,
        page: this.page,
        sort: this.sortValues
      }
      var vm = this
      if (this.transferType === 0) {
        url = '/purchase/tms/invoice/all/list?pageSize=' + this.pageSize + '&pageNum=' + this.page + '&itemType=0&transferType=0'
      } else {
        url = '/purchase/tms/invoice/all/list?pageSize=' + this.pageSize + '&pageNum=' + this.page + '&itemType=0&transferType=1'
      }
      this.$root.ajaxData(url, param, function (data) {
        vm.updateData(data)
      })
    },
    updateData (data) {
      if (data.mate.mateList.rows) {
        this.mate.rows = data.mate.mateList.rows
      }
      if (data.mate.mateList.total) {
        this.mate.total = data.mate.mateList.total
      } else {
        this.mate.total = 0
      }
      if (data.mate.mateList.selected) {
        this.mate.selected = data.mate.mateList.selected
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
      this.getData('search')
    },
    todoEssearch (data) {
      // this.$emit('essearch', data)
      this.searchValues = data
      const vm = this
      var url = vm.mate.essearch.url
      this.$root.ajaxData(url, JSON.stringify(data), function (data) {
        vm.updateData(data)
      }, 'POST')
    },
    getEtagStyle (v) {
      if (v) {
        return 'success'
      }
      return 'gray'
    },
    toUriParams (data) {
      return Object.keys(data).filter(i => !!data[i]).map(i => i + '=' + data[i]).join('&')
    },
    backwardUser () {
      this.$root.monitor({ url: '/users/list' })
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
    display:inline-block;
  }
  .leftFloat div{
    display:inline-block;
    width:250px;
    height:38px;
    margin:0px 15px 0 0;
  }
  .button{
    margin-top:10px;
  }
  .el-form-item {
    margin: 22px 20px 2px 0; 
  }
  .invyTagbtn{
    margin-top:20px;
  }
  .el-table td, .el-table th {
    height: 30px;
  }
</style>
