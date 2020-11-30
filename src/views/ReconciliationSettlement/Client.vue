<template>
  <div>
    <el-dialog @open="open" :before-close="clientClose1" title="选择客户待对账清单" width="90%" :visible.sync="dialogClient" :close-on-click-modal="closeOnClickModal">
      <el-row gutter="10">
      <el-form :model="queryClient" class="dialogForm">
        <template>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item :rules="rulesPoDateFrom" :props="queryClient['poDateFrom']">
              <el-date-picker size="mini" v-model="queryClient['poDateFrom']" type="date" placeholder="入库日期从"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item :rules="rulesPoDateTo" :props="queryClient['poDateTo']">
              <el-date-picker @change="changeDate" size="mini" v-model="queryClient['poDateTo']" type="date" placeholder="入库日期至"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item :props="queryClient['itemCode']">
              <el-input size="mini" v-model.trim="queryClient['itemCode']" placeholder="购方物料编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item :props="queryClient['poCode']">
              <el-input size="mini" v-model.trim="queryClient['poCode']" placeholder="购方订单号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item :props="queryClient['deliveryNum']">
              <el-input size="mini" v-model.trim="queryClient['deliveryNum']" placeholder="送货单号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item :props="queryClient['buyer']">
              <el-input size="mini" v-model.trim="queryClient['buyer']" placeholder="采购员"></el-input>
            </el-form-item>
          </el-col>





          <el-col :sm="4" :md="4" :lg="3" v-show="showFalse">
            <el-form-item label="购方公司" :props="queryClient['corporateBody']">
              <el-input readonly disabled size="mini" v-model="queryClient['corporateBody']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3" v-show="showFalse">
            <el-form-item label="购方业务实体" :props="queryClient['ouName']">
              <el-input readonly disabled size="mini" v-model="queryClient['ouName']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3" v-show="showFalse">
            <el-form-item label="币种" :props="queryClient['currency']">
              <el-input readonly disabled size="mini" v-model="queryClient['currency']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3" v-show="showFalse">
            <el-form-item label="地点" :props="queryClient['address']">
              <el-input readonly disabled size="mini" v-model="queryClient['address']"></el-input>
            </el-form-item>
          </el-col>
          
          
          
          <el-col :sm="4" :md="4" :lg="3" v-show="showFalse">
            <el-form-item label="购方型号规格" :props="queryClient['itemDesc']">
              <el-input size="mini" v-model.trim="queryClient['itemDesc']"></el-input>
            </el-form-item>
          </el-col>
          
          <el-col :sm="4" :md="4" :lg="3" v-show="showFalse">
            <el-form-item label="数量" :props="queryClient['sumQty']">
              <el-input disabled size="mini" v-model.trim="queryClient['sumQty']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3" v-show="showFalse">
            <el-form-item label="金额" :props="queryClient['sumMoney']">
              <el-input disabled size="mini" v-model.trim="queryClient['sumMoney']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-button size="mini" @click="clientQuery" type="primary" plain icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-col>
        </template>
        
      </el-form>
      </el-row>
      <!-- <div class="clientBtn"><el-button size="mini" @click="exportTable" type="primary" plain>导出</el-button></div> -->
      <div class="total">
        <span>共 {{mate.rows.length}} 条</span>&nbsp;&nbsp;&nbsp;
        <span>选中 {{selected}} 条</span>
      </div>
      <ag-grid-vue style="height: 300px;"
                  class="ag-theme-balham"
                  :gridOptions="gridOptions"
                  :columnDefs="mate.columns"
                  :rowData="mate.rows"
                  :enableSorting="true"
                  :enableFilter="true"
                  checkboxSelection: true
                  :suppressSizeToFit="true"
                  :suppressResize="true"
                  :selectionChanged="selectionChanged"
                  >
      </ag-grid-vue>
      <el-button size="mini" @click="comfirm" type="primary" plain>确 定</el-button>
      <el-button size="mini" @click="cancel" type="primary" plain>取 消</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import "../../../node_modules/ag-grid/dist/styles/ag-grid.css"
  import "../../../node_modules/ag-grid/dist/styles/ag-theme-balham.css"
  import {AgGridVue} from "ag-grid-vue"
  import KTable from '../../components/KTable.vue'
  import {DateFormat} from '../../utils/util'
  import { API_GATEWAY } from '@/config/index.js'
  export default {
    data () {
      return {
        showFalse: false,
        queryClient: {
          ouName: '',
          corporateBody: '',
          address: '',
          deliveryNum: '',
          poCode: '',
          itemCode: '',
          itemDesc: '',
          buyer: '',
          poDateFrom: '',
          poDateTo: '',
          address: '',
          sumQty: 0,
          sumMoney: 0,
          currency: ''
        },
        selected: 0,
        gridOptions: {
          enableColResize:true, // 可以改变行的宽度
          rowSelection:"multiple",
          top: '',
          rowMultiSelectWithClick: true,
          suppressCopyRowsToClipboard: true,
          onCellEditingStopped: function(event) {
            let id = event.data.id
            let index = 0
            let rowData = this.rowData
            for (let i = 0; i < rowData.length; i++) {
              if (rowData[i].id === id) {
                index = i
              }
            }
            let rowDataIndex = rowData[index]
            if (rowDataIndex.canInvoiceQty >= 0 && rowDataIndex.canInvoiceQty < rowDataIndex.qty) {
              rowDataIndex.qty = rowDataIndex.canInvoiceQty
            }
            if (rowDataIndex.canInvoiceQty <= 0 && rowDataIndex.canInvoiceQty > rowDataIndex.qty) {
              rowDataIndex.qty = rowDataIndex.canInvoiceQty
            }
            if (rowDataIndex.id.length > 17) {
              rowDataIndex.moneyAmount = (Math.round(rowDataIndex.qty * rowDataIndex.price * 100) / 100).toFixed(2)
              rowDataIndex.unitPrice = (rowDataIndex.price / (1 + Number(rowDataIndex.taxRate))).toFixed(10)
              rowDataIndex.noratAmount = (Math.round(rowDataIndex.qty * rowDataIndex.unitPrice * 100) / 100).toFixed(2)
            }
            // 在改变值之后，实时显示
            this.api.updateRowData(this.rowData)
          }
        },
        selectedData: {},
        agSelectedData: [],
        labelWidth: '100px',
        closeOnClickModal: false,
        height: '500',
        labelPosition: 'right',
        rulesPoDateFrom: [
          { required: true, message: '请输入日期', trigger: 'blur' }
        ],
        rulesPoDateTo: [
          { required: true, message: '请输入日期', trigger: 'blur' }
        ]
      }
    },
    props: {
      dialogClient: {
        type: Boolean,
        default: false
      },
      mate: Object,
      fourCode: Object
    },
    watch: {
      fourCode: function () {
        this.queryClient.ouName = this.fourCode.ouName
        this.queryClient.corporateBody = this.fourCode.customerName
        this.queryClient.supplierName = this.fourCode.supplierName
        this.queryClient.address = this.fourCode.address
        this.queryClient.currency = this.fourCode.currencyCode
      }
    },
    components: {
      KTable,
      AgGridVue
    },
    methods: {
      // 选择数据，计算数量和金额
      selectionChanged () {
        let data = this.gridOptions.api.getSelectedRows()
        this.queryClient.sumQty = 0
        this.queryClient.sumMoney = 0
        for (let i = 0; i < data.length; i++) {
          this.queryClient.sumQty += Number(data[i].qty)
          this.queryClient.sumMoney += Number(data[i].moneyAmount)
        }
        this.queryClient.sumMoney = Math.round(this.queryClient.sumMoney * 100) / 100
        this.selected = data.length
      },
      changeDate (val) {
        if (val < this.queryClient.poDateFrom) {
          this.$message({
            message: '请选择比入库日期大的日期',
            type: 'warning'
          })
          this.queryClient.poDateTo = ''
        }
      },
      clientQuery () {
        if (this.queryClient.poDateFrom === '' || this.queryClient.poDateTo === '') {
          this.$message({
            message: '请填写入库日期',
            type: 'warning'
          })
          return
        }
        this.queryClient.poDateFrom = DateFormat(this.queryClient.poDateFrom, 'yyyy-MM-dd')
        this.queryClient.poDateTo = DateFormat(this.queryClient.poDateTo, 'yyyy-MM-dd')
        this.$emit('clientQuery', this.queryClient)
        this.agSelectedData = this.gridOptions.api.getSelectedRows()
        this.selected = 0
        this.queryClient.sumQty = 0
        this.queryClient.sumMoney = 0
      },
      comfirm () {
        this.$emit('actionSelectedPay', this.gridOptions.api.getSelectedRows())
        this.clientClose1()
      },
      cancel () {
        this.clientClose1()
      },
      clientClose1 () {
        this.$emit('clientClose')
        this.selected = 0
        this.queryClient.sumQty = 0
        this.queryClient.sumMoney = 0
      },
      open () {
        var nowdays = new Date()
        var year = nowdays.getFullYear();
        var month = nowdays.getMonth();
        if (month == 0) {
        month = 12;
        year = year - 1;
        }
        if (month < 10) {
        month = "0" + month;
        }
        var firstDay = year + "-" + month + "-" + "01";// 上个月的第一天
        var myDate = new Date(year, month, 0)
        var lastDay = year + "-" + month + "-" + myDate.getDate()
        this.queryClient.poDateFrom = firstDay
        this.queryClient.poDateTo = lastDay
      },
      exportTable () {
        var vm = this
        let params = {}
        let arrId = []
        params.apList = this.queryClient
        this.mate.selectedRows.length && this.mate.selectedRows.map(i => {
          arrId.push(i.id)
        })
        params.selectedIdList = arrId
        this.$message({
          message: '正在下载，请稍等!',
          type: 'warning'
        })
        this.$http({
          url: API_GATEWAY + '/api/purchase/recon/pre/export/ap',
          // url: API_GATEWAY + '/api/purchase/report/pre/recon/pre_recon_list?format=xlsx' ,
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
            'Accept': 'application/json',
            'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer',
          body: params
        }).then(function (response) {
          var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          var filename = '客户待对账清单.xlsx'
          a.setAttribute('download', filename)
          a.click()
          URL.revokeObjectURL(objectUrl)
        })
      }
    }
  }
</script>

<style scoped>
  .el-form-item--mini.el-form-item {
    margin: 6px;
  }
  .el-form-item {
    margin: 2px 2px 2px 0;
  }
  .el-dialog__header {
  padding: 10px 10px 0;
  }
  .el-dialog__body {
    padding: 10px 10px;
  }
  .dialogForm {
    display:inline-block;
  }
  .clientBtn {
    position: relative;
    display: inline-block;
    z-index: 100000;
  }
  .ag-theme-balham {
    margin: 15px 0;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
  .total {
    position: absolute;
    right: 30px;
    top: 112px;
  }
</style>