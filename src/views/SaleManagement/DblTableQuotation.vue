<template>
<div>
  <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
    <span slot="search" class="leftMargin">
      <!-- <search-form v-if="mate.mateList.essearch" :essearch="mate.mateList.essearch" @essearch="todoEssearch">  </search-form>
      <Formor v-else-if="mate.mateList.search" :mate="mate.mateList.search" v-on:search="search" class="leftFloat" :word="word"></Formor> -->
    </span>
    <div slot="main">
      <div class="query">
          <el-collapse @change="handleChange">
            <el-collapse-item title="搜索">
              <el-row :gutter="20">
                <el-form :model="mate.mateSearch.values" :inline="mate.inline">
                  <el-col :sm="6" :md="4" :lg="4">
                    <el-select clearable v-model="mate.mateSearch.values['name']">
                      <el-option :label="item.label" :value="item.value" v-for="item of titleOptions" :key="item.value"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :sm="6" :md="4" :lg="4">
                    <el-select clearable v-model="mate.mateSearch.values['operator']">
                      <el-option :label="item.label" :value="item.value" v-for="item of operatorOptions" :key="item.value"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :sm="6" :md="4" :lg="4">
                    <el-input clearable v-model="mate.mateSearch.values['value']"></el-input>
                  </el-col>
                  <el-col :sm="6" :md="4" :lg="4">
                    <el-button type="primary" @click="query" style="margin-left: 10px">查询</el-button>
                  </el-col>
                </el-form>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </div>
      <el-row>
        <el-col :span="24">
          <el-table highlight-current-row @row-click="rowClick" ref="table" :data="mate.mateList.rows" border  @selection-change="handleSelectionChange" @sort-change="sortChange" max-height="200" style="width: 100%;">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column v-if="col.isShow" v-for="col of mate.mateList.columns" :formatter="col.formatter" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              </el-table-column>
              <el-table-column fixed="right" label="操作" :width="actionWidth" v-if="mate.mateList.actions">
                <template slot-scope="scope">
                  <k-btn v-for="act of mate.mateList.actions" v-bind:key="act.action" size="mini" :act="act" :icon="act.icon" :row="scope.row" @action="confirm"></k-btn>
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
      <el-table :data="mate.mateList.lineRows" border style="width: 100%;" @row-click.capture="rowClickButton" @cell-click="cellClick">
          <el-table-column v-if="lineColumns['lineNum'].isShow" :label="lineColumns['lineNum'].label" :prop="lineColumns['lineNum'].name" :min-width="lineColumns['lineNum'].width"></el-table-column>
          <el-table-column v-if="lineColumns['productCode'].isShow" :label="lineColumns['productCode'].label" :prop="lineColumns['productCode'].name" :min-width="lineColumns['productCode'].width"></el-table-column>
          <el-table-column v-if="lineColumns['productName'].isShow" :label="lineColumns['productName'].label" :prop="lineColumns['productName'].name" :min-width="lineColumns['productName'].width"></el-table-column>
          <el-table-column v-if="lineColumns['category'].isShow" :formatter="lineColumns['category'].formatter" :label="lineColumns['category'].label" :prop="lineColumns['category'].name" :min-width="lineColumns['category'].width"></el-table-column>
          <el-table-column v-if="lineColumns['explain'].isShow" :label="lineColumns['explain'].label" :prop="lineColumns['explain'].name" :min-width="lineColumns['explain'].width"></el-table-column>
          <el-table-column v-if="lineColumns['brand'].isShow" :label="lineColumns['brand'].label" :prop="lineColumns['brand'].name" :min-width="lineColumns['brand'].width"></el-table-column>
          <el-table-column v-if="lineColumns['unit'].isShow" :label="lineColumns['unit'].label" :prop="lineColumns['unit'].name" :min-width="lineColumns['unit'].width"></el-table-column>
          <el-table-column v-if="lineColumns['priceTax'].isShow" class="tablePriceTax" :label="lineColumns['priceTax'].label" :min-width="lineColumns['priceTax'].width" :prop="lineColumns['priceTax'].name">
            <template slot-scope="scope">
              <span>{{scope.row[lineColumns['priceTax'].name]}}</span>
              <el-button class="buttonPriceTax" type="primary" size="mini">分段价格</el-button>
              <!--<span style="display:none;">{{scope.row[lineColumns['priceList'].name]}}</span>-->
            </template>
          </el-table-column>
          <el-table-column v-if="lineColumns['price'].isShow" :label="lineColumns['price'].label" :prop="lineColumns['price'].name" :min-width="lineColumns['price'].width"></el-table-column>
          <el-table-column v-if="lineColumns['minOrderQty'].isShow" :label="lineColumns['minOrderQty'].label" :prop="lineColumns['minOrderQty'].name" :min-width="lineColumns['minOrderQty'].width"></el-table-column>
          <el-table-column v-if="lineColumns['maxOrderQty'].isShow" :label="lineColumns['maxOrderQty'].label" :prop="lineColumns['maxOrderQty'].name" :min-width="lineColumns['maxOrderQty'].width"></el-table-column>
          <el-table-column v-if="lineColumns['itemNumber'].isShow" :label="lineColumns['itemNumber'].label" :prop="lineColumns['itemNumber'].name" :min-width="lineColumns['itemNumber'].width"></el-table-column>
          <el-table-column v-if="lineColumns['remark'].isShow" :label="lineColumns['remark'].label" :prop="lineColumns['remark'].name" :min-width="lineColumns['remark'].width"></el-table-column>
      </el-table>
    </div>
  </template>

  <el-dialog title="分段价格" :visible.sync="priceListFlag" width="80%">
    <template>
      <el-table :data="priceListRows" border style="width:100%" class="lineTable">
        <!--<el-table-column v-for="col of mate.priceList" v-bind:key="col.name" :label="col.label" :prop="col.name" :width="col.width">
        </el-table-column>-->
        <el-table-column :label="priceList['lineNum'].label" :min-width="priceList['lineNum'].width" :prop="priceList['lineNum'].name"></el-table-column>
        <el-table-column :label="priceList['qtyFrom'].label" :min-width="priceList['qtyFrom'].width" :prop="priceList['qtyFrom'].name"></el-table-column>
        <el-table-column :label="priceList['qtyTo'].label" :min-width="priceList['qtyTo'].width" :prop="priceList['qtyTo'].name"></el-table-column>
        <el-table-column :label="priceList['priceTax'].label" :min-width="priceList['priceTax'].width" :prop="priceList['priceTax'].name"></el-table-column>
        <el-table-column :label="priceList['price'].label" :min-width="priceList['price'].width" :prop="priceList['price'].name"></el-table-column>
        <el-table-column :label="priceList['orgId'].label" :min-width="priceList['orgId'].width" :prop="priceList['orgId'].name">
          <template slot-scope="scope">
            <span>{{scope.row['orgName']}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="priceList['discount'].label" :min-width="priceList['discount'].width" :prop="priceList['discount'].name"></el-table-column>
        <el-table-column :label="priceList['dateFrom'].label" :min-width="priceList['dateFrom'].width" :prop="priceList['dateFrom'].name"></el-table-column>
        <el-table-column :label="priceList['dateTo'].label" :min-width="priceList['dateTo'].width" :prop="priceList['dateTo'].name"></el-table-column>
      </el-table>
    </template>
  </el-dialog>
    <el-dialog title="查看详情" :visible.sync="dialogVisible"   width="80%">
      <el-row>
        <el-form :model="mate.mateFormerHeader.values" :inline="mate.mateFormerHeader.inline" >
           <template>
              <el-col :sm="12" :md="8" :lg="4">
                <el-form-item :label="object['sheetNumber'].label"  :prop="object['sheetNumber'].name">
                  <el-input disabled v-model="mate.mateFormerHeader.values[object['sheetNumber'].name]"></el-input>
                </el-form-item>
              </el-col>
               <el-col :sm="12" :md="8" :lg="4">
                <el-form-item :label="object['type'].label" :prop="object['type'].name">
                  <el-input disabled v-model="mate.mateFormerHeader.values[object['type'].name]"></el-input>
                </el-form-item>
               </el-col>
               <!--获取组织-->
              <el-col :sm="12" :md="8" :lg="4">
                    <el-form-item :label="object['replyDate'].label" :prop="object['replyDate'].name">
                      <el-input disabled v-model="mate.mateFormerHeader.values[object['replyDate'].name]"></el-input>
                    </el-form-item>
              </el-col>
            
              <el-col :sm="12" :md="8" :lg="4">
                    <el-form-item :label="object['tax'].label"  :prop="object['tax'].name">
                         <dict-selected  rowId="0" v-model="mate.mateFormerHeader.values[object['tax'].name]" dictType="tax" :initValue="mate.mateFormerHeader.values[object['tax'].name]"></dict-selected>
                     </el-form-item>
              </el-col>

             <el-col :sm="12" :md="8" :lg="4">
                    <el-form-item :label="object['explain'].label"  :prop="object['explain'].name">
                       <el-input disabled v-model="mate.mateFormerHeader.values[object['explain'].name]"></el-input>
                     </el-form-item>
             </el-col>
               <el-col :sm="12" :md="8" :lg="4">              
                    <el-form-item :label="object['paymentMethod'].label"  :prop="object['paymentMethod'].name">
                        <dict-selected  rowId="0" v-model="mate.mateFormerHeader.values[object['paymentMethod'].name]" dictType="paymentMethod" :initValue="mate.mateFormerHeader.values[object['paymentMethod'].name]"></dict-selected>
                     </el-form-item>
             </el-col>
             <el-col :sm="12" :md="8" :lg="4">
                    <el-form-item :label="object['dateFrom'].label"  :prop="object['dateFrom'].name">
                         <el-input disabled v-model="mate.mateFormerHeader.values[object['dateFrom'].name]"></el-input>
                     </el-form-item>
             </el-col>

              <el-col :sm="12" :md="8" :lg="4">
                    <el-form-item :label="object['dateTo'].label"  :prop="object['dateTo'].name">
                       <el-input disabled v-model="mate.mateFormerHeader.values[object['dateTo'].name]"></el-input>
                     </el-form-item>
             </el-col>
          
             <el-col :sm="12" :md="8" :lg="4">         
                    <el-form-item :label="object['auditor'].label"  :prop="object['auditor'].name">
                         <el-input disabled v-model="mate.mateFormerHeader.values[object['auditorName'].name]"></el-input>
                    </el-form-item>
             </el-col>
          
               <el-col :sm="12" :md="8" :lg="4">
                    <el-form-item :label="object['currency'].label"  :prop="object['currency'].name">
                     <dict-selected  rowId="0" v-model="mate.mateFormerHeader.values[object['currency'].name]" dictType="currency" :initValue="mate.mateFormerHeader.values[object['currency'].name]"></dict-selected>
                     </el-form-item>
             </el-col> 
              <el-col :sm="12" :md="8" :lg="4">
                    <el-form-item :label="object['approvalComments'].label"  :prop="object['approvalComments'].name">
                      <el-input disabled v-model="mate.mateFormerHeader.values[object['approvalComments'].name]"></el-input>
                     </el-form-item>
             </el-col> 
           </template>
         </el-form>
         </el-row>
         <el-row>
         <template>
           <el-table :data="mate.mateList.lineRows" border style="width: 100%;" class="lineTable" @row-click.capture="rowClickButton" @cell-click="cellClick">
              <!--<el-table-column v-for="col of mate.lineColumns" v-bind:key="col.name" :label="col.label" :prop="col.name" :width="col.width">
              </el-table-column>-->
              <el-table-column :label="lineColumns['lineNum'].label" :prop="lineColumns['lineNum'].name" :width="lineColumns['lineNum'].width"></el-table-column>
              <el-table-column :label="lineColumns['productCode'].label" :prop="lineColumns['productCode'].name" :width="lineColumns['productCode'].width"></el-table-column>
              <el-table-column :label="lineColumns['productName'].label" :prop="lineColumns['productName'].name" :width="lineColumns['productName'].width"></el-table-column>
              <el-table-column :formatter="lineColumns['category'].formatter" :label="lineColumns['category'].label" :prop="lineColumns['category'].name" :width="lineColumns['category'].width"></el-table-column>
              <el-table-column :label="lineColumns['explain'].label" :prop="lineColumns['explain'].name" :width="lineColumns['explain'].width"></el-table-column>
              <el-table-column :label="lineColumns['brand'].label" :prop="lineColumns['brand'].name" :width="lineColumns['brand'].width"></el-table-column>
              <el-table-column :label="lineColumns['unit'].label" :prop="lineColumns['unit'].name" :width="lineColumns['unit'].width"></el-table-column>
              <el-table-column class="tablePriceTax" :label="lineColumns['priceTax'].label" :width="lineColumns['priceTax'].width" :prop="lineColumns['priceTax'].name">
                <template slot-scope="scope">
                  <span>{{scope.row[lineColumns['priceTax'].name]}}</span>
                  <el-button class="buttonPriceTax" type="primary" size="mini">分段价格</el-button>
                  <!--<span style="display:none;">{{scope.row[lineColumns['priceList'].name]}}</span>-->
                </template>
              </el-table-column>
              <el-table-column :label="lineColumns['price'].label" :prop="lineColumns['price'].name" :width="lineColumns['price'].width"></el-table-column>
              <el-table-column :label="lineColumns['minOrderQty'].label" :prop="lineColumns['minOrderQty'].name" :width="lineColumns['minOrderQty'].width"></el-table-column>
              <el-table-column :label="lineColumns['maxOrderQty'].label" :prop="lineColumns['maxOrderQty'].name" :width="lineColumns['maxOrderQty'].width"></el-table-column>
              <el-table-column :label="lineColumns['itemNumber'].label" :prop="lineColumns['itemNumber'].name" :width="lineColumns['itemNumber'].width"></el-table-column>
              <el-table-column :label="lineColumns['remark'].label" :prop="lineColumns['remark'].name" :width="lineColumns['remark'].width"></el-table-column>
          </el-table>
         </template>
         </el-row>
    </el-dialog>
    <el-dialog  :visible.sync="dialogFormVisible" width="30%">
      <el-form>
      <el-form-item label="驳回原因">
          <el-input   v-model="cause"></el-input>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false; DialogClickOK()">确 定</el-button>
      </div>
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
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
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
      sortValues: {},
      action: null,
      dialogFormVisible: false,
      dialogTableVisible: false,          // dialog开关
      tableData: [],
      word: this.$t('query'),
      showFlag: false,                    // 下面表格的开关
      object: {},                          // 放columns
      valueStatus: '',
      cause: '',
      dialogVisible: false,
      priceColumns: [],
      lineColumns: {},
      auditStatus: '',
      rowId: {},             // 点击table前面的框框
      priceListRows: [],            // 分段价格数据
      priceListFlag: false,
      priceList: {},
      lineRowsNum: 0,                // 这个表示lineRows的第几行
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
    this.mate.mateSearch.fields.map((i) => { this.object[i.name] = i })
    this.titleOptions = this.mate.mateSearch.fields[0].options
    this.operatorOptions = this.mate.mateSearch.fields[1].options
    this.formatterBefore(this.mate.mateList.priceList)
    this.formatterBefore(this.mate.mateList.columns)
    this.formatterBefore(this.mate.mateList.lineColumns)
    this.mate.mateList.lineColumns.map((i) => { this.lineColumns[i.name] = i })
    this.mate.mateList.priceList.map((i) => { this.priceList[i.name] = i })
    this.mate.mateFormerHeader.fields.map((i) => { this.object[i.name] = i })
    this.mate.mateList.localName = this.mate.localName
  },
  mounted () {
    this.rowSelect()
    // this.showFlag = false
  },
  // 需要添加刷新消息
  methods: {
    query () {
      this.mate.mateList.lineRows = null
      const mate = [this.mate.mateSearch.values]
      const vm = this
      const url = this.mate.mateSearch.url
      this.$root.ajaxData(url, mate, function (data) {
        vm.mate.mateList.rows = data.mate.rows
        vm.mate.mateList.total = data.mate.total
      }, 'POST')
    },
    handleChange () {
    },
    DialogClickOK () {
      var vm = this
      const rowt = { id: this.multipleSelection.map((r) => r.id) }
      this.$root.ajaxData(this.btn.url + 2 + '?ids=' + rowt.id + '&approvalComments=' + this.cause, {}, function (data) {
        vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
          vm.mate.mateList.rows = data.mate.mateList.rows
        }, 'GET')
      }, 'PUT')
      this.cause = ''
    },
    updated () {
      this.showFlag = false
    },
    rowClick (row) {
      this.showFlag = true
      var vm = this
      this.$root.ajaxData(this.mate.mateList.url + '/' + row.id, {}, function (data) {
        vm.mate.mateList.lineRows = data
      }, 'GET')
    },
    confirm (act, row) {
      var vm = this
      if (act.action === 'addChild') {
        this.mate.mateFormerHeader.values = row
        this.dialogVisible = true
        return false
      }
    },
    back () {
      this.dialogTableVisible = false
    },
    handleButton (btn) {
      var vm = this
      let row = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      this.rowId = row
      // 入库单据中需要的审批按钮
      if (btn.action === 'auditIsPass') {
        if (this.multipleSelection[0].auditStatus === '3') {
          vm.$message({
            message: this.$t('examined'),
            type: 'warning'
          })
          return
        }
        if (this.multipleSelection[0].status !== 'undefined') {
          this.auditStatus = this.multipleSelection[0].auditStatus             // 将需要改变的那一行的状态显示在弹出框上
        }
        this.btn = btn
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$root.ajaxData(this.btn.url + 3 + '?ids=' + rowt.id, {}, function () {
          vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
            vm.mate.mateList.rows = data.mate.mateList.rows
          }, 'GET')
        }, 'PUT')
        return
      }
      if (btn.action === 'bohuiIsPass') {
        this.btn = btn
        if (this.multipleSelection[0].auditStatus === '2') {
          vm.$message({
            type: 'warning',
            message: vm.$t('noclose')
          })
          return false
        }
        this.dialogFormVisible = true
        this.btn = btn
        return
      }
      if (btn.action === 'updateQuotation') {
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
    getEtagStyle (v) {
      if (v) {
        return 'success'
      }
      return 'gray'
    },
    toUriParams (data) {
      return Object.keys(data).filter(i => !!data[i]).map(i => i + '=' + data[i]).join('&')
    },
    makeSectionPrice () {
      this.priceListFlag = true
      // 如果priceList里面为空，则让this.priceListRows为null，不然，this.priceList会缓存上一次的数据
      if (!this.mate.mateList.lineRows[this.lineRowsNum].priceList) {
        this.priceListRows = null
        return false
      }
      this.priceListRows = JSON.parse(this.mate.mateList.lineRows[this.lineRowsNum].priceList).priceList
    },
    // 获取数据，知道是明细行的第几行
    rowClickButton (row) {
      for (let i = 0; i < this.mate.mateList.lineRows.length; i++) {
        if (this.mate.mateList.lineRows[i].id === row.id) {
          this.lineRowsNum = i
        }
      }
    },
    cellClick (row, column, cell, event) {
      this.priceListRows = []
      if (column.property === 'priceTax') {
        this.priceListFlag = true
        // 先要判断row.priceList里面是否有值,不然row.priceList找不到会报错
        if (row.priceList) {
          this.priceListRows = row.priceList
        }
        // this.priceListRows = JSON.parse(this.mate.lineRows[this.lineRowsNum].priceList).priceList
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
  .tableLine{
     margin-top:40px;
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
  .lineTable{
    margin-top: 30px;
  }
  .priceDetailLine {
    position: relative;
    margin-top: 50px;
  }
  .priceLine {
    position: absolute;
    right: 0;
    top: -50px;
  }
</style>
