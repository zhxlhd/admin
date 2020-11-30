<template>
  <div>
  <el-row>
  <el-form size="mini"  :model="mate.mateFormerHeader.values" :inline="mate.inline" :label-position="labelPosition" :rules="rules" ref="ruleForm" :label-width="labelWidth">
    <template v-for="field of mate.mateFormerHeader.fields">
      <el-col :sm="12" :md="8" :lg="6" :key="field">
        <el-form-item :label="field.label" :prop="field.name" v-if="field.holder == 'textc'">
          <el-input size="mini" readonly  v-model="mate.mateFormerHeader.values[field.name]" :placeholder="field.placeholder"></el-input>
        </el-form-item>
      </el-col>
    </template>
  </el-form>
  </el-row>
   <!--下面的明细表格-->
  <template>
    <div class="detailLine">
       <TreeBom  
        :columns="columns" :tree-structure="true" :data-source='mate.mateListLine.rows'></TreeBom>
      <!-- <el-table :cell-style="rowClass" max-height="300" size="mini" :data="mate.mateListLine.rows" border  class="tableTop">
        <el-table-column show-overflow-tooltip  :formatter="col.formatter" v-for="col of mate.mateListLine.columns" :key="col.id" :label="col.label" :prop="col.name" :min-width="col.width">
        </el-table-column>
      </el-table> -->
    </div>
  </template>
  </div>
</template>
<script>

import TreeBom from './TreeBom'
export default {
  data () {
    return {
      columns:[]
    }
  },
  props: {
    word: {
      default: '提 交'
    },
    mate: Object
  },
  mounted () {
  
  },
  created () {
    var vm = this
    this.mate.mateListLine.columns.forEach(element => {
      var lineColumns = {}
      lineColumns.text = element.label
      lineColumns.dataIndex = element.name
      vm.columns.push(lineColumns)
    });
  },
  components: {
    TreeBom
  },
  computed: {
    // a computed getter
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        // width = undefined
        width = '110px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '110px'
      } else if (this.mate.labelWidth === null) {
        width = '110px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.el-form--inline>* {
  margin-right:10px
}
.el-form-item{
  margin: 22px 20px 2px 0;
}
.el-form-item{
  margin-bottom:2px;
}
.leftFloat .el-row{
  float:left;
  width:250px;
}
.leftFloat .el-row input{
  width:250px;
}
.leftFloat .el-form-item{
  margin:0;
}
.leftFloat .button{
  float:left;
}
.el-form--inline .el-form-item {
  width:200px;
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
}
.el-form-item.is-required .el-form-item__label:before{
  content:''
}
.el-form-item.is-required .el-form-item__label:after{
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}
.el-cascader{
  width:100%;
}
.el-select{
  width:100%;
}
.hidden{
  display:none;
}
h4{
  margin-top:40px;
  margin-bottom:10px;
}
.el-select{
  width:100%;
}
.el-date-editor.el-input{
  width:100%;
}
.el-form--inline.el-form--label-top .el-form-item__content{
  width:90%
}
.leftFloat .el-form--inline .el-form-item{
  margin-right:10px;
}
.el-form-item {
    margin: 15px 20px 2px 0px;
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
</style>
