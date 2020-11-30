<template>
  <div>
      <div class="tbutton">
        <el-button  @click="handleSubmit" type="primary"  plain class="el-icon-document">提 交</el-button>
        <el-button  type="warning" plain class="el-icon-close" @click="backward">取 消</el-button>
      </div>
     <ReconForm :mate="mate.mateFormerHeader" ref="ReconForm"></ReconForm>
      <KTable :mate="mate.mateList" @actionSelected="handleSelected"  @action="handleKtable" ></KTable>
      <el-dialog title="填写对账单明细单" width="80%" :visible.sync="dialogFormVisible">
        <ReconKTable :mate="dataKTable" @actionSelected="Selected" :mateFormerSupplierName ='mateFormerSupplierName' :mateFormerCurrency='mateFormerCurrency'></ReconKTable>
        <el-button @click="dlgConfirm" type="primary">确 定</el-button>
        <el-button @click="dlgCancel">取 消</el-button>
      </el-dialog>
  </div>
</template>
<script>
export default {
  components: {
    ReconForm: function index (resolve) {
      require(['./ReconForm.vue'], resolve)
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
            if (this.tmpRows[i].type === '59') {
              moneyAmount -= price
            } else {
              moneyAmount += price
            }
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
      selectLineId: [],
      mateFormerSupplierName: this.mate.mateFormerHeader.values.supplierName,
      mateFormerCurrency: this.mate.mateFormerHeader.values.currency,
      rules: {
        qty: [
         { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSelected (val) {
      this.selectedIds = []
      // map方法也可以
      val.map((i) => this.selectedIds.push(i.lineNum))
      val.map((i) => this.selectLineId.push(i.rsPreReconListId))
      var arr = []
      var json = {}
      var arrId = []
      for (var i = 0; i < this.selectedIds.length; i++) {
        if (!json[this.selectedIds[i]]) {
          json[this.selectedIds[i]] = 1
          arr.push(this.selectedIds[i])
        }
      }
      for (i = 0; i < this.selectLineId.length; i++) {
        if (!json[this.selectLineId[i]]) {
          json[this.selectLineId[i]] = 1
          arrId.push(this.selectLineId[i])
        }
      }
      this.selectLineId = arrId
      this.selectedIds = arr
    },
    handleKtable (btn, row) {
      this.row = row
      this.btn = btn
      if (this.btn.action === 'addLine') {
        // 新增
        var vm = this
        this.$root.ajaxData('/purchase/recon/addReconLine' + '?supplierName=' + this.mate.mateFormerHeader.values.supplierName + '&currency=' + this.mate.mateFormerHeader.values.currency, {}, function (data) {
          delete data.mate.btns
          vm.dataKTable = data.mate
        }, 'GET')
        this.dialogFormVisible = true
        if (this.mate.mateList.rows.length === 0) {
          this.tmpRows = []
        } else {
          this.tmpRows = this.mate.mateList.rows
        }
        return
      } else if (this.btn.action === 'deleteLine') {
        // 判断list中有的值和用户选择的值是否一致，若一致则将其删除
        for (var j = 0; j < this.mate.mateList.rows.length; j++) {
          for (var k = 0; k < this.selectedIds.length; k++) {
            if (this.mate.mateList.rows[j].lineNum === this.selectedIds[k]) {
              this.mate.mateList.rows.splice(j, 1)
            }
          }
          for (var l = 0; l < this.mate.mateList.rows.length; l++) {
            this.mate.mateList.rows[l].lineNum = l + 1
          }
          this.$root.ajaxData('/purchase/recon/pre/updateStatus?ids=' + this.selectLineId, {}, function () {
          }, 'PUT')
        }
      }
    },
    dlgConfirm (val) {
      var vm = this
      var rows = this.selectedRows
      if (rows.length === 0) {
        vm.$message({
          message: this.$t('selmdata'),
          type: 'warning'
        })
        return
      } else {
        this.confrimRows = rows
        var index = 0
        while (this.confrimRows.length !== 0) {
          if (index >= this.confrimRows.length) {
            break
          }
          var j
          for (j = 0; j < this.mate.mateList.rows.length; j++) {
            if (this.mate.mateList.rows[j].rsPreReconListId === this.confrimRows[index].id) {
              this.confrimRows.splice(index, 1)
              break
            }
          }
          if (j >= this.mate.mateList.rows.length) {
            index++
          }
        }
        for (var i = 0; i < this.confrimRows.length; i++) {
          this.confrimRows[i].rsPreReconListId = this.confrimRows[i].id
          this.confrimRows[i].id = null
        }
        this.tmpRows.push(...this.confrimRows)
        this.mate.mateList.rows = this.tmpRows
        for (i = 0; i < this.mate.mateList.rows.length; i++) {
          this.mate.mateList.rows[i].lineNum = i + 1
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
      mate.mateFormerHeader = this.mate.mateFormerHeader.values
      mate.mateList = this.mate.mateList.rows
      if (this.mate.mateFormerHeader.method === 'PUT') {
        this.httpMethods('/purchase/recon/updateRecon', mate, 'PUT')
      } else {
        this.httpMethods('/purchase/recon/batchSave', mate, 'POST')
      }
    },
    httpMethods (url, mate, type) {
      let vm = this
      this.$root.ajaxData(url, mate, function (data) {
        vm.$root.monitor({ url: '/purchase/recon/all/list' })
      }, type)
    },
    backward () {
      if (this.mate.mateFormerHeader.method === 'PUT') {
        this.$root.monitor({ url: '/purchase/recon/all/list' })
      } else {
        this.$root.monitor({ url: '/purchase/recon/pre/list' })
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

