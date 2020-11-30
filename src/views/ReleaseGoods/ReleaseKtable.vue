<template>
<div>
  
  <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
    <span slot="search" class="leftMargin">
      <search-form v-if="mate.mateList.essearch" :essearch="mate.mateList.essearch" @essearch="todoEssearch"></search-form>
      <Formor v-else-if="mate.mateList.search" :mate="mate.mateList.search" v-on:search="search" class="leftFloat" :word="word"></Formor>
    </span>
    <div slot="main">
      <el-row>
        <el-col :span="24">
          <el-table highlight-current-row ref="table" :data="mate.mateList.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;">
              <el-table-column type="selection" width="50" id="tableSel"></el-table-column>
              <el-table-column v-if="col.isShow" :formatter="col.formatter" v-for="col of mate.mateList.columns" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="操作" fixed="right" :min-width="actionWidth" v-if="mate.mateList.actions">
                <template slot-scope="scope">
                  <k-btn v-for="act of mate.mateList.actions" v-bind:key="act.action" size="mini" :act="act" :icon="act.icon" :row="scope.row" @action="handleAction"></k-btn>
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
            :current-page.sync="mate.mateList.page"
            layout="total,prev, pager, next, sizes"
            :total="mate.mateList.total"
            :page-sizes ="[5, 10, 15, 20, 50]"
            :page-size="pageSize">
        </el-pagination>
      </el-col>
      </el-row>
    </div>
  </Boxer>
      <el-dialog title="查看详情" :visible.sync="dialogVisible"   width="80%"  >
      <el-row>
         <ReleaseGoods :mate="mate" formModel="dialog" :showDetial="showDetial" :showValue = "showValue"></ReleaseGoods>
      </el-row>
    </el-dialog>
</div>
</template>

<script scoped>
// import { REPORT_SERVER_URL } from '@/config/index.js'
import SearchForm from '../../components/SearchForm'
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
// import { API_GATEWAY } from '@/config/index.js'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    SearchForm,
    KBtn,
    Boxer,
    Formor: function index (resolve) {
      require(['../../components/Formor.vue'], resolve)
    },
    ReleaseGoods: function index (resolve) {
      require(['./ReleaseGoods.vue'], resolve)
    }
  },
  props: {
    mate: Object,
    mateFormerHeaderId: String,
    KTableItemCode: String
  },
  data () {
    return {
      pageSize: 10,
      multipleSelection: [],
      hasSelected: false,
      dialogVisible: false,
      searchValues: {},
      page: 0,
      sortValues: {},
      action: null,
      showDetial: '',
      dialogTableVisible: false,         // dialog开关
      tableData: [],
      word: '查 询',
      object: {},                          // 放columns
      mingxiRows: [],                      // 明细行获取的数据
      physicalInventoryId: 0,
      colModels: [],
      dialogFile: false,
      fileList: [],
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      },
      checkAll: false,
      checkedLabel: [],
      isIndeterminate: true,
      lineSelected: [],               // 存放全部的label
      lineSelectedDetail: [],         // 存放全部的明细行label
      msgBoxButton: true,
      dialogDetailLine: false,
      showValue: {}
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.formatterBefore(this.mate.mateList.columns)
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },
  created () {
    // this.getData()
    this.formatterBefore(this.mate.mateList.columns)
  },
  computed: {
    actionWidth: function () {
      return this.mate.mateList.actions.length * 60 + 30
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
    back () {
      this.dialogTableVisible = false
    },
    handleButton (btn) {
      var vm = this
      // 在采购模块中加了一个btn.edit
      let row = (btn.isApi || btn.ajax || btn.edit) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      if (btn.action === 'updataBill') {
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
      if (btn.action === 'stop') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.ajaxData('/purchase/th/goods/updateStatus/' + row.id + '/2', {}, function (data) {
          vm.$root.monitor({ url: '/purchase/th/goods/all/list' })
        }, 'PUT')
        return
      }
      this.$root.handleAction(btn, row, function () {
        vm.getData()
      })
    },
    rowSelect () {
      if (this.mate.rows) {
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
      var vm = this
      // 在采购模块中的分段价格
      if (act.actionEmit === 'actionEmit') {
        this.$emit('handleAction', act, row)
        return true
      } else if (act.action === 'edit') {
        this.$root.monitor({ url: act.url + row.id })
        return
      } else if (act.action === 'seeDetail') {
        this.showDetial = row.id.toString()
        this.dialogVisible = true
      } else {
        this.$root.handleAction(act, row, function () {
          vm.getData()
        })
      }
    },
    getData (flag) {
      let url = this.mate.dataApi
      // 入库管理中，添加明细表单，删除刷新，需要带表头的id
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
      if (flag && url.indexOf('?') === -1) {
        if (url === '/sys/seqno/list') {
          url += '?search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        } else {
        // url += '-q?' + (this.toUriParams(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page
          url += '-q?' + 'search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
          if (this.physicalInventoryId !== 0) {
            url += '&physicalInventoryId=' + this.physicalInventoryId
          }
        }
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
    },
    backwardUser () {
      this.$root.monitor({ url: '/users/list' })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },

    importfile () {
      this.$root.monitor({ url: '/users/import' })
    },
    submitUpload () {
      this.$refs.upload.submit()
      const vm = this
      setTimeout(function () {
        vm.$root.monitor({ url: '/users/list' })
      }, 1000)
    },
    handleRemove (file, fileList) {
    },
    handlePreview (file) {
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
