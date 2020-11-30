<template>
  <div class="CheckSettlement1">
    <div class="headQuery">
      <check-s-form-purch class="form" :form="mate.queryHeader" :showFlag="!!mate.matePaymentList.selectedRows.length" :saleCheck="saleChecked" @changeThree="changeThree" @clickCreate="clickCreate"></check-s-form-purch>
      <!-- <el-button size="mini">生成结算单</el-button> -->
    </div>

    <div class="client">
      <h1>采购方待对账清单</h1>
      <div class="client-btn">
        <el-button type="primary" plain size="mini" @click="clientAdd" v-show="mate.matePaymentList.btns[0].clientAdd">添加行</el-button>
        <el-button type="primary" plain size="mini" @click="addLine" :disabled="mate.matePaymentList.selectedRows.length === 0" v-show="mate.matePaymentList.btns[1].addLine">新增手工录入行</el-button>
        <!-- <el-button size="mini" @click="adjustTax" :disabled="payDataSelectList.length!==1" v-show="mate.matePaymentList.btns[2].addLine">调税</el-button> -->
        <el-button type="primary" plain size="mini" @click="adjustPrice" :disabled="payDataSelectList.length === 0" v-show="mate.matePaymentList.btns[3].adjustTax">调价</el-button>
        <el-button type="primary" plain size="mini" @click="clientDelete" :disabled="!payDataSelectList.length" v-show="mate.matePaymentList.btns[2].clientDelete">删除</el-button>
        <el-button type="primary" plain size="mini" @click="eImportData" :disabled="!mate.matePaymentList.selectedRows.length">对账单导出</el-button>
      </div>
      <div style="margin-bottom: 10px;">您现在选中的内容为: {{gridOptionsPay.content}}</div>
      <!-- <ag-grid-vue style="height: 500px;"
                  class="ag-theme-balham ag-test"
                  :gridOptions="gridOptionsPay"
                  :columnDefs="mate.matePaymentList.columns"
                  :rowData="mate.matePaymentList.selectedRows"
                  :suppressMenuHide="true"
                  :enableSorting="true"
                  :enableFilter="true"
                  :selectionChanged="selectionChangedPay"
                  >
      </ag-grid-vue> -->
      <ag-grid-vue style="height: 500px;"
                  class="ag-theme-balham ag-test"
                  :gridOptions="gridOptionsPay"
                  :columnDefs="mate.matePaymentList.columns"
                  :rowData="mate.matePaymentList.selectedRows"
                  :suppressMenuHide="true"
                  :selectionChanged="selectionChangedPay"
                  >
      </ag-grid-vue>
    </div>

    <!--新增客户对账单dialog-->
    <Client :mate="mate.matePaymentList" :dialogClient="dialogClient" @clientClose="clientClose" :fourCode="fourCode" @clientQuery="clientQuery" @actionSelectedPay="actionSelectedPay"></Client>

    <!--新增手工录入行-->
    <check-dailog-hand ref="checkdailogHand" @closeHand="closeHand" @confirmLine="confirmLine" :addDialogFormVisible="addDialogFormVisible"></check-dailog-hand>
    
    <!--选取对账方式-->
    <el-dialog title="请选择对账内容" :close-on-click-modal="closeOnClickModal" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" top="20vh">
      <div class="content">
        <el-checkbox v-model="buyChecked" disabled>采购方</el-checkbox>
        <el-checkbox v-model="saleCheck">销售方</el-checkbox>
      </div>
      <div class="dialogBtn">
        <el-button size="mini" @click="getCheckResult">确 定</el-button>
        <el-button size="mini" @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>

    <!--调税-->
    <el-dialog title="调税" :visible.sync="adjustTaxDialog" width="40%" class="adjustTax">
      <h5>提示：调税不调价选是会把调税的金额差异自动添加到新的行，使含税金额不变！</h5>
      <el-form>
        <el-form-item label="调税不调价">
          <el-radio v-model="taxNoPrice" label="1">是</el-radio>
          <el-radio v-model="taxNoPrice" label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="请输入新的税率">
          <!-- <el-input size="mini" v-model="adjustTaxData"></el-input> -->
          <el-select size="mini" v-model="adjustTaxData" placeholder="请选择">
                <el-option
                  v-for="item in adjustTaxDataOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
        </el-form-item>
      </el-form>
      <el-button size="mini" @click="taxSubmit">确 定</el-button>
      <el-button size="mini" @click="taxCancel">取 消</el-button>
    </el-dialog>

    <!--调价-->
    <el-dialog title="调价" :visible.sync="adjustPriceDialog" width="40%" class="adjustTax" before-close="beforeClosePrice" @close="beforeClosePrice" :close-on-click-modal="falseFlag">
      <h5>提示：系统会根据输入的新单价计算金额差异，并添加到新的行！</h5>
      <el-form :model="adjustPriceM" :label-position="labelPosition" :label-width="labelWidth" class="priceDialog">
        <el-form-item label="新的含税单价">
          <el-input size="mini" @change="changePrice" v-model.trim="adjustPriceM.adjustPriceData"></el-input>
        </el-form-item>
        <el-form-item label="需调价的数量">
          <el-input size="mini" disabled @change="changeNumber" v-model.trim="adjustPriceM.number"></el-input>
        </el-form-item>
        <el-form-item label="差异的金额">
          <el-input size="mini" disabled v-model.trim="adjustPriceM.priceSpread"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input size="mini" v-model.trim="adjustPriceM.remark"></el-input>
        </el-form-item>
      </el-form>
      <el-button size="mini" @click="priceSubmit">确 定</el-button>
      <el-button size="mini" @click="priceCancel">取 消</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import "../../../node_modules/ag-grid/dist/styles/ag-grid.css"
  import "../../../node_modules/ag-grid/dist/styles/ag-theme-balham.css"
  import {AgGridVue} from "ag-grid-vue"
  import Vue from 'vue'
  import CheckSFormPurch from './CheckSFormPurch'
  import KTable from '../../components/KTable.vue'
  import {DateFormat} from '../../utils/util'
  import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
  import Client from './Client'
  import CheckDialogSupplier from './CheckDialogSupplier'
  import CheckDailogHand from './CheckDialogHand'
  import { API_GATEWAY } from '@/config/index.js'
  export default {
    mixins: [ColumnFormatterMixin],
    created () {
      this.init()
    },
    mounted () {
      this.gridOptionsPay.api.forEachNode(function (node) {
        if (node.data.selected === true) {
          node.setSelected(true)
        }
      })
      // this.gridOptions.api.forEachNode(function (node) {
      //   if (node.data.selected === true) {
      //     node.setSelected(true)
      //   }
      // })
    },
    watch: {
      mate: function () {
        this.init()
      }
    },
    data () {
      return {
        adjustPriceM: {
          adjustPriceData: '',
          number: '',
          priceSpread: '',
          remark: ''
        },
        falseFlag: false,
        labelWidth: '130px',
        taxNoPrice: '2',
        adjustTaxData: 0,
        adjustTaxDialog: false,
        adjustPriceData: '',
        adjustPriceDialog: false,
        content: '',
        buyChecked: true,   // 对账方式采购
        saleCheck: false,  // 对账方式销售
        saleChecked: false,
        objectColumns: {},
        closeOnClickModal: false,
        // isFalse: false,   // 确定和取消都是可以用的按钮
        // isQuery: false,  // 查询按钮是否可用
        // isCheck: false,  // 匹配按钮是否可用
        // isCreate: true, // 生成客户结算单按钮是否可用
        // checkName: '匹配',
        // createSettlementName: '生成客户结算单',
        // confirmName: '确定',
        // cancelName: '取消',
        receiveData: {},  // 勾选应收数据
        payData: [],  // 勾选应付数据
        payDataList: [], // 显示在采购列表的数据
        payDataSelectList: [],
        reDateSelectList: [],
        isMutiAddress: '',
        height: 200, // table的高度，这个是要传入到KTable组件中的
        labelPosition: 'right',
        changeNumberMap: {}, // 改变数量
        showOverflow: true,
        addDialogFormVisible: false, // 新增明细行开关
        dialogClient: false,   // 客户dialog开关
        dialogSupplier: false,  // 供应商dialog开关
        fourCode: {},
        dialogVisible: false,
        closeOnClickModal: false,
        defaultColDef: {
          filter: true
        },
        gridOptions: {
          enableColResize:true, // 可以改变行的宽度
          rowSelection:"multiple",
          rowMultiSelectWithClick: true
        },
        adjustTaxDataOptions: [
          {
            value: 0
          },
          {
            value: 0.03
          },
          {
            value: 0.04
          },
          {
            value: 0.06
          },
          {
            value: 0.1
          },
          {
            value: 0.11
          },
          {
            value: 0.13
          },
          {
            value: 0.16
          },
          {
            value: 0.17
          }
        ],
        gridOptionsPay: {
          content: '',
          top: '',
          floatingFilter: true,
          defaultColDef: {
              resizable: true,//是否可以调整列大小，就是拖动改变列大小
              filter: false  //开启刷选
          },
          enableColResize:true, // 可以改变行的宽度
          rowSelection:"multiple",  // 可以多选
          rowMultiSelectWithClick: true, // 点击一下就可以选中
          suppressCopyRowsToClipboard: true,
          onCellClicked: function (event) {
            this.content = event.value
          },
          onCellEditingStopped: function(event) {
            let id = event.data.id
            let index = 0
            for (let i = 0; i < this.rowData.length; i++) {
              if (this.rowData[i].id === id) {
                index = i
              }
            }
            let rowDataIndex = this.rowData[index]
            if (rowDataIndex.canInvoiceQty > 0 && rowDataIndex.canInvoiceQty < rowDataIndex.qty) {
              rowDataIndex.qty = rowDataIndex.canInvoiceQty
            }
            if (rowDataIndex.canInvoiceQty < 0 && rowDataIndex.canInvoiceQty > rowDataIndex.qty) {
              rowDataIndex.qty = rowDataIndex.canInvoiceQty
            }
            if (rowDataIndex.id.length > 17) {
              rowDataIndex.moneyAmount = (Math.round(rowDataIndex.qty * rowDataIndex.price * 100) / 100).toFixed(2)
              rowDataIndex.unitPrice = rowDataIndex.price / (1 + Number(rowDataIndex.taxRate))
              rowDataIndex.unitPrice = Math.round(rowDataIndex.unitPrice * 10000000000) / 10000000000
              rowDataIndex.noratAmount = (Math.round(rowDataIndex.qty * rowDataIndex.unitPrice * 100) / 100).toFixed(2)
            }
            // 
            // 在改变值之后，实时显示
            this.api.updateRowData(this.rowData)
          }
        },
        queryHead: {
          qytMount: 0,
          qty: 0,
          amount: 0,
          moneyAmount: 0,
          differOfQty: 0,
          differOfMoney: 0
        },
        Options: [
          {
            label: '杂项',
            value: '1'
          },
          {
            label: '运费',
            value: '2'
          },
          {
            label: '项目',
            value: '0'
          }
        ],
        labelPosition: 'right',
        payDataList: [],
        payData: [],
        ReceiveData: []
      }
    },
    components: {
      CheckSFormPurch,
      KTable,
      Client,
      CheckDialogSupplier,
      CheckDailogHand,
      AgGridVue
    },
    props: {
      mate: Object,
      isTabCome: Boolean,
      saleCheckedHome: Boolean
    },
    methods: {
      // 导出
      eImportData () {
        this.$http({
          url: API_GATEWAY + '/api/purchase/recon/pre/price/change/export',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
            'Accept': 'application/json',
            'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer',
          body: this.mate.matePaymentList.selectedRows
        }).then(function (response) {
          var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          var filename = '对账单.xlsx'
          a.setAttribute('download', filename)
          a.click()
          URL.revokeObjectURL(objectUrl)
        })
      },
      beforeClosePrice () {
        this.clearNumber()
      },
      // 将数据清空
      clearNumber () {
        Object.keys(this.adjustPriceM).forEach(item => {
          this.adjustPriceM[item] = ''
        })
      },
      subNum(num1, num2) {
        var sq1, sq2, m
        try {
          sq1 = num1.toString().split('.')[1].length
        } catch (e) {
          sq1 = 0
        }
        try {
          sq2 = num2.toString().split('.')[1].length
        } catch (e) {
          sq2 = 0
        }
        m  = Math.pow(10, Math.max(sq1, sq2))
        return m
      },
      changePrice () {
        let m = this.subNum(this.adjustPriceM.adjustPriceData, this.payDataSelectList[0].price)
        this.adjustPriceM.priceSpread = (this.adjustPriceM.adjustPriceData - this.payDataSelectList[0].price) * this.adjustPriceM.number
        this.adjustPriceM.priceSpread = Math.round(this.adjustPriceM.priceSpread * m) / m
        this.adjustPriceM.remark = `原单价${this.payDataSelectList[0].price}调整为${this.adjustPriceM.adjustPriceData}`
      },
      // 调价改变数量
      changeNumber () {
        let old = this.payDataSelectList[0].qty
        if (this.adjustPriceM.number <= 0 || this.adjustPriceM.number > old) {
          this.$message({
            message: '调价数量不能小于0且不能大于原来的数量',
            type: 'warning'
          })
          this.adjustPriceM.number = old
        } else {
          this.changePrice()
        }
      },
      taxCancel () {
        this.adjustTaxDialog = false
        this.adjustTaxData = 0
      },
      priceCancel () {
        this.adjustPriceDialog = false
        this.adjustPriceData = ''
        this.clearNumber()
      },
      getMaxLength (pre, next) {
        let sq1
        let sq2
        try {
          sq1 = pre.toString().split('.')[1].length
        } catch (e) {
          sq1 = 0
        }
        try {
          sq2 = next.toString().split('.')[1].length
        } catch (e) {
          sq2 = 0
        }
        return Math.max(sq1, sq2)
      },
      taxSubmit () {
        const pow = 10000000000
        this.adjustTaxDialog = false
        let preMoney = 0
        let maxLength
        let theFirstData = this.payDataSelectListp[0]
        preMoney = theFirstData.moneyAmount
        theFirstData.taxRate = this.adjustTaxData
        theFirstData.price = theFirstData.unitPrice * (1 + theFirstData.taxRate)
        theFirstData.price = Math.round(theFirstData.price  * pow) / pow // 保留10位小数
        theFirstData.moneyAmount = (theFirstData.price * theFirstData.qty).toFixed(4)
        theFirstData.taxCode = '进项税' + this.adjustTaxData * 100 + '%'
        for (let i = 0, data = this.mate.matePaymentList.selectedRows; i < data.length; i++) {
          if (data[i].lineNo === theFirstData.lineNo) {
            data[i].price = theFirstData.price
            data[i].moneyAmount = theFirstData.moneyAmount
          }
        }
        if (this.taxNoPrice === '1') {
          let data = JSON.parse(JSON.stringify(theFirstData))
          data.moneyAmount = preMoney - theFirstData.moneyAmount
          maxLength = this.getMaxLength(preMoney, theFirstData.moneyAmount)
          let num = Math.pow(10, maxLength)
          data.moneyAmount = Math.round(data.moneyAmount * num) / num
          data.taxCode = '进项税' + this.adjustTaxData * 100 + '%'
          data.poDate = null
          data.unitPrice = ''
          data.canInvoiceQty = ''
          data.qty = ''
          data.price = ''
          data.noratAmount = data.moneyAmount / (1 + data.taxRate)
          data.noratAmount = Math.round(data.noratAmount * pow) / pow // 保留10位小数
          data.parentSourceId = data.sourceId
          this.mate.matePaymentList.selectedRows.splice(data.lineNo, 0, data)
        }
        this.sortPaySelect()
        this.payDataSelectList = []
      },
      priceSubmit () {
        if (this.adjustPriceM.adjustPriceData == '' || this.adjustPriceM.number == '' || this.adjustPriceM.remark == '') {
          this.$message({
            message: '新的含税单价、需调价的数量和备注必填',
            type: 'warning'
          })
          return
        }
        const pow = 10000000000
        let maxLength
        this.adjustPriceDialog = false
        this.payDataSelectList.forEach(item=>{
          let payData = item
          let data = JSON.parse(JSON.stringify(payData))
          data.qty = item.qty
          let mPrice = this.subNum(this.adjustPriceM.adjustPriceData, payData.price)
          data.price = Math.round((this.adjustPriceM.adjustPriceData - payData.price) * mPrice) / mPrice
          data.unitPrice = data.price / (1 + Number(data.taxRate)) // 不含税单价
          data.noratAmount = Math.round(data.unitPrice * this.adjustPriceM.number * pow) / pow// 不含税金额
          data.moneyAmount = Math.round(data.price * data.qty * pow) / pow
          data.unTaxedAmount = data.noratAmount // 未税金额
          let taxedAmountNum = this.subNum(data.moneyAmount, data.noratAmount)
          data.taxedAmount = Math.round((data.moneyAmount - data.noratAmount) * taxedAmountNum) / taxedAmountNum  // 税金
          data.poDate = null
          data.poCode = ''
          data.warehouseNum = ''
          data.canInvoiceQty = this.adjustPriceM.number
          data.summary = this.adjustPriceM.remark
          data.comments = data.summary
          data.parentSourceId = data.sourceId
          data.isChange = true
          this.mate.matePaymentList.selectedRows.splice(data.lineNo, 0, data)
          item.isChange = true
          this.sortPaySelect()
        })
        this.clearNumber()
        this.payDataSelectList = []
      },
      adjustTax () {
        this.adjustTaxDialog = true
        this.adjustTaxData = ''
      },
      adjustPrice () {
        // 是否调价过
        var isChange = false
        var qtyAmout = 0
        this.payDataSelectList.forEach(item=>{
          qtyAmout += item.qty
          if(item.isChange){
            isChange = true
          }
        })
        if (isChange) {
          this.$message({
            message: '存在已调价的数据，请选择其他数据进行调价',
            type: 'warning'
          })
          return
        }
        // 是否选择相同的物料、相同的单价
        var isSame = false
        for(var i = 0; i <= this.payDataSelectList.length-2; i++ ){
          if(this.payDataSelectList[i].itemCode !== this.payDataSelectList[i+1].itemCode || this.payDataSelectList[i].price !== this.payDataSelectList[i+1].price){
            isSame = true
          }
        }
        if(isSame){
          this.$message({
            message: '请选择相同物料、相同含税单价的进行统一调价',
            type: 'warning'
          })
          return
        }
        this.adjustPriceDialog = true
        this.adjustPriceM.number = qtyAmout
        this.adjustPriceM.adjustPriceData = this.payDataSelectList[0].price
        this.adjustPriceData = ''
      },
      init () {
        this.mate.matePaymentList.columns.map((i) => {
          i.headerName = i.label
          i.field = i.name
          this.objectColumns[i.name] = i
          if (i.name === 'lineType') {
            // 格式渲染
            i.cellRenderer = function (params) {
              if (params.value == '1') {
                return '杂项'
              } else if (params.value == '2') {
                return '运费'
              } else {
                return '项目'
              }
            }
          }
        })
        this.mate.mateReceiveList.columns.map((i) => {
          i.headerName = i.label
          i.field = i.name
          i.filter = false
        })
        // 从home组件里面传来的数据
        this.saleChecked = this.saleCheckedHome
        let queryHeaderC = this.mate.queryHeader
        Vue.set(queryHeaderC, 'qytMount', 0)
        Vue.set(queryHeaderC, 'qty', 0)
        Vue.set(queryHeaderC, 'amount', 0)
        Vue.set(queryHeaderC, 'moneyAmount', 0)
        Vue.set(queryHeaderC, 'differOfQty', 0)
        Vue.set(queryHeaderC, 'differOfMoney', 0)
        Vue.set(queryHeaderC, 'supplierName', '')
        queryHeaderC = Object.assign(queryHeaderC, this.queryHead)
        if (localStorage.getItem('settlement')) {
          let data = JSON.parse(localStorage.getItem('settlement'))
          this.mate.matePaymentList.selectedRows = data.matePaymentList.selectedRows
          this.mate.mateReceiveList.selectedRows = data.mateReceiveList.selectedRows
          queryHeaderC = data.queryHeader
          localStorage.removeItem('settlement')
        }
      },
      // 这是给子组件用的
      emptyOUName () {
        this.mate. queryHeader.ouName = ''
      },
      doubleClick (row) {
      },
      // table选中的数据应付
      selectionChangedPay (val) {
        this.payDataSelectList = this.gridOptionsPay.api.getSelectedRows()
        this.caclPay()
      },
      clickAll () {
        let queryHeader = this.mate.queryHeader
        console.log(this.mate.queryHeader)
        if(this.isMutiAddress){
          if (queryHeader.ouName == '' || queryHeader.customerName == '' || queryHeader.currencyCode == '' || queryHeader.supplierName == '') {
            this.$message({
              message: '请先填写购方业务实体、购方公司和销方公司',
              type: 'warning'
            })
            return false
          }
          this.fourCode = {
            operationUnit: queryHeader.operationUnit,
            ouName: queryHeader.ouName,
            customerName: queryHeader.customerName,
            currencyCode: queryHeader.currencyCode,
            supplierName:queryHeader.supplierName,
            address: queryHeader.address
          }
          return true
        } else {
          if (queryHeader.ouName == '' || queryHeader.customerName == '' || queryHeader.currencyCode == '' || queryHeader.address == '' || queryHeader.supplierName == '') {
          this.$message({
            message: '请先填写购方业务实体、购方公司、地点和销方公司',
            type: 'warning'
          })
          return false
        }
        this.fourCode = {
          operationUnit: queryHeader.operationUnit,
          ouName: queryHeader.ouName,
          customerName: queryHeader.customerName,
          currencyCode: queryHeader.currencyCode,
          supplierName:queryHeader.supplierName,
          address: queryHeader.address
        }
        return true
        }
      },
      // 点击新增按钮 客户新增
      clientAdd () {
        let flag = this.clickAll()
        if (flag) {
          this.dialogClient = true
        }
      },
      // 点击dialog的X，在父组件去关闭弹窗
      clientClose () {
        this.dialogClient = false
        this.mate.matePaymentList.rows = []
      },
      // 查询客户待对账单
      clientQuery (val) {
        var vm = this
        let params = {}
        let arrId = []
        params.apList = val
        this.mate.matePaymentList.selectedRows.length && this.mate.matePaymentList.selectedRows.map(i => {
          arrId.push(i.id)
        })
        params.selectedIdList = arrId
        this.$root.ajaxData('/purchase/recon/pre/query/payment?from=buyer', params, function (data) {
          for (let item of data.rows) {
            item.taxMoney = item.moneyAmount - item.noratAmount
          }
          vm.mate.matePaymentList.rows = data.rows
        }, 'POST')
      },
      test () {
        document.getElementsByClassName('ag-row-level-0')[0].style="height: 28px; transform: translateY(0px); background: #ecf5ff"
      },
      // 在子组件中选择客户对账单放在父组件中
      actionSelectedPay (val) {
        var vm = this
        let select = JSON.parse(JSON.stringify(val))
        select.length && select.map(i => {
          // i.selected = true
          vm.mate.matePaymentList.selectedRows.push(i)
        })
        this.mate.matePaymentList.selectedRows.length && this.mate.matePaymentList.selectedRows.map(i => {
          vm.changeNumberMap[i.id] = i.qty
        })
        this.sortPaySelect()
      },
      // 打开新增手工录入行
      addLine () {
        this.addDialogFormVisible = true
      },
      confirmLine (val) {
        let taxRate
        const selectedRows = this.mate.matePaymentList.selectedRows
        // 获取到第一个数量是正数的值且税率不为空，然后获取税率
        for (let i = 0; i < selectedRows.length; i++) {
          if (selectedRows[i].qty > 0 && selectedRows[i].taxRate != null && selectedRows[i].taxRate != '') {
            taxRate = selectedRows[i].taxRate
            break
          }
        }
        // 不含税金额、税额  这里要加Number（）将String转化为Number（）
        if (this.mate.matePaymentList.selectedRows.length && taxRate) {
          val.noratAmount = Number(val.moneyAmount) / (1 + Number(taxRate))
          val.noratAmount = (Math.round(val.noratAmount * 100) / 100).toFixed(2)
          val.taxRate = taxRate
        }
        // 计算未税金额和税额
        val.unTaxedAmount = val.noratAmount
        val.taxedAmount = val.moneyAmount - val.unTaxedAmount
        // 加id，是为了在删除的时候，可以找到id
        val.id = this.mate.matePaymentList.selectedRows.length
        val.comments = val.summary // 手工行中的摘要要放在备注里面
        const data = Object.assign({}, val)
        this.mate.matePaymentList.selectedRows.push(data)
        this.changeNumberMap[val.id] = val.qty
        this.$refs.checkdailogHand.cancelLine()
        this.sortPaySelect()
      },
      // 关闭dialog手工录入行
      closeHand () {
        this.addDialogFormVisible = false
      },
      // 删除应付数据
      clientDelete () {
        const deleteArr = []
        let copy = []
        this.payDataSelectList.forEach(i => {
          deleteArr[i.id] = true
        })
        copy = [...this.mate.matePaymentList.selectedRows]
        this.mate.matePaymentList.selectedRows = []
        copy.map(i => {
          if (!deleteArr[i.id]) {
            this.mate.matePaymentList.selectedRows.push(i)
          } else {
            delete this.changeNumberMap[i.id]
          }
        })
        this.sortPaySelect()
        this.payDataSelectList = []
        this.caclPay()
      },
      // 从子组件过来
      actionSelectedRe (val) {
        val.length && val.map(i => {
          this.mate.mateReceiveList.selectedRows.push(i)
        })
        this.sortReSelect()
      },
      supplierDelete () {
        const deleteArr = []
        let copy = []
        this.gridOptions.api.getSelectedRows().forEach(i => {
          deleteArr[i.id] = true
        })
        copy = [...this.mate.mateReceiveList.selectedRows]
        this.mate.mateReceiveList.selectedRows = []
        copy.map(i => {
          if (!deleteArr[i.id]) {
            this.mate.mateReceiveList.selectedRows.push(i)
          }
        })
        this.sortReSelect()
        this.reDateSelectList = []
        this.caclRe()
      },
      // 采购
      caclPay () {
        var vm = this
        let qtyTotal = 0
        let money = 0
        this.payDataSelectList.forEach(i => {
          // 这里只计算原来的数据，调价的数量不计算进去
          if ((typeof i.id === 'string') && i.parentSourceId == null) {
            qtyTotal += Number(i.qty)
          }
          money += Number(i.moneyAmount)
        }) 
        this.mate.queryHeader.qty = qtyTotal
        this.mate.queryHeader.moneyAmount = (Math.round(money * 100) / 100).toFixed(2)
        this.mate.queryHeader.differOfQty = this.mate.queryHeader.qty - this.mate.queryHeader.qytMount
        this.mate.queryHeader.differOfMoney = (Math.round((this.mate.queryHeader.moneyAmount - this.mate.queryHeader.amount) * 100) / 100).toFixed(2)
      },
      judgeAddress () {
        // 将不是手工录入行的抽出来，其地址是要相同的
        let noHandData = []
        this.payDataSelectList.map(i => {
          if (i.id.length > 17) {
            noHandData.push(i)
          }
        })
        for (let i = 0; i < noHandData.length - 1; i++) {
          if (noHandData[i].address !== noHandData[i + 1].address) {
            this.$message({
              message: '客户待对账清单地址须一致',
              type: 'warning'
            })
            return false
          }
        }
        return true
      },
      // 生成结算单
      clickCreate () {
        var vm = this
        // this.saleChecked = true 则说明选择了销售方对账
        if (this.saleChecked) {
          if (this.payDataSelectList.length === 0 || this.reDateSelectList.length === 0) {
            this.$message({
              message: '请选择客户待对账清单和供应商待对账清单中的数据',
              type: 'warning'
            })
            return
          }
          if (!this.judgeAddress()) {
            return
          }
          if (this.mate.queryHeader['amount'] !== this.mate.queryHeader['moneyAmount']) {
            this.$message({
              message: '销售金额合计和采购金额合计不相等',
              type: 'warning'
            })
            return
          }
        } else {
          if (this.payDataSelectList.length === 0) {
            this.$message({
              message: '请选择采购方待对账清单中的数据',
              type: 'warning'
            })
            return
          }
          if (!this.judgeAddress()) {
            return
          }
        }
        const params = {
          operationUnit: this.mate.queryHeader.operationUnit,
          receiveList: [],
          payList: {},
          extraPayList: [],
          changePayList: []
        }
        const payId = {}
        const reId = {}
        this.payDataSelectList.forEach(i => {
          payId[i.id] = true
          // 去掉调税调价的数据
          if (!i.parentSourceId && typeof i.id !== 'number') {
            params.payList[i.id] = `${i.qty}_${i.price}@${i.unitPrice}&${i.lineNo}`
          }
          // 手工录入行
          if (typeof i.id === 'number') {
            params.extraPayList.push(i)
          }
          // 调价
          if (i.parentSourceId) {
            params.changePayList.push(i)
          }
        })
        this.reDateSelectList.forEach(i => {
          reId[i.id] = true
          params.receiveList.push(i.id)
        })
        // 下面两个for循环是用来设置已经选择的数据的标记selected，生成结算单，点击取消的时候，需要显示已经选择的数据
        const payDataP = this.mate.matePaymentList.selectedRows
        const reDataP = this.mate.mateReceiveList.selectedRows
        for (let i = 0, len = payDataP.length; i < len; i++) {
          if (payId[payDataP[i].id]) {
            payDataP[i].selected = true
          } else {
            payDataP[i].selected = false
          }
        }
        for (let i = 0, len = reDataP.length; i < len; i++) {
          if (reId[reDataP[i].id]) {
            reDataP[i].selected = true
          } else {
            reDataP[i].selected = false
          }
        }
        if (this.saleChecked) {
          this.methodsUrl('/purchase/precast/create/settle', params)
        } else {
          this.methodsUrl('/purchase/ap/create/settle?buyer=true', params)
        }
      },
      methodsUrl (url, params) {
        let vm = this
        this.$root.ajaxData(url, params, function (data) {
          if(data.mate.flag == 0){
            vm.$message({
              message: '折扣行信息填写错误',
              type: 'warning'
            })
            return
          } else {
            localStorage.setItem('settlement','settlement')
            vm.$bus.emit('refreshview', data)
          }
        }, 'POST')
      },
      // 改变购方业务实体、购方公司、币种三个中的任何一个都要清空数据
      changeThree (val) {
        this.mate.matePaymentList.selectedRows = []
        this.mate.mateReceiveList.selectedRows = []
        this.isMutiAddress = val
      },
      // selectIdRows 重新排序问题
      sortPaySelect () {
        let data = this.mate.matePaymentList.selectedRows
        for (let i = 0; i < data.length; i++) {
          data[i].lineNo = i + 1
        }
      },
      sortReSelect () {
        let data = this.mate.mateReceiveList.selectedRows
        for (let i = 0; i < data.length; i++) {
          data[i].lineNo = i + 1
        }
      }
    }
  }
</script>
<style lang="scss">
.CheckSettlement1 {
  .client-btn {
    margin-bottom: 10px;
  }
  .supplier {
    margin-bottom: 30px;
  }
  .dialogBtn {
    text-align: right;
    margin-top: 20px;
  }
  .content {
    margin-bottom: 20px;
  }
  h5 {
    color: red;
  }
  .adjustTax {
    padding: 50px;
  }
  .priceDialog {
    margin-bottom: 20px;
  }
}
</style>
