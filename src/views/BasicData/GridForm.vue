<template>
 <div>
  <Boxer :mate="mate" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
    <div slot="main">
      <el-row>
        <el-col :span="24">
          <el-table size="mini" max-height="500" ref="table" :data="mate.rows" border  @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;">
              <el-table-column type="selection" width="50" id="tableSel"></el-table-column>
              <el-table-column v-if="col.isShow" v-for="col of mate.columns" :label="col.label" :key="col.name" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip :formatter="col.formatter"></el-table-column>
              <el-table-column fixed="right" label="操作" :width="actionWidth" v-if="mate.actions">
                <template slot-scope="scope">
                  <k-btn v-for="act of mate.actions" size="mini" v-bind:key="act.action" :act="act" :row="scope.row" @action="handleAction"></k-btn>
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
  <el-dialog :title="curform.title" :visible.sync="dialogFormVisible" width="80%">
    <formor :mate="curform" :treeDatas="treeDatas" formModel="dialog" @submit="refreshGrid" @dialog-cancel="dialogFormVisible=false" :warehouseId="warehouseId" :rowId="rowId"></formor>
  </el-dialog>
 </div>
</template>

<script>
import KBtn from '../../components/KBtn.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import Boxer from '../../components/Boxer.vue'
import SearchForm from '../../components/SearchForm'
export default {
  name: 'GridForm',
  mixins: [ColumnFormatterMixin],
  components: {
    KBtn,
    Boxer,
    SearchForm,
    Formor: function index (resolve) {
      require(['../../components/Formor.vue'], resolve)
    }
  },
  props: {
    mate: Object
  },
  data () {
    return {
      pageSize: 15,
      dialogFormVisible: false,
      multipleSelection: [],
      hasSelected: false,
      searchValues: {},
      word: '查询',
      page: 0,
      sortValues: {},
      rowId: '',
      action: null,
      curform: {},
      treeDatas: {},
      warehouseId: '',   // 点击新增储位时，获取到仓库id
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
      this.formatterBefore(this.mate.columns)
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },
  created () {
    this.formatterBefore(this.mate.columns)
    this.curform = this.mate.extObj.formMate.mate
    if (this.mate.extObj.warehouse) {
      this.warehouseId = this.mate.extObj.warehouse.values.id
    }
    if (this.curform.treeDataLoad) {
      const self = this
      this.curform.treeDataLoad.map(i => {
        this.$root.ajaxData(i.url, {}, function (data) {
          self.treeDatas[i.prop] = data
        })
      })
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
  beforeUpdate () {
  },
  // 需要添加刷新消息
  methods: {
    handleButton (btn) {
      if (btn.action === 'add') {
        this.curform.values = {}
        this.rowId = ''
        this.dialogFormVisible = true
        this.curform = this.mate.extObj.formMate.mate
        this.curform.method = 'POST'
        this.curform.title = this.mate.extObj.formMate.title.replace('修改', '新增')
        return
      }
      const row = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      if (btn.action === 'report') {
        this.mate.url = btn.url + '&id=' + row.id
        // this.mate.url = 'http://localhost:8075/WebReport/ReportServer?reportlet=wms%2FInboundBillTemplate.cpt&id=1'
        this.$emit('route', 'FReport', this.mate)
        return
      }
      this.$root.handleAction(btn, row)
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
    rowSelect () {
      this.mate.rows.forEach(row => {
        /* eslint-disable */
        let select = (row.id && this.mate.selected && this.mate.selected.findIndex(id => id == row.id) !== -1)
        /* eslint-enable */
        this.$refs.table.toggleRowSelection(row, (select === true))
      })
      // this.mate.selected = [];
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.pageSize = val
      const act = { action: 'paging' }
      this.getData(act)
    },
    handleCurrentChange (val) {
      this.page = val
      const act = { action: 'paging' }
      this.getData(act)
    },
    handleAction (act, row) {
      if (act.action === 'edit') {
        this.curform.values = row
        this.rowId = row.id.toString()
        this.dialogFormVisible = true
        this.curform.title = this.mate.extObj.formMate.title.replace('新增', '修改')
        this.curform.method = 'PUT'
        return
      }
      // 仓库生效
      if (act.action === 'shengxiao') {
        vm = this
        if (row.status === 0) {
          this.$root.ajaxData('/dc/update/' + row.id + '?status=1', {}, function (data) {
            vm.$root.ajaxData(vm.mate.dataApi, {}, function (data) {
              vm.mate.rows = data.mate.rows
            }, 'GET')
          }, 'PUT')
          return
        } else {
          this.$root.ajaxData('/dc/update/' + row.id + '?status=0', {}, function (data) {
            vm.$root.ajaxData(vm.mate.dataApi, {}, function (data) {
              vm.mate.rows = data.mate.rows
            }, 'GET')
          }, 'PUT')
        }
        return
      }
      // 储位生效
      if (act.action === 'shengxiaoLocation') {
        vm = this
        var param = { status: '1' }
        if (row.status === 0) {
          this.$root.ajaxData('/dc/local/mod/' + row.id, param, function (data) {
            vm.$root.ajaxData('/dc/' + row.warehouseId + '/locals', {}, function (data) {
              vm.mate.rows = data.mate.rows
            }, 'GET')
          }, 'PUT')
          return
        } else {
          var paramShixiao = { status: '0' }
          this.$root.ajaxData('/dc/local/mod/' + row.id, paramShixiao, function (data) {
            vm.$root.ajaxData('/dc/' + row.warehouseId + '/locals', {}, function (data) {
              vm.mate.rows = data.mate.rows
            }, 'GET')
          }, 'PUT')
          return
        }
      }
      // 储位失效
      // if (act.action === 'shixiaoLocation') {
      //   param = { status: '0' }
      //   vm = this
      //   if (row.status === 1) {
      //     this.$confirm('确定将该储位失效?', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }).then(() => {
      //       this.$root.ajaxData('/dc/local/mod/' + row.id, param, function (data) {
      //         vm.$root.ajaxData('/dc/' + row.warehouseId + '/locals', {}, function (data) {
      //           vm.mate.rows = data.mate.rows
      //         }, 'GET')
      //       }, 'PUT')
      //     }).catch(() => {
      //       this.$message({
      //         message: '已取消失效',
      //         type: 'info'
      //       })
      //     })
      //     return
      //   } else {
      //     this.$message({
      //       message: '已失效',
      //       type: 'warning'
      //     })
      //     return
      //   }
      // }
      var vm = this
      this.$root.handleAction(act, row, function (data) {
        const action = act
        if (data && data.next) {
          action.next = data.next
        }
        vm.getData({ action: act.action, url: action.next })
      })
    },
    refreshGrid (act) {
      this.dialogFormVisible = false
    },
    getData (act, row) {
      let url = act.url || this.mate.dataApi
      let param = {
        search: this.searchValues,
        page: this.page,
        sort: this.sortValues
      }
      var vm = this
      if (act.action === 'search') {
        url += '-q?param=' + this.mate.search.values.name
      }
      // 翻页功能
      if (act.action === 'paging') {
        url += '-q/' + this.warehouseId + '?pageNum=' + this.page + '&pageSize=' + this.pageSize
        param = null
      }
      // 在巫老师的基础上，添加了act.action === paging
      this.$root.ajaxData(url, param, function (data) {
        if (act.action === 'submited' || act.action === 'delete' || act.action === 'search' || act.action === 'paging') {
          vm.updateData(data)
        }
      })
    },
    updateData (data) {
      if (data.mate.rows) {
        this.mate.rows = data.mate.rows
      }
      if (data.mate.total) {
        this.mate.total = data.mate.total
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
      const act = { action: 'sort' }
      this.getData(act)
    },
    search (data) {
      this.searchValues = data
      this.page = 0
      const act = { action: 'search' }
      this.getData(act)
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

  .leftFloat{
    float:left;
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
  #demo .el-form-item{
    margin:0;
  }
  .el-form-item {
    margin: 15px 20px 2px 0px;
}
.el-table td, .el-table th {
    height: 30px;
  }
.el-pagination__sizes{
  margin-left: 20px;
}

</style>
