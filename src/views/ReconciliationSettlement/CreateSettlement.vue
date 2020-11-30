<template>
  <div>
    <div class="tbutton">
      <el-button size="mini" @click="handleSubmit" type="primary" plain class="el-icon-document">提 交</el-button>
      <el-button size="mini" @click="backward" tyupe="warning" plain class="el-icon-close">取 消</el-button>
    </div>
    <CreateSettleForm :mate="mate.mateFormerHeader" ref="ReconForm"></CreateSettleForm>
    <div style="margin-top: 40px"></div>
    <KTable :mate="mate.mateList" @actionSelected="handleSelected" @action="handleKtable"></KTable>
    <el-dialog title="选择待对账单数据" width="80%" :visible.sync="dialogFormVisible" :before-close="handleClose">
      <el-table size="mini" highlight-current-row ref="table" :data="dataKtable.data" border @selection-change="handleSelectionChange" style="width: 100%;">
        <el-table-column type="selection" width="50" id="tableSel"></el-table-column>
        <el-table-column v-if="col.isShow" :formatter="col.formatter" v-for="col of dataKtable.columns" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-row type="flex" justify="center" class="page">
        <el-col :span="12" v-show="mate.page">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            layout="total,prev, pager, next, sizes"
            :total="total"
            :page-sizes ="[5, 10, 15, 20, 50]"
            :page-size="pageSize">
          </el-pagination>
        </el-col>
      </el-row>
      <div style="margin-top: 20px;"></div>
      <el-button size="mini" title="1234" @click="dlgConfirm" type="primary">确 定</el-button>
      <el-button size="mini"  @click="dlgCancel">取 消</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      page: 0,
      total: 0,
      pageSize: 15,
      dataKtable: {
        data: []
      },
      dialogFormVisible: false,
      labelPosition: 'right',
      hasSelected: [],
      hasSelectedLine: []
    }
  },
  components: {
    KTable: function index (resolve) {
      require(['../../components/KTable.vue'], resolve)
    },
    CreateSettleForm: function index (resolve) {
      require(['./createSettleForm.vue'], resolve)
    }
  },
  props: {
    mate: Object
  },
  methods: {
    cacl () {
      this.mate.mateFormerHeader.values.moneyAmount = 0
      for (let i = 0; i < this.mate.mateList.rows.length; i++) {
        this.mate.mateFormerHeader.values.moneyAmount += Number(this.mate.mateList.rows[i].moneyAmount)
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.page = val
    },
    handleSelected (val) {
      this.hasSelectedLine = val
    },
    handleKtable (btn) {
      const btnContent = btn
      const vm = this
      let mateListRows = this.mate.mateList.rows
      if (btnContent.action === 'addLine') {
        this.$root.ajaxData('/purchase/precast/receive/list', {}, function (data) {
          delete data.mate.btns
          vm.dataKtable.columns = data.mate.columns
          vm.dataKtable.data = data.mate.rows
        })
        vm.dialogFormVisible = true
      } else if (btnContent.action === 'deleteLine') {
        const delList = []
        const copy = [...mateListRows]
        mateListRows = []
        this.hasSelectedLine.length && this.hasSelectedLine.map(i => {
          delList[i.id] = true
        })
        copy.length && copy.map(i => {
          if (!delList[i.id]) {
            mateListRows.push(i)
          }
        })
        this.cacl()
      }
    },
    dlgConfirm () {
      let mateListRows = this.mate.mateList.rows
      this.hasSelected.length && this.hasSelected.map(i => {
        i.customerPo = i.purchaseOrder // 客户po
        i.itemCode = i.itemNumber // 物料编号
        i.qty = i.quantityOrdered // 数量
        i.currency = i.currencyCode // 币种
        i.price = i.unitSellingPrice // 含税单价
        i.moneyAmount = i.amount // 含税金额
        i.orderNum = i.salesOrder // 订单号
        i.deliveryNum = i.lineAttribute3 // 送货单号
      })
      mateListRows.push(...this.hasSelected)
      var hash = {}
      mateListRows = mateListRows.reduce(function (item, next) {
        hash[next.id] ? '' : hash[next.id] = true && item.push(next)
        return item
      }, [])
      this.cacl()
      this.handleClose()
    },
    dlgCancel () {
      this.handleClose()
    },
    handleSubmit () {
      var vm = this
      const data = {
        mateFormerHeader: this.mate.mateFormerHeader.values,
        mateList: this.mate.mateList.rows
      }
      this.$root.ajaxData('/purchase/settlement/batchSave', data, function (data) {
        vm.$root.monitor({ url: '/purchase/precast/receive/list' })
      }, 'POST')
    },
    backward () {
      this.$root.monitor({ url: '/purchase/precast/receive/list' })
    },
    handleSelectionChange (val) {
      this.hasSelected = val
    },
    handleClose () {
      this.dialogFormVisible = false
    }
  }
}
</script>