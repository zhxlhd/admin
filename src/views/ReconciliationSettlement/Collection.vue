<template>
  <div>
    <div class="tbutton">
        <el-button  size="mini" plain class="el-icon-document" @click="handleSubmit">提 交</el-button>
        <el-button  size="mini" plain class="el-icon-close" @click="backward">取 消</el-button>
        <el-button  size="mini" plain class="el-icon-date"  @click="resetForm('CollectionForm')">重 置</el-button>
    </div>
     <CollectionForm :mate="mate.mateFormerHeader" ref="CollectionFormentForm"></CollectionForm>
      <KTable :mate="mate.mateList" @actionSelected="handleSelected"  @action="handleKtable" style="margin-top:10px"></KTable>
     <el-dialog :visible.sync="dialogInvoice" width="80%">
    <el-table highlight-current-row ref="table" :data="mateLineListRowsData" border @selection-change="handleDialogSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column v-if="dialogColumn['invoiceNum'].isShow" :label="dialogColumn['invoiceNum'].label" :min-width="dialogColumn['invoiceNum'].width" :sortable="dialogColumn['invoiceNum'].sortable" show-overflow-tooltip :prop="dialogColumn['invoiceNum'].name"></el-table-column>
      <el-table-column v-if="dialogColumn['invoiceDate'].isShow" :label="dialogColumn['invoiceDate'].label" :min-width="dialogColumn['invoiceDate'].width" :sortable="dialogColumn['invoiceDate'].sortable" show-overflow-tooltip :prop="dialogColumn['invoiceDate'].name"></el-table-column>
      <el-table-column v-if="dialogColumn['invoiceType'].isShow"  :formatter="dialogColumn['invoiceType'].formatter" :label="dialogColumn['invoiceType'].label"  :min-width="dialogColumn['invoiceType'].width" :sortable="dialogColumn['invoiceType'].sortable" show-overflow-tooltip :prop="dialogColumn['invoiceType'].name"></el-table-column>
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
    </el-table>
    <div class="buttonMargin">
      <el-button size="mini" type="primary" @click="dialogSubmit">确 定</el-button>
      <el-button size="mini" @click="dialogInvoice = false">取 消</el-button>
    </div>
  </el-dialog>
    <el-dialog :visible.sync="dialogGathering" width="40%" :close-on-click-modal="showVisible">
      <span>未核销收款为</span>{{ this.mate.mateFormerHeader.values.uncancAmount }}<span>将作为预收款</span>
    <div class="buttonMargin">
      <el-button type="primary" size="mini" @click="dialogSubmitGathering">确 定</el-button>
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
    CollectionForm: function index (resolve) {
      require(['./CollectionForm.vue'], resolve)
    },
    KTable: function index (resolve) {
      require(['../../components/KTable.vue'], resolve)
    },
    ReconKTable: function index (resolve) {
      require(['../../components/ReconciliationSettlement/ReconKTable.vue'], resolve)
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
      let mateMateList = this.mate.mateList
      this.formatterBefore(mateMateList.columns)
      this.formatterBefore(mateMateList.lineColumns)
      this.rowsContent = mateMateList.rows
      mateMateList.localName = this.mate.localName
      this.$nextTick(function () {
        this.rowSelect()
      })
    },
    rowsContent: function (val, old) {
      var amount = 0
      var everAmount = 0
      let headValue = this.mate.mateFormerHeader.values
      var count = headValue.invoiceAmount
      for (var i = 0; i < val.length; i++) {
        everAmount = val[i].cancAmount
        amount += parseInt(everAmount)
      }
      this.$set(headValue, 'cancAmount', amount)
      this.$set(headValue, 'uncancAmount', count - amount)
    }
  },
  data () {
    return {
      object: {},
      btn: {},
      row: {},
      tmpRows: [],
      dialogInvoice: false,
      showVisible: false,
      selectedRows: [],
      selectedIds: [],
      selectedCancel: [],
      rowsContent: [],
      dialogColumn: {},
      mateLineListRowsData: [],
      dialogGathering: false
    }
  },
  created () {
    let mateListLine = this.mate.mateListLine
    let mateList = this.mate.mateList
    mateListLine.columns.map((i) => { this.dialogColumn[i.name] = i })
    this.formatterBefore(mateList.columns)
    this.formatterBefore(mateListLine.columns)
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
      let mateFormerHeaderValue = this.mate.mateFormerHeader.values
      let mateList = this.mate.mateList
      if (this.btn.action === 'verificationCancel') {
        if (mateList.rows.length === 0) {
          this.tmpRows = []
        } else {
          this.tmpRows = mateList.rows
        }
        const vm = this
        this.dialogInvoice = true
        this.$root.ajaxData('/purchase/invoice/receive/receivePay?currency=' + mateFormerHeaderValue.currency + '&companyCode=' + mateFormerHeaderValue.companyCode, {}, function (data) {
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
        if (mateFormerHeaderValue.id !== '') {
          this.$root.ajaxData('/purchase/calcellation/received/abolishInvoice/' + mateFormerHeaderValue.id, mate, function () {
          }, 'PUT')
          for (var j = 0; j < mateList.rows.length; j++) {
            for (var k = 0; k < this.selectedIds.length; k++) {
              if (mateList.rows[j].invoiceCode === this.selectedIds[k]) {
                mateList.rows.splice(j, 1)
              }
            }
          }
        } else {
          for (j = 0; j < mateList.rows.length; j++) {
            for (k = 0; k < this.selectedIds.length; k++) {
              if (mateList.rows[j].invoiceCode === this.selectedIds[k]) {
                mateList.rows.splice(j, 1)
              }
            }
          }
        }
      }
    },
    changeTrandeAmount (amount, trade) {
      if (trade > amount) {
        this.message('收款金额不能大于发票余额', 'warning')
      }
    },
    message (message, type) {
      this.$message({
        message: message,
        type: type
      })
    },
    // 选择已选的核销发票
    handleDialogSelectionGathering (val) {
      this.gatherings = val
    },
    // 选择发票之后，将收款的头和发票都传给后台
    dialogSubmit () {
      var rowsValues = []
      if (this.multipleDialogSelection.length === 0) {
        this.message('请勾选核销发票', 'warning')
        return
      }
      // 核销金额的总和
      var amount = 0
      var mate = {}
      this.multipleDialogSelection.forEach(i => {
        var obj = {}
        obj.lineNum = i
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
          this.message('金额不能为空', 'warning')
          return
        }
      }
      if (amount > this.mate.mateFormerHeader.values.uncancAmount) {
        this.message('选择发票核销金额不能大于收款未核销金额', 'warning')
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
      mate.mateList = rowsValues
      if (mate.mateFormerHeader.id !== '') {
        this.$root.ajaxData('/purchase/calcellation/received/cancelInvoice/' + mate.mateFormerHeader.id, mate, function (data) {
        }, 'PUT')
      }
    },
    handleDialogSelectionChange (val) {
      this.multipleDialogSelection = val
    },
    Selected (val) {
      this.selectedRows = val
    },
    httpMethods (url, id, mate, type) {
      let vm = this
      this.$root.ajaxData(url, id, mate,function (data) {
        if (data.code === 500) {
          vm.buttonDisabled = false
          return
        }
        vm.$root.monitor({ url: '/purchase/invoice/received/all/list' })
      }, type)
    },
    handleSubmit () {
      var mate = {}
      var vm = this
      mate.mateFormerHeader = this.mate.mateFormerHeader.values
      mate.mateList = this.mate.mateList.rows
      mate.mateFormerHeader.tradeDate = DateFormat(mate.mateFormerHeader.tradeDate, 'yyyy-MM-dd')
      this.$refs.CollectionFormentForm.$refs['CollectionForm'].validate((valid) => {
        if (valid) {
          if (this.mate.mateFormerHeader.method === 'PUT' && mate.mateFormerHeader.id) {
            this.httpMethods('/purchase/invoice/', mate.mateFormerHeader.id, mate, 'PUT')
          } else if (this.mate.mateFormerHeader.method === 'POST') {
            if (mate.mateFormerHeader.uncancAmount > 0) {
              this.dialogGathering = true
            } else {
              this.httpMethods('/purchase/invoice/received/batchSave', '', mate, 'POST')
            }
          }
        } else {
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          return false
        }
      })
    },
    dialogSubmitGathering () {
      var mate = {}
      var vm = this
      mate.mateFormerHeader = this.mate.mateFormerHeader.values
      mate.mateFormerHeader.tradeDate = DateFormat(mate.mateFormerHeader.tradeDate, 'yyyy-MM-dd')
      mate.mateList = this.mate.mateList.rows
      this.httpMethods('/purchase/invoice/received/batchSave', '', mate, 'POST')
    },
    backward () {
      this.$root.monitor({ url: '/purchase/invoice/received/all/list' })
    }
  }
}
</script>
<style scoped lang="scss">
.tbutton{
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
 .el-form-item__label{
  line-height:inherit
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

