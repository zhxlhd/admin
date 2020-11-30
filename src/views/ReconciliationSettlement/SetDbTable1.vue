<template>
  <div class="setDblTable1" v-loading="loading" element-loading-text="预制发票正在生成中，请稍后" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)">
    <div class="searchForm">
      <el-row>
        <el-form size="mini" :model="searchForm">
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item :prop="searchForm['state']">
              <dict-selected  filterable v-model="searchForm.state" dictType="settlementState" :initValue="searchForm.state" placeholder="状态"></dict-selected>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-select clearable filterable size="mini" @change="changeName" v-model="searchForm['customerName']" placeholder="购方公司">
                  <el-option
                    v-for="item in customerNameOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-select clearable filterable size="mini" @visible-change="visibleChange" v-model="searchForm['ouName']" placeholder="购方业务实体">
                  <el-option
                    v-for="item in ouNameOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-input clearable v-model="searchForm.settleCode" placeholder="结算单号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-date-picker clearable size="mini" v-model="searchForm.beginDate" type="date" placeholder="创建日期从" ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-date-picker clearable size="mini" v-model="searchForm.toDate" type="date" placeholder="创建日期至" ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="8" :md="8" :lg="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="clickQuery">查询</el-button>
              <el-button size="mini" type="info" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
      <div slot="main">
        <div>
          <el-row>
            <el-col :span="24">
              <el-table size="mini" highlight-current-row ref="table" stripe :data="mate.mateList.rows" @selection-change="handleSelectionChange">
                <el-table-column align="center" type="selection" width="30"></el-table-column>
                <el-table-column align="center" v-if="col.blockHash" :formatter="col.formatter" v-for="col of mate.mateList.columns" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
                  <template slot-scope="scope">
                  <el-button type="text" size="mini" v-show="scope.row.blockHash" @click="clickBlockHash(scope.row,scope.row.blockHash)"><img src="../../assets/imgs/ztree/ic_chain.png" style="width:13px; margin:-2px 2px">{{ scope.row.settleCode }}</el-button>
                    <span v-show="!scope.row.blockHash" >{{ scope.row.settleCode }} </span>
                </template>
                </el-table-column>
                <el-table-column align="center" v-if="col.isShow" v-for="(col,index) of mate.mateList.columns" v-bind:key="col.name+index" :formatter="col.formatter" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" fixed="right" label="操作" :width="actionWidth" v-if="mate.mateList.actions">
                  <template slot-scope="scope" >
                    <k-btn  v-for="act of mate.mateList.actions" v-if="act.action === 'downloadPdf' && scope.row.sealpdfPath" v-bind:key="act.action" :label="act.label" size="mini" :act="act"  :row="scope.row" @action="handleAction"></k-btn>
                    <k-btn v-for="act of mate.mateList.actions"  v-if="act.action !=='downloadPdf'" v-bind:key="act.action" :label="act.label" size="mini" :act="act"  :row="scope.row" @action="handleAction"></k-btn>
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
      <el-dialog  title="邮箱（通知采购方确认）" :visible.sync="visibleEmail" width="30%" >
        <el-form :model="emailForm" label-width="90px" :label-position="labelPosition" ref="ruleForm" :rules="rules">
          <el-row>
            <el-col :span="15">
              <el-form-item label="采购员邮箱" prop="buyerEmail">
                <el-input type="email" size="mini"  v-model="emailForm.buyerEmail"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <el-button :disabled="showSubmit" size="mini" type="primary" @click="confirmEmail">确认</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
      <el-dialog  title="邮箱（通知供应商确认）" :visible.sync="visibleSupplyEmail" width="30%" >
        <el-form :model="emailForm" label-width="90px" :label-position="labelPosition" ref="ruleForm" :rules="rules">
          <el-row>
            <el-col :span="15">
              <el-form-item label="供应商邮箱" prop="buyerEmail">
                <el-input type="email" size="mini"  v-model="emailSupplyForm.buyerEmail"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <el-button :disabled="showSupplySubmit" size="mini" type="primary" @click="confirmSupplyEmail">确认</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
      <el-dialog  title="查看区块信息" :visible.sync="blockHashVisible" width="40%">
        <BlockHash :hashForm="hashForm" :setId="setId" :retrospectShow="retrospectShow">
        </BlockHash>
      </el-dialog>
      <el-dialog  title="上传已盖章签字的对账单" :visible.sync="blockFile" width="40%" :close-on-click-modal="closeModal" :show-close="showClose">
        <el-upload 
          ref="upload" 
          accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF" 
          multiple 
          class="upload-demo" 
          :headers="headersSettlement" 
          :action="fileuploadUrl" 
          :on-preview="handlePreview"
          :on-remove="handleRemove" 
          :before-remove="beforeRemove" 
          :on-change="handleChange" 
          :file-list="settlementFile" 
          :on-success="handleSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传图片，PDF文档格式（可上传多个文件）</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="sureFile">确 认</el-button>
        </div>
      </el-dialog>
      <el-dialog  title="查看对账单" :visible.sync="showFile" width="22%">
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
    </template>
    <el-dialog  title="生成ebs发票" :visible.sync="invoiceDialog" width="40%" >
      <el-button size="mini" type="primary" @click="submitAP">提 交</el-button>
      <el-button size="mini" @click="cancelBack">取 消</el-button>
      <div class="invoiceDetail">
        <ul class="ul">
          <li>供应商名称：{{reconFormData.companyName}}</li>
          <li>币种：{{reconFormData.currency}}</li>
          <li>结算单总金额：{{reconFormData.moneyAmount}}</li>
          <li>税率：{{reconFormData.taxRate}}</li>
        </ul>
        <ul>
          <li><span><strong>*</strong>发票摘要：</span><el-input size="mini" v-model="reconFormData.summary" class="summaryInput"></el-input></li>
          <li class="type1"><span><strong>*</strong>发票日期：</span>
            <el-date-picker
              size="mini"
              v-model="reconFormData.invoiceDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </li>
          <li class="type1"><span><strong>*</strong>条件日期：</span>
            <el-date-picker
              size="mini"
              v-model="reconFormData.termsDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </li>
          <li class="type1"><span><strong>*</strong>GL日期：</span>
            <el-date-picker
              size="mini"
              v-model="reconFormData.glDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </li>
          <li>地点：{{reconFormData.address}}</li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { API_GATEWAY } from '@/config/index.js'
import SearchForm from '../../components/SearchForm'
import { LANGS } from '../../i18n/lang'
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import BlockHash from '../../components/BlockHash'
import { isPositiveEmail, trimSpace } from '../../utils/util.js'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import {DateFormat} from '../../utils/util'
import axios from '@/utils/http';
const BASEAPI = `${API_GATEWAY}/api`
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    SearchForm,
    KBtn,
    Boxer,
    BlockHash,
    Formor: function index (resolve) {
      require(['../../components/Formor.vue'], resolve)
    },
    DialogForm: function index (resolve) {
      require(['../../components/DialogForm.vue'], resolve)
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
    var validateEmail = (rule, value, callback) => {
      if (!isPositiveEmail(trimSpace(value))) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    return {
      settlementFile: [],
      searchForm: {
        state: '',
        customerName: '',
        ouName: '',
        settleCode: '',
        beginDate: '',
        toDate: ''
      },
      headersSettlement: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      },
      closeModal: false,
      showClose: false,
      queryPage: false,
      blockFile: false,
      customerNameOptions: [],
      showFile: false,
      ouNameOptions: [],
      input: '',
      fileuploadUrl: API_GATEWAY + '/api/purchase/file',
      retrospectShow: false,
      setId: '',
      loading: false,
      pageSize: 5,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      multipleDialogSelection: [],
      langs: LANGS,
      hasSelected: false,
      blockHashVisible: false,
      hashForm: {},
      andOrSymbolOptions: {},
      labelPosition: 'right',
      searchValues: {},
      page: 0,
      radio3: '1',
      emailForm: {},
      settlementStateOptions: [],
      visibleEmail: false,
      visibleSupplyEmail: false,
      emailSupplyForm:{},
      emailUrl: '',
      emailSupplyUrl: '',
      showAdvancedSearchPopover: false,
      sortValues: {},
      showPurDetial: true,
      showSaleDetial: false,
      action: null,
      dialogTableVisible: false,          // dialog开关
      tableData: [],
      word: this.$t('query'),
      showFlag: false,                    // 下面表格的开关
      object: {},                          // 放columns
      fit: false,
      dialogVisible: false,
      dialogFormVisible: false,
      valueStatus: '',
      dialogAuditVisible: false,
      dialogUpdateVisible: false,
      cause: '',
      showSubmit: false,
      showSupplySubmit: false,
      auditStatus: '',
      rowId: {},             // 点击table前面的框框
      rowsContent: [],              // 获取到明细行中的数据
      urlName: '',
      fileName: '',
      checkAll: false,
      checkedLabel: [],
      isIndeterminate: true,
      lineSelected: [],               // 存放全部的label
      lineSelectedDetail: [],         // 存放全部的明细行label
      msgBoxButton: true,
      dialogDetailLine: false,
      dialogInvoice: false,
      rowtId: '',
      urlPath: '',
      settlementId: '',
      qty: 0,
      user: {},
      rules: {
        buyerEmail: { validator: validateEmail, trigger: 'blur' }
      },
      mateLineListRowsData: {},
      dialogColumn: {},
      dialogGathering: false,           // 取消核销发票弹出框
      gatherings: [],                   // 取消核销发票条数
      mateListRows: [],                  // 核销发票明细行
      mateSaleListRows: [],
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
      },
      reconFormData: {       // 生成ebs发票需要的表单数据
        companyName: "",
        currency: "",
        moneyAmount: "",
        taxRate: "",
        summary: "",
        invoiceDate: "",
        termsDate: "",
        glDate: "",
        address: ""
      },
      reconListData: [],      // 生成ebs发票需要的列表数据
      invoiceDialog: false,   // 生成ebs发票弹框
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    radio3: function (val) {
      var vm = this
      if (val === '1') {
        this.showPurDetial = true
        this.showSaleDetial = false
      } else {
        this.$root.ajaxData('/purchase/settlement/line/receive/' + this.rowtId, {}, function (data) {
          vm.mateSaleListRows = data
          for (let i = 0; i < vm.mateSaleListRows.length; i++) {
            vm.mateSaleListRows[i].lineNo = i + 1
          }
        })
        this.showPurDetial = false
        this.showSaleDetial = true
      }
    },
    mate: function (newMate) {
      this.formatterBefore(this.mate.mateList.columns)
      this.formatterBefore(this.mate.mateList.lineColumns)
      this.rowsContent = this.mate.mateList.rows
      this.mate.mateList.localName = this.mate.localName
      this.$nextTick(function () {
        this.rowSelect()
      })
      if (this.mate.mateSearch) {
        this.titleOptions = this.mate.mateSearch.fields[0].options
        this.operatorOptions = this.mate.mateSearch.fields[1].options
        this.andOrSymbolOptions = this.mate.mateSearch.fields[3].options
      }
    }
  },
  created () {
    let mateList = this.mate.mateList
    this.formatterBefore(mateList.columns)
    this.formatterBefore(mateList.lineColumns)
    this.rowsContent = mateList.rows
    mateList.localName = this.mate.localName
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
    this._getCustomerName()
  },
  mounted() {
    this.rowSelect()
  },
  computed: {
    actionWidth: function () {
      return this.mate.mateList.actions.length * 80 + 30
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
  methods: {
    // 查询重置
    reset() {
      this.searchForm.status = ''
      this.searchForm.customerName = ''
      this.searchForm.ouName = ''
      this.searchForm.settleCode = ''
      this.searchForm.beginDate = ''
      this.searchForm.toDate = ''
      this.queryPage = false
    },
    // 查询接口
    clickQuery() {
      let vm = this
      this.searchForm.beginDate = DateFormat(this.searchForm.beginDate, 'yyyy-MM-dd')
      this.searchForm.toDate = DateFormat(this.searchForm.toDate, 'yyyy-MM-dd')
      this.$root.ajaxData('/purchase/settlement/simple/search-n?isCopy=0', this.searchForm, function (data) {
        vm.mate.mateList.rows = data.mate.rows
        vm.mate.mateList.total = data.mate.total
        vm.queryPage = true
      }, 'POST')
    },
    // 获取客户名称
    _getCustomerName () {
      var vm = this
      this.$root.ajaxData('/companys/companyInfo/4?status=1&auditStatus=1&nopaging=1&dataOnly=true&&onlyCompanyFlag=1', {}, function (data) {
        for (var i = 0; i < data.length; i++) {
          data[i].value = data[i].name
        }
        vm.customerNameOptions = data
      })
    },
    changeName (val) {
      var vm = this
      let option = {}
      this.searchForm.ouName = ''
      this.ouNameOptions = []
      this.$root.ajaxData(`/offices/pass/company/name?companyName=${val}`, {}, function (data) {
        for (var i = 0; i < data.length; i++) {
          option = {}
          option.value = data[i].name
          vm.ouNameOptions.push(option)
        }
      })
    },
    message(message, type) {
      this.$message({
        message: message,
        type: type
      })
    },
    rowClass ({ row, column, rowIndex, columnIndex }) {
      if (row.parentSourceId && columnIndex === 9) {
        return 'background: rgba(245,108,108,0.3);'
      }
    },
    clearCondition () {
      this.mate.mateSearch.values = [{
        name: '',
        operator: '',
        value: '',
        andOrSymbol: 'null'
      }]
    },
    clickBlockHash (row, blockHash) {
      var vm = this
      this.setId = row.id
      this.$http({
        url: API_GATEWAY + '/hyper/block/hash/query/' + blockHash,
        method: 'GET',
        headers: this.headers,
        responseType: 'text'
      }).then(function (response) {
        if (response.data.length > 0) {
          vm.blockHashVisible = true
          vm.hashForm = response.data
        } else {
          vm.hashForm = {}
          this.message('没有查询到区块信息', 'warning')
          return
        }
      })
    },
    // 点击添加查询条件
    addCondition () {
      let len = this.mate.mateSearch.values.length
      if (this.mate.mateSearch.values.length >= 1) {
        this.mate.mateSearch.values[len - 1]['andOrSymbol'] = ''
      }
      this.mate.mateSearch.values.push({
        name: '',
        operator: '',
        value: '',
        andOrSymbol: 'null'
      })
    },
    // 查询按钮
    query () {
      this.mate.mateList.lineRows = null
      let len = this.mate.mateSearch.values.length
      let data = this.mate.mateSearch.values
      for (let i = 0; i < len; i++) {
        if (data[i]['name'] === 'sl.create_at') {
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
    // 显示搜索框
    showSearchPopover () {
      this.showAdvancedSearchPopover = !this.showAdvancedSearchPopover
    },
    // 发送邮件确认
    confirmEmail () {
      var vm = this
      vm.visibleEmail = false
      vm.showSubmit = true
      const rowt = { id: this.multipleSelection.map((r) => r.id) }
      if(vm.emailForm.buyerEmail==undefined){
          vm.emailForm.buyerEmail=''
      }
      this.$root.ajaxData(vm.emailUrl + '?buyerEmail=' + vm.emailForm.buyerEmail, rowt.id, function (data) {
        vm.$root.monitor({ url: '/purchase/settlement/all/list', method: 'GET' })
      }, 'PUT')
      vm.showSubmit = false
    },
    confirmSupplyEmail(){
      var vm = this
      vm.visibleSupplyEmail = false
      vm.showSupplySubmit = true
      const rowt = { id: this.multipleSelection.map((r) => r.id) }
      if(vm.emailSupplyForm.buyerEmail==undefined){
          vm.emailSupplyForm.buyerEmail=''
      }
      this.$root.ajaxData(vm.emailSupplyUrl + vm.emailSupplyForm.buyerEmail, rowt.id, function (data) {
        vm.$root.monitor({ url: '/purchase/settlement/all/list', method: 'GET' })
      }, 'PUT')
      vm.showSupplySubmit = false
    },
    // 获取结算单状态值
    getSettlementState () {
      var vm = this
      vm.settlementStateOptions = []
      this.$root.ajaxData('/dic/cg/settlementState', {}, function (data) {
        data.forEach(i => {
          vm.settlementStateOptions.push({ 'label': i.label, 'value': i.label })
        })
      }, 'GET')
    },
    dialogDetailLineFalse () {
      this.dialogDetailLine = false
    },
    dialogDetailLineTrue () {
      this.dialogDetailLine = true
    },
    changeType (val) {
      var vm = this
      if (val.name === '1') {
        this.showPurDetial = true
        this.showSaleDetial = false
      } else if (val.name === '2') {
        this.$root.ajaxData('/purchase/settlement/line/receive/' + this.rowtId, {}, function (data) {
          vm.mateSaleListRows = data
        })
        this.showPurDetial = false
        this.showSaleDetial = true
      }
    },
    handleDetialLine () {
      this.dialogDetailLine = true
    },
    updated () {
      this.showFlag = false
    },

    back () {
      this.dialogTableVisible = false
    },
    handleButton (btn) {
      var vm = this
      let row = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      this.rowId = row
      // 新增的时候不需要带上row，也不需要带上select前面的id
      if (btn.action === 'addDetailBill') {
        this.$emit('action', btn)
        return
      }
      // 结算单导出
      if (btn.action === 'exportSettlement') {
        if (this.multipleSelection.length > 1) {
          this.message('请选择一条数据', 'warning')
          return
        }
        const rowt = { id: this.multipleSelection.map((r) => r.id),customerName: this.multipleSelection.map((r) => r.customerName) }
        let exportUrl = ''

        //判断客户是否是欣旺达电动汽车电池有限公司
        if(rowt.customerName == '欣旺达电动汽车电池有限公司'){
          exportUrl = API_GATEWAY + '/api' + btn.url + '_dq?format=xlsx&&ID=' + rowt.id
        }else{
          exportUrl = API_GATEWAY + '/api' + btn.url + '?format=xlsx&&ID=' + rowt.id
        }

        this.$http({
          url: exportUrl,
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
            'Accept': 'application/json',
            'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
            // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
          },
          responseType: 'arraybuffer'
        }).then(function (response) {
          var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          a.setAttribute('download', '结算单.xlsx')
          a.click()
          URL.revokeObjectURL(objectUrl)
        })
        return
      }
      if (btn.action === 'cancelSettlement') {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state !== '0') {
            this.message('只有新建状态才能取消', 'warning')
            return
          }
        }
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$root.ajaxData(btn.url, rowt.id, function (data) {
          vm.$root.monitor({ url: '/purchase/settlement/all/list', method: 'GET' })
        }, btn.method)
        return
      }
      // 删除结算单
      if (btn.action === 'deleteSettlement') {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state !== '0') {
            this.message('请选择状态为新建的数据', 'warning')
            return
          }
        }
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$root.ajaxData(btn.url, rowt.id, function (data) {
          vm.$root.monitor({ url: '/purchase/settlement/all/list', method: 'GET' })
        }, btn.method)
        return
      }
        // 发送结算单
      if (btn.action === 'sendSettlement') {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state !== '0' && this.multipleSelection[i].state !== '4') {
            this.message('请选择状态为新建的数据', 'warning')
            return
          }
        }
        for (var i = 0; i <= this.multipleSelection.length - 2; i++) {
          if (this.multipleSelection[i].ouName !== this.multipleSelection[ i + 1].ouName) {
            this.message('请选择相同采购方业务实体的发票', 'warning')
            return
          }
        }
        this.$root.ajaxData('/users/' + this.user.id, {}, function (data) {
          if (data.buyerEmail) {
            vm.emailForm = data
          }
        }, 'GET')
        this.visibleEmail = true
        this.emailUrl = btn.url
        return
      }
      // 结算单生成预制发票
      if (btn.action === 'sendReceivable') {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state !== '1') { // 1是已确定状态
            this.message('请选择状态为已确定的数据', 'warning')
            return
          }
        }
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.loading = true
        this.$http({
          url: API_GATEWAY + '/api' + btn.url + rowt.id,
          method: 'GET'
        }).then((response) => {
          vm.loading = false
          try {
            var data = response.body || response
            if (data.statusCode) {
              if (data.statusCode === 200) {
                vm.message(data.message, 'success')
              }else {
                vm.message(data.message, 'warning')
              }
            }
            setTimeout(function () {
              vm.$root.monitor({ url: '/purchase/settlement/all/list', method: 'GET' })
            }, 1000)
          } catch (err) {
          }
        }, (response) => {
          vm.loading = false
          vm.message(response.body.message, 'warning')
        })
        return
      }
       // 结算单确认生成ebs发票
      if (btn.action == 'genEbsInvoice') {
        if (this.multipleSelection.length !== 1) {
          this.message('只能选择一条结算单', 'warning')
          return
        }
        if (this.multipleSelection[0].state != '2') {
          this.message('结算单的状态只能为已开票', 'warning')
          return
        }
        const rowt = {id: this.multipleSelection.map((r) => r.id)}
        vm.$root.ajaxData(btn.url + '/' + rowt.id, {}, function (data) {
          vm.$root.monitor({ url: '/purchase/settlement/all/list', method: 'GET' })
            if(data.statusCode === 200){
              vm.message(data.message, 'success')
            }
            if(data.statusCode === 500){
              vm.message(data.message, 'error')
            }
        }, btn.method)
        return
      }
      // 结算单确认、驳回
      if (btn.action === 'confirmSettlement' || btn.action === 'rejectSettlement') {
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state !== '4') {
            this.message('请选择状态为等待采购方确认的数据', 'warning')
            return
          }
        }
        vm.$root.ajaxData(btn.url + rowt.id, {}, function (data) {
          vm.$root.monitor({ url: '/purchase/settlement/all/list', method: 'GET' })
        }, btn.method)
        return
      }
      if (btn.action === 'shuaxin') {
        vm.$root.ajaxData(btn.url, {}, function (data) {
          vm.mate.mateList.rows = data.mate.mateList.rows
          vm.mate.mateList.total = data.mate.mateList.total
        })
        vm.$root.ajaxData('/purchase/tms/invoice/checkPreInvoiceInfo', {}, function (data) {
        }, 'GET')
        return
      }
      if (btn.action === 'sendSupply') {
        for (let i = 0; i < this.multipleSelection.length; i++) {
            if (this.multipleSelection[i].state !== '0' && this.multipleSelection[i].state !== '4') {
              this.message('请选择状态为新建的数据', 'warning')
              return
            }
          }
        for (var i = 0; i <= this.multipleSelection.length - 2; i++) {
          if (this.multipleSelection[i].ouName !== this.multipleSelection[ i + 1].ouName) {
            this.message('请选择相同采购方业务实体的数据', 'warning')
            return
          }
          if (this.multipleSelection[i].seller !== this.multipleSelection[ i + 1].seller) {
            this.message('请选择相同的销方公司', 'warning')
            return
          }
        }
        this.$root.ajaxData('/users/' + this.user.id, {}, function (data) {
          if (data.buyerEmail) {
            vm.emailForm = data
          }
        }, 'GET')
        this.visibleSupplyEmail = true
        this.emailSupplyUrl = btn.url
        return
      }
      /**
       * 生成ap发票
       * @param void
       * @return void
       */
      if (btn.action === 'genApInvoice') {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '只能勾选一条数据'
          })
          return;
        }
        if (this.multipleSelection[0].currency === 'CNY') {
          this.$message({
            type: 'warning',
            message: '只能勾选外币对账的结算单'
          })
          return;
        }
        if (this.multipleSelection[0].state !== '1') { // 1是已确定状态
          this.message('请选择状态为已确定的数据', 'warning')
          return
        }
        this.invoiceDialog = true
        let id = this.multipleSelection[0].id
        axios.get(`${BASEAPI}/purchase/settlement/detail/${id}`).then(res => {
          if (res.status === 200) {
            this.reconListData = res.data.mate.apMateLineList.rows
            let formData = res.data.mate.mateFormerHeader.values
            this.$set(this.reconFormData,'id', formData.id)
            this.$set(this.reconFormData,'companyName', formData.seller)
            this.$set(this.reconFormData,'currency', formData.currency)
            this.$set(this.reconFormData,'moneyAmount', formData.moneyAmount)
            this.$set(this.reconFormData,'taxRate', formData.taxRate)
            this.$set(this.reconFormData,'address', this.reconListData[0].address)
            this.$set(this.reconFormData,'officeName',formData.ouName)
            this.$set(this.reconFormData,'ebsInvoiceCode',this.multipleSelection[0].ebsInvoiceCode)
            this.$set(this.reconFormData,'ebsMsg', this.multipleSelection[0].ebsMsg)
            this.$set(this.reconFormData,'state', this.multipleSelection[0].state)
            if (this.reconListData.length) {
              this.reconListData.forEach(item => {
                item.parentSourceId = item.sourceId
                item.itemUnit = item.unit
                item.rsInvoiceHeadId = item.rsSettlementHeadId
                item.unTaxPrice = item.unitPrice
                item.noTaxAmount = item.unTaxMoney
              })
            }
          }
        })
        return
      }
      this.$root.handleAction(btn, row, function () {
        vm.$root.monitor({ url: '/purchase/invoice/paymented/all/list' })
      })
    },
    rowSelect () {
      this.mate.mateList.rows.forEach(row => {
        let select = (row.id && this.mate.mateList.selected && this.mate.mateList.selected.findIndex(id => id == row.id) !== -1)
        this.$refs.table.toggleRowSelection(row, (select === true))
      })
    },
    handleSelectionChange (val) {
      this.$emit('actionSelected', val)
      this.multipleSelection = val
    },

    handleSizeChange (val) {
      this.pageSize = val
      if (this.queryPage) {
        this.getData('queryPage')
      }else {
        this.getData('paging')
      }
    },
    handleCurrentChange (val) {
      this.page = val
      if (this.queryPage) {
        this.getData('queryPage')
      }else {
        this.getData('paging')
      }
    },
    handleAction (act, row) {
      var vm = this
      if (act.action === 'addChild') {
        vm.$root.monitor({ url: '/purchase/settlement/detail/' + row.id })
        return
      }
      if (act.action === 'printerSettlement') {
        
        this.$root.ajaxData(this.mate.mateList.url + '/' + row.id + '?printFlag=true', {}, function (data) {
          var firstdate = data[0].poDate
          var enddate = ''
          for (var i = data.length - 1; i >= 0; i--) {
            if (data[i].poDate) {
              enddate = data[i].poDate
              break
            }
          }
          let exportUrl = ''
          //判断客户是否是欣旺达电动汽车电池有限公司
          if(row.customerName == '欣旺达电动汽车电池有限公司'){
          // if(row.customerName == '欣旺达电子股份有限公司'){
            exportUrl = API_GATEWAY + '/api' + act.url + '_dq?format=pdf&ID=' + row.id + '&subtitle=' + firstdate + '%E8%87%B3' + enddate + '%E7%BB%93%E7%AE%97%E5%8D%95'
          }else{
            exportUrl = API_GATEWAY + '/api' + act.url + '?format=pdf&ID=' + row.id + '&subtitle=' + firstdate + '%E8%87%B3' + enddate + '%E7%BB%93%E7%AE%97%E5%8D%95'
          }

          vm.$http({
            url: exportUrl,
            method: 'GET',
            headers: vm.headers,
            responseType: 'arraybuffer'
          }).then(function (response) {
            var blob = new Blob([response.data], { type: 'application/pdf' })
            var objectUrl = URL.createObjectURL(blob)
            var a = document.createElement('a')
            document.body.appendChild(a)
            a.setAttribute('style', 'display:none')
            a.setAttribute('href', objectUrl)
            var windowOpen = window.open(objectUrl)
            if (windowOpen == null || typeof (windowOpen) === 'undefined') {
              vm.message('结算单预览界面被拦截,请检查浏览器设置', 'warning')
            }
          })
        }, 'GET')
        return
      }
      if (act.action === 'addFile') {
        // 结算单状态是 已确认 已开票 已生成预制发票
        if(row.state === '1' || row.state === '2' || row.state === '6'){
          this.blockFile = true
          this.settlementId = row.id
        } else {
           vm.message('结算单未确认不能上传', 'warning')
        }
        return
      }
      if (act.action === 'showFile') {
        this.settlementId = row.id
        this.$root.ajaxData(act.url + row.id, {}, function (data) {
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
      if(act.action === 'downloadPdf') {
        if(row.sealpdfPath){
          window.open(row.sealpdfPath)
        } else {
          vm.message('未确认结算单暂无盖章信息', 'warning')
          return
        }
        return
      }
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
      let judge = false
      if (this.mate.mateSearch.values[0]['name'] && this.mate.mateSearch.values[0]['operator'] && this.mate.mateSearch.values[0]['value']) {
        judge = true
      }
      var vm = this
      if (flag === 'queryPage') {
        url = '/purchase/settlement/simple/search-n?isCopy=0' + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        this.$root.ajaxData(url, this.searchForm, function (data) {
          vm.mate.mateList.rows = data.mate.rows
          vm.mate.mateList.total = data.mate.total
        }, 'POST')
        return
      }
      if (flag && !judge) {
        url += '-q?' + 'search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        param = null
        this.$root.ajaxData(url, param, function (data) {
          vm.updateData(data)
        })
        return
      }
      if (flag && judge) {
        let data = this.mate.mateSearch.values
        let len = this.mate.mateSearch.values.length
        for (let i = 0; i < len; i++) {
          if (data[i]['name'] === 'sl.create_at') {
            data[i]['value'] = DateFormat(data[i]['value'], 'yyyy-MM-dd')
          }
        }
        url = `/purchase/settlement/simple/search-q?pageSize=${this.pageSize}&pageNum=${this.page}`
        this.$root.ajaxData(url, this.mate.mateSearch.values, function (data) {
          vm.updateData(data)
        }, 'POST')
        return
      }
    },
    updateData (data) {
      let mateList = this.mate.mateList
      if (data.mate.rows) {
        mateList.rows = data.mate.rows
        this.rowsContent = data.mate.rows
      }
      if (data.mate.total) {
        mateList.total = data.mate.total
      } else {
        mateList.total = 0
      }
      if (data.mate.selected) {
        mateList.selected = data.mate.selected
      }
      this.$nextTick(function () {
        this.rowSelect()
      })
    },
    search (data) {
      this.$emit('actionSearch', data)
      this.searchValues = data
      this.page = 0
    },
    todoEssearch (data) {
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
    handleChange(file,fileList){
      this.settlementFile = fileList.slice(-1)
    },
    handleSuccess(response, file, fileList) {
      this.urlPath += response + ','
    },
    handleRemove (file, fileList) {
      this.urlPath = ''
      fileList.forEach(item => {
        this.urlPath += item.response + ','
      })
    },
    showInvoice(val){
      window.open(val)
    },
    sureFile(){
      var vm = this
      this.blockFile = false
      if(this.urlPath !== ''){
        this.$root.ajaxData('/purchase/settlement/submit/file/'+ this.settlementId +'?urlPath=' + this.urlPath, {}, function (data) {
           vm.$refs.upload.clearFiles()
           vm.$root.monitor({ url: '/purchase/settlement/all/list', method: 'GET' })
        }, 'PUT')
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
    /**
     * 生成ebs发票
     * @param void
     * @return void
     */
    submitAP () {
      if (
        this.reconFormData.summary === '' ||
        this.reconFormData.invoiceDate === '' ||
        this.reconFormData.termsDate === null || 
        this.reconFormData.glDate === null
      ){
        this.$message({
          type: 'warning',
          message: '发票摘要、发票日期、选择日期、GL日期必填',
        })
        this.invoiceDialog = true
        return
      }
      const map = {}
      const vm = this
      this.reconFormData.invoiceDate = DateFormat(this.reconFormData.invoiceDate, 'yyyy-MM-dd')
      this.reconFormData.termsDate = DateFormat(this.reconFormData.termsDate, 'yyyy-MM-dd')
      this.reconFormData.glDate = DateFormat(this.reconFormData.glDate, 'yyyy-MM-dd')
      map.headPayment = this.reconFormData
      map.billPaymentList = this.reconListData
      const loading = this.$loading({
        lock: true,
        text: '正在生成ebs发票，请稍等......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      axios.post(`${BASEAPI}/purchase/settlement/gen/ebs/invoice`,map).then(res => {
        loading.close()
        if (res.data.statusCode === 200) {
          this.$message({
            type: 'success',
            message: res.data.message,
          })
          vm.$root.monitor({ url: '/purchase/settlement/all/list' })
          vm.getEbsResult(map.headPayment)
          vm.cancelBack()
        }
      }, 'POST')
    },
    /**
     * 生成ebs发票弹框 取消
     * @param void
     * @return void
     */
    cancelBack () {
      this.invoiceDialog = false
    },
    /**
     * 定时查询ebs应付发票是否完成
     */
    getEbsResult (val) {
      this.$emit('getEbsResult', val)
    }
  }
}
</script>

<style lang="scss">
.setDblTable1 {
  .invoiceDetail {
    margin: 0 auto;
    ul {
      display: inline-block;
      vertical-align: top;
      width: 350px;
      margin-left: 20px;
      overflow: hidden;
    }
    ul li {
      display: flex;
      align-items:center;
      list-style: none;
      margin: 15px 0;
    }
    ul li span {
      display: inline-block;
      width: 100px;
    }
    ul li span strong {
      display: inline-block;
      color: red;
    }
    .summaryInput {
      margin-left: -8px
    }
    .type span {
      display: inline-block;
      width: 50px;
    }
    .type1 span {
      display: inline-block;
      width: 80px;
      height: 30px;
    }
    .type1 span i {
      line-height: 26px;
      margin-left: -54px;
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
    margin-bottom: 0;
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
  .searchForm{
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
  .el-form-item {
    margin: 6px;
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
  .buttonMargin {
    margin-top: 20px;
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
