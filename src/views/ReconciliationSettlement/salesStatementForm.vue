<template>
  <div>
    <el-row>
      <el-form size="mini" :model="values" :label-position="labelPostion" :label-width="labelWidth">
        <template>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="业务实体" :props="values['operationUnit']">
              <el-input size="mini" v-model="values['operationUnit']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="客户名称" :props="values['customerName']">
              <el-input size="mini" v-model="values['customerName']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="销售人员" :props="values['salesPerson']">
              <el-input size="mini" v-model="values['salesPerson']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="币别" :props="values['currencyCode']">
              <el-input size="mini" v-model="values['currencyCode']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="对账单号" :props="values['settleCode']">
              <el-input size="mini" v-model="values['settleCode']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="出货单号" :props="values['lineAttribute3']">
              <el-input size="mini" v-model="values['lineAttribute3']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="销售订单" :props="values['salesOrder']">
              <el-input size="mini" v-model="values['salesOrder']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="客户PO" :props="values['purchaseOrder']">
              <el-input size="mini" v-model="values['purchaseOrder']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="出货日期从" :props="values['shipDateFrom']">
              <el-date-picker size="mini" v-model="values['shipDateFrom']" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="出货日期至" :props="values['shipDateTo']">
              <el-date-picker @change="change" size="mini" v-model="values['shipDateTo']" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="物料编码" :props="values['itemNumber']">
              <el-input size="mini" v-model="values['itemNumber']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="客户料号" :props="values['customerItemNumber']">
              <el-input size="mini" v-model="values['customerItemNumber']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="发票类型" :props="values['custTrxType']">
              <el-input size="mini" v-model="values['custTrxType']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="付款条件" :props="values['termName']">
              <el-input size="mini" v-model="values['termName']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="销售数量合计" :props="values['saleQty']">
              <el-input disabled size="mini" v-model="values['saleQty']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="销售金额合计" :props="values['saleMoney']">
              <el-input disabled size="mini" v-model="values['saleMoney']"></el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPostion: 'right',
      labelWidth: '120px'
    }
  },
  props: {
    values: Object
  },
  methods: {
    change (val) {
      if (val < this.values['shipDateActualFrom']) {
        this.$message({
          message: '请选择正确的出货日期',
          type: 'warning'
        })
        this.values['shipDateActualTo'] = ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}
.el-select {
  width: 100%;
}
</style>
