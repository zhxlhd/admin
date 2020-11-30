<template>
  <div>
    <p>含税金额合计：{{sum}}</p>
    <p>不含税金额合计：{{noTaxSum}}</p>
    <p>税额合计：{{taxSum}}</p>
    <p></p>
    <p>共&nbsp;{{mate.rows.length}}&nbsp;条</p>
    <div>
    <el-table v-show="showPurDetial" class="tablePre" size="mini" highlight-current-row ref="table" :data="mate.rows" border>
      <el-table-column :label="lineColumns['invoiceNo'].label" :prop="lineColumns['invoiceNo'].name" :min-width="lineColumns['invoiceNo'].width"></el-table-column>
      <el-table-column :label="lineColumns['makeInvoiceTime'].label" :prop="lineColumns['makeInvoiceTime'].name" :min-width="lineColumns['makeInvoiceTime'].width"></el-table-column>
      <el-table-column :label="lineColumns['totalPrice'].label" :prop="lineColumns['totalPrice'].name" :min-width="lineColumns['totalPrice'].width"></el-table-column>
      <el-table-column :label="lineColumns['totalTax'].label" :prop="lineColumns['totalTax'].name" :min-width="lineColumns['totalTax'].width"></el-table-column>
      <el-table-column :label="lineColumns['totalPriceTax'].label" :prop="lineColumns['totalPriceTax'].name" :min-width="lineColumns['totalPriceTax'].width"></el-table-column>
      <el-table-column :label="lineColumns['taxRate'].label" :prop="lineColumns['taxRate'].name" :min-width="lineColumns['taxRate'].width"></el-table-column>
      <el-table-column :label="lineColumns['type'].label" :prop="lineColumns['type'].name" :min-width="lineColumns['type'].width" :formatter="lineColumns['type'].formatter"></el-table-column>
      <el-table-column :label="lineColumns['status'].label" :prop="lineColumns['status'].name" :min-width="lineColumns['status'].width" :formatter="lineColumns['status'].formatter"></el-table-column>
      <el-table-column  fixed="right" label="操作" :width="actionWidth">
        <template slot-scope="scope">
          <el-button size="mini" @click="preInvoice(scope.row)">预览发票</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <el-dialog :visible.sync="visibleInvoiceDetial" width="65%">
      <InvoiceView :myInvoice="myInvoice" :rowStatus="rowStatus" :invoiceDetial="invoiceDetial" ref="InvoiceView"></InvoiceView>
    </el-dialog>
  </div>
</template>

<script>
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    InvoiceView: function index (resolve) {
      require(['../../components/InvoiceView.vue'], resolve)
    }
  },
  data () {
    return {
      myInvoice: true,
      visibleInvoiceDetial: false,
      dialogFormVisible: false,
      showPurDetial: true,
      showSaleDetial: false,
      lineColumns: {},
      invoiceDetial: {},
      rowStatus: {},
      sum: 0, // 含税金额,
      noTaxSum: 0, // 不含税金额合计
      taxSum: 0 // 税额合计
    }
  },
  props: {
    mate: Object
  },
  created () {
    this.formatterBefore(this.mate.columns)
    this.mate.columns.map((i) => { this.lineColumns[i.name] = i })
    this.getTotalMoney()
  },
  methods: {
    getTotalMoney(){
      this.mate.rows.forEach(row=>{
        this.sum += row.totalPriceTax
        this.taxSum += row.totalTax
        this.noTaxSum += row.totalPrice
      });
    },
    preInvoice (val) {
      var vm = this
      this.rowStatus = val
      this.$root.ajaxData('/purchase/tms/invoice/showInvoice/' + val.id, {}, function (data) {
        vm.visibleInvoiceDetial = true
        vm.invoiceDetial = data
      })
    }
  }
}
</script>

<style scoped>
  ul {
    display: inline-block;
    vertical-align: top;
    width: 350px;
    overflow: hidden;
  }
  ul li {
    list-style: none;
    margin: 5px 0;
  }
  ul li span {
    display: inline-block;
    width: 100px;
    text-align: right;
  }
  .el-form-item--mini.el-form-item {
    margin: 6px;
  }
  /* .tablePre {
    margin-top: 0px;
  } */
</style>
