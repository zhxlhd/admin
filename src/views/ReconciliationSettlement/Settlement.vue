<template>
  <div>
      <div class="tbutton">
        <el-button  @click="handleSubmit" type="primary"  plain class="el-icon-document">提 交</el-button>
        <el-button  type="warning" plain class="el-icon-close" @click="backward">取 消</el-button>
      </div>
     <SettlementForm :mate="mate.mateFormerHeader" ref="SettlementForm"></SettlementForm>
      <KTable :mate="mate.mateList" @actionSelected="handleSelected"  @action="handleKtable" ></KTable>
      <el-dialog title="填写结算明细单" width="80%" :visible.sync="dialogFormVisible">
        <ReconKTable :mate="dataKTable" @actionSelected="Selected" :mateFormerReconCode = 'mateFormerReconCode'></ReconKTable>
        <el-button @click="dlgConfirm" type="primary">确 定</el-button>
        <el-button @click="dlgCancel">取 消</el-button>
      </el-dialog>
  </div>
</template>
<script>
export default {
  components: {
    SettlementForm: function index (resolve) {
      require(['./SettlementForm.vue'], resolve)
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
    tmpRows: {
      handler: function (val, old) {
        var price
        var moneyAmount = 0
        for (var i = 0; i < this.tmpRows.length; i++) {
          if (this.tmpRows[i].moneyAmount === '') {
            price = 0
          } else {
            price = this.tmpRows[i].moneyAmount
            moneyAmount += price
          }
        }
        this.mate.mateFormerHeader.values.moneyAmount = moneyAmount
      },
      deep: true
    }
  },
  data () {
    return {
      object: {},
      dialogFormVisible: false,
      dataKTable: {},
      btn: {},
      row: {},
      tmpRows: [],
      confrimRows: [],
      selectedRows: [],
      selectedIds: [],
      mateFormerReconCode: this.mate.mateFormerHeader.values.reconCode,
      rules: {
        qty: [
         { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ]
      }
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
      val.map((i) => this.selectedIds.push(i.lineNum))
    },
    handleKtable (btn, row) {
      this.row = row
      this.btn = btn
      let mateListRows = this.mate.mateList.rows
      if (this.btn.action === 'addLine') {
        // 新增
        var vm = this
        this.$root.ajaxData('/purchase/recon/getUnSettlementRecon?reconCode=' + this.mate.mateFormerHeader.values.reconCode, {}, function (data) {
          delete data.mate.btns
          vm.dataKTable = data.mate
        }, 'GET')
        this.dialogFormVisible = true
        if (mateListRows.length === 0) {
          this.tmpRows = []
        } else {
          this.tmpRows = mateListRows
        }
        return
      } else if (this.btn.action === 'deleteLine') {
        for (var j = 0; j < mateListRows.length; j++) {
          for (var k = 0; k < this.selectedIds.length; k++) {
            if (mateListRows[j].lineNum === this.selectedIds[k]) {
              mateListRows.splice(j, 1)
            }
          }
          for (var l = 0; l < mateListRows.length; l++) {
            mateListRows[l].lineNum = l + 1
          }
        }
      }
    },
    dlgConfirm (val) {
      var vm = this
      var rows = this.selectedRows
      let mateListRows = this.mate.mateList.rows
      if (rows.length === 0) {
        this.message(this.$t('selmdata'), 'warning')
        return
      } else {
        this.confrimRows = rows
        var index = 0
        while (this.confrimRows.length !== 0) {
          if (index >= this.confrimRows.length) {
            break
          }
          var j
          for (j = 0; j < mateListRows.length; j++) {
            if (mateListRows[j].rsPreReconListId === this.confrimRows[index].rsPreReconListId) {
              this.confrimRows.splice(index, 1)
              break
            }
          }
          if (j >= mateListRows.length) {
            index++
          }
        }
        for (j = 0; j < this.confrimRows.length; j++) {
          this.confrimRows[j].customerCode = this.confrimRows[j].supplierCode
          this.confrimRows[j].customerName = this.confrimRows[j].supplierName
          this.confrimRows[j].customerPo = this.confrimRows[j].poCode
          this.confrimRows[j].customerPoCode = this.confrimRows[j].poLineNum
          this.confrimRows[j].reconLineNum = this.confrimRows[j].lineNum
          this.confrimRows[j].id = null
        }
        this.tmpRows.push(...this.confrimRows)
        mateListRows = this.tmpRows
        for (var i = 0; i < mateListRows.length; i++) {
          mateListRows[i].lineNum = i + 1
        }
        this.dialogFormVisible = false
      }
    },
    Selected (val) {
      this.selectedRows = val
    },
    dlgCancel () {
      this.dialogFormVisible = false
    },
    handleSubmit () {
      var mate = {}
      var vm = this
      let mateListRows = this.mate.mateList.rows
      if (mateListRows.length === 0) {
        this.message(this.$t('Detailed data can not be empty'), 'warning')
        return
      }
      if (mateListRows.length !== 1) {
        for (let z = 0; z <= mateListRows.length - 2; z++) {
          if (mateListRows[z].supplierCode !== mateListRows[z + 1].supplierCode) {
            this.message(this.$t('selectSupp'), 'warning')
            return
          }
        }
        for (let z = 0; z <= mateListRows.length - 2; z++) {
          if (mateListRows[z].currency !== mateListRows[z + 1].currency) {
            this.message(this.$t('selectSupp'), 'warning')
            return
          }
        }
      }
      mate.mateFormerHeader = this.mate.mateFormerHeader.values
      mate.mateList = this.mate.mateList.rows
      if (this.mate.mateFormerHeader.method === 'PUT') {
        this.ajaxMethods('/purchase/settlement/updateSettlement', mate, 'PUT')
      } else {
        this.ajaxMethods('/purchase/settlement/batchSave', mate, 'GET')
      }
    },
    ajaxMethods (url, mate, type = 'GET') {
      let vm = this
      this.$root.ajaxData(url, mate, function (data) {
        vm.$root.monitor({ url: '/purchase/settlement/all/list' })
      }, type)
    },
    backward () {
      if (this.mate.mateFormerHeader.method === 'PUT') {
        this.$root.monitor({ url: '/purchase/settlement/all/list' })
      } else {
        this.$root.monitor({ url: '/purchase/recon/all/list?businessType=true' })
      }
    }
  }
}
</script>
<style scoped>
 .el-form-item__label{
  line-height:inherit
}
.tbutton{
  margin: 20px 0
}
</style>

