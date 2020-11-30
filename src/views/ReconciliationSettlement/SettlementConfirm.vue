<template>
  <div class="SettlementConfirm">
    <!--最上面的搜索-->
    <div class="ct">
      <el-row :gutter="10">
        <el-form v-model="searchForm">
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-select size="mini" clearable v-model="searchForm.state" placeholder="状态">
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
              <el-input size="mini" clearable v-model="searchForm.ouName" placeholder="购方业务实体"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <!-- <el-input size="mini" clearable v-model="searchForm.seller" placeholder="销方公司"></el-input> -->
              <el-select filterable size="mini" clearable v-model="searchForm.seller" placeholder="销方公司">
                <el-option
                  v-for="item in sellerOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-input size="mini" clearable v-model="searchForm.settleCode" placeholder="结算单号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-date-picker clearable size="mini" v-model="searchForm.beginDate" type="date" placeholder="创建日期从"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-date-picker clearable size="mini" v-model="searchForm.toDate" type="date" placeholder="创建日期到"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="8" :md="8" :lg="6">
            <el-form-item>
              <el-button size="mini" @click="searchCondition" type="primary" plain icon="el-icon-search">查询</el-button>
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
            <el-table  size="mini" fit highlight-current-row @row-click="rowClick" ref="table" :data="mate.mateList.rows" @selection-change="handleSelectionChange" @sort-change="sortChange" max-height="300">
              <el-table-column type="selection" width="50" align="center"></el-table-column>
              <el-table-column  align="center" v-if="col.blockHash" :formatter="col.formatter" v-for="col of mate.mateList.columns" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
                 <template slot-scope="scope">
                      <el-button type="text" size="mini" v-show="scope.row.blockHash" @click="clickBlockHash(scope.row,scope.row.blockHash)"><img src="../../assets/imgs/ztree/ic_chain.png" style="width:13px; height:13px;margin:-2px 2px">{{ scope.row[col.name] }}</el-button>
                     <span v-show="!scope.row.blockHash" >{{ scope.row[col.name] }} </span>
                  </template>
              </el-table-column>
              <el-table-column  align="center" v-if="col.isShow" v-for="(col,index) of mate.mateList.columns" v-bind:key="col.name+index" :formatter="col.formatter" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              </el-table-column>
              <el-table-column  align="center"  fixed="right" label="操作" :width="actionWidth" v-if="mate.mateList.actions">
                <template slot-scope="scope" >
                  <k-btn  v-for="act of mate.mateList.actions" v-if="act.action === 'downloadPdf' && scope.row.sealpdfPath" v-bind:key="act.action" :label="act.label" size="mini" :act="act"  :row="scope.row" @action="confirm"></k-btn>
                  <k-btn v-for="act of mate.mateList.actions"  v-if="act.action !=='downloadPdf'" v-bind:key="act.action" :label="act.label" size="mini" :act="act"  :row="scope.row" @action="confirm"></k-btn>
                </template>
              </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <input type="file" ref="excelFile"  style="display:none" @change="fileUpload"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
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
      <div class="definedLine">
      </div>
      <el-table :cell-style="rowClass" max-height="300" size="mini" v-if="showFlag" :data="mate.mateList.lineRows"  class="tableTop">
        <el-table-column align="center" v-if="col.blockHash" :formatter="col.formatter" v-for="col of mate.mateList.lineColumns" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" size="mini" v-show="scope.row.blockHash" @click="clickBlockHash(scope.row,scope.row.blockHash)"><img src="../../assets/imgs/ztree/ic_chain.png" style="width:13px; height:13px;margin:-2px 2px">{{ scope.row.lineNum }}</el-button>
            <span v-show="!scope.row.blockHash" >{{ scope.row.lineNum }} </span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip v-if="col.isShow" :formatter="col.formatter" v-for="col of mate.mateList.lineColumns" :key="col.id" :label="col.label" :prop="col.name" :min-width="col.width">
        </el-table-column>
      </el-table>
    </div>
  </template>
  <el-dialog  title="查看区块信息" :visible.sync="blockHashVisible" width="40%">
    <BlockHash :hashForm="hashForm" :retrospectShow="retrospectShow"></BlockHash>
  </el-dialog>
     <el-dialog title="查看详情" :visible.sync="dialogVisible"   v-if="mate.mateFormerHeader" width="80%" >
       <el-row>
      <el-row>
         <DialogForm :mate="mate.mateFormerHeader" formModel="dialog" ></DialogForm>
         </el-row>
         <el-row>
         <template>
          <el-table max-height="300" size="mini" :data="mate.mateList.lineRows" border style="width: 100%;" class="detailTable">
            <el-table-column show-overflow-tooltip :formatter="col.formatter" v-for="col of mate.mateList.lineColumns" :key="col.id" :label="col.label" :prop="col.name" >
          </el-table-column>
          </el-table>
         </template>
         </el-row>
       </el-row>
    </el-dialog>
    <el-dialog  title="生成ebs发票" :visible.sync="invoiceDialog" width="40%" >
      <el-button size="mini" type="primary" @click="submitAP">提 交</el-button>
      <el-button size="mini" @click="cancelBack">取 消</el-button>
      <div class="invoiceDetail">
        <ul class="ul">
          <li><span><strong>*</strong>发票号：</span><el-input size="mini" v-model="reconFormData.ebsInvoiceCode" class="codeInput" maxlength="50" @blur="checkInput(reconFormData.ebsInvoiceCode)"></el-input></li>
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
import Vue from 'vue'
import { DateFormat } from '../../utils/util.js'
import { API_GATEWAY } from '@/config/index.js'
import SearchForm from '../../components/SearchForm'
import { LANGS } from '../../i18n/lang'
import BlockHash from '../../components/BlockHash'
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import axios from '@/utils/http';
import { dateFormatter } from "@/utils/DateUtils";
const BASEAPI = `${API_GATEWAY}/api`
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    SearchForm,
    KBtn,
    BlockHash,
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
      hashForm: {},
      searchForm: {
        state: '',
        ouName: '',
        seller: '',
        settleCode: '',
        beginDate: '',
        toDate: ''
      },
      sellerOptions: [],
      allowSearch: false,
      changePage: false,
      retrospectShow: false,
      setId: '',
      labelWidth: '90px',
      stateOptions: [], // 搜索状态的options
      seller: '',
      state: '',
      blockHashVisible: false,
      beginDate: null,
      toDate: null,
      titleOptions: [],
      operatorOptions: [],
      showAdvancedSearchPopover: false,
      pageSize: 5,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      langs: LANGS,
      hasSelected: false,
      searchValues: {},
      page: 0,
      sortValues: {},
      action: null,
      showFlag: false,                    // 下面表格的开关
      object: {},                          // 放columns
      fit: false,
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': window.sessionStorage.getItem('user').tenantId,
        'Content-Type': 'application/json;charset=utf8'
      },
      dialogVisible: false,
      auditStatus: '',
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
      companyName: '',  //当前租户公司名
      reconFormData: {       // 生成ebs发票需要的表单数据
        ebsInvoiceCode: "",
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
    mate: function (newMate) {
      this.formatterBefore(this.mate.mateList.columns)
      this.formatterBefore(this.mate.mateList.lineColumns)
      this.rowsContent = this.mate.mateList.rows
      this.mate.mateList.localName = this.mate.localName
      if (this.mate.mateSearch) {
        this.titleOptions = this.mate.mateSearch.fields[0].options
        this.operatorOptions = this.mate.mateSearch.fields[1].options
      }
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },
  created () {
    let mateList = this.mate.mateList
    let mateSearch = this.mate.mateSearch
    if (mateSearch) {
      if (mateSearch !== undefined && mateSearch.fields !== undefined && mateSearch !== null && mateSearch.fields !== null) {
        mateSearch.fields.map((i) => { this.object[i.name] = i })
        this.titleOptions = mateSearch.fields[0].options
        this.operatorOptions = mateSearch.fields[1].options
      }
    }
    this.formatterBefore(mateList.columns)
    this.formatterBefore(mateList.lineColumns)
    this.rowsContent = mateList.rows
    mateList.localName = this.mate.localName
    this.getStateOptions()
    // 获取销方公司
    this.getCompanyOptions()

    this.getenantName()
  },
  computed: {
    actionWidth: function () {
      return this.mate.mateList.actions.length * 60 + 30
    }
  },
  mounted () {
    this.rowSelect()
  },
  // 需要添加刷新消息
  methods: {
    /**
     * 校验发票号输入值并给出提示
    */
    checkInput (val) {
      let reg = /^[0-9a-zA-Z]+$/
      if(val) {
        if(!reg.test(val)) {
          this.reconFormData.ebsInvoiceCode = ''
          this.message('只能输入数字或字母','warning')
        } else {
          axios.get(`${BASEAPI}/purchase/settlement/check/ebs/invoice?ebsInvoiceCode=${val}`).then(res => {
            if (res.data.statusCode == 200) {
              if (!res.data.data) {
                this.message('该发票号已存在','warning')
                this.reconFormData.ebsInvoiceCode = ''
              }
            }
          })
        }
      }
      if (val.length === 50) {
        this.message('发票输入长度已达限制，请勿无效输入','warning')
      }
    },
    getenantName(){
       //判断租户是否是欣旺达电动汽车电池有限公司
      let vm = this
      var user = window.sessionStorage.getItem('user')
      this.$root.ajaxData('/tenants/get/tenant?tenantId=' + JSON.parse(user).tenantId, {}, function (data) {
          vm.companyName = data.name
      })
    },

    // 获取销方公司
    getCompanyOptions() {
      let vm = this
      this.$root.ajaxData('/companys/companyInfo/3?status=1&auditStatus=1&nopaging=1&dataOnly=true&&onlyCompanyFlag=1', {}, function (data) {
        for(let item of data) {
          vm.sellerOptions.push({value: item.name})
        }
        // vm.sellerOptions.push({})
      }, 'GET')
    },
    // 重置查询条件
    reset() {
      this.searchForm.state = ''
      this.searchForm.ouName = ''
      this.searchForm.seller = ''
      this.searchForm.settleCode = ''
      this.searchForm.beginDate = ''
      this.searchForm.toDate = ''
      this.allowSearch = false
      this.changePage = false
    },
    // 获取状态options
    getStateOptions () {
      var vm = this
      this.$root.ajaxData('/dic/cg/settlementState', {}, function (res) {
        vm.stateOptions = res
      }, 'GET')
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
    // 搜索条件
    searchCondition () {
      this.allowSearch = true
      this.getData('paging')
    },
    // 清空搜索条件
    clearCondition () {
      this.seller = ''
      this.state = ''
      this.beginDate = ''
      this.toDate = ''
    },
    rowClass({row, column, rowIndex, columnIndex}) {
      if (row.parentSourceId && columnIndex == 9) {
        return 'background: rgba(245,108,108,0.3);'
      }
    },
    fileUpload (file) {
      var vm = this
      var formdata = new FormData()
      formdata.append('file', file.target.files[0])
      this.$http({
        url: API_GATEWAY + '/zuul/api/users/import',
        method: 'POST',
        body: formdata,
        responseType: 'arraybuffer'
      }).then(function (response) {
        vm.$refs.excelFile.value = ''
        setTimeout(function () {
          vm.$root.monitor({ url: '/users/list' })
        }, 1000)
      })
    },
    // 查看详情按钮
    confirm (act, row) {
      var vm = this
      if (act.action === 'addChild') {
        this.mate.mateFormerHeader.values = row
        this.dialogVisible = true
        return false
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
    },
    rowClick (row) {
      this.showFlag = true
      var vm = this
      this.$root.ajaxData(this.mate.mateList.url + '/' + row.id, {}, function (data) {
        Vue.set(vm.mate.mateList, 'lineRows', data)
        vm.mate.mateList.lineRows = data
      }, 'GET')
    },
    handleButton (btn) {
      var vm = this
      let row = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      let rowLine = this.multipleSelection
      // 结算单确认、驳回
      if (btn.action === 'confirmSettlement' ) {
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state != 4) {
            this.message('请选择状态为待采购方确认的数据', 'warning')
            return
          }
        }
        vm.$root.ajaxData(btn.url, rowt.id, function (data) {
          vm.$root.monitor({ url: '/purchase/settlement/all/list?businessType=true', method: 'GET' })
        }, btn.method)
        return
      }
      // 采购方结算单确认、驳回
      if (btn.action === 'confirmSettlement' ) {
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state != 4) {
            this.message('请选择状态为待采购方确认的数据', 'warning')
            return
          }
        }
       vm.$root.ajaxData(btn.url, rowt.id, function (data) {
          vm.$root.monitor({ url: '/purchase/settlement/all/list?businessType=true', method: 'GET' })
        }, btn.method)
        return
      }
      // 供应商结算单确认
      if (btn.action === 'confirmSettlementSupplier' ) {
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state != 4) {
            this.message('请选择状态为待采购方确认的数据', 'warning')
            return
          }
        }
        vm.$root.ajaxData(btn.url, rowt.id, function (data) {
          vm.$root.monitor({ url: '/purchase/settlement/all/list?businessType=true', method: 'GET' })
        }, btn.method)
        return
      }
       // 采购商结算单驳回
      if(btn.action === 'rejectSettlement'){
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state != 4) {
            this.message('请选择状态为待采购方确认的数据', 'warning')
            return
          }
        }
        this.$confirm('此操作将驳回结算单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
          vm.$root.ajaxData(btn.url, rowt.id, function (data) {
            vm.$root.monitor({ url: '/purchase/settlement/all/list?businessType=true', method: 'GET' })
          }, btn.method)
          return
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消驳回'
          });          
        });
        return
      }
      // 供应商商结算单驳回
      if(btn.action === 'rejectSettlementSupplier'){
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state != 4) {
            this.message('请选择状态为待采购方确认的数据', 'warning')
            return
          }
        }
        this.$confirm('此操作将驳回结算单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
          vm.$root.ajaxData(btn.url, rowt.id, function (data) {
            vm.$root.monitor({ url: '/purchase/settlement/all/list?businessType=true', method: 'GET' })
          }, btn.method)
          return
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消驳回'
          });          
        });
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
              vm.$root.monitor({ url: '/purchase/settlement/all/list?businessType=true', method: 'GET' })
            }, 1000)
          } catch (err) {
          }
        }, (response) => {
          vm.loading = false
          vm.message(response.body.message, 'warning')
        })
        return
      }
      // 结算单确认 财务审批
      if (btn.action === 'auditPass' || btn.action === 'auditReject') {
        const rowt = {id: this.multipleSelection.map((r) => r.id)}
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].auditStatus != 1) {
            this.message('请选择审批状态为待审批状态的数据', 'warning')
            return
          }
        }
        vm.$root.ajaxData(btn.url, rowt.id, function (data) {
          vm.$root.monitor({ url: '/purchase/settlement/all/list?businessType=true', method: 'GET' })
        }, btn.method)
        return
      }
      if (btn.action === 'cancelBuySettlement') {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state !== '1' && this.multipleSelection[i].state !== '4') {
            this.message('已确定、等待采购方确认状态才能取消', 'warning')
            return
          }
        }
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$root.ajaxData(btn.url, rowt.id, function (data) {
          vm.$root.monitor({ url: '/purchase/settlement/all/list?businessType=true', method: 'GET' })
        }, btn.method)
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
          vm.$root.monitor({ url: '/purchase/settlement/all/list?businessType=true', method: 'GET' })
            if(data.statusCode === 200){
              vm.message(data.message, 'success')
            }
            if(data.statusCode === 500){
              vm.message(data.message, 'error')
            }
        }, btn.method)
        return
      }
      // 结算单确认导出
      if (btn.action === 'exportSettlement') {
        if (this.multipleSelection.length > 1) {
          vm.message('请选择一条数据', 'warning')
          return
        }
        let exportUrl = ''
        const rowt = { id: this.multipleSelection.map((r) => r.id)}
        
        if(this.companyName == '欣旺达电动汽车电池有限公司'){
          exportUrl = API_GATEWAY + '/api' + btn.url + '_dq?format=xlsx&&ID=' + rowt.id
        }else{
          exportUrl = API_GATEWAY + '/api' + btn.url + '?format=xlsx&&ID=' + rowt.id
        }
        this.$http({
          url: exportUrl,
          method: 'GET',
          headers: this.headers,
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
      if (btn.action === 'shuaxin') {
        this.$root.handleAction(btn, row, function (data) {
          vm.mate.mateList.rows = data.mate.mateList.rows
          vm.mate.mateList.total = data.mate.mateList.total
        })
        this.clearCondition()
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
        // 发票日期，条件日期，GL日期默认当前日期
        let date1 = this.reconFormData.invoiceDate || ''
        let date2 = this.reconFormData.termsDate || ''
        let date3 = this.reconFormData.glDate || ''
        this.reconFormData.invoiceDate = date1 || dateFormatter("YYYY-MM-DD")
        this.reconFormData.termsDate = date2 || dateFormatter("YYYY-MM-DD")
        this.reconFormData.glDate = date3 || dateFormatter("YYYY-MM-DD")
        let id = this.multipleSelection[0].id
        axios.get(`${BASEAPI}/purchase/settlement/line/all/${id}`).then(res => {
          if (res.status === 200) {
            this.reconListData = res.data
            this.$set(this.reconFormData,'id', this.multipleSelection[0].id)
            this.$set(this.reconFormData,'companyName', this.multipleSelection[0].seller)
            this.$set(this.reconFormData,'currency', this.multipleSelection[0].currency)
            this.$set(this.reconFormData,'moneyAmount', this.multipleSelection[0].moneyAmount)
            this.$set(this.reconFormData,'taxRate', this.multipleSelection[0].taxRate)
            this.$set(this.reconFormData,'address', this.reconListData[0].address)
            this.$set(this.reconFormData,'officeName',this.multipleSelection[0].ouName)
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
        vm.getData()
      })
    },
    message (message, type) {
      this.$message({
        message: message,
        type: type
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
      this.getData('paging')
    },
    handleCurrentChange (val) {
      this.page = val
      this.changePage = true
      this.getData('paging')
    },
    handleAction (act, row) {
      var vm = this
      
      this.$root.handleAction(act, row, function () {
        vm.getData()
      })
    },
    getData (flag) {
      // 查询获取
      let vm = this
      if (this.allowSearch && !this.changePage) {
        this.searchForm.beginDate = DateFormat(this.searchForm.beginDate, 'yyyy-MM-dd')
        this.searchForm.toDate = DateFormat(this.searchForm.toDate, 'yyyy-MM-dd')
        this.$root.ajaxData('/purchase/settlement/simple/search-n?isCopy=1', this.searchForm, function(data) {
          vm.mate.mateList.rows = data.mate.rows
          vm.mate.mateList.total = data.mate.total
        }, 'POST')
        return
      }
      // 查询获取、分页
      if (this.allowSearch && this.changePage) {
        this.searchForm.beginDate = DateFormat(this.searchForm.beginDate, 'yyyy-MM-dd')
        this.searchForm.toDate = DateFormat(this.searchForm.toDate, 'yyyy-MM-dd')
        this.$root.ajaxData(`/purchase/settlement/simple/search-n?isCopy=1&pageNum=${this.page}&pageSize=${this.pageSize}`, this.searchForm, function(data) {
          vm.mate.mateList.rows = data.mate.rows
          vm.mate.mateList.total = data.mate.total
        }, 'POST')
        return
      }
      let url = `/purchase/settlement/all/list?businessType=true`
      // if (this.beginDate && this.toDate) {
      //   url = `/purchase/settlement/all/list?businessType=true&&seller=${this.seller}&&state=${this.state}&&beginDate=${this.beginDate}&&toDate=${this.toDate}`
      // } else if (!this.beginDate && !this.toDate) {
      //   url = `/purchase/settlement/all/list?businessType=true&&seller=${this.seller}&&state=${this.state}`
      // } else if (!this.beginDate && this.toDate) {
      //   url = `/purchase/settlement/all/list?businessType=true&&seller=${this.seller}&&state=${this.state}&&toDate=${this.toDate}`
      // } else if (this.beginDate && !this.toDate) {
      //   url = `/purchase/settlement/all/list?businessType=true&&seller=${this.seller}&&state=${this.state}&&beginDate=${this.beginDate}`
      // }
      let param = {
        search: this.searchValues,
        page: this.page,
        sort: this.sortValues
      }
      if (url === '/purchase/th/order/headers/all/list') {
        url += '-q?' + 'pageNum=' + this.page + '&pageSize=' + this.pageSize
      } else if (flag && url.indexOf('?') === -1) {
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
      let mateList = this.mate.mateList
      let dataMateList = data.mate.mateList
      if (dataMateList.rows) {
        mateList.rows = dataMateList.rows
        this.rowsContent = dataMateList.rows
      }
      if (dataMateList.total) {
        mateList.total = dataMateList.total
      } else {
        mateList.total = 0
      }
      if (data.mate.selected) {
        mateList.selected = dataMateList.selected
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
    },
    /**
     * 生成ebs发票
     * @param void
     * @return void
     */
    submitAP () {
      if (
        this.reconFormData.ebsInvoiceCode === '' ||
        this.reconFormData.summary === '' ||
        this.reconFormData.invoiceDate === '' ||
        this.reconFormData.termsDate === null || 
        this.reconFormData.glDate === null
      ){
        this.$message({
          type: 'warning',
          message: '必填字段填写完整',
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
          vm.$root.monitor({ url: '/purchase/settlement/all/list?businessType=true' })
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
.SettlementConfirm {
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
    .codeInput {
       margin-left:-8px;
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
      height: 30px;
    }
    .type1 span i {
      line-height: 26px;
      margin-left: -70px;
    }
    .el-input--prefix .el-input__inner {
        padding-left: 40px;
    }
  }
  .page {
    // margin-top: 20px;
  }
  .chain {
      display: inline-block;
      width: 15px;
      height: 15px;
      background:url('../../assets/imgs/ztree/ic_chain.png') no-repeat;
      transform: translateY(3px);
      }
  .main-block .search {
      display: inline-block;
      margin-left: 30px;
      margin-top: -13px;
  }
  // .el-form--inline .el-form-item {
  //   margin-bottom: 0
  // }
   .el-tag{
    background-color:rgba(64,158,255,.1);
    padding:0 10px;
    height:32px;
    line-height:30px;
    font-size:12px;
    margin-left:-23px;
    color:#409EFF;
    border-radius:4px;
    box-sizing:border-box;
    border:1px solid rgba(64,158,255,.2)
  }
  .el-table .cell, .el-table th>div {
    padding-right: 0;
  }
  .blank{
    float:left;
    margin-left:10px;
    margin-bottom: 30px;
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
  .el-form--inline .el-form-item {
    margin-bottom: 0
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
  .select-button{
    margin-top: 20px;
  }
  .detailLine{
    // margin-top: 10px;
    position: relative;
    margin-bottom: 30px;
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
    // position: absolute;
    margin-top: 20px;
  }
  .el-table td, .el-table th {
    height: 25px;
  }
  .detailTable{
    margin-top: 20px;
  }
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
  .el-dialog__header {
    padding: 10px 10px 0;
  }
  .el-dialog__body {
    padding: 10px 10px;
  }
  .ct {
    // margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
  th {
    background-color: #e6e7eb;
    color: #303030;
    font-weight: 700;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
}
</style>
