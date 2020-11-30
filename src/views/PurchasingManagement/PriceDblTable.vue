<template>
<div>
  <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
    <span slot="searchForm" class="leftMargin">
      <el-button  size="mini" type="primary" class="el-icon-search" @click="showSearchPopover">搜索</el-button>
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
          <el-table size="mini" fit highlight-current-row @row-click="rowClick" ref="table" :data="mate.mateList.rows" border  @selection-change="handleSelectionChange" @sort-change="sortChange" max-height="500" style="width: 100%;">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column v-if="col.isShow" :formatter="col.formatter" v-for="col of mate.mateList.columns" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="操作"  fixed="right" :width="actionWidth" v-if="mate.mateList.actions">
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
            layout="total,prev, pager, next, sizes"
            :total="mate.mateList.total"
            :page-sizes ="[5,10,15,20,30]"
            :page-size="pageSize">
        </el-pagination>
      </el-col>
      </el-row>
    </div>
  </Boxer>
  <el-dialog title="分段价格" :visible.sync="dialogPriceVisible" width="80%">
      <el-table size="mini" :data="priceList" border fit highlight-current-row style="width: 100%;">

          <el-table-column :label="priceColumns['lineNum'].label" width="60">
            <template slot-scope="scope">
              <span>{{scope.row[priceColumns['lineNum'].name]}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="priceColumns['qtyFrom'].label" >
            <template slot-scope="scope">
              <span>{{scope.row[priceColumns['qtyFrom'].name]}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="priceColumns['qtyTo'].label" >
            <template slot-scope="scope">
              <span>{{scope.row[priceColumns['qtyTo'].name]}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="priceColumns['priceTax'].label">
            <template slot-scope="scope">
              <span>{{scope.row[priceColumns['priceTax'].name]}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="priceColumns['discount'].label" >
            <template slot-scope="scope">
              <span>{{scope.row[priceColumns['discount'].name]}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="priceColumns['price'].label" >
            <template slot-scope="scope">
              <span>{{scope.row[priceColumns['price'].name]}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="priceColumns['dateFrom'].label" >
            <template slot-scope="scope">
              <span>{{scope.row[priceColumns['dateFrom'].name]}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="priceColumns['dateTo'].label" >
            <template slot-scope="scope">
              <span>{{scope.row[priceColumns['dateTo'].name]}}</span>
            </template>
          </el-table-column>

      </el-table>

      <div class="closed">
          <el-button @click="dlgPriceCancel">关 闭</el-button>
      </div>
  </el-dialog>

<!--定价明细-->
  <div class="priceDetailLine">
    <div class="definedLine">
    </div>
    <el-table size="mini" v-if="showGoodsPrice" :data="mate.mateList.lineRows" border style="width: 100%;" class="priceLine" show-overflow-tooltip>
      <el-table-column v-if="objectColumns['itemNumber'].isShow" :label="objectColumns['itemNumber'].label" :min-width="objectColumns['itemNumber'].width" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['itemNumber'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="objectColumns['subcode'].isShow" :label="objectColumns['subcode'].label" :min-width="objectColumns['subcode'].width" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['subcode'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="objectColumns['materialName'].isShow" :label="objectColumns['materialName'].label" :min-width="objectColumns['materialName'].width" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['materialName'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="objectColumns['specification'].isShow" :label="objectColumns['specification'].label" :min-width="objectColumns['specification'].width" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['specification'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="objectColumns['unit'].isShow" :label="objectColumns['unit'].label" :min-width="objectColumns['unit'].width" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['unit'].name]}}</span>
        </template>
      </el-table-column>

       <el-table-column v-if="objectColumns['category'].isShow" :label="objectColumns['category'].label" :min-width="objectColumns['materialName'].width" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['category'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="objectColumns['priceTax'].isShow" class="tablePriceTax" :label="objectColumns['priceTax'].label" :min-width="objectColumns['priceTax'].width">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['priceTax'].name]}}</span>
            <el-button class="buttonPriceTax" size="mini" @click="makeSectionPrice(scope.row[objectColumns['priceList'].name])">分段价格</el-button>
            <span style="display:none;">{{scope.row[objectColumns['priceList'].name]}}</span>
          </template>
        </el-table-column>

      <el-table-column v-if="objectColumns['price'].isShow" :label="objectColumns['price'].label" :min-width="objectColumns['price'].width">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['price'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="objectColumns['supplierMaterialCode'].isShow" :label="objectColumns['supplierMaterialCode'].label" :min-width="objectColumns['supplierMaterialCode'].width" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['supplierMaterialCode'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="objectColumns['supplierMaterialName'].isShow" :label="objectColumns['supplierMaterialName'].label" :min-width="objectColumns['supplierMaterialName'].width" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['supplierMaterialName'].name]}}</span>
          </template>
        </el-table-column>

      <el-table-column v-if="objectColumns['dateFrom'].isShow" :label="objectColumns['dateFrom'].label" :min-width="objectColumns['dateFrom'].width">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['dateFrom'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="objectColumns['dateTo'].isShow" :label="objectColumns['dateTo'].label" :min-width="objectColumns['dateTo'].width">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['dateTo'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="objectColumns['remark'].isShow" :label="objectColumns['remark'].label" :min-width="objectColumns['remark'].width">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['remark'].name]}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>

      <el-dialog title="查看详情" :visible.sync="dialogVisible"   width="80%"  >
        <el-row>
            <DialogForm :mate="mate.mateFormerHeader"  formModel="dialog" ></DialogForm>
         </el-row>
          <el-row>
         <template>
           <el-table size="mini" v-if="showGoodsPrice" :data="mate.mateList.lineRows" border style="width: 100%;" class="detailTable">
              <el-table-column :label="objectColumns['itemNumber'].label" width="100">
                <template slot-scope="scope">
             <span>{{scope.row[objectColumns['itemNumber'].name]}}</span>
            </template>
            </el-table-column>

          <el-table-column :label="objectColumns['subcode'].label" width="150">
            <template slot-scope="scope">
              <span>{{scope.row[objectColumns['subcode'].name]}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="objectColumns['materialName'].label" width="150">
            <template slot-scope="scope">
              <span>{{scope.row[objectColumns['materialName'].name]}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="objectColumns['specification'].label" >
            <template slot-scope="scope">
              <span>{{scope.row[objectColumns['specification'].name]}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="objectColumns['unit'].label" >
            <template slot-scope="scope">
               <span>{{scope.row[objectColumns['unit'].name]}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="objectColumns['category'].label" width="150">
            <template slot-scope="scope">
              <span>{{scope.row[objectColumns['category'].name]}}</span>
            </template>
          </el-table-column>

          <el-table-column class="tablePriceTax" :label="objectColumns['priceTax'].label" width="150">
            <template slot-scope="scope">
              <span>{{scope.row[objectColumns['priceTax'].name]}}</span>
                <el-button class="buttonPriceTax" size="mini" @click="makeSectionPrice(scope.row[objectColumns['priceList'].name])">分段价格</el-button>
              <span style="display:none;">{{scope.row[objectColumns['priceList'].name]}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="objectColumns['price'].label" >
            <template slot-scope="scope">
              <span>{{scope.row[objectColumns['price'].name]}}</span>
            </template>
          </el-table-column>

        <el-table-column :label="objectColumns['dateFrom'].label" width="130">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['dateFrom'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['dateTo'].label">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['dateTo'].name]}}</span>
            </template>
        </el-table-column>
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
import { API_GATEWAY } from '@/config/index.js'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
function trimSpace (str) {
  try {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
  } catch (e) {
    return str
  }
}

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
      pageSize: 5,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      langs: LANGS,
      hasSelected: false,
      searchValues: {},
      page: 0,
      sortValues: {},
      showAdvancedSearchPopover: false,
      action: null,
      dialogTableVisible: false,          // dialog开关
      tableData: [],
      word: this.$t('query'),
      showFlag: false,                    // 下面表格的开关
      showInquiry: false,
      dialogVisible: false,
      object: {},                          // 放columns
      objectColumns: {},
      showGoodsPrice: false,
      priceColumns: {},
      cause: '',
      priceList: [],
      dialogPriceVisible: false,
      fit: false,
      dialogFormVisible: false,
      valueStatus: '',
      dialogAuditVisible: false,
      dialogInquiryVisible: false,
      auditStatus: '',
      rowId: {},             // 点击table前面的框框
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
      this.formatterBefore(this.mate.mateList.lineColumns)
      this.formatterBefore(this.mate.mateList.lineRows)
      this.mate.mateList.localName = this.mate.localName
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
    this.formatterBefore(this.mate.mateList.columns)
    this.formatterBefore(this.mate.mateList.lineColumns)
    this.formatterBefore(this.mate.mateList.lineRows)
    this.mate.mateFormerHeader.fields.map((i) => { this.object[i.name] = i })
    if (this.mate.mateList.priceList) {
      this.mate.mateList.priceList.map((i) => { this.priceColumns[i.name] = i })
    }
    this.mate.mateList.localName = this.mate.localName
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
    showSearchPopover () {
      this.showAdvancedSearchPopover = !this.showAdvancedSearchPopover
    },
    handleChange () {
    },
    dialogDetailLineFalse () {
      this.dialogDetailLine = false
    },
    dialogDetailLineTrue () {
      this.dialogDetailLine = true
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
      this.showInquiry = false
      this.showGoodsPrice = false
      var vm = this

      if (this.mate.mateList.url.indexOf('/purchase/inquiry/line/all') >= 0) {
        this.showFlag = false
        this.showInquiry = true
        this.mate.mateList.lineColumns.map((i) => { this.objectColumns[i.name] = i })
      }

      if (this.mate.mateList.url.indexOf('/purchase/goodsPricing/line/all') >= 0) {
        this.showFlag = false
        this.showGoodsPrice = true
        this.mate.mateList.lineColumns.map((i) => { this.objectColumns[i.name] = i })
      }
      this.$root.ajaxData(this.mate.mateList.url + '/' + row.id, {}, function (data) {
        vm.mate.mateList.lineRows = data
      }, 'GET')
      // this.$alert(this.objectColumns['itemNumber'].isShow)
    },
    back () {
      this.dialogTableVisible = false
    },
    handleButton (btn) {
      var vm = this
      let row = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      this.rowId = row
      if (btn.action === 'add') {
        this.$root.handleAction(btn, row, function () {})
      }
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
      // 采购定价修改控制
      if (btn.action === 'updataIsPass') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        if (this.multipleSelection[0].status !== 'undefined') {
          this.auditStatus = this.multipleSelection[0].auditStatus             // 将需要改变的那一行的状态显示在弹出框上
        }
        if (this.auditStatus !== '0' && this.auditStatus !== '2') {
          vm.$message({
            type: 'warning',
            message: vm.$t('noChange')
          })
          return false
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {})
        return
      }
      // 采购定价生产合格供应商
      if (btn.action === 'beQualifiedSupplier') {
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
       // this.$root.handleAction(btn, row, function () {})
        this.$http.get(API_GATEWAY + '/api/purchase/goods/pricing/genQualifySupplier?ids=' + row.id)
          .then(response => {
            if (response.data.statusCode === 403) {
              vm.$message({
                type: 'warning',
                message: vm.$t('No approval')
              })
              return false
            } else if (response.data.statusCode === 409) {
              vm.$message({
                type: 'warning',
                message: vm.$t('existing')
              })
              return false
            } else if (response.data.statusCode === 40014) {
              vm.$message({
                type: 'warning',
                message: '系统中无该供应商信息'
              })
              return false
            } else {
              vm.$message({
                type: 'success',
                message: vm.$t('Ocompleted')
              })
            }
          })
        return
      }
      // 采购定价提交审批
      if (btn.action === 'submitAudit') {
        if (this.multipleSelection[0].auditStatus > 0) {
          vm.$message({
            type: 'warning',
            message: '不能提交审批'
          })
          return
        }
        this.btn = btn
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$root.ajaxData(this.btn.url + 1 + '?ids=' + rowt.id, {}, function (data) {
          if (data.statusCode === 40039) {
            vm.$message({
              type: 'warning',
              message: '该供应商未审批'
            })
            return
          }
          vm.$root.monitor({ url: '/purchase/goods/pricing/all/list', method: 'GET' })
        }, 'PUT')
        return
      }
      // 采购定价的审批按钮
      if (btn.action === 'auditIsPass') {
        if (this.multipleSelection[0].auditStatus !== '1') {
          vm.$message({
            type: 'warning',
            message: '不是待审批状态，不能审批'
          })
          return
        }
        if (this.multipleSelection[0].status !== 'undefined') {
          this.auditStatus = this.multipleSelection[0].auditStatus             // 将需要改变的那一行的状态显示在弹出框上
        }
        this.btn = btn
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$root.ajaxData(this.btn.url + 3 + '?ids=' + rowt.id, {}, function () {
          vm.$root.monitor({ url: '/purchase/goods/pricing/all/list', method: 'GET' })
        }, 'PUT')
        return
      }
      // 采购定价驳回
      if (btn.action === 'bohuiIsPass') {
        // 驳回只有审批状态是待审批，头状态是变更处理中和新建才能驳回
        if (this.multipleSelection[0].auditStatus === '1') {
          // && (this.multipleSelection[0].state === '0' || this.multipleSelection[0].state === '5')
          if (this.multipleSelection[0].status !== 'undefined') {
            this.auditStatus = this.multipleSelection[0].auditStatus             // 将需要改变的那一行的状态显示在弹出框上
          }
          this.dialogFormVisible = true
          this.btn = btn
          return
        } else {
          vm.$message({
            type: 'warning',
            message: '不能驳回'
          })
          return
        }
      }
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
    confirm (act, row) {
      var vm = this
      if (act.action === 'addChild') {
        this.mate.mateFormerHeader.values = row
        this.dialogVisible = true
        return false
      }
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
      }
      this.$root.ajaxData(url, param, function (data) {
        vm.updateData(data)
      })
    },
    updateData (data) {
      if (data.mate.rows) {
        this.mate.mateList.rows = data.mate.rows
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
    makeSectionPrice (priceList) {
      if (priceList === undefined || priceList === null || trimSpace(priceList) === '') {
        this.priceList = []
      } else {
        var obj = JSON.parse(priceList)
        this.priceList = obj.priceList
      }

      this.dialogPriceVisible = true
    },
    dlgPriceCancel () {
      this.dialogPriceVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
  .buttonPriceTax {
    position: absolute;
    right: 10px;
    button {
      padding: 7px 15px;
      background-color: #fff;
      cursor: pointer;
    }
  }
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
  .detailTable{
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
  .select-button{
    margin-top: 20px;
  }
  .detailLine{
    position: relative;
  }
  .definedLine{
    position: absolute;
    right: 10px;
    button {
      padding: 7px 15px;
      background-color: #fff;
      cursor: pointer;
    }
  }
  .tableTop{
    position: absolute;
    margin-bottom: 50px;
  }
  .el-table td, .el-table th {
    height: 30px;
  }
  .priceDetailLine {
    margin-top: 10px;
    position: relative;
  }
  // .priceLine {
  //   position: absolute;
  //   top: 40px;
  // }
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
  .closed {
    margin: 10px 0;
    button {
      padding: 7px 15px;
      background-color: #fff;
      cursor: pointer;
    }
  }
  .el-dialog__header {
    padding: 10px 10px 0;
  }
  .el-dialog__body {
    padding: 10px 10px;
  }
</style>
