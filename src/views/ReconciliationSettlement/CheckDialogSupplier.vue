<template>
  <div>
    <el-dialog @open="open" :before-close="supplier" title="选择销售待对账清单" width="90%" :visible.sync="dialogSupplier" :close-on-click-modal="closeOnClickModal">
      <el-form :model="querySupplier" :label-position="labelPosition" :label-width="labelWidth" class="dialogForm">
        <template>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :rules="rulesPoDateTo" label="销方业务实体" :props="querySupplier['operationUnit']">
             <el-input readonly disabled size="mini" v-model="querySupplier['operationUnit']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="客户名称" :props="querySupplier['customerName']">
              <el-input readonly disabled size="mini" v-model="querySupplier['customerName']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="币种" :props="querySupplier['currencyCode']">
              <el-input readonly disabled size="mini" v-model="querySupplier['currencyCode']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="收货方" :props="querySupplier['shipToLocation']">
              <el-input size="mini" v-model="querySupplier['shipToLocation']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="销售人员" :props="querySupplier['salesPerson']">
              <el-input size="mini" v-model.trim="querySupplier['salesPerson']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="客户料号" :props="querySupplier['customerItemNumber']">
              <el-input size="mini" v-model.trim="querySupplier['customerItemNumber']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="客户PO" :props="querySupplier['purchaseOrder']">
              <el-input size="mini" v-model.trim="querySupplier['purchaseOrder']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="出货单号" :props="querySupplier['lineAttribute3']">
              <el-input size="mini" v-model.trim="querySupplier['lineAttribute3']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="销售订单" :props="querySupplier['salesOrder']">
              <el-input size="mini" v-model.trim="querySupplier['salesOrder']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="物料编码" :props="querySupplier['itemNumber']">
              <el-input size="mini" v-model.trim="querySupplier['itemNumber']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="出货日期开始" :props="querySupplier['shipDateFrom']">
              <el-date-picker size="mini" v-model="querySupplier['shipDateFrom']" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="出货日期结束" :props="querySupplier['shipDateTo']">
              <el-date-picker size="mini" @change="changeDate(val)" v-model="querySupplier['shipDateTo']" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="数量" :props="querySupplier['sumQty']">
              <el-input disabled size="mini" v-model.trim="querySupplier['sumQty']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="金额" :props="querySupplier['sumMoney']">
              <el-input disabled size="mini" v-model.trim="querySupplier['sumMoney']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item>
              <el-button size="mini" @click="supplierQuery">查询</el-button>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
      <div class="clientBtn"><el-button size="mini" @click="exportTable">导出</el-button></div>
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
                  :selectionChanged="selectionChanged"
                  >
      </ag-grid-vue>
      <el-button size="mini" @click="comfirm">确 定</el-button>
      <el-button size="mini" @click="cancel">取 消</el-button>
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
        height: '500',
        closeOnClickModal: false,
        labelPosition: 'right',
        labelWidth: '110px',
        selectedData: [],
        operationUnitOptions: {},
        selected: 0,
        gridOptions: {
          enableColResize:true, // 可以改变行的宽度
          rowSelection:"multiple",
          rowMultiSelectWithClick: true
        },
        querySupplier: {
          operationUnit: '',
          customerName: '',
          currencyCode: '',
          salesPerson: '',
          customerItemNumber: '',
          lineAttribute3: '',
          purchaseOrder: '',
          salesOrder: '',
          shipDateFrom: '',
          shipDateTo: '',
          shipToLocation: '',
          sumQty: 0,
          sumMoney: 0
        },
        rulesPoDateTo: [
          { required: true, message: '请输入销方业务实体', trigger: 'blur' }
        ]
      }
    },
    props: {
      mate: Object,
      dialogSupplier: Boolean,
      fourCode: Object
    },
    watch: {
      fourCode: function () {
        this.querySupplier.customerName = this.fourCode.customerName
        this.querySupplier.currencyCode = this.fourCode.currencyCode
        this.querySupplier.operationUnit = this.fourCode.operationUnit
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
        this.querySupplier.sumQty = 0
        this.querySupplier.sumMoney = 0
        for (let i = 0; i < data.length; i++) {
          this.querySupplier.sumQty += data[i].quantityOrdered
          this.querySupplier.sumMoney += data[i].amount
        }
        this.querySupplier.sumMoney = Math.round(this.querySupplier.sumMoney * 100) / 100
        this.selected = data.length
      },
      actionSelectedRe (val) {
        this.selectedData = val
      },
      comfirm () {
        this.$emit('actionSelectedRe', this.gridOptions.api.getSelectedRows())
        this.supplier()
      },
      cancel () {
        this.supplier()
      },
      supplier () {
        this.$emit('supplierClose')
        this.init()
      },
      init () {
        // 选择的条数要清空，数量和金额也要清空
        this.selected = 0
        this.querySupplier.sumQty = 0
        this.querySupplier.sumMoney = 0
      },
      changeDate (val) {
        let shipDateTo = this.querySupplier.shipDateTo
        if (val < shipDateTo) {
          this.$message({
            message: '请选择比入库日期大的日期',
            type: 'warning'
          })
          shipDateTo = ''
        }
      },
      supplierQuery () {
        if (this.querySupplier.operationUnit === '') {
          this.$message({
            message: '请填写销方业务实体',
            type: 'warning'
          })
          return
        }
        this.querySupplier.shipDateFrom = DateFormat(this.querySupplier.shipDateFrom, 'yyyy-MM-dd')
        this.querySupplier.shipDateTo = DateFormat(this.querySupplier.shipDateTo, 'yyyy-MM-dd')
        this.$emit('supplierQuery', this.querySupplier)
        this.init()
      },
      open () {
        var vm = this
        this.$root.ajaxData('/offices/current/offices?top=true', {}, function (data) {
          for (var i = 0; i < data.length; i++) {
            data[i].value = data[i].name
          }
          vm.operationUnitOptions = data
        }, 'GET')
      },
      exportTable () {
        var vm = this
        let params = {}
        let arrId = []
        params.arList = this.querySupplier
        this.mate.selectedRows.length && this.mate.selectedRows.map(i => {
          arrId.push(i.id)
        })
        params.selectedIdList = arrId
        this.$http({
          url: API_GATEWAY + '/api/purchase/recon/pre/export/ar',
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
          var filename = '供应商待对账清单.xls'
          a.setAttribute('download', filename)
          a.click()
          URL.revokeObjectURL(objectUrl)
        })
      }
    }
  }
</script>

<style scoped>
  .el-dialog__header {
    padding: 10px 10px 0;
  }
  .el-dialog__body {
    padding: 10px 10px;
  }
  .dialogForm {
    display: inline-block;
  }
  .clientBtn {
    position: relative;
    display: inline-block;
    z-index: 100000;
  }
  .el-form-item {
    margin: 2px 2px 2px 0;
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
    top: 282px;
  }
</style>