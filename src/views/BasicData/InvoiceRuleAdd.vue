<template>
  <div>
    <InvoiceRuleForm :mate="mate.mateFormerHeader" ref="InvoiceRuleForm"></InvoiceRuleForm>
  </div>
</template>

<script>
import Vue from 'vue'
import { DateFormat } from '../../utils/util.js'
export default {
  components: {
    // InBill,
    InvoiceRuleForm: function index (resolve) {
      require(['../../components/InvoiceRuleForm.vue'], resolve)
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
      mateFormerRows: [],
      object: {},
      dialogObject: {},
      subCodeOptions: [],
      flagId: '',                        // 判断是用户自己新增，还是从收货通知
      labelPosition: 'right',
      dialogTableVisible: false,
      selectedIds: [],
      selectedLines: [],          // 用来获取明细行的行号的，做修改，删除操作
      buttonFalse: true,                   // 按钮可不可用
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
        // width = undefined
        width = '100px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '100px'
      } else if (this.mate.labelWidth === null) {
        width = '100px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  created () {
    this.mate.mateList.columns.map((i) => { this.object[i.name] = i })           // 点击修改按钮时，获取到的mateList
    if (this.mate.mateFormerHeader.values.id) {
      this.isKtable = false
    }
    if (this.mate.mateFormerHeader.values.id) {
      this.flagId = this.mate.mateFormerHeader.values.id
    }
  },
  mounted () {
  },
  methods: {
    handleSelected (val) {
      // 第一步就是要清空selectedIDS里面的数据
      this.selectedIds = []
      // map方法也可以
      val.map((i) => this.selectedIds.push(i.id))
      // 每次点击都会执行这个函数，要点击两下的时候，this.selectedIds里面包括了前面一次的数据，所以会有重复，要去重
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
      if (this.mate.mateFormer.values['price']) {
        this.mate.mateFormer.values['moneyAmount'] = val * this.mate.mateFormer.values['price']
      }
    },
    changePrice (val) {
      if (this.mate.mateFormer.values['qty']) {
        this.mate.mateFormer.values['moneyAmount'] = val * this.mate.mateFormer.values['qty']
      }
    },
    dialogSubmit () {
      // 在页面上添加细单行号
      if (this.mate.mateFormer.values.lineno) {
        for (let i = 0; i < this.mate.mateList.rows.length; i++) {
          if (this.mate.mateList.rows[i].lineno === this.mate.mateFormer.values.lineno) {
            this.mate.mateFormer.values.poDate = DateFormat(this.mate.mateFormer.values.poDate, 'yyyy-MM-dd')
            const values = Object.assign({}, this.mate.mateFormer.values)
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
        this.mate.mateFormer.values.lineno = (this.mate.mateList.rows.length + 1)
        // 拷贝
        const mateFormerValues = Object.assign({}, this.mate.mateFormer.values)
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.mate.mateList.rows.push(mateFormerValues)
            mateFormerValues.poDate = DateFormat(this.mate.mateFormer.values.poDate, 'yyyy-MM-dd')
            this.dialogFormVisible = false
            this.$refs['ruleForm'].resetFields()
            this.mate.mateFormer.values.lineno = null
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
      this.mate.mateFormer.values.lineno = null
    },
    dialogBackward () {
      this.$refs['ruleForm'].resetFields()
      this.dialogFormVisible = false
    },
    handleKtable (btn, row) {
      const vm = this
       // 添加行
      if (btn.action === 'addDetailBill') {
        this.companyId = this.mate.mateFormerHeader.values.companyCode
        this.currencyName = this.mate.mateFormerHeader.values.currency
        if (this.currencyName && this.companyId) {
          this.dialogTableVisible = true
          // 添加明细行时，若是从出库入库中来，则需要先选择币种和客户编号
          this.$root.ajaxData(`/purchase/invoice/receive/so/noOpen?customerNum=${this.companyId}&currency=${this.currencyName}`, {}, function (data) {
            vm.mateListLineRows = data.rows
            vm.mate.mateListLine.rows = data.rows
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请先选择客户编号和币种'
          })
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
                this.$message({
                  type: 'warning',
                  message: '请选择手工录入明细行'
                })
              }
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请选择一行明细行'
          })
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
        // 将明细行的排序重新排序
        var count = 0
        this.mate.mateList.rows.forEach(i => {
          i.lineno = ++count
        })
        this.$message({
          type: 'success',
          message: '删除成功'
        })
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

<style scoped>
.el-form-item__label{
  line-height:inherit
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
</style>