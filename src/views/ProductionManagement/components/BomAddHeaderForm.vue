/**
 * 新增Bom 头部表单
 */
<template>
  <div>
    <!-- form组 Start-->
    <el-row>
      <el-form size="mini" ref="headerForm" :model="mate.values" :inline="mate.inline" label-position="labelPosition" :rules="rules" :label-width="labelWidth">
        <!-- Bom编码 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.bomCode.label" :prop="headForm.bomCode.name">
            <el-input disabled v-model="mate.values['bomCode']"></el-input>
          </el-form-item>
        </el-col>
        <!-- 库存组织 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.orgUnit.label" :prop="headForm.orgUnit.name">
            <el-select v-model="mate.values['orgUnit']" placeholder="选择库存组织" @change="changeOrgUnit(mate.values['orgUnit'])">
              <el-option :label="mItem.label" :value="mItem.value" v-for="(mItem,index) of orgUnitOptions" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 物料 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.materialsCode.label" :prop="headForm.materialsCode.name" class="groupStyle">
            <el-input v-model="mate.values.materialsCode" :disabled="rules['materialsCode'][0].disabled" @change="changeMaterialsCode(mate.values['materialsCode'])">
              <el-button :disabled="btnMaterialsCode" slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 品名 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.materialsName.label" :prop="headForm.materialsName.name">
            <el-input disabled v-model="mate.values['materialsName']"></el-input>
          </el-form-item>
        </el-col>
        <!-- 物料类型 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.materialsType.label" :prop="headForm.materialsType.name">
            <el-input disabled v-model="mate.values['materialsType']"></el-input>
          </el-form-item>
        </el-col>
        <!-- 规格 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.specs.label" :prop="headForm.specs.name">
            <el-input disabled v-model="mate.values['specs']"></el-input>
          </el-form-item>
        </el-col>
        <!-- 单位 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.unit.label" :prop="headForm.unit.name">
            <el-input disabled v-model="mate.values['unit']"></el-input>
          </el-form-item>
        </el-col>
        <!-- 版本 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.version.label" :prop="headForm.version.name">
            <el-input disabled v-model="mate.values['version']"></el-input>
          </el-form-item>
        </el-col>
        <!-- 日期 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.fromDateStr.label" :prop="headForm.fromDateStr.name">
            <el-date-picker :picker-options="pickerOptions" value-format="yyyy-MM-dd" :disabled="rules['fromDateStr'][0].disabled" type="date" v-model="mate.values['fromDateStr']" @change="getFromDate"></el-date-picker>
          </el-form-item>
        </el-col>
        <!-- 有效状态 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.state.label" :prop="headForm.state.name">
            <el-select clearable v-model="mate.values['state']" placeholder="选择状态">
              <el-option label="有效" value="1"></el-option>
              <el-option label="废弃" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- 物料搜索框-->
    <material-search 
      v-if="searchDialogVisible" 
      :visible.sync="searchDialogVisible" 
      :orgId="mate.values['orgUnit']" 
      :materialsType="materialsType" 
      @getMateInfo="getMateInfo"></material-search>
    <!-- form组 End-->
  </div>
</template>

<script>
import { BOM_API } from "@/services/apis";
import { dateFormatZero } from '@/utils/util.js';
import { dateInit } from "@/utils/util";

export default {
  components: {
    MaterialSearch: function index (resolve) {
      require(['@/components/MaterialSearch.vue'], resolve)
    }
  },
  props:{
    mate: Object
  },
  data(){
    return{
      headForm: {},           // 新建Bom 头部表单信息
      labelPosition: 'right',   // label位置
      orgUnitOptions: [],       // 库存组织选项列表
      materialsCodeOptions: [], // 物料编码选项列表
      rules: { // Form rules
        orgUnit:[{ required: true, message: '该输入项为必输项', disabled: false, trigger: 'change'}], // 库存组织
        materialsCode:[{ required: true, message: '该输入项为必输项', disabled: true, trigger: 'change'}], // 物料
        fromDateStr:[{ required: true, message: '该输入项为必输项', disabled: false, trigger: 'blur'}], // 日期 有效日期-开始
      },
      pickerOptions: { // 日期禁用今天之前的
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      oldMaterialsCode: '', // 物料编码切换前值
      searchDialogVisible: false,
      materialsType: '1',
      btnMaterialsCode: true
      
    }
  },
  computed: {
    labelWidth () {
      let width = '';
      if (this.mate.inline) {
        width = '100px';
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '100px';
      }else if (this.mate.labelWidth === null) {
        width = '100px';
      } else {
        width = this.mate.labelWidth;
      }
      return width;
    }
  },
  created() {
    let orgUnitId = this.mate.values.orgUnit;
    let materialsCode = this.mate.values.materialsCode;
    this.mate.fields.map((item) => { this.headForm[item.name] = item; });
    
    this.getOrgUnit();
    if (orgUnitId) {
      this.getMaterialsCode(orgUnitId);
      this.materialsCode = materialsCode;
      this.rules['materialsCode'][0].disabled = false;
      this.btnMaterialsCode = false;
    }
  },
  mounted() {
    // 初始化日期，默认为当天
    let date = this.mate.values.fromDateStr || '';
    this.mate.values.fromDateStr = date || dateInit();
  },
  methods:{
    getFromDate (value) {
      this.mate.values['fromDateStr'] = value;
    },
    /**
     * 获取库存组织 并保存到 orgUnitOptions
     * @param void
     * @return void
     */
    getOrgUnit () { 
      let _this = this;
      _this.$root.ajaxData(BOM_API.ORG_UNIT, {}, data => {
        if (data.length > 0 ){
          data.forEach(item => {
            _this.orgUnitOptions.push({
              label: item.name,
              value: item.id,
              id: item.id
            })
          });
        }
      }, 'GET');
    },
    /**
     * 获取物料编码 品名 物料类型 单位 并保存到 materialsCodeOptions
     * @param {String} id 库存组织id
     * @return void
     */
    getMaterialsCode (id) {
      let _this = this;
      _this.$root.ajaxData(`${BOM_API.MATERIALS_CODE}/${id}?type=1`, {}, data => {
        if (data.length > 0 ){
          data.forEach(item => {
            _this.materialsCodeOptions.push({
              label: item.subcode,
              value: item.id,
              name: item.name,
              category: item.materialCategory,
              unit: item.basicUnit,
              specs: item.basicSpec,
              disabled: false
            })
          });
        }
      }, 'GET');
    },
    /**
     * 改变库存组织选项 根据库存组织获取对应的物料
     * 清除或者切换选项
     * @param {String} id 库存组织id
     * @return void
     */
    changeOrgUnit (id) {
      let _this = this;
      // 改变库存组织清空物料信息
      let values = this.mate.values;
      values.materialsId = '';
      values.materialsCode = '';
      values.materialsName =  '';
      values.materialsType = '';
      values.specs = '';
      values.unit = '';
      this.rules['materialsCode'][0].disabled = false;
      this.btnMaterialsCode = false;
      
      if (id) {
        this.materialsCodeOptions = [];
        this.getMaterialsCode(id);
      }else {
        _this.$message({
          message: '请选择库存组织',
          type: 'warning'
        });
        return;
      }
    },
    /**
     * 选择物料编码
     * @param {String} id 物料id
     * @return void
     */
    changeMaterialsCode (value) {
      // Bom头部From值
      let values = this.mate.values;
      if(value){
        let obj = this.materialsCodeOptions.find(item => {
          return item.label === value;
        });
        if (obj){
          let code = obj.label;
          this.checkMaterials(code, values, obj);
        }else {
          this.$message({
            message: '该物料不是成品或者不存在',
            type: 'warning'
          });
          values.materialsCode = '';
        }
      }else{
        values.materialsId = '';
        values.materialsCode = '';
        values.materialsName = '';
        values.materialsType = '';
        values.specs = '';
        values.unit = '';
      }
    },
    /**
     * 检查物料编码是否已被占用
     * exist true 表示已存在; false 表示不存在
     * @param {String} code 物料label
     * @param {Object} valuse Bom头部From值
     * @param {Object} obj 目标物料信息
     * @return void 
     */
    checkMaterials (code, values, obj) {
      let url = BOM_API.CHECK_MATERIALS;
      let exist;
      this.$root.ajaxData(`${url}/${code}`, {}, data => {
        exist = data.data;
        if(values && obj) this.controlMaterials(exist, values, obj);
      }, 'GET');
      if (values && obj){
        values.materialsId = '';
        values.materialsCode = '';
        values.materialsName = '';
        values.materialsType = '';
        values.specs = '';
        values.unit = '';
      }else{
        return exist;
      }
    },
    /**
     * 控制Bom头物料编码
     * 如果目标物料已存在
     * 并且如果之前物料不为空把之前物料信息填回From中,否则清空物料相关信息
     * 如果目标物料没有被占用 带出相关物料信息
     * @param {Boolean} bool 是否已被占用
     * @param {Object} valuse Bom头部From值
     * @param {Object} obj 目标物料信息
     * @return void
     */
    controlMaterials (bool, values, obj) {
      if (bool){
        let oldv = this.oldMaterialsCode;
        let oldItem = this.materialsCodeOptions.find(item => {
          return item.label === oldv;
        });
        if (oldv){
          values.materialsId = oldItem.value;
          values.materialsCode = oldItem.label;
          values.materialsName = oldItem.name;
          values.materialsType = oldItem.category;
          values.specs = oldItem.category;
          values.unit = oldItem.unit;
        }else{
          values.materialsId = '';
          values.materialsCode = '';
          values.materialsName = '';
          values.materialsType = '';
          values.specs = '';
          values.unit = '';
        }
        this.$message({
          message: 'Bom已存在',
          type: 'warning'
        });
      }else{
        values.materialsId = obj.value;
        values.materialsCode = obj.label;
        values.materialsName = obj.name;
        values.materialsType = obj.category;
        values.specs = obj.specs;
        values.unit = obj.unit;
      }
    },
    
    // 弹出物料搜索框
    handleSearch () {
      this.searchDialogVisible = true
    },

    // 接收物料信息
    getMateInfo({ subcode, name, materialCategory, basicUnit, basicSpec, ...data }){
      this.checkMaterials(subcode);
      this.mate.values = { 
        ...this.mate.values, 
        'materialsCode': subcode,
        'materialsName': name,
        'materialsType': materialCategory,
        'unit': basicUnit,
        'specs': basicSpec
      }
    }
  },
  watch: {
//     'mate.values.materialsCode': {
//       handler (curVal, oldVal) {
//         this.oldMaterialsCode = oldVal;
// 　　　},
//     }
  }
}
</script>

<style scoped lang="scss">
  .el-form-item__label{
    line-height:inherit
  }
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
  .tbutton{
    margin: 3px 0;
    button {
      padding: 7px 15px;
      background-color: #fff;
      cursor: pointer;
    }
  }
  .fbutton{
    margin: 5px 0;
    button {
      padding: 7px 15px;
      background-color: #fff;
      cursor: pointer;
    }
  }
  .el-input__suffix {
    right:80px
  }
  .el-form-item--mini.el-form-item {
    margin: 6px;
  }
  .el-input--mini .el-input__inner{
    width:80%
  }
  .el-dialog__header {
    padding: 10px 10px 0;
  }
  .el-dialog__body {
    padding: 10px 10px;
  }
  .el-button--mini {
    padding: 7px 9px;
  }
  .pbutton {
    margin: 3px 0;
    button {
      padding: 7px 15px;
      background-color: #fff;
      cursor: pointer;
    }
  }
  .groupStyle /deep/ .el-input--mini .el-input__inner {
    height: 29px;
    line-height: 29px;
  }
</style>
