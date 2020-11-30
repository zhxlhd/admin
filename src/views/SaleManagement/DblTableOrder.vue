<template>
<div>
  <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
    <span slot="search" class="leftMargin">
      <search-form v-if="mate.mateList.essearch" :essearch="mate.mateList.essearch" @essearch="todoEssearch">  </search-form>
      <Formor v-else-if="mate.mateList.search" :mate="mate.mateList.search" v-on:search="search" class="leftFloat" :word="word"></Formor>
    </span>
    <div slot="main">
      <el-row>
        <el-col :span="24">
          <el-table highlight-current-row @row-click="rowClick" ref="table" :data="mate.mateList.rows" border  @selection-change="handleSelectionChange" @sort-change="sortChange" max-height="200" style="width: 100%;">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column v-if="col.isShow" v-for="col of mate.mateList.columns" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip :formatter="col.formatter">
              </el-table-column>
              <el-table-column label="操作" fixed="right" :width="actionWidth" v-if="mate.mateList.actions">
                <template slot-scope="scope">
                  <k-btn v-for="act of mate.mateList.actions" v-bind:key="act.action" size="mini" :act="act" :icon="act.icon" :row="scope.row" @action="confirm"></k-btn>
                </template>
              </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" class="page" v-if="mate.mateList.size > 0">
      <el-col :span="12">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="mate.mateList.page"
            layout="sizes,prev, pager, next"
            :total="mate.mateList.total"
            :page-sizes ="[5, 10, 15, 20, 50]"
            :page-size="pageSize">
        </el-pagination>
      </el-col>
      </el-row>
    </div>
  </Boxer>
  <!--下面的明细表格-->
  <template>
    <div class="priceDetailLine">
      <el-table v-if="showFlag" :data="mate.mateList.lineRows" border style="width: 100%;" class="DblTableOrder" @cell-click="cellClick">
          <el-table-column v-if="lineColumns['lineNum'].isShow" :label="lineColumns['lineNum'].label" :prop="lineColumns['lineNum'].name" :min-width="lineColumns['lineNum'].width"></el-table-column>
          <el-table-column v-if="lineColumns['subcode'].isShow" :label="lineColumns['subcode'].label" :prop="lineColumns['subcode'].name" :min-width="lineColumns['subcode'].width"></el-table-column>
          <el-table-column v-if="lineColumns['materialName'].isShow" :label="lineColumns['materialName'].label" :prop="lineColumns['materialName'].name" :min-width="lineColumns['materialName'].width"></el-table-column>
          <el-table-column v-if="lineColumns['specification'].isShow" :label="lineColumns['specification'].label" :prop="lineColumns['specification'].name" :min-width="lineColumns['specification'].width"></el-table-column>
          <el-table-column v-if="lineColumns['unit'].isShow" :label="lineColumns['unit'].label" :prop="lineColumns['unit'].name" :width="lineColumns['unit'].min-width"></el-table-column>
          <el-table-column v-if="lineColumns['type'].isShow" :formatter="lineColumns['type'].formatter" :label="lineColumns['type'].label" :prop="lineColumns['type'].name" :min-width="lineColumns['type'].width"></el-table-column>
          <el-table-column v-if="lineColumns['category'].isShow" :label="lineColumns['category'].label" :prop="lineColumns['category'].name" :min-width="lineColumns['category'].width"></el-table-column>
          <el-table-column v-if="lineColumns['qty'].isShow" :label="lineColumns['qty'].label" :prop="lineColumns['qty'].name" :min-width="lineColumns['qty'].width"></el-table-column>
          <el-table-column v-if="lineColumns['receivedQty'].isShow" :label="lineColumns['receivedQty'].label" :prop="lineColumns['receivedQty'].name" :min-width="lineColumns['receivedQty'].width"></el-table-column>
          <el-table-column v-if="lineColumns['returnQty'].isShow" :label="lineColumns['returnQty'].label" :prop="lineColumns['returnQty'].name" :min-width="lineColumns['returnQty'].width"></el-table-column>
          <el-table-column v-if="lineColumns['priceTax'].isShow" :label="lineColumns['priceTax'].label" :prop="lineColumns['priceTax'].name" :min-width="lineColumns['priceTax'].width"></el-table-column>
          <el-table-column v-if="lineColumns['price'].isShow" :label="lineColumns['price'].label" :prop="lineColumns['price'].name" :min-width="lineColumns['price'].width"></el-table-column>
          <el-table-column v-if="lineColumns['dateFrom'].isShow" :label="lineColumns['dateFrom'].label" :prop="lineColumns['dateFrom'].name" :min-width="lineColumns['dateFrom'].width"></el-table-column>
          <el-table-column v-if="lineColumns['dateTo'].isShow" :label="lineColumns['dateTo'].label" :prop="lineColumns['dateTo'].name" :min-width="lineColumns['dateTo'].width"></el-table-column>
          <el-table-column :label="lineColumns['operation'].label" :prop="lineColumns['operation'].name">
            <template slot-scope="scope">
              <el-button size="mini" type="primary">查看</el-button>
            </template>
          </el-table-column>
      </el-table>
    </div>
  </template>

  <el-dialog title="采购发运" :visible.sync="despatchFlag" width="80%">  
    <template>
      <el-table :data="despatchListRows" border style="width:100%" class="tableLine">
        <!--<el-table-column v-for="col of mate.despatchList" v-bind:key="col.name" :label="col.label" :prop="col.name" :width="col.width"></el-table-column>-->
        <el-table-column :label="despatchList['lineNum'].label" :prop="despatchList['lineNum'].name" width="100"></el-table-column>
        <el-table-column :label="despatchList['orgId'].label" :prop="despatchList['orgId'].name" :widht="despatchList['orgId'].width">
          <template slot-scope="scope">
            <span>{{scope.row['orgName']}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="despatchList['qty'].label" :prop="despatchList['qty'].name" :widht="despatchList['qty'].width"></el-table-column>
        <el-table-column :label="despatchList['promiseDate'].label" :prop="despatchList['promiseDate'].name" :widht="despatchList['promiseDate'].width"></el-table-column>
        <el-table-column :label="despatchList['requiredDate'].label" :prop="despatchList['requiredDate'].name" :widht="despatchList['requiredDate'].width"></el-table-column>
        <el-table-column :label="despatchList['moneyAmount'].label" :prop="despatchList['moneyAmount'].name" :widht="despatchList['moneyAmount'].width"></el-table-column>
      </el-table>
    </template>
  </el-dialog>
  <el-dialog title="查看详情" :visible.sync="dialogVisible"   width="80%" >
      <el-row>
         <DialogForm :mate="mate.mateFormerHeader"  formModel="dialog" ></DialogForm>
        </el-row>
        <el-row>
          <template>
            <el-table v-if="showFlag" :data="mate.mateList.lineRows" border style="width: 100%;" class="tableLine" @cell-click="cellClick">
                <el-table-column :label="lineColumns['lineNum'].label" :prop="lineColumns['lineNum'].name" :width="lineColumns['lineNum'].width"></el-table-column>
                <el-table-column :label="lineColumns['subcode'].label" :prop="lineColumns['subcode'].name" :width="lineColumns['subcode'].width"></el-table-column>
                <el-table-column :label="lineColumns['materialName'].label" :prop="lineColumns['materialName'].name" :width="lineColumns['materialName'].width"></el-table-column>
                <el-table-column :label="lineColumns['specification'].label" :prop="lineColumns['specification'].name" :width="lineColumns['specification'].width"></el-table-column>
                <el-table-column :label="lineColumns['unit'].label" :prop="lineColumns['unit'].name" :width="lineColumns['unit'].width"></el-table-column>
                <el-table-column :formatter="lineColumns['type'].formatter" :label="lineColumns['type'].label" :prop="lineColumns['type'].name"></el-table-column>
                <el-table-column :label="lineColumns['category'].label" :prop="lineColumns['category'].name" :width="lineColumns['category'].width"></el-table-column>
                <el-table-column :label="lineColumns['qty'].label" :prop="lineColumns['qty'].name" :width="lineColumns['qty'].width"></el-table-column>
                <el-table-column :label="lineColumns['receivedQty'].label" :prop="lineColumns['receivedQty'].name" :width="lineColumns['receivedQty'].width"></el-table-column>
                <el-table-column :label="lineColumns['returnQty'].label" :prop="lineColumns['returnQty'].name" :width="lineColumns['returnQty'].width"></el-table-column>
                <el-table-column :label="lineColumns['priceTax'].label" :prop="lineColumns['priceTax'].name" :width="lineColumns['priceTax'].width"></el-table-column>
                <el-table-column :label="lineColumns['price'].label" :prop="lineColumns['price'].name" :width="lineColumns['price'].width"></el-table-column>
                <el-table-column :label="lineColumns['dateFrom'].label" :prop="lineColumns['dateFrom'].name" :width="lineColumns['dateFrom'].width"></el-table-column>
                <el-table-column :label="lineColumns['dateTo'].label" :prop="lineColumns['dateTo'].name" :width="lineColumns['dateTo'].width"></el-table-column>
                <el-table-column :label="lineColumns['operation'].label" :prop="lineColumns['operation'].name">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary">查看</el-button>
                </template>
                </el-table-column>
            </el-table>
          </template>
      </el-row>
    </el-dialog>
</div>
</template>

<script>
import SearchForm from '../../components/SearchForm'
import { LANGS } from '../../i18n/lang'
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
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
      pageSize: 1,
      currentPage: 1,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      langs: LANGS,
      hasSelected: false,
      searchValues: {},
      page: 0,
      width: '',
      sortValues: {},
      action: null,
      tableData: [],
      word: this.$t('query'),
      showFlag: false,                    // 下面表格的开关
      object: {},                          // 放columns
      fit: false,
      valueStatus: '',
      dialogVisible: false,
      auditStatus: '',
      rowId: {},             // 点击table前面的框框
      lineColumns: {},
      despatchFlag: false,
      despatchListRows: [],
      despatchList: {},
      lineRowsNum: 0,
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
      this.formatterBefore(this.mate.mateList.despatchList)
      this.formatterBefore(this.mate.mateList.lineColumns)
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },
  computed: {
    actionWidth: function () {
      return this.mate.mateList.actions.length * 60 + 30
    }
  },
  created () {
    this.formatterBefore(this.mate.mateList.columns)
    this.formatterBefore(this.mate.mateList.despatchList)
    this.formatterBefore(this.mate.mateList.lineColumns)
    this.mate.mateList.lineColumns.map((i) => { this.lineColumns[i.name] = i })
    this.mate.mateList.despatchList.map((i) => { this.despatchList[i.name] = i })
    this.mate.mateFormerHeader.fields.map((i) => { this.object[i.name] = i })
  },
  mounted () {
    this.rowSelect()
    // this.showFlag = false
  },
  // 需要添加刷新消息
  methods: {
    DateFormat (date, fmt) {
      var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'H+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        return fmt
      }
    },
    updated () {
      this.showFlag = false
    },
    rowClick (row) {
      this.showFlag = true
      var vm = this
      this.$root.ajaxData('/purchase/purchaseOrder/all/' + row.id, {}, function (data) {
        vm.mate.mateList.lineRows = data
      }, 'GET')
    },
    back () {
      this.dialogTableVisible = false
    },
    confirm (act, row) {
      var vm = this
      if (act.action === 'addChild') {
        this.mate.mateFormerHeader.values = row
        this.dialogVisible = true
        return false
      }
    },
    handleButton (btn) {
      var vm = this
      const row = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      this.rowId = row
      // 客户po转so
      if (btn.action === 'updataDetailBill') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        this.btn = btn
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$root.ajaxData(this.btn.url + '/' + rowt.id, {}, function (data) {
          if (data.statusCode === 40017) {
            vm.$message({
              type: 'warning',
              message: vm.$t('generatedSo')
            })
            return false
          } else if (data.statusCode === 40019) {
            vm.$message({
              type: 'warning',
              message: vm.$t('defaultPricelist')
            })
            return false
          } else if (data.statusCode === 40020) {
            vm.$message({
              type: 'warning',
              message: vm.$t('notFind')
            })
            return false
          } else {
            vm.$message({
              type: 'success',
              message: vm.$t('Successful operation')
            })
          }
          vm.$root.ajaxData(vm.mate.dataApi, {}, function (data) {
            vm.mate.rows = data.mate.rows
          }, 'GET')
        }, 'GET')
        return
      }
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
      }
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
    },
    // 点击采购发运出现弹出框采购发运弹出框
    cellClick (row, column, cell, event) {
      // 在table里面一定要加prop,不然就没有property
      if (column.property === 'operation') {
        this.despatchFlag = true
        this.despatchListRows = row.poDespatchList
      }
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
  .el-table td, .el-table th {
    height: 30px;
  }
  .priceDetailLine{
    margin-top: 50px;
    position: relative;
  }
  .priceLine{
    position: absolute;
    right: 0;
  }
  .DblTableOrder{
    position: absolute;
    top: 50px;
  }
  .tableLine{
    margin-top: 30px;
  }
</style>
