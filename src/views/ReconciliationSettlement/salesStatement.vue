<template>
  <div>
    <sales-statement-form :values="values"></sales-statement-form>
    <div>
      <el-button size="mini" @click="query">查找</el-button>
    </div>
    <el-table class="tableM" size="mini" highlight-current-row ref="table" :data="mate.rows" border>
      <el-table-column type="selection" width="40" id="tableSel"></el-table-column>
      <el-table-column v-if="col.isShow" :formatter="col.formatter" v-for="col of mate.columns" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip></el-table-column>
    </el-table>
    <div class="center">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        layout="total, prev, pager, next, sizes"
        :total="mate.total"
        :page-sizes ="[5, 10, 15, 20, 50]"
        :page-size="pageSize">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { DateFormat } from '../../utils/util'
import salesStatementForm from './salesStatementForm'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
export default {
  mixins: [ColumnFormatterMixin],
  watch: {
    mate: function (newMate) {
      this.formatterBefore(this.mate.columns)
    } 
  },
  data () {
    return {
      total: 0,
      pageSize: 5,
      page: 1,
      values: {
        operationUnit: '',
        customerName: '',
        salesPerson: '',
        currencyCode: '',
        settleCode: '',
        lineAttribute3: '',
        salesOrder: '',
        purchaseOrder: '',
        shipDateFrom: '',
        shipDateTo: '',
        itemNumber: '',
        customerItemNumber: '',
        custTrxType: '',
        termName: '',
        saleQty: 0,
        saleMoney: 0
      }
    }
  },
  props: {
    mate: Object
  },
  created () {
    var vm = this
    this.formatterBefore(this.mate.columns)
    this.cacl()
  },
  components: {
    salesStatementForm
  },
  methods: {
    cacl () {
      var vm = this
      vm.values.saleQty = 0
      vm.values.saleMoney = 0
      this.mate.rows.forEach(i => {
        vm.values.saleQty += Number(i.quantityOrdered)
        vm.values.saleMoney += Number(i.amount)
      })
      vm.values.saleMoney = Number(vm.values.saleMoney).toFixed(2)
    },
    query (data) {
      let url = ''
      if (data) {
        url = this.mate.url + `?pageSize=${this.pageSize}&pageNum=${this.page}`
      } else {
        url = this.mate.url
      }
      var vm = this
      this.values.shipDateFrom = DateFormat(this.values.shipDateFrom, 'yyyy-MM-dd')
      this.values.shipDateTo = DateFormat(this.values.shipDateTo, 'yyyy-MM-dd')
      this.$root.ajaxData(url, this.values, function (data) {
        vm.mate.total = data.total
        vm.pageSize = data.pageSize
        vm.page = data.pageNum
        vm.mate.rows = data.list
        vm.cacl()
      }, 'POST')
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.query('page')
    },
    handleCurrentChange (val) {
      this.page = val
      this.query('page')
    }
  }
}
</script>

<style scoped>
.tableM {
  margin-top: 10px;
}
.center {
  text-align: center;
  padding: 20px 0;
}
</style>
