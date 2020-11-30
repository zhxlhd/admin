<!-- 角色管理 -->
<template>
  <div>
    <Boxer :mate="mate" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
      <div slot="main">
        <el-row>
          <el-col :span="24">
            <el-table size="mini" max-height="500" highlight-current-row ref="table" :data="mate.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;">
                <el-table-column type="selection" width="50" id="tableSel"></el-table-column>
                <template v-for="(col, index) of mate.columns" >
                  <el-table-column v-if="col.isShow" :formatter="col.formatter" :key="index" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip></el-table-column>
                </template>
                <el-table-column label="操作" fixed="right" :min-width="actionWidth" v-if="mate.actions">
                  <template slot-scope="scope">
                    <k-btn v-for="(act, index) of mate.actions" :key="index" size="mini" :act="act" :row="scope.row" @action="handleAction"></k-btn>
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
            :current-page.sync="mate.page"
            layout="total,prev, pager, next, sizes"
            :total="mate.total"
            :page-sizes ="[5, 10, 15, 20, 50]"
            :page-size="pageSize">
          </el-pagination>
        </el-col>
        </el-row>
      </div>
    </Boxer>
    
    <el-dialog title="角色授权" width="80%s" :visible.sync="roleAllocation" @open="openReload" @close="closeReload">
        <el-tree 
          @check-change="checkChange" 
          :data="assignPermission" 
          show-checkbox 
          :default-checked-keys="ckobj.defaultChecked" 
          :default-expand-all="false" 
          node-key="id" 
          ref="tree" 
          highlight-current 
          :props="defaultProps"></el-tree>
      <el-row>
        <div class="fbutton">
          <el-button @click.native.prevent="getCheckedNodes" :loading="saving">保存</el-button>
          <el-button @click="backward">返回</el-button>
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// import { REPORT_SERVER_URL } from '@/config/index.js'
import SearchForm from '../../components/SearchForm'
import _ from 'underscore'
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import { API_GATEWAY } from '@/config/index.js'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    SearchForm,
    KBtn,
    Boxer
  },
  props: {
    mate: Object,
    mateFormerHeaderId: String,
    KTableItemCode: String
  },
  data () {
    return {
      saving: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      ckobj: {
        defaultChecked: []
      },
      pageSize: 15,
      multipleSelection: [],
      hasSelected: false,
      searchValues: {},
      page: 0,
      sortValues: {},
      action: null,
      dialogTableVisible: false,         // dialog开关
      tableData: [],
      word: '查 询',
      object: {},                          // 放columns
      mingxiRows: [],                      // 明细行获取的数据
      physicalInventoryId: 0,
      colModels: [],
      checkStrictly: false,
      dialogFile: false,
      checkAll: false,
      checkedLabel: [],
      isIndeterminate: true,
      lineSelected: [],               // 存放全部的label
      lineSelectedDetail: [],         // 存放全部的明细行label
      msgBoxButton: true,
      dialogDetailLine: false,
      roleAllocation: false,
      assignPermission: [],
      rowId: '',
      getRole: {}
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
    this.assignPermission = this.mate.treeData
  },
  computed: {
    actionWidth: function () {
      return this.mate.actions.length * 60 + 60
    }
  },
  mounted () {
    this.rowSelect()
  },
  // 需要添加刷新消息
  methods: {
    handleButton (btn, row) {
      const vm = this
      this.$root.handleAction(btn, row, function () {
        vm.getData()
      })
    },
    checkChange () {
      this.checkStrictly = false;
    },
    handleAction (act, row) {
      const vm = this
      if (act.action === 'approveJurisdiction') {
        this.checkStrictly = true
        this.rowId = row.id
        this.$root.ajaxData('/roles/toAuth/' + this.rowId, {}, function (data) {
          vm.getRole = data
        })
        setTimeout(function () {
          vm.roleAllocation = true
        }, 300)
      } else {
        this.$root.handleAction(act, row, function () {
          vm.getData()
        })
      }
    },
    openReload (event) {
      if (this.getRole.checked) {
        for (let i = 0; i < this.getRole.checked.length; i++) {
          this.ckobj.defaultChecked.push(this.getRole.checked[i])
        }
      }
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys(this.ckobj.defaultChecked)
      }
      this.checkStrictly = true
    },
    closeReload (event) {
      for (let i = 0; i < this.getRole.checked.length; i++) {
        this.ckobj.defaultChecked.pop(this.getRole.checked[i])
      }
    },
    // 分配角色确定按钮
    getCheckedNodes () {
      var vm = this
      const arr = []
      const arr1 = []
      this.$refs.tree.getCheckedNodes().forEach(i => {
        if (_.indexOf(arr, i.id) === -1) {
          arr.push(i.id)
        }
      })
      this.$refs.tree.getHalfCheckedNodes().forEach(i => {
        if (_.indexOf(arr1, i.id) === -1) {
          arr1.push(i.id)
        }
      })
      arr.push(...arr1)
      this.$root.ajaxData('/roles/auth/' + this.rowId, arr, function () {
        vm.roleAllocation = false
      }, 'POST')
    },
    // 分配角色取消按钮
    backward () {
      this.roleAllocation = false
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    back () {
      this.dialogTableVisible = false
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
  .fbutton {
    margin-top:10px;
    text-align: center;
    button {
      padding: 7px 15px;
      background-color: #fff;
      cursor: pointer;
    }
  }
</style>
