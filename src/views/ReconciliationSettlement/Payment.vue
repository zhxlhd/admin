<template>
  <div>
    <div class="tbutton">
        <el-button  size="mini" plain class="el-icon-document" @click="handleSubmit">提 交</el-button>
        <el-button size="mini" plain class="el-icon-close" @click="backward">取 消</el-button>
        <el-button  size="mini" plain class="el-icon-date"  @click="resetForm('CollectionFormentForm')">重 置</el-button>
    </div>
     <PaymentForm :mate="mate.mateFormerHeader" ref="CollectionFormentForm"></PaymentForm>
      <KTable :mate="mate.mateList" @actionSelected="handleSelected"  @action="handleKtable" ></KTable>
     <el-dialog :visible.sync="dialogInvoice" width="80%">
    <el-table highlight-current-row ref="table" :data="mateLineListRowsData" border @selection-change="handleDialogSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column v-if="dialogColumn['invoiceNum'].isShow" :label="dialogColumn['invoiceNum'].label" :min-width="dialogColumn['invoiceNum'].width" :sortable="dialogColumn['invoiceNum'].sortable" show-overflow-tooltip :prop="dialogColumn['invoiceNum'].name"></el-table-column>
      <el-table-column v-if="dialogColumn['invoiceDate'].isShow" :label="dialogColumn['invoiceDate'].label" :min-width="dialogColumn['invoiceDate'].width" :sortable="dialogColumn['invoiceDate'].sortable" show-overflow-tooltip :prop="dialogColumn['invoiceDate'].name"></el-table-column>
      <el-table-column v-if="dialogColumn['invoiceType'].isShow" :formatter="dialogColumn['invoiceType'].formatter" :label="dialogColumn['invoiceType'].label" :min-width="dialogColumn['invoiceType'].width" :sortable="dialogColumn['invoiceType'].sortable" show-overflow-tooltip :prop="dialogColumn['invoiceType'].name"></el-table-column>
      <el-table-column v-if="dialogColumn['state'].isShow" :label="dialogColumn['state'].label" :formatter="dialogColumn['state'].formatter" :min-width="dialogColumn['state'].width" :sortable="dialogColumn['state'].sortable" show-overflow-tooltip :prop="dialogColumn['state'].name"></el-table-column>
       <el-table-column v-if="dialogColumn['invoiceAmount'].isShow" :label="dialogColumn['invoiceAmount'].label" :min-width="dialogColumn['invoiceAmount'].width" :sortable="dialogColumn['invoiceAmount'].sortable" show-overflow-tooltip :prop="dialogColumn['invoiceAmount'].name"></el-table-column>
      <el-table-column v-if="dialogColumn['tradeAmount'].isShow" :label="dialogColumn['tradeAmount'].label" :min-width="dialogColumn['tradeAmount'].width" :sortable="dialogColumn['tradeAmount'].sortable" show-overflow-tooltip :prop="dialogColumn['tradeAmount'].name">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row[dialogColumn['tradeAmount'].name]" @change="changeTrandeAmount(scope.row[dialogColumn['invoiceBalance'].name], scope.row[dialogColumn['tradeAmount'].name])"></el-input>
        </template>
      </el-table-column>
      <el-table-column v-if="dialogColumn['invoiceBalance'].isShow" :label="dialogColumn['invoiceBalance'].label" :min-width="dialogColumn['invoiceBalance'].width" :sortable="dialogColumn['invoiceBalance'].sortable" show-overflow-tooltip :prop="dialogColumn['invoiceBalance'].name">
      </el-table-column>
      <el-table-column v-if="dialogColumn['corporateBody'].isShow" :label="dialogColumn['corporateBody'].label" :min-width="dialogColumn['corporateBody'].width" :sortable="dialogColumn['corporateBody'].sortable" show-overflow-tooltip :prop="dialogColumn['corporateBody'].name"></el-table-column>
      <el-table-column v-if="dialogColumn['companyCode'].isShow" :label="dialogColumn['companyCode'].label" :min-width="dialogColumn['companyCode'].width" :sortable="dialogColumn['companyCode'].sortable" show-overflow-tooltip :prop="dialogColumn['companyCode'].name"></el-table-column>
      <el-table-column v-if="dialogColumn['companyName'].isShow" :label="dialogColumn['companyName'].label" :min-width="dialogColumn['companyName'].width" :sortable="dialogColumn['companyName'].sortable" show-overflow-tooltip :prop="dialogColumn['companyName'].name"></el-table-column>
      <el-table-column v-if="dialogColumn['createAt'].isShow" :label="dialogColumn['createAt'].label" :min-width="dialogColumn['createAt'].width" :sortable="dialogColumn['createAt'].sortable" show-overflow-tooltip :prop="dialogColumn['createAt'].name"></el-table-column>
      <el-table-column v-if="dialogColumn['remark'].isShow" :label="dialogColumn['remark'].label" :min-width="dialogColumn['remark'].width" :sortable="dialogColumn['remark'].sortable" show-overflow-tooltip :prop="dialogColumn['remark'].name"></el-table-column>
      <!--<el-table-column v-if="col.isShow" v-for="(col,index) of mate.mateLineList.columns" v-bind:key="col.name+index" :formatter="col.formatter" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip></el-table-column>-->
    </el-table>
    <div class="buttonMargin">
      <el-button size="mini" type="primary" @click="dialogSubmit">确 定</el-button>
      <el-button size="mini" @click="dialogInvoice = false">取 消</el-button>
    </div>
  </el-dialog>
    <el-dialog :visible.sync="dialogGathering" width="30%" :close-on-click-modal="showVisible">
      <span>未核销付款为</span>{{ this.mate.mateFormerHeader.values.uncancAmount }}<span>将作为预付款</span>
    <div class="buttonMargin">
      <el-button size="mini" type="primary" @click="dialogSubmitGathering">确 定</el-button>
      <el-button size="mini" @click="dialogGathering = false">取 消</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
import { DateFormat } from '../../utils/util.js'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    PaymentForm: function index (resolve) {
      require(['./PaymentForm.vue'], resolve)
    },
    KTable: function index (resolve) {
      require(['../../components/KTable.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    }
  },
  props: {
    mate: Object
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.formatterBefore(this.mate.mateList.columns)
      this.formatterBefore(this.mate.mateList.lineColumns)
      this.mate.mateList.localName = this.mate.localName
      this.$nextTick(function () {
        this.rowSelect()
      })
    },
    rowsContent: function (val, old) {
      let amount = 0
      let everAmount = 0
      let headerValues = this.mate.mateFormerHeader.values
      let count = headerValues.invoiceAmount
      for (var i = 0; i < val.length; i++) {
        everAmount = val[i].cancAmount
        amount += parseInt(everAmount)
      }
      this.$set(headerValues, 'cancAmount', amount)
      this.$set(headerValues, 'uncancAmount', count - amount)
    }
  },
  data () {
    return {
      object: {},
      btn: {},
      row: {},
      tmpRows: [],
      dialogInvoice: false,
      selectedRows: [],
      showVisible: false,
      selectedIds: [],
      selectedCancel: [],
      dialogColumn: {},
      mateLineListRowsData: [],
      rowsContent: [],
      dialogGathering: false,
      rules: {
        qty: [
         { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    let listLineColumns = this.mate.mateListLine.columns
    let mateList = this.mate.mateList
    listLineColumns.map((i) => { this.dialogColumn[i.name] = i })
    this.formatterBefore(mateList.columns)
    this.formatterBefore(listLineColumns)
    this.rowsContent = mateList.rows
    mateList.localName = this.mate.localName
  },
  methods: {
    resetForm (formName) {
      this.$refs.CollectionFormentForm.$refs['CollectionForm'].resetFields()
    },
    handleSelected (val) {
      this.selectedIds = []
      this.selectedCancel = []
      val.map((i) => this.selectedIds.push(i.lineNum))
      val.map((i) => this.selectedCancel.push(i))
    },
    handleKtable (btn, row) {
      this.row = row
      this.btn = btn
      if (this.btn.action === 'verificationCancel') {
        if (this.mate.mateList.rows.length === 0) {
          this.tmpRows = []
        } else {
          this.tmpRows = this.mate.mateList.rows
        }
        const vm = this
        this.dialogInvoice = true
        this.$root.ajaxData('/purchase/invoice/payment/needPay?currency=' + this.mate.mateFormerHeader.values.currency + '&companyCode=' + this.mate.mateFormerHeader.values.companyCode, {}, function (data) {
          data.rows.map(i => {
            i.tradeAmount = null
          })
          vm.mateLineListRowsData = data.rows
        })
        return
      }
      if (this.btn.action === 'verificationCancelDbl') {
        const mate = {}
        mate.mateFormerHeader = this.mate.mateFormerHeader.values
        mate.mateList = this.selectedCancel
        let formerValues = this.mate.mateFormerHeader.values
        if (formerValues.id !== '') {
          this.$root.ajaxData('/purchase/cancellation/payment/abolishInvoice/' + formerValues.id, mate, function () {
          }, 'PUT')
          for (var j = 0; j < this.mate.mateList.rows.length; j++) {
            for (var k = 0; k < this.selectedIds.length; k++) {
              if (this.mate.mateList.rows[j].lineNum === this.selectedIds[k]) {
                this.mate.mateList.rows.splice(j, 1)
              }
            }
          }
        } else {
          for (j = 0; j < this.mate.mateList.rows.length; j++) {
            for (k = 0; k < this.selectedIds.length; k++) {
              if (this.mate.mateList.rows[j].lineNum === this.selectedIds[k]) {
              // splice(i, 1),从i开始的那一条，删除一条
                this.mate.mateList.rows.splice(j, 1)
              // 删除了一条之后，就将剩余从新排序
              }
            }
          }
        }
      }
    },
    changeTrandeAmount (amount, trade) {
      if (trade > amount) {
        this.$message({
          type: 'warning',
          message: '收款金额不能大于发票余额'
        })
      }
    },
    // 选择已选的核销发票
    handleDialogSelectionGathering (val) {
      this.gatherings = val
    },
    // 选择发票之后，将收款的头和发票都传给后台
    dialogSubmit () {
      var rowsValues = []
      if (this.multipleDialogSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请勾选核销发票'
        })
        return
      }
      // 核销金额的总和
      var amount = 0
      var mate = {}
      // var count = this.mate.mateFormerHeader.values.invoiceAmount
      this.multipleDialogSelection.forEach(i => {
        var obj = {}
        obj.invoiceCode = i.invoiceNum
        obj.invoiceDate = i.invoiceDate
        obj.currency = i.currency
        obj.invoiceAmount = i.invoiceBalance
        obj.cancAmount = i.tradeAmount
        obj.remark = i.remark
        rowsValues.push(obj)
      })
      rowsValues.map(i => {
        amount += parseInt(i.cancAmount)
      })
      for (var i = 0; i < rowsValues.length; i++) {
        if (rowsValues[i].cancAmount === null) {
          this.$message({
            type: 'warning',
            message: '金额不能为空'
          })
          return
        }
      }
      if (amount > this.mate.mateFormerHeader.values.uncancAmount) {
        this.$message({
          type: 'warning',
          message: '选择发票核销金额不能大于付款未核销金额'
        })
        return
      }
      this.tmpRows.push(...rowsValues)
      for (var j = 0; j < this.tmpRows.length; j++) {
        this.tmpRows[j].lineNum = j + 1
      }
      this.mate.mateList.rows = this.tmpRows
      this.rowsContent = this.mate.mateList.rows
      this.dialogInvoice = false
      mate.mateFormerHeader = this.mate.mateFormerHeader.values
    //   const id = this.multipleSelection[0].id
      mate.mateList = rowsValues
      if (this.mate.mateFormerHeader.values.id !== '') {
        this.$root.ajaxData('/purchase/cancellation/payment/cancelInvoice/' + this.mate.mateFormerHeader.values.id, mate, function (data) {
        }, 'PUT')
      }
    },
    handleDialogSelectionChange (val) {
      this.multipleDialogSelection = val
    },
    Selected (val) {
      this.selectedRows = val
    },
    handleSubmit () {
      var mate = {}
      var vm = this
      this.mate.mateFormerHeader.values.tradeDate = DateFormat(this.mate.mateFormerHeader.values.tradeDate, 'yyyy-MM-dd')
      mate.mateFormerHeader = this.mate.mateFormerHeader.values
      mate.mateList = this.mate.mateList.rows
      this.buttonDisabled = true
      this.$refs.CollectionFormentForm.$refs['CollectionForm'].validate((valid) => {
        if (valid) {
          if (this.mate.mateFormerHeader.method === 'PUT' && this.mate.mateFormerHeader.values.id) {
            this.$root.ajaxData('/purchase/invoice/' + this.mate.mateFormerHeader.values.id, mate, function (data) {
              if (data.code === 500) {
                vm.buttonDisabled = false
                return
              }
              vm.$root.monitor({ url: '/purchase/invoice/paymented/all/list' })
            }, 'PUT')
          } else if (this.mate.mateFormerHeader.method === 'POST') {
            if (this.mate.mateFormerHeader.values.uncancAmount > 0) {
              this.dialogGathering = true
            } else {
              this.$root.ajaxData('/purchase/invoice/paymented/save', mate, function (data) {
                if (data.code === 500) {
                  vm.buttonDisabled = false
                  return
                }
                vm.$root.monitor({ url: '/purchase/invoice/paymented/all/list' })
              }, 'POST')
            }
          } else {
            this.$notify.error({
              title: '消息',
              message: '数据验证未通过'
            })
            return false
          }
        }
      })
    },
    dialogSubmitGathering () {
      var mate = {}
      var vm = this
      this.mate.mateFormerHeader.values.tradeDate = DateFormat(this.mate.mateFormerHeader.values.tradeDate, 'yyyy-MM-dd')
      mate.mateFormerHeader = this.mate.mateFormerHeader.values
      mate.mateList = this.mate.mateList.rows
      this.$root.ajaxData('/purchase/invoice/paymented/save', mate, function (data) {
        if (data.code === 500) {
          vm.buttonDisabled = false
          return
        }
        vm.$root.monitor({ url: '/purchase/invoice/paymented/all/list' })
      }, 'POST')
    },
    backward () {
      this.$root.monitor({ url: '/purchase/invoice/paymented/all/list' })
    }
  }
}
</script>
<style scoped lang="scss">
 .el-form-item__label{
  line-height:inherit
}
.tbutton{
  margin: 3px 0
}
.tbutton{
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.el-input__suffix {
  right:80px
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-input--mini .el-input__inner{
  width:80%
}
</style>

