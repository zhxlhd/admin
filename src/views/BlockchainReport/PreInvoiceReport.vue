<template>
  <div>
    <el-row>
    <el-form :model="querySupplier" :label-position="labelPosition" :label-width="labelWidth" class="dialogForm">
        <template>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item  label="起始月" >
               <el-date-picker
                  v-model="querySupplier.dateFrom"
                  type="month"
                  size="mini"
                  placeholder="选择月">
               </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="截止月" >
              <el-date-picker
                  v-model="querySupplier.dateTo"
                  type="month"
                  size="mini" 
                  placeholder="选择月">
               </el-date-picker>
            </el-form-item>
          </el-col>
           <el-col :sm="12" :md="8" :lg="6">
            <el-form-item>
              <el-button size="mini" type="primary" @click="supplierQuery">查询</el-button>
            </el-form-item>
          </el-col>
        </template>
    </el-form>
    </el-row>
    <div class="lineChart">
    <el-row>
        <linePreInvoiceChart :fatherXData="fatherXData" :fatherYData="fatherYData" :fatherDetial="fatherDetial" :yName="yName" :xName="xName"></linePreInvoiceChart>
   </el-row>
    </div>
  </div>
</template>
<script>
import linePreInvoiceChart from './linePreInvoiceChart'
import { DateFormat } from '../../utils/util'
export default {
  components: {
    linePreInvoiceChart
  },
  props: {
    mate: Object
  },
  data () {
    return {
      yName: '',
      xName: '',
      fatherXData: [],
      fatherYData: [],
      fatherDetial: [],
      querySupplier: {
        dateFrom: '',
        dateTo: ''
      }
    }
  },
  created () {
    this.yName = '数量'
    this.xName = '金额'
    this.fatherXData = this.mate.mateXList
    this.fatherYData = this.mate.mateYList
    this.fatherDetial = this.mate.moneyList
  },
  methods: {
    supplierQuery () {
      var vm = this
      this.querySupplier.beginDate = DateFormat(this.querySupplier.dateFrom, 'yyyy-MM')
      this.querySupplier.toDate = DateFormat(this.querySupplier.dateTo, 'yyyy-MM')
      if (this.querySupplier.toDate === null && this.querySupplier.beginDate !== null) {
        this.$root.ajaxData('/purchase/tms/invoice/query/block/report?dateFrom=' + this.querySupplier.beginDate, {}, function (data) {
          vm.fatherXData = data.mate.mateXList
          vm.fatherYData = data.mate.mateYList
          vm.fatherDetial = data.mate.moneyList
        }, 'GET')
      }
      if (this.querySupplier.beginDate === null && this.querySupplier.toDate !== null) {
        this.$root.ajaxData('/purchase/tms/invoice/query/block/report?dateTo=' + this.querySupplier.toDate, {}, function (data) {
          vm.fatherXData = data.mate.mateXList
          vm.fatherYData = data.mate.mateYList
          vm.fatherDetial = data.mate.moneyList
        }, 'GET')
      }
      if (this.querySupplier.beginDate === null && this.querySupplier.toDate === null) {
        this.$root.ajaxData('/purchase/tms/invoice/query/block/report', {}, function (data) {
          vm.fatherXData = data.mate.mateXList
          vm.fatherYData = data.mate.mateYList
          vm.fatherDetial = data.mate.moneyList
        }, 'GET')
      }
      if (this.querySupplier.beginDate !== null && this.querySupplier.toDate !== null) {
        this.$root.ajaxData('/purchase/tms/invoice/query/block/report?dateFrom=' + this.querySupplier.beginDate + '&dateTo=' + this.querySupplier.toDate, {}, function (data) {
          vm.fatherXData = data.mate.mateXList
          vm.fatherYData = data.mate.mateYList
          vm.fatherDetial = data.mate.moneyList
        }, 'GET')
      }
    }
  }
}
</script>

<style scoped>
.lineChart{
  margin-top: 30px;
}
</style>
