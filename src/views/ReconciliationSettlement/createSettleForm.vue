<template>
 <div>
   <el-row>
     <el-form :model="mate.values" :label-position="labelPosition" ref="ruleForm" :label-width="labelWidth">
       <template>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['settleCode'].label" :prop="object['settleCode'].name">
              <el-input size="mini" disabled v-model="mate.values['settleCode']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['reconCode'].label" :prop="object['reconCode'].name">
              <el-input size="mini" disabled v-model="mate.values['reconCode']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['corporateBody'].label" :prop="object['corporateBody'].name">
              <el-input size="mini" disabled v-model="mate.values['corporateBody']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['customerCode'].label" :prop="object['customerCode'].name">
              <el-input size="mini" disabled v-model="mate.values['customerCode']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['customerName'].label" :prop="object['customerName'].name">
              <el-input size="mini" disabled v-model="mate.values['customerName']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['emitDate'].label" :prop="object['emitDate'].name">
              <el-input size="mini" disabled v-model="mate.values['emitDate']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['currency'].label" :prop="object['currency'].name">
              <el-input size="mini" disabled v-model="mate.values['currency']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['moneyAmount'].label" :prop="object['moneyAmount'].name">
              <el-input size="mini" disabled v-model="mate.values['moneyAmount']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['remark'].label" :prop="object['remark'].name">
              <el-input size="mini" v-model="mate.values['remark']"></el-input>
            </el-form-item>
          </el-col>
       </template>
     </el-form>
   </el-row>
 </div>  
</template>
<script>
export default {
  created () {
    this.mate.fields.map((i) => { this.object[i.name] = i })
  },
  data () {
    return {
      object: {},
      labelPosition: 'right',
      labelWidth: '120px'
    }
  },
  props: {
    mate: Object
  }
}
</script>
<style scoped>
.el-form--inline>* {
  margin-right:10px
}
.el-form-item{
  margin: 15px 20px 2px 0px;
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
</style>