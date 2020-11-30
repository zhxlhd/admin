<template>
  <div>
    <el-row>
    <el-form :model="querySupplier" :label-position="labelPosition" :label-width="labelWidth" class="dialogForm">
        <template>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item  label="起始月" >
               <el-date-picker
                  v-model="querySupplier.beginDate"
                  type="month"
                  size="mini"
                  placeholder="选择月">
               </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="截止月" >
              <el-date-picker
                  v-model="querySupplier.toDate"
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
        <line-chart :fatherXData="fatherXData" :fatherYData="fatherYData" :yName="yName"></line-chart>
   </el-row>
   </div>
  </div>
</template>
<script>
import lineChart from './lineChart'
import { DateFormat } from '../../utils/util'
export default {
  components: {
    lineChart
  },
  props: {
    mate: Object
  },
  data () {
    return {
      yName: '',
      fatherXData: [],
      fatherYData: [],
      querySupplier: {
        beginDate: '',
        toDate: ''
      }
    }
  },
  created () {
    this.yName = '企业数量'
    this.fatherXData = this.mate.mateXList
    this.fatherYData = this.mate.mateYList
  },
  methods: {
    supplierQuery () {
      var vm = this
      this.querySupplier.beginDate = DateFormat(this.querySupplier.beginDate, 'yyyy-MM')
      this.querySupplier.toDate = DateFormat(this.querySupplier.toDate, 'yyyy-MM')
      if (this.querySupplier.toDate === null && this.querySupplier.beginDate !== null) {
        this.$root.ajaxData('/companys/query/block/report?beginDate=' + this.querySupplier.beginDate, {}, function (data) {
          vm.fatherXData = data.mate.mateXList
          vm.fatherYData = data.mate.mateYList
        }, 'GET')
      }
      if (this.querySupplier.beginDate === null && this.querySupplier.toDate !== null) {
        this.$root.ajaxData('/companys/query/block/report?toDate=' + this.querySupplier.toDate, {}, function (data) {
          vm.fatherXData = data.mate.mateXList
          vm.fatherYData = data.mate.mateYList
        }, 'GET')
      }
      if (this.querySupplier.beginDate === null && this.querySupplier.toDate === null) {
        this.$root.ajaxData('/companys/query/block/report', {}, function (data) {
          vm.fatherXData = data.mate.mateXList
          vm.fatherYData = data.mate.mateYList
        }, 'GET')
      }
      if (this.querySupplier.beginDate !== null && this.querySupplier.toDate !== null) {
        this.$root.ajaxData('/companys/query/block/report?beginDate=' + this.querySupplier.beginDate + '&toDate=' + this.querySupplier.toDate, {}, function (data) {
          vm.fatherXData = data.mate.mateXList
          vm.fatherYData = data.mate.mateYList
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
