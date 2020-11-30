<template>
<div>
  
  <Boxer :mate="mate" :hasSelected="hasSelected" @action="handleButton" ref="Boxer"  :msgBoxButton="msgBoxButton">
    <div slot="main">
      <el-row>
        <el-col :span="24">
          <el-table size="mini" max-height="500" highlight-current-row ref="table" :data="ListRows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%" >
              <el-table-column type="selection" width="50" id="tableSel"></el-table-column>
               <el-table-column show-overflow-tooltip :label="list['goodsCode'].label" :width="list['goodsCode'].width" :prop="list['goodsCode'].name"></el-table-column>
               <el-table-column show-overflow-tooltip :label="list['goodsName'].label" :width="list['goodsName'].width" :prop="list['goodsName'].name"></el-table-column>
               <el-table-column show-overflow-tooltip :label="list['supplierName'].label" :width="list['supplierName'].width" :prop="list['supplierName'].name"></el-table-column>
               <el-table-column show-overflow-tooltip :label="list['goodsCategory'].label" :width="list['goodsCategory'].width" :prop="list['goodsCategory'].name"></el-table-column>
               <el-table-column show-overflow-tooltip :label="list['specifications'].label" :width="list['specifications'].width" :prop="list['specifications'].name"></el-table-column>
              <el-table-column show-overflow-tooltip :label="list['unit'].label" :width="list['unit'].width" :prop="list['unit'].name"></el-table-column>
              <el-table-column show-overflow-tooltip :label="list['applyDate'].label"  :width="list['applyDate'].width" :prop="list['applyDate'].name"></el-table-column>
            <el-table-column  :label="list['materialCode'].label" :width="list['materialCode'].width" >
             <template slot-scope="scope">
                <span v-show="!scope.row.editFlag" style="font-weight:bold">{{ scope.row['materialCode'] }} </span>
                <!-- <span v-if="scope.row.editFlag" class="cell-edit-input"><el-input v-model="inputColumn1" placeholder="请输入内容"></el-input></span> -->
               <el-select  size="mini" style="font-weight:bold" v-show="scope.row.editFlag"  v-model="scope.row[list['materialCode'].name]" @change="changeMaterial" clearable>
                  <el-option :label="item.label" :value="item.value" v-for="item of materialOptions" :key="item.name">
                     <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color:#212121; font-size: 13px">{{ item.materialName }}</span>
                  </el-option>
               </el-select>
             </template>
           </el-table-column>
        <!-- <el-table-column :label="list['materialId'].label"  :width="list['materialId'].width" :prop="list['materialId'].name"></el-table-column> -->
        <el-table-column show-overflow-tooltip :label="list['materialName'].label"  :width="list['materialName'].width" :prop="list['materialName'].name"></el-table-column>
        <el-table-column show-overflow-tooltip :label="list['effectiveDate'].label" :width="list['effectiveDate'].width" :prop="list['effectiveDate'].name">
           <template slot-scope="scope">
                <span v-show="!scope.row.editFlag" style="font-weight:bold">{{ scope.row['effectiveDate'] }}</span>
                <!-- <span v-if="scope.row.editFlag" class="cell-edit-input"><el-input v-model="inputColumn1" placeholder="请输入内容"></el-input></span> -->
               <el-date-picker  size="mini" type="date" v-show="scope.row.editFlag"   v-model="scope.row[list['effectiveDate'].name]"  >
               </el-date-picker>
             </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip :label="list['invalidDate'].label"  :width="list['invalidDate'].width" :prop="list['invalidDate'].name">
           <template slot-scope="scope">
                <span v-show="!scope.row.editFlag" style="font-weight:bold">{{ scope.row['invalidDate'] }}</span>
                <!-- <span v-if="scope.row.editFlag" class="cell-edit-input"><el-input v-model="inputColumn1" placeholder="请输入内容"></el-input></span> -->
               <el-date-picker size="mini"  type="date"  v-show="scope.row.editFlag"  v-model="scope.row[list['invalidDate'].name]"  >
               </el-date-picker>
             </template>
        </el-table-column>
              <!-- <el-table-column v-if="col.isShow" :formatter="col.formatter" v-for="col of mate.columns" v-bind:key="col.name" :label="col.label" :prop="col.name" :width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              </el-table-column> -->
              <el-table-column label="操作" fixed="right" :min-width="actionWidth" v-if="mate.actions">
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
</div>
</template>

<script>
import { DateFormat } from '../../utils/util.js'
import SearchForm from '../../components/SearchForm'
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import Vue from 'vue'
import { API_GATEWAY } from '@/config/index.js'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import DictStore from '../../store/dict-store.js'
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    SearchForm,
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
      titleOptions: [],
      operatorOptions: [],
      pageSize: 5,
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
      materialOptions: [],
      ListRows: {},
      materialName: [],
      priceColumns: {},
      object: {},                          // 放columns
      mingxiRows: [],
      list: {},                      // 明细行获取的数据
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
    },
    ListRows: {
      handler: function (val, old) {
        for (var i = 0; i < val.length; i++) {
          this.materialOptions.forEach(j => {
            if (j.value === val[i].materialCode) {
              val[i].materialName = j.materialName
              val[i].materialCode = j.code
              val[i].materialId = j.value
            }
          })
          if (val[i].materialCode === '') {
            val[i].materialName = ''
            val[i].materialId = ''
          }
        }
      },
      deep: true
    }
  },
  created () {
    this.ListRows = this.mate.rows
    this.formatterBefore(this.mate.columns)
    if (this.mate !== undefined && this.mate.dataApi !== undefined) {
      if (this.mate.dataApi.indexOf('/inventory/physical/snapshots/invyWatch/list') > -1 ||
        this.mate.dataApi.indexOf('/inventory/physical/snapshots/invyApprove/list') > -1 ||
        this.mate.dataApi.indexOf('/inventory/physical/snapshots/invyAdjust/list') > -1) {
        if (this.mate.rows !== undefined && this.mate.rows.length > 0) {
          this.physicalInventoryId = this.mate.rows[0].physicalInventoryId
        }
      }
    }
    this.mate.columns.map((i) => { this.list[i.name] = i })
    this.getMaterial()
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
    query () {
      const mate = [this.mate.mateSearch.values]
      const vm = this
      const url = this.mate.mateSearch.url
      this.$root.ajaxData(url, mate, function (data) {
        vm.mate.mateList.rows = data.mate.rows
      }, 'POST')
    },
    handleChange () {
    },
    changeMaterial (val) {
      for (var i = 0; i < this.materialOptions.length; i++) {
        if (val === this.materialOptions[i].value) {
          this.materialName = this.materialOptions[i].materialName
        }
      }
    },
    getMaterial () {
      var vm = this
      this.$root.ajaxData('/materials?dataOnly=true&&status=1&&nopaging=true', {}, function (data) {
        vm.materialData = data
        for (let i = 0; i < data.length; i++) {
          vm.materialOptions.push({ label: data[i].subcode, value: data[i].id, materialName: data[i].name, specification: data[i].basicSpec, unit: data[i].basicUnit, category: data[i].materialCatgsName, code: data[i].subcode })
        }
      }, 'GET')
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    handleButton (btn) {
      var vm = this
      if (btn.action === 'saveLine') {
        for (var i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].materialId === '' || this.multipleSelection[i].materialId === null) {
            vm.$message({
              type: 'warning',
              message: '第' + (i + 1) + '行' + '请选择物料编码' })
            return
          } else {
            this.multipleSelection[i].effectiveDate = DateFormat(this.multipleSelection[i].effectiveDate, 'yyyy-MM-dd')
            this.multipleSelection[i].invalidDate = DateFormat(this.multipleSelection[i].invalidDate, 'yyyy-MM-dd')
            this.$root.ajaxData(btn.url, this.multipleSelection, function (data) {
              vm.$root.monitor({ url: '/purchase/goodsCross/all/list' })
            }, 'PUT')
            this.multipleSelection[i].editFlag = false
          }
        }
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
      this.getData('paging')
    },
    handleCurrentChange (val) {
      this.page = val
      this.getData('paging')
    },
    handleAction (act, row) {
      var vm = this
      if (act.action === 'addChild') {
        vm.$root.monitor({ url: '/materials/toadd' })
      }
      if (act.action === 'bianji') {
        Vue.set(row, 'editFlag', true)
        this.toggleSelection(row)
      }
    },
    toggleSelection (rows) {
      if (rows) {
        this.$refs.table.toggleRowSelection(rows)
      } else {
        this.$refs.table.clearSelection()
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
        // url += '-q?' + (this.toUriParams(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page
        url += '-q?' + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        param = null
      }
      this.$root.ajaxData(url, param, function (data) {
        vm.updateData(data)
      })
    },
    updateData (data) {
      if (data.mate.rows) {
        this.ListRows = data.mate.rows
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
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
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
