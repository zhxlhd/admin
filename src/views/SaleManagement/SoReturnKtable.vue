<template>
<div>
  
  <Boxer :mate="mate" :hasSelected="hasSelected" @action="handleButton" ref="Boxer">
    <span slot="search" class="leftMargin">
      <search-form v-if="mate.essearch" :essearch="mate.essearch" @essearch="todoEssearch"></search-form>
      <Formor v-else-if="mate.search" :mate="mate.search" v-on:search="search" class="leftFloat" :word="word"></Formor>
    </span>
    <div slot="main">
      <el-row>
        <el-col :span="24">
          <el-table size="mini" highlight-current-row ref="table" :data="mate.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;">
              <el-table-column type="selection" width="50" id="tableSel"></el-table-column>
              <el-table-column  :formatter="col.formatter" v-for="col of mate.columns" v-bind:key="col.name" :label="col.label" :prop="col.name" :width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="操作" :min-width="actionWidth" v-if="mate.actions">
                <template slot-scope="scope">
                  <k-btn v-for="act of mate.actions" v-bind:key="act.action" size="mini" :act="act" :icon="act.icon" :row="scope.row" @action="handleAction"></k-btn>
                </template>
              </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" class="page" >
      <el-col :span="12">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            layout="total,prev, pager, next, sizes"
            :total="mate.total"
            :page-sizes ="[5, 10, 15, 20, 50]"
            :page-size="pageSize">
        </el-pagination>
      </el-col>
      </el-row>
    </div>
  </Boxer>
  

</div>
</template>

<script>
import SearchForm from '../../components/SearchForm'
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import { API_GATEWAY } from '@/config/index.js'
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
    mateFormerHeaderId: String,
    KTableItemCode: String,
    mateFormSupplierId: String,
    mateFormOrgId: String
  },
  data () {
    return {
      pageSize: 5,
      currentPage: 1,
      multipleSelection: [],
      hasSelected: false,
      searchValues: {},
      page: 1,
      sortValues: {},
      action: null,
      dialogTableVisible: false,
      dialogPriceVisible: false,         // dialog开关
      tableData: [],
      word: '查 询',
      priceColumns: {},
      object: {},                          // 放columns
      mingxiRows: [],
      priceList: {},                      // 明细行获取的数据
      invyTagDlgVisible: false,
      invyTagmate: { startTagNo: '', stolabel: '起始标签号', incrementNumber: '', inlabel: '数字增量', numberOfTags: '', numlabel: '标签数量' },
      physicalInventoryId: 0,
      colModels: [],
      dialogFile: false,
      fileList: [],
      supplierId: '',
      fileimportUrl: API_GATEWAY + '/api/users/import',
      filedownloadUrl: API_GATEWAY + '/api/users/downloadFile',
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      }
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },
  created () {
    // this.getData()
    if (this.mate !== undefined && this.mate.dataApi !== undefined) {
      if (this.mate.dataApi.indexOf('/inventory/physical/snapshots/invyWatch/list') > -1 ||
        this.mate.dataApi.indexOf('/inventory/physical/snapshots/invyApprove/list') > -1 ||
        this.mate.dataApi.indexOf('/inventory/physical/snapshots/invyAdjust/list') > -1) {
        if (this.mate.rows !== undefined && this.mate.rows.length > 0) {
          this.physicalInventoryId = this.mate.rows[0].physicalInventoryId
        }
      }
    }
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
      this.getData('paging')
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
      let url = '/purchase/goodsPricing/line/getPurchaseOrder'
      if (this.mate.dataApi === '/inbound/bill/lines/list') {
        url = this.mate.dataApi + '/' + this.mateFormerHeaderId
      }
      let param = {
        search: this.searchValues,
        page: this.page,
        sort: this.sortValues
      }

      var vm = this
      if (flag === 'search') {
        url += '-q?param=' + this.mate.search.values.name
        this.$root.ajaxData(url, param, function (data) {
          vm.updateData(data)
        })
        // 不用return，会有两次调用这个函数
        return true
      }
      if (flag === 'paging') {
        // url += '-q?' + (this.toUriParams(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page
        url += '-q?supplierId=' + this.mateFormSupplierId + '&orgId=' + this.mateFormOrgId + '&search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        param = null
      }
      this.$root.ajaxData(url, param, function (data) {
        vm.updateData(data)
      })
    },
    updateData (data) {
      if (data.mate.rows) {
        this.mate.rows = data.mate.rows
      }
      // 获取到包括元数据的所有数据，因为数据量太大，上面只获取到明细行的元数据和数据
      // if (data.mate.mateList.rows) {
      //   this.mate.rows = data.mate.mateList.rows
      // }
      if (data.mate.total) {
        this.mate.total = data.mate.total
      } else {
        this.mate.total = 0
      }
      if (data.mate.selected) {
        this.mate.selected = data.mate.selected
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
    formatterBefore () {
      this.mate.columns.filter(col => col.dict !== undefined).forEach(function (col, i) {
        let dictType = col.dict
        if (dictType.indexOf('.') > -1) {
          dictType = dictType.split('.')[1]
        }
        col.formatter = function (row, column) {
          return DictStore.formatDict(dictType, row[column.property])
        }
      })
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
