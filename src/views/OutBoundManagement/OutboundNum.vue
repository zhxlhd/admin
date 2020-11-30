<template>
<div>
  <Boxer :mate="mate" :hasSelected="hasSelected" ref="Boxer">
    <div slot="main">
      <el-row>
        <el-col :span="24">
          <el-table size="mini" highlight-current-row ref="table" :data="mate.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;">
              <el-table-column type="selection" width="50" id="tableSel"></el-table-column>
              <el-table-column :label="object['pickNo'].label" :prop="object['pickNo'].name" :width="object['pickNo'].width"></el-table-column>
              <el-table-column :label="object['pickDate'].label" :prop="object['pickDate'].name" :width="object['pickDate'].width"></el-table-column>
              <el-table-column :label="object['pickWarehouseId'].label" :prop="object['pickWarehouseId'].name" :width="object['pickWarehouseId'].width">
                <template slot-scope="scope">
                  <span>{{scope.row['pickWarehouseName']}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="object['pickRouteId'].label" :prop="object['pickRouteId'].name" :width="object['pickRouteId'].width"></el-table-column>
              <el-table-column :label="object['itemCode'].label" :prop="object['itemCode'].name" :width="object['itemCode'].width"></el-table-column>
              <el-table-column :label="object['itemName'].label" :prop="object['itemName'].name" :width="object['itemName'].width"></el-table-column>
              <el-table-column :label="object['model'].label" :prop="object['model'].name" :width="object['model'].width"></el-table-column>
              <el-table-column :label="object['unit'].label" :prop="object['unit'].name" :width="object['unit'].width"></el-table-column>
              <el-table-column :label="object['requireQty'].label" :prop="object['requireQty'].name" :width="object['requireQty'].width"></el-table-column>
              <el-table-column :label="object['pickQty'].label" :prop="object['pickQty'].name" :width="object['pickQty'].width"></el-table-column>
              <el-table-column :formatter="object['docStatus'].formatter" :label="object['docStatus'].label" :prop="object['docStatus'].name" :width="object['docStatus'].width"></el-table-column>
              <el-table-column :label="object['warehouseId'].label" :prop="object['warehouseId'].name" :width="object['warehouseId'].width">
                <template slot-scope="scope">
                  <span>{{scope.row['warehouseName']}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="object['locationId'].label" :prop="object['locationId'].name" :width="object['locationId'].width">
                <template slot-scope="scope">
                  <span>{{scope.row['locationName']}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="object['batchNo'].label" :prop="object['batchNo'].name" :width="object['batchNo'].width"></el-table-column>
              <el-table-column :label="object['lotNo'].label" :prop="object['lotNo'].name" :width="object['lotNo'].width"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!-- <el-row type="flex" justify="center" class="page" >
      <el-col :span="12">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            layout="sizes,prev, pager, next"
            :total="100"
            :page-sizes ="[5, 10, 15, 20, 50]"
            :page-size="pageSize">
        </el-pagination>
      </el-col>
      </el-row> -->
    </div>
  </Boxer>
  <el-button type="primary" class="buttonFinished" @click="submit">{{$t('finishPutAway')}}</el-button>
</div>
</template>

<script scoped>
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    KBtn,
    Boxer,
    Formor: function index (resolve) {
      require(['../../components/Formor.vue'], resolve)
    }
  },
  props: {
    mate: Object,
    mateFormerHeaderId: String,
    KTableItemCode: String
  },
  data () {
    return {
      pageSize: 1,
      currentPage: 1,
      multipleSelection: [],
      hasSelected: false,
      searchValues: {},
      page: 0,
      sortValues: {},
      action: null,
      dialogTableVisible: false,         // dialog开关
      tableData: [],
      word: this.$t('query'),
      object: {},                          // 放columns
      mingxiRows: [],                      // 明细行获取的数据
      finishPutAway: this.$t('finishPutAway')
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
    this.mate.columns.map((i) => { this.object[i.name] = i })
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
  beforeUpdate () {
  },
  // 需要添加刷新消息
  methods: {
    back () {
      this.dialogTableVisible = false
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
      if (flag && url.indexOf('?') === -1) {
        url += '-q?' + (this.toUriParams(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
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
    toUriParams (data) {
      return Object.keys(data).filter(i => !!data[i]).map(i => i + '=' + data[i]).join('&')
    },
    submit () {
      var vm = this
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: this.$t('outBoundHintMsg'),
          type: 'warning'
        })
        return
      }
      this.$root.ajaxData('/outbound/pick/lines/outboundFinished', this.multipleSelection, function () {
        vm.$root.monitor({ url: '/outbound/pick/header/all/list', method: 'GET' })
      }, 'POST')
    }
  }
}
</script>

<style scoped>
  .page {
    margin-top: 20px;
  }
.el-form-item__label{
  line-height:inherit
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
  .buttonFinished{
    margin-top:10px;
  }
  .el-form-item {
    margin: 15px 20px 2px 0px;
}
.el-table td, .el-table th {
    height: 30px;
  }
</style>
