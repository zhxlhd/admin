<template>
  <div>
      <div class="tbutton">
        <el-button  size="mini" plain class="el-icon-document" :disabled="buttonDisabled" @click="handleSubmit">提 交</el-button>
        <el-button size="mini" plain class="el-icon-close" @click="backward">取 消</el-button>
        <el-button   size="mini" plain class="el-icon-date"  @click="resetForm('InvoicePayForm')">重 置</el-button>
      </div>
    <InvoicePayForm @changeCompanyId="changeCompanyId" @changeCurrency="changeCurrency" :mate="mate.mateFormerHeader" ref="InvoicePayForm"></InvoicePayForm>
    <div style="margin-top: 20px">
      <div style="margin-bottom: 20px">
        <el-button size="mini" plain @click="dialogMatch">匹配</el-button>
        <el-button size="mini" plain @click="dialogAdd">添加行</el-button>
        <el-button size="mini" plain @click="dialogModify">修改</el-button>
        <el-button  size="mini" plain @click="dialogDel">删除</el-button>
      </div>
      <el-table highlight-current-row ref="table" :data="mate.mateList.rows" border @selection-change="handleSelectedDetail" style="width: 100%;" @cell-click="cellClick">
        <el-table-column type="selection" width="50" id="tableSel"></el-table-column>
        <el-table-column :label="object['settleCode'].label" :prop="object['settleCode'].name" :min-width="object['settleCode'].width" :formatter="object['settleCode'].formatter"></el-table-column>
        <el-table-column :label="object['settleLineNum'].label" :prop="object['settleLineNum'].name" :min-width="object['settleLineNum'].width" :formatter="object['settleLineNum'].formatter"></el-table-column>
        <el-table-column :label="object['reconCode'].label" :prop="object['reconCode'].name" :min-width="object['reconCode'].width" :formatter="object['reconCode'].formatter"></el-table-column>
        <el-table-column :label="object['reconLineNum'].label" :prop="object['reconLineNum'].name" :min-width="object['reconLineNum'].width" :formatter="object['reconLineNum'].formatter"></el-table-column>
        <el-table-column :label="object['type'].label" :prop="object['type'].name" :min-width="object['type'].width" :formatter="object['type'].formatter"></el-table-column>
        <el-table-column :label="object['customerCode'].label" :prop="object['customerCode'].name" :min-width="object['customerCode'].width" :formatter="object['customerCode'].formatter"></el-table-column>
        <el-table-column :label="object['customerName'].label" :prop="object['customerName'].name" :min-width="object['customerName'].width" :formatter="object['customerName'].formatter"></el-table-column>
        <el-table-column :label="object['orderCode'].label" :prop="object['orderCode'].name" :min-width="object['orderCode'].width" :formatter="object['orderCode'].formatter"></el-table-column>
        <el-table-column :label="object['orderLineNum'].label" :prop="object['orderLineNum'].name" :min-width="object['orderLineNum'].width" :formatter="object['orderLineNum'].formatter"></el-table-column>
        <el-table-column :label="object['customerPo'].label" :prop="object['customerPo'].name" :min-width="object['customerPo'].width" :formatter="object['customerPo'].formatter"></el-table-column>
        <el-table-column :label="object['customerPoCode'].label" :prop="object['customerPoCode'].name" :min-width="object['customerPoCode'].width" :formatter="object['customerPoCode'].formatter"></el-table-column>
        <el-table-column :label="object['itemCode'].label" :prop="object['itemCode'].name" :min-width="object['itemCode'].width" :formatter="object['itemCode'].formatter"></el-table-column>
        <el-table-column :label="object['itemDesc'].label" :prop="object['itemDesc'].name" :min-width="object['itemDesc'].width" :formatter="object['itemDesc'].formatter"></el-table-column>
        <el-table-column :label="object['qty'].label" :prop="object['qty'].name" :min-width="object['qty'].width" :formatter="object['qty'].formatter"></el-table-column>
        <el-table-column :label="object['openQty'].label" :prop="object['openQty'].name" :min-width="object['openQty'].width" :formatter="object['openQty'].formatter">
          <template slot-scope="scope">
            <el-input type="number" :min="1" size="mini" v-model="scope.row[object['openQty'].name]" @change="changeOpenQty"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="object['transactDate'].label" :prop="object['transactDate'].name" :min-width="object['transactDate'].width" :formatter="object['transactDate'].formatter"></el-table-column>
        <el-table-column :label="object['poDate'].label" :prop="object['poDate'].name" :min-width="object['poDate'].width" :formatter="object['poDate'].formatter"></el-table-column>
        <el-table-column :label="object['price'].label" :prop="object['price'].name" :min-width="object['price'].width" :formatter="object['price'].formatter"></el-table-column>
        <el-table-column :label="object['currency'].label" :prop="object['currency'].name" :min-width="object['currency'].width" :formatter="object['currency'].formatter"></el-table-column>
        <el-table-column :label="object['moneyAmount'].label" :prop="object['moneyAmount'].name" :min-width="object['moneyAmount'].width" :formatter="object['moneyAmount'].formatter"></el-table-column>
        <el-table-column :label="object['openInvoicePrice'].label" :prop="object['openInvoicePrice'].name" :min-width="object['openInvoicePrice'].width" :formatter="object['openInvoicePrice'].formatter">
          <template slot-scope="scope">
            <el-input type="number" :min="1" size="mini" v-model="scope.row[object['openInvoicePrice'].name]" @change="changeOpenQty"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="object['openInvoiceMoney'].label" :prop="object['openInvoiceMoney'].name" :min-width="object['openInvoiceMoney'].width" :formatter="object['openInvoiceMoney'].formatter"></el-table-column>
        <el-table-column :label="object['taxMoneyAmount'].label" :prop="object['taxMoneyAmount'].name" :min-width="object['taxMoneyAmount'].width" :formatter="object['taxMoneyAmount'].formatter"></el-table-column>
        <el-table-column :label="object['noTaxAmount'].label" :prop="object['noTaxAmount'].name" :min-width="object['noTaxAmount'].width" :formatter="object['noTaxAmount'].formatter"></el-table-column>
        <el-table-column :label="object['remark'].label" :prop="object['remark'].name" :min-width="object['remark'].width" :formatter="object['remark'].formatter"></el-table-column>
      </el-table>
    </div>
    <el-dialog title="新增明细单" width="80%" :visible.sync="dialogFormVisible">
      <el-row>
      <el-form size="mini" :model="mate.mateFormer.values"  ref="ruleForm" :label-position="labelPosition" :label-width="labelWidth" :rules="rules">

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['itemDesc'].label" :prop="dialogObject['itemDesc'].name" >
              <el-input v-model="mate.mateFormer.values['itemDesc']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['qty'].label" :prop="dialogObject['qty'].name" >
              <el-input type="number" @change="changeQty" v-model="mate.mateFormer.values['qty']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item  :label="dialogObject['poDate'].label" :prop="dialogObject['poDate'].name">
              <el-date-picker type="date" v-model="mate.mateFormer.values[dialogObject['poDate'].name]"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['price'].label" :prop="dialogObject['price'].name" >
              <el-input type="number" @change="changePrice" v-model="mate.mateFormer.values['price']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['moneyAmount'].label" :prop="dialogObject['moneyAmount'].name" >
              <el-input readonly v-model="mate.mateFormer.values['moneyAmount']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['remark'].label" :prop="dialogObject['remark'].name" >
              <el-input v-model="mate.mateFormer.values['remark']"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="button">
        <el-button type="primary" @click="dialogSubmit">提 交</el-button>
        <el-button @click="dialogBackward">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="匹配明细行" width="80%" :visible.sync="dialogTableVisible" ref="InvoicePayTable">
      <template>
        <KTable :mate="mate.mateListLine" @actionSelected="handleSelected"></KTable>
        <el-button type="primary" @click="dialogSubmitSel">提 交</el-button>
        <el-button @click="dialogBackwardSel">取 消</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import Vue from 'vue'
import { DateFormat } from '../../utils/util.js'
export default {
  components: {
    InvoicePayForm: function index (resolve) {
      require(['../../components/ReconciliationSettlement/InvoicePayForm.vue'], resolve)
    },
    KTable: function index (resolve) {
      require(['../../components/KTable.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    }
  },
  data () {
    return {
      buttonDisabled: false,
      companyId: '',
      currencyName: '',
      ruleForm: {
        itemCode: '',
        quantity: ''
      },
      dialogFormVisible: false,
      btn: {},
      row: [],
      id: this.mate.mateFormerHeader.values.id,
      isKtable: true,
      object: {},
      dialogObject: {},
      flagId: '',                        // 判断是用户自己新增，还是从收货通知
      labelPosition: 'right',
      dialogTableVisible: false,
      selectedIds: [],
      selectedLines: [],          // 用来获取明细行的行号的，做修改，删除操作
      rules: {
        itemDesc: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        qty: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ]
      },
      mateListLineRows: [],
      cellClickData: {}
    }
  },
  props: {
    mate: Object
  },
  computed: {
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        width = '130px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '130px'
      } else if (this.mate.labelWidth === null) {
        width = '130px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  created () {
    this.mate.mateList.columns.map((i) => { this.object[i.name] = i })           // 点击修改按钮时，获取到的mateList
    this.mate.mateFormer.fields.map((i) => { this.dialogObject[i.name] = i })
    let mateFormerHeaderValueId = this.mate.mateFormerHeader.values.id
    if (mateFormerHeaderValueId) {
      this.isKtable = false
    }
    if (mateFormerHeaderValueId) {
      this.flagId = mateFormerHeaderValueId
    }
  },
  methods: {
    changeOpenQty (val) {
      // 价税合计金额 = 开票单价 * 开票数量
      this.cellClickData.openInvoiceMoney = this.cellClickData.openInvoicePrice * this.cellClickData.openQty
      // 税额 = 价税合计金额 * 税率  / （ 1 + 税率）
      this.cellClickData.taxMoneyAmount = (this.cellClickData.openInvoiceMoney * this.cellClickData.tax / (1 + this.cellClickData.tax)).toFixed(2)
      // 不含税金额 = 价税合计金额 - 税额
      this.cellClickData.noTaxAmount = (this.cellClickData.openInvoiceMoney - this.cellClickData.taxMoneyAmount).toFixed(2)
      let sum = 0
      this.mate.mateList.rows.forEach(i => {
        sum += i.openInvoiceMoney
      })
      Vue.set(this.mate.mateFormerHeader.values, 'invoiceAmount', sum)
    },
    cellClick (row, column, cell, event) {
      this.cellClickData = row
    },
    changeCompanyId (val) {
      this.companyId = val
    },
    changeCurrency (val) {
      this.currencyName = val
    },
    handleSelected (val) {
      this.selectedIds = []
      // map方法也可以
      val.map((i) => this.selectedIds.push(i.id))
      var arr = []
      var json = {}
      for (let i = 0; i < this.selectedIds.length; i++) {
        if (!json[this.selectedIds[i]]) {
          json[this.selectedIds[i]] = 1
          arr.push(this.selectedIds[i])
        }
      }
      this.selectedIds = arr
    },
    handleSelectedDetail (val) {
      this.selectedLines = []
      val.map(i => this.selectedLines.push(i.lineno))
      var arr1 = []
      var json1 = {}
      for (let i = 0; i < this.selectedLines.length; i++) {
        if (!json1[this.selectedLines[i]]) {
          json1[this.selectedLines[i]] = 1
          arr1.push(this.selectedLines[i])
        }
      }
      this.selectedLines = arr1
    },
    resetForm (formName) {
      this.$refs.InvoiceReceiveForm.$refs['ruleForm'].resetFields()
    },
    // 选择出库入库单据
    dialogSubmitSel () {
      this.dialogTableVisible = false
      var arrayTemp = []
      this.selectedIds.forEach(i => {
        arrayTemp[i] = true
      })
      if (!this.mate.mateList.rows) {
        this.mate.mateList.rows = []
      }
      const length = this.mateListLineRows.length
      for (let i = 0; i < length; i++) {
        if (arrayTemp[this.mateListLineRows[i].id]) {
          var obj = {}
          var count = this.mate.mateList.rows.length + 1
          obj.lineNum = count
          obj.orderLineNum = this.mateListLineRows[i].lineNum
          obj.orderCode = this.mateListLineRows[i].goodsName
          obj.customerName = this.mateListLineRows[i].companyName
          obj.itemCode = this.mateListLineRows[i].subcode
          obj.itemDesc = this.mateListLineRows[i].specification
          obj.customerCode = this.mateListLineRows[i].companyCode
          obj.poDate = this.mateListLineRows[i].createAt
          obj.tax = this.mateListLineRows[i].tax
          obj.openQty = this.mateListLineRows[i].qty
          obj.qty = this.mateListLineRows[i].qty
          obj.openInvoicePrice = this.mateListLineRows[i].priceTax
          obj.price = this.mateListLineRows[i].priceTax
          obj.currency = this.mateListLineRows[i].currency
          obj.moneyAmount = this.mateListLineRows[i].priceTax * this.mateListLineRows[i].qty
          obj.openInvoiceMoney = obj.openInvoicePrice * obj.openQty
          obj.taxMoneyAmount = (obj.openInvoiceMoney * obj.tax / (1 + obj.tax)).toFixed(2)
          obj.noTaxAmount = (obj.openInvoiceMoney - obj.taxMoneyAmount).toFixed(2)
          this.mate.mateList.rows.push(obj)
        }
      }
      var sum = 0
      this.mate.mateList.rows.forEach(i => {
        sum += i.moneyAmount
      })
      Vue.set(this.mate.mateFormerHeader.values, 'invoiceAmount', sum)
    },
    dialogBackwardSel () {
      this.dialogTableVisible = false
    },
    // 单价和数量的乘积
    changeQty (val) {
      let mateFormerValues = this.mate.mateFormer.values
      if (mateFormerValues['price']) {
        mateFormerValues['moneyAmount'] = val * mateFormerValues['price']
      }
    },
    changePrice (val) {
      let mateFormerValues = this.mate.mateFormer.values
      if (mateFormerValues['qty']) {
        mateFormerValues['moneyAmount'] = val * mateFormerValues['qty']
      }
    },
    dialogSubmit () {
      let mateListRows = this.mate.mateList.rows
      let mateFormerValues = this.mate.mateFormer.values
      if (mateFormerValues.lineno) {
        for (let i = 0; i < mateListRows.length; i++) {
          if (mateListRows[i].lineno === mateFormerValues.lineno) {
            mateFormerValues.poDate = DateFormat(mateFormerValues.poDate, 'yyyy-MM-dd')
            const values = Object.assign({}, mateFormerValues)
            this.$refs.ruleForm.validate((valid) => {
              if (valid) {
                mateListRows.splice(i, 1, values)
                this.$refs['ruleForm'].resetFields()
              } else {
                this.$notify.error({
                  title: '消息',
                  message: '数据验证未通过'
                })
                this.dialogFormVisible = true
              }
            })
            this.dialogFormVisible = false
          }
        }
      } else {
        mateFormerValues.lineno = (mateListRows.length + 1)
        // 拷贝
        const mateFormerValues = Object.assign({}, mateFormerValues)
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            mateListRows.push(mateFormerValues)
            mateFormerValues.poDate = DateFormat(mateFormerValues.poDate, 'yyyy-MM-dd')
            this.dialogFormVisible = false
            this.$refs['ruleForm'].resetFields()
            mateFormerValues.lineno = null
          } else {
            this.$notify.error({
              title: '消息',
              message: '数据验证未通过'
            })
            // return false
          }
        })
      }
      var sum = 0
      this.mate.mateList.rows.forEach(i => {
        sum += i.moneyAmount
      })
      Vue.set(this.mate.mateFormerHeader.values, 'invoiceAmount', sum)
      mateFormerValues.lineno = null
    },
    dialogBackward () {
      this.$refs['ruleForm'].resetFields()
      this.dialogFormVisible = false
    },
    httpMethods (url, id, mate, type) {
      let vm = this
      this.$root.ajaxData(url, id, mate, function (data) {
        if (data.code === 500) {
          vm.buttonDisabled = false
          return
        }
        vm.$root.monitor({ url: '/purchase/invoice/payment/all/list' })
      }, type)
    },
    handleSubmit (ev) {
      this.buttonDisabled = true
      var vm = this
      var mate = {}
      const mateMateFormerHeader = this.mate.mateFormerHeader
      const mateMateListRows = this.mate.mateList.rows
      mateMateFormerHeader.values.invoiceDate = DateFormat(mateMateFormerHeader.values.invoiceDate, 'yyyy-MM-dd')
      mate.mateFormerHeader = mateMateFormerHeader.values
      mate.mateList = mateMateListRows
      if (mateMateFormerHeader.method === 'PUT' && mateMateFormerHeader.values.id) {
        this.httpMethods('/purchase/invoice/payment/batchUpdate/', mateMateFormerHeader.values.id, mate, 'PUT')
      } else if (mateMateFormerHeader.method === 'POST') {
        this.httpMethods('/purchase/invoice/payment/batchSave', '', mate, 'POST')
      }
    },
    backward () {
      this.$root.monitor({ url: '/purchase/invoice/payment/all/list' })
    },
    // 明细行点击匹配
    dialogMatch () {
      const vm = this
      const currency = this.mate.mateFormerHeader.values.currency
      const companyCode = this.mate.mateFormerHeader.values.companyCode
      if (companyCode && currency) {
        this.dialogTableVisible = true
        this.$root.ajaxData(`/purchase/purchaseOrder/create/invoicePayment?currency=${currency}&companyCode=${companyCode}`, {}, function (data) {
          vm.mateListLineRows = data.rows
          vm.mate.mateListLine.rows = data.rows
        }, 'GET')
      } else {
        this.message('请先选择供应商编号和币种', 'warning')
      }
    },
    // 添加明细行
    dialogAdd () {
      this.dialogFormVisible = true
    },
    dialogModify () {
      if (this.selectedLines.length === 1) {
        this.mate.mateList.rows.forEach(i => {
          if (i.lineno === this.selectedLines[0]) {
            if (!i.orderCode) {
              this.dialogFormVisible = true
              this.mate.mateFormer.values = Object.assign({}, i)
            } else {
              this.message('请选择手工录入明细行', 'warning')
            }
          }
        })
      } else {
        this.message('请选择一行明细行', 'warning')
      }
    },
    message (message, type) {
      this.$message({
        message: message,
        type: type
      })
    },
    dialogDel () {
      if (this.selectedLines.length) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const temp = []
          for (let i = 0; i < this.selectedLines.length; i++) {
            temp[this.selectedLines[i]] = 1
          }
          const rows = this.mate.mateList.rows
          this.mate.mateList.rows = []
          for (let i = 0; i < rows.length; i++) {
            if (!temp[rows[i].lineno]) {
              this.mate.mateList.rows.push(rows[i])
            }
          }
          // 将明细行的排序重新排序
          var count = 0
          this.mate.mateList.rows.forEach(i => {
            i.lineno = ++count
          })
          var sum = 0
          this.mate.mateList.rows.forEach(i => {
            sum += i.moneyAmount
          })
          Vue.set(this.mate.mateFormerHeader.values, 'invoiceAmount', sum)
          this.message('删除成功', 'success')
        }).catch(() => {
          this.message('已取消删除', 'info')
        })
      } else {
        this.message('请选择一行明细行', 'warning')
      }
    }
  }
}
</script>

<style scoped lang="scss">
 .el-form-item__label{
  line-height:inherit
}
.tbutton{
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.KTable-margin-top{
  margin-top:20px;
}
.button1{
  margin-top:20px;
}
.el-form-item {
    margin: 15px 20px 2px 0px;
}
.button{
  margin-top:20px;
}
.table-margin{
  margin-top:20px;
}
.el-input__suffix {
  right:68px
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-input--mini .el-input__inner{
  width:80%
}
</style>