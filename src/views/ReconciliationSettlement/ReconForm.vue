<template>
 <div>
   <el-row>
     <el-form :model="mate.values" :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="labelWidth">
       <template>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['reconCode'].label" :prop="object['reconCode'].name">
              <el-input  disabled readonly v-model="mate.values['reconCode']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['corporateBody'].label" :prop="object['corporateBody'].name">
              <el-select  disabled clearable   filterable v-model="mate.values[object['corporateBody'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of object['corporateBody'].options" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['supplierCode'].label" :prop="object['supplierCode'].name">
              <el-select  disabled clearable   filterable v-model="mate.values[object['supplierCode'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of object['supplierCode'].options" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['supplierName'].label" :prop="object['supplierName'].name">
              <el-input  disabled  v-model="mate.values['supplierName']"></el-input>
            </el-form-item>
          </el-col>

           <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['emitDate'].label" :prop="object['emitDate'].name">
                  <el-date-picker disabled clearable v-model="mate.values[object['emitDate'].name]" type="date" placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
           </el-col>
          
           <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['currency'].label"  :prop="object['currency'].name">
                  <dict-selected  rowId="0" v-model="mate.values[object['currency'].name]" dictType="currency" :initValue="mate.values[object['currency'].name]"></dict-selected>
                </el-form-item>
           </el-col>
          
           <el-col :sm="12" :md="8" :lg="8">
             <el-form-item :label="object['moneyAmount'].label" :prop="object['moneyAmount'].name">
               <el-input disabled   v-model="mate.values['moneyAmount']"></el-input>
             </el-form-item>
           </el-col>

           <el-col :sm="12" :md="8" :lg="8">
             <el-form-item :label="object['remark'].label" :prop="object['remark'].name">
               <el-input   v-model="mate.values['remark']"></el-input>
             </el-form-item>
           </el-col>
       </template>
     </el-form>
   </el-row>
 </div>  
</template>
<script>
export default {
  components: {
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    },
    'tree-selected': function index (resolve) {
      require(['../../components/TreeSelected.vue'], resolve)
    }
  },
  created () {
    this.mate.fields.map((i) => { this.object[i.name] = i })
  },
  data () {
    return {
      object: {},
      labelPosition: 'right',
      rules: {
      }
    }
  },
  props: {
    mate: Object
  },
  computed: {
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        width = '100px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '100px'
      } else if (this.mate.labelWidth === null) {
        width = '100px'
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