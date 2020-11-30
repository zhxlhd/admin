<template>
  <div class="settlementDetail">
    <h1>结算单行详情</h1>
    <ul>
      <li><span>结算单编号</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.values.settleCode}}</li>
      <li><span>来源：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.values.seller}}</li>
      <li><span>购方公司：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.values.customerName}}</li>
      <li><span>购方业务实体：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.values.ouName}}</li>
      <li><span>采购员：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.values.buyer}}</li>
      <li><span>创建时间：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.values.createAt}}</li>
      <li><span>备注：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.values.remark}}</li>
    </ul>
    <ul>
      <li><span>销方公司：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.values.seller}}</li>
      <li><span>销方业务实体：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.values.salesOu}}</li>
      <li><span>销售员：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.values.salesPerson}}</li>
      <li><span>币种：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.values.currency}}</li>
      <li><span>不含税金额：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.values.unTaxMoney}}</li>
      <li><span>税率：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.values.taxRate}}</li>
      <li><span>含税金额：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.values.moneyAmount}}</li>
    </ul>
    <div>
    <el-table class="tablePre" size="mini" highlight-current-row ref="table" :max-height="200" stripe :data="mate.apMateLineList.rows"  @selection-change="handleSelectionChange">
      <el-table-column align="center" v-if="col.isShow" :formatter="col.formatter" v-for="col of mate.apMateLineList.columns" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip></el-table-column>
    </el-table>
    </div>
  </div>
</template>

<script>
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
export default {
  mixins: [ColumnFormatterMixin],
  data () {
    return {
      showPurDetial: true,
      showSaleDetial: false,
      radio3: '1'
    }
  },
  props: {
    mate: Object
  },
  created () {
    this.formatterBefore(this.mate.apMateLineList.columns)
    this.formatterBefore(this.mate.arMateLineList.columns)
  },
  methods: {
    changeType (val) {
      if (val.name === '1') {
        this.showPurDetial = true
        this.showSaleDetial = false
      } else if (val.name === '2') {
        this.showPurDetial = false
        this.showSaleDetial = true
      }
    }
  }
}
</script>

<style lang="scss">
.settlementDetail {
  ul {
    display: inline-block;
    vertical-align: top;
    width: 350px;
    overflow: hidden;
    li {
      list-style: none;
      margin: 5px 0;
      span {
        display: inline-block;
        width: 100px;
        text-align: right;
      }
    }
  }
  .tablePre {
    width: 100%;
    margin: 20px 0;
  }
  th {
    background-color: #e6e7eb;
    color: #303030;
    font-weight: 700;
  }
}
</style>
