<template>
<div>
  <div class="query" style="margin-bottom:20px">
    <el-row :gutter="20">
      <el-col :sm="6" :md="4" :lg="4">
        <el-select clearable v-model="companyNameId" placeholder="请选择客户名称" @visible-change="visibleChangeCompany" @change="changeCompany" size="mini">
          <el-option :label="item.label" :value="item.value" v-for="item of companySelect" :key="item.value"></el-option>
        </el-select>
      </el-col>
      <el-col :sm="6" :md="4" :lg="4">
        <el-input clearable v-model="opNum" placeholder="请填写客户po" size="mini"></el-input>
      </el-col>
      <el-col :sm="6" :md="4" :lg="4">
        <el-select clearable v-model="poSelect" placeholder="请选择查询参数" size="mini">
          <el-option :label="item.label" :value="item.value" v-for="item of poSelectOptions" :key="item.value"></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
  <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
    <span slot="search" class="leftMargin">
      <search-form v-if="mate.mateList.essearch" :essearch="mate.mateList.essearch" @essearch="todoEssearch">  </search-form>
      <Formor v-else-if="mate.mateList.search" :mate="mate.mateList.search" v-on:search="search" class="leftFloat" :word="word"></Formor>
    </span>
    
    <div slot="main">
      <el-row>
        <el-col :span="24">
          <el-table size="mini" highlight-current-row @row-click="rowClick" ref="table" :data="mate.mateList.rows" border  @selection-change="handleSelectionChange" @sort-change="sortChange" max-height="250" style="width: 100%;">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column  v-for="col of mate.mateList.columns"  v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip :formatter="col.formatter">
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
            layout="total, prev, pager, next, sizes"
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
      <el-table fit highlight-current-row size="mini" v-if="showFlag" :data="mate.mateList.lineRows" border style="width: 100%;" class="DblTableOrder" >
        <el-table-column show-overflow-tooltip v-if="lineColumns['lineNum'].isShow" :label="lineColumns['lineNum'].label" :prop="lineColumns['lineNum'].name" :min-width="lineColumns['lineNum'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['subcode'].isShow" :label="lineColumns['subcode'].label" :prop="lineColumns['subcode'].name" :min-width="lineColumns['subcode'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['materialName'].isShow" :label="lineColumns['materialName'].label" :prop="lineColumns['materialName'].name" :min-width="lineColumns['materialName'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['category'].isShow" :label="lineColumns['category'].label" :prop="lineColumns['category'].name" :min-width="lineColumns['category'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['priceTax'].isShow" :formatter="lineColumns['priceTax'].formatter" :label="lineColumns['priceTax'].label" :prop="lineColumns['priceTax'].name" :min-width="lineColumns['priceTax'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['priceTax'].isShow" :formatter="lineColumns['price'].formatter" :label="lineColumns['price'].label" :prop="lineColumns['price'].name" :min-width="lineColumns['price'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['needDate'].isShow" :label="lineColumns['needDate'].label" :prop="lineColumns['needDate'].name" :min-width="lineColumns['needDate'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['promiseDate'].isShow" :label="lineColumns['promiseDate'].label" :prop="lineColumns['promiseDate'].name" :min-width="lineColumns['promiseDate'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['qty'].isShow" :label="lineColumns['qty'].label" :prop="lineColumns['qty'].name" :min-width="lineColumns['qty'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['unit'].isShow" :label="lineColumns['unit'].label" :prop="lineColumns['unit'].name" :min-width="lineColumns['unit'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['money'].isShow" :label="lineColumns['money'].label" :prop="lineColumns['money'].name" :min-width="lineColumns['money'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['effective'].isShow" :label="lineColumns['effective'].label" :prop="lineColumns['effective'].name" :min-width="lineColumns['effective'].width" :formatter="lineColumns['effective'].formatter"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['remark'].isShow" :label="lineColumns['remark'].label" :prop="lineColumns['remark'].name" :min-width="lineColumns['remark'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['changeInstructions'].isShow" :label="lineColumns['changeInstructions'].label" :prop="lineColumns['changeInstructions'].name" :min-width="lineColumns['changeInstructions'].width">
          <template slot-scope="scope">
            <el-input :disabled="changeable" size="mini" @focus="focus" v-model="scope.row[lineColumns['changeInstructions'].name]"></el-input>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['active'].isShow" :label="lineColumns['active'].label" :prop="lineColumns['active'].name" :min-width="lineColumns['active'].width">
          <template slot-scope="scope">
            <el-select size="mini" :disabled="changeable" clearable v-model="scope.row[lineColumns['active'].name]">
              <el-option :label="item.label" :value="item.value" v-for="item of activeOptions" :key="item.value"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" :width="actionWidth" >
            <template slot-scope="scope">
            <el-button size="mini"   @click="despatch(scope.row.id)">发运信息</el-button>
            </template>
          </el-table-column>
      </el-table>
    </div>
  </template>
  <el-dialog title="查看详情" :visible.sync="dialogVisible"   width="80%">
      <el-row>
         <DialogForm :mate="mate.mateFormerHeader"  formModel="dialog" ></DialogForm>
        </el-row>
        <el-row>
          <template>
            <el-table size="mini" v-if="showFlag" :data="mate.mateList.lineRows" border style="width: 100%;" class="tableLine">
                <el-table-column show-overflow-tooltip v-if="lineColumns['lineNum'].isShow" :label="lineColumns['lineNum'].label" :prop="lineColumns['lineNum'].name" :min-width="lineColumns['lineNum'].width"></el-table-column>
                <el-table-column show-overflow-tooltip v-if="lineColumns['subcode'].isShow" :label="lineColumns['subcode'].label" :prop="lineColumns['subcode'].name" :min-width="lineColumns['subcode'].width"></el-table-column>
                <el-table-column show-overflow-tooltip v-if="lineColumns['materialName'].isShow" :label="lineColumns['materialName'].label" :prop="lineColumns['materialName'].name" :min-width="lineColumns['materialName'].width"></el-table-column>
                <el-table-column show-overflow-tooltip v-if="lineColumns['needDate'].isShow" :label="lineColumns['needDate'].label" :prop="lineColumns['needDate'].name" :min-width="lineColumns['needDate'].width"></el-table-column>
                <el-table-column show-overflow-tooltip v-if="lineColumns['promiseDate'].isShow" :label="lineColumns['promiseDate'].label" :prop="lineColumns['promiseDate'].name" :min-width="lineColumns['promiseDate'].width"></el-table-column>
                <el-table-column show-overflow-tooltip v-if="lineColumns['priceTax'].isShow" :formatter="lineColumns['priceTax'].formatter" :label="lineColumns['priceTax'].label" :prop="lineColumns['priceTax'].name" :min-width="lineColumns['priceTax'].width"></el-table-column>
                <el-table-column show-overflow-tooltip v-if="lineColumns['qty'].isShow" :label="lineColumns['qty'].label" :prop="lineColumns['qty'].name" :min-width="lineColumns['qty'].width"></el-table-column>
                <el-table-column show-overflow-tooltip v-if="lineColumns['unit'].isShow" :label="lineColumns['unit'].label" :prop="lineColumns['unit'].name" :min-width="lineColumns['unit'].width"></el-table-column>
                <el-table-column show-overflow-tooltip v-if="lineColumns['money'].isShow" :label="lineColumns['money'].label" :prop="lineColumns['money'].name" :min-width="lineColumns['money'].width"></el-table-column>
                <el-table-column show-overflow-tooltip v-if="lineColumns['effective'].isShow" :label="lineColumns['effective'].label" :prop="lineColumns['effective'].name" :min-width="lineColumns['effective'].width" :formatter="lineColumns['effective'].formatter"></el-table-column>
                <el-table-column show-overflow-tooltip v-if="lineColumns['remark'].isShow" :label="lineColumns['remark'].label" :prop="lineColumns['remark'].name" :min-width="lineColumns['remark'].width"></el-table-column>
                <el-table-column show-overflow-tooltip v-if="lineColumns['changeInstructions'].isShow" :label="lineColumns['changeInstructions'].label" :prop="lineColumns['changeInstructions'].name" :min-width="lineColumns['changeInstructions'].width"></el-table-column>
                <el-table-column show-overflow-tooltip v-if="lineColumns['active'].isShow" :label="lineColumns['active'].label" :prop="lineColumns['active'].name" :min-width="lineColumns['active'].width"></el-table-column>
            </el-table>
          </template>
      </el-row>
    </el-dialog>
    <el-dialog title="查看发运信息" :visible.sync="dialogDespatchVisible"   width="80%">
         <template>
          <el-table size="mini" :data="despatchList" border style="width: 100%;">
            <el-table-column show-overflow-tooltip  v-for="col of mate.mateList.despatchList"   :formatter="col.formatter" :key="col.id" :label="col.label" :prop="col.name" :min-width="col.width">
          </el-table-column>
          </el-table>
         </template>
    </el-dialog>
</div>
</template>

<script scoped>
import SearchForm from '../../components/SearchForm'
import { LANGS } from '../../i18n/lang'
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
    mateFormerHeaderId: String
  },
  data () {
    return {
      pageSize: 5,
      currentPage: 1,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      langs: LANGS,
      hasSelected: false,
      searchValues: {},
      page: 1,
      dialogDespatchVisible: false,
      despatchList: [],
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
      lineRowsNum: 0,
      checkAll: false,
      checkedLabel: [],
      isIndeterminate: true,
      lineSelected: [],               // 存放全部的label
      lineSelectedDetail: [],         // 存放全部的明细行label
      msgBoxButton: true,
      dialogDetailLine: false,
      companyNameId: '',
      companySelect: [],
      opNum: '',                  // 这里是一个空字符串
      poSelect: '',
      companyName: '',
      changeable: false,
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
        'Content-Type': 'application/json;charset=utf8'
      },      
      poSelectOptions: [
        {
          'label': '要确认的客户po',
          'value': '7'
        },
        {
          'label': '所有客户po',
          'value': ''
        },
        {
          'label': '变更正等待客户确认的客户po',
          'value': '5'
        }
      ],
      activeOptions: [
        {
          'label': '1.接受',
          'value': '1'
        },
        {
          'label': '2.拒绝',
          'value': '2'
        },
        {
          'label': '3.请求更改',
          'value': '3'
        }
      ]
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.formatterBefore(this.mate.mateList.columns)
      this.formatterBefore(this.mate.mateList.lineColumns)
      this.formatterBefore(this.mate.mateList.despatchList)
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
    this.formatterBefore(this.mate.mateList.lineColumns)
    this.formatterBefore(this.mate.mateList.despatchList)
    this.mate.mateList.lineColumns.map((i) => { this.lineColumns[i.name] = i })
    this.mate.mateFormerHeader.fields.map((i) => { this.object[i.name] = i })
  },
  mounted () {
    this.rowSelect()
    // this.showFlag = false
  },
  // 需要添加刷新消息
  methods: {
    focus () {
      if (!this.multipleSelection.length) {
        this.message('warning', '请在头信息中选择一行数据')
      }
    },
    changeCompany (val) {
      const vm = this
      this.companySelect.forEach(i => {
        if (val === i.value) {
          vm.companyName = i.label
        }
      })
    },
    // 打开时获取客户的数据
    visibleChangeCompany (flag) {
      const vm = this
      if (flag) {
        if (this.companySelect.length === 0) {
          this.$root.ajaxData('/companys/companyInfo/4?dataOnly=true&auditStatus=1&status=1&nopaing=true', {}, function (data) {
            data.forEach(i => {
              vm.companySelect.push({ 'label': i.name, 'value': i.id })
            })
          }, 'GET')
        }
      }
    },
    updated () {
      this.showFlag = false
    },
    rowClick (row) {
      this.showFlag = true
      var vm = this
      if (row.state === '0' || row.state === '6') {
        this.changeable = false
      } else {
        this.changeable = true
      }
      this.$root.ajaxData('/purchase/purchaseOrder/all/' + row.id, {}, function (data) {
        vm.mate.mateList.lineRows = data
      }, 'GET')
    },
    back () {
      this.dialogTableVisible = false
    },
    despatch (pdGoodsPricingId) {
      var vm = this
      this.dialogDespatchVisible = true
      this.$root.ajaxData('/purchase/po/despatch/getPoDespatch/' + pdGoodsPricingId, {}, function (data) {
        if(null!=data&&data.length>0){
          for(var i=0;i<data.length;i++){
            if(null!=data[i].qty&&null!=data[i].price){
              data[i].moneyAmount=(data[i].qty*data[i].price).toFixed(2)
            }
          }
        }
        vm.despatchList = data
      })
    },
    confirm (act, row) {
      var vm = this
      if (act.action === 'addChild') {
        this.mate.mateFormerHeader.values = row
        this.dialogVisible = true
        return false
      }
      if (act.action === 'printOrder') {
        let url = ''
        if(row.ebsPoHeaderId == null){
            url = API_GATEWAY + '/api'+act.url + 'pd_good_pricing?format=pdf&ID='+row.id
        }else {
            url = API_GATEWAY + '/api'+act.url + 'ebs_pd_good_pricing?format=pdf&ID='+row.id+'&CUSTOMERNAME='+row.customerName
        }
        vm.$http({
          url: url,
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
            'Accept': 'application/json',
            'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
          },
          responseType: 'arraybuffer'
        }).then(function (response) {
          var blob = new Blob([response.data], { type: 'application/pdf' })
          // blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          //var windowOpen = window.open('/static/pdf/web/viewer.html?file=' + objectUrl)
          var windowOpen = window.open(objectUrl)
          if(windowOpen == null || typeof(windowOpen) === 'undefined'){
             this.$message({
              message: '采购订单预览界面被拦截,请检查浏览器设置',
              type: 'warning'
            })
          }
        })
      }
    },
    message (type, message) {
      this.$message({
        type: type,
        message: message
      })
    },
    handleButton (btn) {
      var vm = this
      //导出
      if (btn.action === 'exportPoHeaders') {
        this.$http({
                  url: API_GATEWAY + '/api/purchase/goods/pricing/export/po/headers',
                  method: 'GET',
                  responseType: 'arraybuffer',
                  headers: this.headers,
              }).then(function (response) {
                  var blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
                  var objectUrl = URL.createObjectURL(blob)
                  var a = document.createElement('a')
                  document.body.appendChild(a)
                  a.setAttribute('style', 'display:none')
                  a.setAttribute('href', objectUrl)
                  var filename = 'export.xlsx'
                  a.setAttribute('download', filename)
                  a.click()
                  URL.revokeObjectURL(objectUrl)
              })
        return
      }
      const row = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      this.rowId = row
      // 查询
      if (btn.action === 'query') {
        if (!this.companyNameId) {
          this.message('warning', '请先选择客户名称')
          return
        }
        this.$root.ajaxData(`/purchase/cusPoToSo/all?customerName=${this.companyName}&goodsName=${this.opNum}&state=${this.poSelect}`, {}, function (data) {
          vm.mate.mateList.rows = data.mate.rows;
          vm.pageSize = data.mate.size;
          vm.mate.mateList.total = data.mate.total;
          vm.mate.mateList.lineRows = [];
        }, 'GET')
        return
      }
      // 除了查询不要选，其他的按钮都要选一条数据
      if (!this.multipleSelection.length === 1) {
        this.message('warning', '请选择一条数据!')
        return
      }
      const id = this.multipleSelection[0].id
      const state = this.multipleSelection[0].state
      const mate = {}
      mate.mateFormerHeader = this.multipleSelection[0]
      mate.mateList = this.mate.mateList.lineRows
      // 整单接收
      if (btn.action === 'allReceive') {
        if (state === '0' || state === '6') {
          this.$root.ajaxData(`/purchase/cusPoToSo/update/${id}/3`, {}, function () {
            vm.$root.monitor({ url: '/purchase/cusPoToSo/getAllPo' })
          }, 'PUT')
          return
        } else {
          this.message('warning', '不是新建、已变更状态')
        }
        return
      }
      // 整单拒绝
      if (btn.action === 'allReject') {
        if (state === '0' || state === '6') {
          this.$root.ajaxData(`/purchase/cusPoToSo/update/${id}/4`, {}, function () {
            vm.$root.monitor({ url: '/purchase/cusPoToSo/getAllPo' })
          }, 'PUT')
          return
        } else {
          this.message('warning', '不是新建、已变更状态')
        }
        return
      }
      // 保存
      if (btn.action === 'save') {
        if (state === '0' || state === '6') {
          for (let i = 0; i < mate.mateList.length; i++) {
            // 先让用户选择活动
            if (!mate.mateList[i].active) {
              vm.message('warning', '请选择活动!')
              return
            }
            // 若用户选择了
            if (mate.mateList[i].active === '3' && mate.mateList[i].changeInstructions === '') {
              vm.message('warning', '请完成变更说明和活动信息')
              return
            }
          }
          this.$root.ajaxData(`/purchase/cusPoToSo/update/${id}/5`, mate, function () {
            vm.$root.monitor({ url: '/purchase/cusPoToSo/getAllPo' })
          }, 'PUT')
          return
        } else {
          this.message('warning', '不是新建或已变更状态，不能保存!')
          return
        }
      }
      // 客户po转so
      if (btn.action === 'updataDetailBill') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        if (this.multipleSelection[0].state !== '3') {
          vm.$message({
            message: '该订单未确认',
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
          } else if (data.statusCode === 40038) {
            vm.$message({
              type: 'warning',
              message: '该客户未审批'
            })
            return false
          } else {
            vm.$message({
              type: 'success',
              message: vm.$t('Successful operation')
            })
            vm.$bus.emit('refreshview', data)
          }
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
    /* position: absolute;
    top: 50px; */
  }
  .tableLine{
    margin-top: 30px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
</style>
