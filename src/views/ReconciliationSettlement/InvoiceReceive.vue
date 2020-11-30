<template>
  <div>
      <div class="tbutton">
        <el-button  size="mini" plain class="el-icon-document" :disabled="buttonDisabled" @click="handleSubmit">提 交</el-button>
        <el-button  size="mini" plain class="el-icon-close" @click="backward">取 消</el-button>
        <el-button  size="mini" plain class="el-icon-date"  @click="resetForm('InvoiceReceiveForm')">重 置</el-button>
      </div>
    <InvoiceReceiveForm :mate="mate.mateFormerHeader" ref="InvoiceReceiveForm"></InvoiceReceiveForm>
    <KTable :mate="mate.mateList" :mateFormerHeaderId="id" class="KTable-margin-top" @action="handleKtable" @actionSelected="handleSelectedDetail"></Ktable>
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
        <el-button size="mini" type="primary" @click="dialogSubmit">提 交</el-button>
        <el-button size="mini" @click="dialogBackward">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增明细行" width="80%" :visible.sync="dialogTableVisible" ref="InvoiceReceiveTable">
      <template>
        <KTable :mate="mate.mateListLine" @actionSelected="handleSelected"></Ktable>
        <el-button size="mini" type="primary" @click="dialogSubmitSel">提 交</el-button>
        <el-button size="mini" @click="dialogBackwardSel">取 消</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import Vue from 'vue'
import { DateFormat } from '../../utils/util.js'
export default {
  components: {
    // InBill,
    InvoiceReceiveForm: function index (resolve) {
      require(['../../components/ReconciliationSettlement/InvoiceReceiveForm.vue'], resolve)
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
      mateListLineRows: []
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
    let mateFormerHeaderValues = this.mate.mateFormerHeader.values
    this.mate.mateList.columns.map((i) => { this.object[i.name] = i })           // 点击修改按钮时，获取到的mateList
    this.mate.mateFormer.fields.map((i) => { this.dialogObject[i.name] = i })
    if (mateFormerHeaderValues.id) {
      this.isKtable = false
    }
    if (mateFormerHeaderValues.id) {
      this.flagId = mateFormerHeaderValues.id
    }
  },
  methods: {
    message (message, type) {
      this.$message({
        message: message,
        type: type
      })
    },
    handleSelected (val) {
      this.selectedIds = []
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
    // 选择出库入库单据生成发票明细行
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
          obj.lineno = count
          obj.orderLineNum = this.mateListLineRows[i].lineno
          obj.orderCode = this.mateListLineRows[i].soNum
          obj.customerPo = this.mateListLineRows[i].customerPo
          obj.itemCode = this.mateListLineRows[i].itemCode
          obj.qty = this.mateListLineRows[i].qty
          obj.price = this.mateListLineRows[i].price
          obj.currency = this.mateListLineRows[i].currency
          obj.moneyAmount = this.mateListLineRows[i].price * this.mateListLineRows[i].qty
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
      let formerValues = this.mate.mateFormer.values
      if (formerValues['price']) {
        formerValues['moneyAmount'] = val * formerValues['price']
      }
    },
    changePrice (val) {
      let formerValues = this.mate.mateFormer.values
      if (formerValues['qty']) {
        formerValues['moneyAmount'] = val * formerValues['qty']
      }
    },
    dialogSubmit () {
      // 在页面上添加细单行号
      let formerValues = this.mate.mateFormer.values
      if (formerValues.lineno) {
        for (let i = 0; i < this.mate.mateList.rows.length; i++) {
          if (this.mate.mateList.rows[i].lineno === formerValues.lineno) {
            formerValues.poDate = DateFormat(formerValues.poDate, 'yyyy-MM-dd')
            const values = Object.assign({}, formerValues)
            this.$refs.ruleForm.validate((valid) => {
              if (valid) {
                this.mate.mateList.rows.splice(i, 1, values)
                this.$refs['ruleForm'].resetFields()
              } else {
                this.$notify.error({
                  title: '消息',
                  message: '数据验证未通过'
                })
                this.dialogFormVisible = true
                // return false
              }
            })
            this.dialogFormVisible = false
          }
        }
      } else {
        formerValues.lineno = (this.mate.mateList.rows.length + 1)
        // 拷贝
        const mateFormerValues = Object.assign({}, formerValues)
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.mate.mateList.rows.push(mateFormerValues)
            mateFormerValues.poDate = DateFormat(formerValues.poDate, 'yyyy-MM-dd')
            this.dialogFormVisible = false
            this.$refs['ruleForm'].resetFields()
            formerValues.lineno = null
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
      formerValues.lineno = null
    },
    dialogBackward () {
      this.$refs['ruleForm'].resetFields()
      this.dialogFormVisible = false
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
        this.httpMethods('/purchase/invoice/receive/batchUpdate/', mateMateFormerHeader.values.id, mate, 'PUT')
      } else if (mateMateFormerHeader.method === 'POST') {
        this.httpMethods('/purchase/invoice/receive/batchSave', '', mate, 'POST')
      }
    },
    httpMethods (url, id, mate, type) {
      var vm = this
      this.$root.ajaxData(url + id, mate, function (data) {
        if (data.code === 500) {
          vm.buttonDisabled = false
          return
        }
        vm.$root.monitor({ url: '/purchase/invoice/receive/all/list' })
      }, type)
    },
    backward () {
      this.$root.monitor({ url: '/purchase/invoice/receive/all/list' })
    },
    handleKtable (btn, row) {
      const vm = this
      if (btn.action === 'addDetailBill') {
        this.companyId = this.mate.mateFormerHeader.values.companyCode
        this.currencyName = this.mate.mateFormerHeader.values.currency
        if (this.currencyName && this.companyId) {
          this.dialogTableVisible = true
          this.$root.ajaxData(`/purchase/invoice/receive/so/noOpen?customerNum=${this.companyId}&currency=${this.currencyName}`, {}, function (data) {
            vm.mateListLineRows = data.rows
            vm.mate.mateListLine.rows = data.rows
          })
        } else {
          this.message('请先选择客户编号和币种', 'warning')
        }
      } else if (btn.action === 'manualOperation') {
        this.dialogFormVisible = true
      } else if (btn.action === 'updataDetailBill') {
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
      } else if (btn.action === 'deleteQuotation') {
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
        var count = 0
        this.mate.mateList.rows.forEach(i => {
          i.lineno = ++count
        })
        this.message('删除成功', 'success')
        var sum = 0
        this.mate.mateList.rows.forEach(i => {
          sum += i.moneyAmount
        })
        Vue.set(this.mate.mateFormerHeader.values, 'invoiceAmount', sum)
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
.el-form-item--mini.el-form-item {
  margin: 6px;
}
</style>