<template>
  <div class="InvoicePayment">
    <!--最上面的搜索-->
    <div class="searchForm">
      <el-row :gutter="10">
        <el-form>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <!-- <el-input size="mini" v-model="officeName" placeholder="业务实体"></el-input> -->
              <el-select size="mini" clearable filterable v-model="officeName" placeholder="业务实体">
                <el-option
                  v-for="item in officeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <!-- <el-input size="mini" v-model="officeName" placeholder="业务实体"></el-input> -->
              <el-select size="mini" clearable filterable v-model="buyerName" placeholder="采购员">
                <el-option
                  v-for="item in buyerOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-input size="mini" v-model="seller" placeholder="供应商名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-select size="mini" clearable v-model="state" placeholder="状态">
                <el-option
                  v-for="item in stateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-date-picker size="mini" v-model="beginDate" type="date" placeholder="结算单日期从"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-date-picker size="mini" v-model="toDate" type="date" placeholder="结算单日期至"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="8" :md="8" :lg="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="searchCondition">查询</el-button>
              <el-button size="mini" type="info" @click="clearCondition1">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
      <div slot="main">
        <div class="query" v-if="mate.mateSearch">
      </div>
      <div>
        <el-row>
          <el-col :span="24">
            <el-table stripe size="mini" highlight-current-row @row-click="rowClick" ref="table" :data="mate.mateList.rows" @selection-change="handleSelectionChange" max-height="300" style="width: 100%; margin-top:15px">
              <el-table-column align="center" type="selection" width="50"></el-table-column>
              <el-table-column align="center" v-if="col.blockHash" :formatter="col.formatter" v-for="col of mate.mateList.columns" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
                <template slot-scope="scope">
                <el-button type="text" size="mini" v-show="scope.row.blockHash" @click="clickBlockHash(scope.row,scope.row.blockHash)"><img src="../../assets/imgs/ztree/ic_chain.png" style="width:13px; height:13px;margin:-2px 2px">{{ scope.row.invoiceNum }}</el-button>
                  <span v-show="!scope.row.blockHash" >{{ scope.row.invoiceNum }} </span>
                </template>
              </el-table-column>
              <el-table-column align="center" v-if="col.name == 'state'" v-for="col of mate.mateList.columns" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.state == 0 ? '新建' : scope.row.state == 1 ? '已确认' : '已生成ebs发票' }} </span>
                </template>
              </el-table-column>
              <el-table-column align="center" v-if="col.isShow" v-for="(col,index) of mate.mateList.columns" v-bind:key="col.name+index" :formatter="col.formatter" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              </el-table-column>
              <el-table-column align="center" v-if="col.oaStatus" v-for="col of mate.mateList.columns" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="scope.row.oaStatus === '0'" >驳回</span>
                  <span v-else-if="scope.row.oaStatus === '1'" >已审批</span>
                  <span v-else-if="scope.row.oaStatus === '2'" >已推送</span>
                  <span v-else>无</span>
                </template>
              </el-table-column>
              <el-table-column align="center" fixed="right" label="操作" :width="actionWidth" v-if="mate.mateList.actions">
                <template slot-scope="scope">
                  <k-btn v-for="act of mate.mateList.actions" v-bind:key="act.action" size="mini" :act="act" :icon="act.icon" :row="scope.row" @action="handleAction"></k-btn>
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
            :current-page.sync="mate.mateList.page"
            layout="total, prev, pager, next, sizes"
            :total="mate.mateList.total"
            :page-sizes ="[5,10,15,20,30]"
            :page-size="pageSize">
        </el-pagination>
      </el-col>
      </el-row>
      </div>
    </div>
  </Boxer>
  <!--下面的明细表格-->
  <template>
    <div class="detailLine">
      <el-table max-height="300" size="mini" v-if="showFlag" :data="mateListRows" stripe  class="tableTop" v-show="showPurDetial">
        <el-table-column align="center" show-overflow-tooltip v-if="col.isShow" :formatter="col.formatter" v-for="col of mate.mateList.lineColumns" :key="col.id" :label="col.label" :prop="col.name" :min-width="col.width">
        </el-table-column>
      </el-table>
    </div>
    <!-- <el-dialog  title="查看区块信息" :visible.sync="blockHashVisible" width="40%">
    <BlockHash :hashForm="hashForm" :setId="setId">
    </BlockHash>
  </el-dialog> -->
  </template>
  <el-dialog title="查看区块信息" :visible.sync="blockHashVisible" width="50%">
    <blockHash :hashForm="hashForm" :setId="setId" :rowHash="rowHash">
    </blockHash>
  </el-dialog>
  <el-dialog  title="查看对账单" :visible.sync="showFile" width="20%">
     <template>
    <el-table :data="tableData" style="width: 100%" size="mini" center>
      <el-table-column  prop="lineNo" label="序号" width="180"></el-table-column>
      <el-table-column  label="文件" width="180">
        <template slot-scope="scope">
            <el-button size="mini" type="text" @click="showInvoice(scope.row.name)">查看文件</el-button>
          </template>
      </el-table-column>
    </el-table>
  </template>
  </el-dialog>
  </div>
</template>

<script>
import { API_GATEWAY } from '@/config/index.js'
import SearchForm from '../../components/SearchForm'
import { LANGS } from '../../i18n/lang'
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import {DateFormat} from '../../utils/util'
const BASEAPI = `${API_GATEWAY}/api`
import BlockHash from '../../components/BlockHash1.vue'
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    SearchForm,
    BlockHash,
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
      buyerName: '',
      officeName: '',
      setId: '',
      rowHash: {},
      blockHashVisible: false,
      labelWidth: '100px',
      showFile: false,
      tableData: [],
      officeOptions: [],//搜索业务实体的options
      buyerOptions: [], //采购员的options
      seller: '',
      state: '',
      stateOptions: [
        {
          value: 0,
          label: '新建'
        },
        {
          value: 1,
          label: '已确认'
        },
        {
          value: 2,
          label: '已生成ebs发票'
        }
      ],
      blockHashVisible: false,
      beginDate: null,
      toDate: null,
      fullscreenLoading: true,
      page: 1,
      pageSize: 5,
      hasSelected: false,
      msgBoxButton: true,
      titleOptions: [],
      operatorOptions: [],
      sortValues: {},
      searchValues: {},
      showFlag: false,                    // 下面表格的开关
      showAdvancedSearchPopover: false,
      dialogDetailLine: false,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      andOrSymbolOptions: [],
      mateListRows: [],                  // 应付发票明细行
      showPurDetial: true,
      mateMateList: {},
      rowsContent: []
    }
  },

  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.formatterBefore(this.mate.mateList.columns)
      this.formatterBefore(this.mate.mateList.lineColumns)
      this.rowsContent = this.mate.mateList.rows
      this.mate.mateList.localName = this.mate.localName
      // 如果是点击左边的菜单，则将搜索条件去掉
      if (this.mate.localName) {
        this.clearCondition1()
      }
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },

  created () {
    this._getBuyerOption()
    this._getUnitOption()
    this.mateMateList = this.mate.mateList
    this.formatterBefore(this.mateMateList.columns)
    this.formatterBefore(this.mateMateList.lineColumns)
    this.rowsContent = this.mateMateList.rows
    this.mateMateList.localName = this.mate.localName
    var user = window.sessionStorage.getItem('user')
    if (user) {
      user = JSON.parse(user)
    }
    this.user = user
    if (this.mate.mateSearch) {
      this.titleOptions = this.mate.mateSearch.fields[0].options
      this.operatorOptions = this.mate.mateSearch.fields[1].options
      this.andOrSymbolOptions = this.mate.mateSearch.fields[3].options
    }
  },
    computed: {
    actionWidth: function () {
      return '230px'
    },
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        width = '100px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '100px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  mounted () {
    this.rowSelect()
  },
  methods: {

     // 获取采购员信息
    _getBuyerOption () {
      var vm = this
      this.$root.ajaxData('/users/getUserDropdownList', {}, function (data) {
        for (var i = 0; i < data.length; i++) {
          let param = {}
          data[i].value = data[i].firstname + data[i].lastname
          param.label = data[i].value
          param.value = data[i].id
          vm.buyerOptions.push(param)
        }
        
      }, 'GET')
    },

     // 获取销方业务实体
    _getUnitOption () {
      var vm = this
      this.$root.ajaxData('/offices/current/offices', {}, function (data) {
        for (var i = 0; i < data.length; i++) {
          data[i].value = data[i].name
        }
        vm.officeOptions = data
      }, 'GET')
    },

    clickBlockHash (row, blockHash) {
      var vm = this
      this.setId = row.id
      this.rowHash = row
      this.$http({
        url: API_GATEWAY + '/hyper/block/hash/query/' + blockHash,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
          'Accept': 'application/json',
          'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
          'Content-Type': 'application/json;charset=utf8'
        },
        responseType: 'application/json'
      }).then(function (response) {
        console.log(response)
        if (response.data.length > 0) {
          vm.blockHashVisible = true
          vm.hashForm = response.data
        } else {
          vm.hashForm = {}
          this.$message({
            message: '没有查询到区块信息',
            type: 'warning'
          })
          return
        }
      })
    },
    searchCondition () {
      this.getData('paging')
    },
    clearCondition1 () {
      this.seller = ''
      this.state = ''
      this.beginDate = ''
      this.toDate = ''
      this.officeName = ''
    },
    addCondition () {
      let searchValues = this.mate.mateSearch.values.length 
      if (this.searchValues.length >= 1) {
        this.searchValues[len - 1]['andOrSymbol'] = ''
      }
      this.searchValues.push({
        name : '',
        operator : '',
        value : '',
        andOrSymbol: 'null'
      })
    },
    clearCondition () {
      this.mate.mateSearch.values = [{
        name : '',
        operator : '',
        value : '',
        andOrSymbol: 'null'
      }]
    },
    query () {
      this.mateMateList.lineRows = null
      let len = this.mate.mateSearch.values.length
      let data = this.mate.mateSearch.values
      for (let i = 0; i < len; i++) {
        if (data[i]['name'] === 'r.invoice_date') {
          data[i]['value'] = DateFormat(data[i]['value'], 'yyyy-MM-dd')
        }
        if (data[i]['name'] === 'r.settle_date') {
          data[i]['value'] = DateFormat(data[i]['value'], 'yyyy-MM-dd')
        }
        if (data[i]['andOrSymbol'] === '') {
          this.message('请选择并列条件', 'warning')
          return
        }
      }
      const mate = this.mate.mateSearch.values
      const vm = this
      const url = this.mate.mateSearch.url
      this.$root.ajaxData(url, mate, function (data) {
        vm.mate.mateList.rows = data.mate.rows
        vm.mate.mateList.total = data.mate.total
      }, 'POST')
    },
    updated () {
      this.showFlag = false
    },
    handleButton (btn) {
      var vm = this
      if(btn.action === 'genEbsInvoice'){
        if (this.multipleSelection.length > 1) {
          this.message('只能选择一条数据', 'warning')
          return
        }
        if (this.multipleSelection[0].state == '2') {
          this.message('该条数据已生成ebs发票，请勿重复生成', 'warning')
          return
        }
        const loading = this.$loading({
          lock: true,
          text: '正在生成ebs发票，请稍等......',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        vm.$root.monitor({ url: btn.url + '/' + rowt.id })
        loading.close()
        return
      }

      //取消ebs发票
      if(btn.action === 'cancelEbsInvoice'){
        if (this.multipleSelection.length > 1) {
          this.message('只能选择一条数据', 'warning')
          return
        }
        if (this.multipleSelection[0].state == '0') {
          this.message('该条数据未生成ebs发票，请先生成ebs发票', 'warning')
          return
        }
        const loading = this.$loading({
          lock: true,
          text: '正在取消ebs发票，请稍等......',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        // vm.$root.monitor({ url: btn.url + '/' + rowt.id })
         this.$root.ajaxData(btn.url + '/' + rowt.id,{}, function (data) {
          if(data.statusCode == 40057){
            vm.message('该ebs发票在erp里不是已取消或者删除状态，不能取消', 'warning')
          }
          vm.$root.monitor({ url: '/purchase/invoice/payment/get/list', method: 'GET' })
        }, btn.method)
        loading.close()
        return
      }
      if (btn.action === 'deleteInvoice') {
        let arr = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state == '2') {
            this.message('已生成ebs发票的信息不能删除', 'warning')
            return
          }
          arr.push(this.multipleSelection[i].id)
        }
        this.$root.ajaxData(btn.url, arr, function (data) {
          vm.$root.monitor({ url: '/purchase/invoice/payment/get/list', method: 'GET' })
        }, btn.method)
        return
      }
      // 导出
      if (btn.action === 'exportPaymentInvoice') {
        var exporturl = API_GATEWAY + '/api' + btn.url
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$http({
          url: exporturl,
          method: 'POST',
          body: rowt.id,
          headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
            'Accept': 'application/json',
            'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
            'Content-Type': 'application/json;charset=utf8'
          },
          responseType: 'arraybuffer'
        }).then(function (response) {
          var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          var filename = '应付发票.xlsx'
          a.setAttribute('download', filename)
          a.click()
          URL.revokeObjectURL(objectUrl)
        })
        return
      }

      // 发票清单报表导出
      if (btn.action === 'invoiceReport') {
        var exporturl = API_GATEWAY + '/api' + btn.url
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        const rowOffice = { officeId: this.multipleSelection.map((r) => r.officeId) }
        //判断发票清单导出时要选择同一机构的应付发票
        let set = new Set(rowOffice.officeId)
        if(set.size != 1){
          this.message('请选择同一业务组织的应付发票','warning')
          return
        }

        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state == '0') {
            this.message('请选择状态为生成ebs发票的应付发票', 'warning')
            return
          }
        }
        this.$http({
          url: exporturl,
          method: 'POST',
          body: rowt.id,
          headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
            'Accept': 'application/json',
            'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
            'Content-Type': 'application/json;charset=utf8'
          },
          responseType: 'arraybuffer'
        }).then(function (response) {
          var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          var filename = '发票清单导出表.xlsx'
          a.setAttribute('download', filename)
          a.click()
          URL.revokeObjectURL(objectUrl)
        })
        return
      }

       //打印付款审批单
      if (btn.action === 'printEbsInvoice') {
        let arr = []
        let oaArr = []
        let paymentUrl = ''
        let ebsFlag = 0 //ebs数据不存在
        let oaFlag = 0  //oa数据不存在

        for (let i = 0; i < this.multipleSelection.length; i++) {
          var row = this.multipleSelection[i]
          if(row.state !=2){
           this.message('请选择状态为生成ebs发票的应付发票数据', 'warning')
           return
          }
          if(null != row.fdModelId && '' != row.fdModelId){
             oaFlag = 1
             oaArr.push(this.multipleSelection[i].fdModelId)
          }else{
            ebsFlag = 1
            arr.push(this.multipleSelection[i].id)
          }
        }

        if(oaFlag == 1 && ebsFlag == 0){
          // oa数据打印付款审批单
           paymentUrl = API_GATEWAY + '/api' + btn.url + '/oa/oa_ebs_invoice_bill?ids=' + oaArr
        }else if(oaFlag == 0 && ebsFlag == 1){
          //erp数据打印付款审批单
          paymentUrl = API_GATEWAY + '/api' + btn.url + '/ebs/ebs_invoice_bill?ids=' + arr
        }else {
          this.message('请选择全部来自erp的应付发票或者全部来自oa的应付发票', 'warning')
           return
        }
        const loading = this.$loading({
          lock: true,
          text: '正在打印付款审批单，请稍等......',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        vm.$http({
            url: paymentUrl,
            method: 'get',
            headers: vm.headers,
            responseType: 'arraybuffer',
          }).then(function (response) {
            // 判断如果数据异常，则提示用户
            if(response.data.byteLength===0){
              vm.message('数据异常,打印付款审批单失败', 'warning')
            }else {
              var blob = new Blob([response.data], { type: 'application/pdf' })
              var objectUrl = URL.createObjectURL(blob)
              var a = document.createElement('a')
              document.body.appendChild(a)
              a.setAttribute('style', 'display:none')
              a.setAttribute('href', objectUrl)
              var windowOpen = window.open(objectUrl)
              if (windowOpen == null || typeof (windowOpen) === 'undefined') {
                vm.message('付款审批单预览界面被拦截,请检查浏览器设置', 'warning')
              }
            }
          })
          loading.close()
        return
      }
      // 推送OA审批对账单
      if(btn.action === 'toOa'){
        // 推送Oa状态
        if (this.multipleSelection.length > 1) {
          this.message('只能选择一条数据', 'warning')
          return
        }
        var row = this.multipleSelection[0]
        if(row.state == 2 ){
          if(row.oaStatus !== '1' && row.oaStatus !== '2'){
            btn.loading = true
            this.$root.ajaxData(btn.url + row.id, {}, function (data) {
              if(data.statusCode === 40056){
                vm.message('推送OA审批，供应商必须上传盖章签字的对账单', 'warning')
                btn.loading = false
                return
              } else if(data.statusCode === 200){
                vm.$root.monitor({ url: '/purchase/invoice/payment/get/list', method: 'GET' })
                vm.message('操作成功，请去OA走审批流程', 'success')
                return
              } else {
                vm.message('操作失败', 'warning')
                return
              }
            }, 'GET')
          } else {
            vm.message('已推送OA，请等待审批结果', 'warning')
            return
          }
        } else {
          vm.message('请先生成EBS发票才可推送OA审批', 'warning')
          return
        }
        return
      }
    },
    message (message, type) {
      this.$message({
        message: message,
        type: type
      })
    },
    handleDetialLine () {
      this.dialogDetailLine = true
    },
    showSearchPopover () {
      this.showAdvancedSearchPopover = !this.showAdvancedSearchPopover
    },
    rowClick (row) {
      this.showFlag = true
      var vm = this
      this.$root.ajaxData(this.mateMateList.url + '/' + row.id, {}, function (data) {
        vm.mateListRows = data
      }, 'GET')
    },
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
      this.beginDate = DateFormat(this.beginDate, 'yyyy-MM-dd')
      this.toDate = DateFormat(this.toDate, 'yyyy-MM-dd')
      let url
      if (this.beginDate && this.toDate) {
        url = `/purchase/invoice/payment/get/list-q?officeName=${this.officeName}&&companyName=${this.seller}&&state=${this.state}&&buyerName=${this.buyerName}&&beginDate=${this.beginDate}&&toDate=${this.toDate}`
      } else if (!this.beginDate && !this.toDate) {
        url = `/purchase/invoice/payment/get/list-q?officeName=${this.officeName}&&companyName=${this.seller}&&state=${this.state}&&buyerName=${this.buyerName}`
      } else if (!this.beginDate && this.toDate) {
        url = `/purchase/invoice/payment/get/list-qt?officeName=${this.officeName}&&companyName=${this.seller}&&state=${this.state}&&buyerName=${this.buyerName}&&toDate=${this.toDate}`
      } else if (this.beginDate && !this.toDate) {
        url = `/purchase/invoice/payment/get/list-q?officeName=${this.officeName}&&companyName=${this.seller}&&state=${this.state}&&buyerName=${this.buyerName}&&beginDate=${this.beginDate}`
      }
      let param = {
        search: this.searchValues,
        page: this.page,
        sort: this.sortValues
      }
      let judge = false
      // if (this.mate.mateSearch.values[0]['name'] && this.mate.mateSearch.values[0]['operator'] && this.mate.mateSearch.values[0]['value']) {
      //   judge = true
      // }
      var vm = this
      if (flag && !judge) {
        url += '&&search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        // url += '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        param = null
        this.$root.ajaxData(url, param, function (data) {
          vm.updateData(data)
        })
        return
      }
      // if (flag && judge) {
      //   let data = this.mate.mateSearch.values
      //   let len = this.mate.mateSearch.values.length
      //   for (let i = 0; i < len; i++) {
      //     if (data[i]['name'] === 'sl.create_at') {
      //       data[i]['value'] = DateFormat(data[i]['value'], 'yyyy-MM-dd')
      //     }
      //   }
      //   url = `/purchase/invoice/payment/simple/search-q?pageSize=${this.pageSize}&pageNum=${this.page}`
      //   this.$root.ajaxData(url, this.mate.mateSearch.values, function (data) {
      //     vm.updateData(data)
      //   }, 'POST')
      // }
    },

    updateData (data) {
      if (data.mate.rows) {
        this.mate.mateList.rows = data.mate.rows
        // rowsContent用于判断波次批次管理中拣料出库动作是否可以进行
        this.rowsContent = data.mate.rows
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
    toUriParams (data) {
      return Object.keys(data).filter(i => !!data[i]).map(i => i + '=' + data[i]).join('&')
    },

    rowSelect () {
      this.mate.mateList.rows.forEach(row => {
        let select = (row.id && this.mate.mateList.selected && this.mate.mateList.selected.findIndex(id => id == row.id) !== -1)
        this.$refs.table.toggleRowSelection(row, (select === true))
      })
    },
    showInvoice(val){
      window.open(val)
    },
    handleAction(act, row){
      var vm = this
      //查询进项发票
      if(act.action === 'printerSettlement'){
        vm.$root.monitor({url: act.url + '?seller=' + row.companyName + '&settleCode=' + row.settleCode + '&money=' + row.moneyAmount})
        return
      }
      // 预览对账单
      if(act.action === 'showFile'){
        this.$root.ajaxData(act.url + row.companyName +'&settleCode=' + row.settleCode, {}, function (data) {
          var response = data.data
          if(response.length === 0){
             vm.message('未上传对账单', 'warning')
          } else if(response.length === 1){
            window.open(response[0])
          } else {
            vm.tableData = []
            vm.showFile = true
            var i = 1
            response.forEach(item=>{
              var tableLine = {
                lineNo: i++,
                name: item
              }
              vm.tableData.push(tableLine)
            })
          }
        }, 'GET')
        return
      }
      // //打印付款审批单
      // if (act.action === 'printEbsInvoice') {
        
      //   if(row.state !=2){
      //      this.message('请选择状态为生成ebs发票的应付发票数据', 'warning')
      //      return
      //   }
      //   const loading = this.$loading({
      //     lock: true,
      //     text: '正在打印付款审批单，请稍等......',
      //     spinner: 'el-icon-loading',
      //     background: 'rgba(0, 0, 0, 0.7)'
      //   })
      //   vm.$http({
      //       url: API_GATEWAY + '/api' + act.url + '/' + row.id + '/ebs_invoice_bill',
      //       method: 'GET',
      //       headers: vm.headers,
      //       responseType: 'arraybuffer'
      //     }).then(function (response) {
      //       // 判断如果数据异常，则提示用户
      //       if(response.data.byteLength===0){
      //         vm.message('数据异常,打印付款审批单失败', 'warning')
      //       }else {
      //         var blob = new Blob([response.data], { type: 'application/pdf' })
      //         var objectUrl = URL.createObjectURL(blob)
      //         var a = document.createElement('a')
      //         document.body.appendChild(a)
      //         a.setAttribute('style', 'display:none')
      //         a.setAttribute('href', objectUrl)
      //         var windowOpen = window.open(objectUrl)
      //         if (windowOpen == null || typeof (windowOpen) === 'undefined') {
      //           vm.message('付款审批单预览界面被拦截,请检查浏览器设置', 'warning')
      //         }
      //       }
      //     })
      //     loading.close()
      //   return
      // }
    }
  }
}
</script>

<style lang="scss">
.InvoicePayment {
  .page {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .el-form--inline .el-form-item {
    margin-bottom: 0;
  }

  .el-table .cell, .el-table th>div {
    padding-right: 0;
  }
  .leftMargin{
    float:left;
    margin-left:10px;
  }

  .searchForm{
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
  .el-form-item {
    margin: 0px;
  }
  .checkboxClass{
    width: 30%;
    padding-bottom: 10px;
    box-sizing: border-box;
    margin-left: 15px;
  }
  .radioClass{
    margin-bottom: 5px
  }
  .detailLine{
    position: relative;
  }
  .definedLine{
    position: absolute;
    right: 0px;
  }
  .tableTop{
    // position: absolute;
    margin-bottom: 50px;
  }
  .el-table td, .el-table th {
    height: 30px;
  }
  .detailTable{
    margin-top: 40px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
  th {
    background-color: #e6e7eb;
    color: #303030;
    font-weight: 700;
  }
}
</style>
