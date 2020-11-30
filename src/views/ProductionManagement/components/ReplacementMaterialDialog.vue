/**
 * BOM模块下新增模块
 */
<template>
  <div>
    <el-row>
      <el-form size="mini" :model="mate.replaceDetail.replaceBomHeader" label-position="right" ref="LineForm"  label-width="100">
        <!-- 父件 -->
        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="replacementMaterialForm.materialsCode.label" :prop="replacementMaterialForm.materialsCode.name">
            <el-input readonly v-model="mate.replaceDetail.replaceBomHeader.materialsCode"></el-input>
          </el-form-item>
        </el-col>
        <!-- 组件 -->
        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="replacementMaterialForm.componentCode.label" :prop="replacementMaterialForm.componentCode.name">
            <el-input readonly v-model="mate.replaceDetail.replaceBomHeader.componentCode"></el-input>
          </el-form-item>
        </el-col>
        <!-- 物料编号 -->
        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="replacementMaterialForm.serialNumber.label" :prop="replacementMaterialForm.serialNumber.name">
            <el-input readonly v-model="mate.replaceDetail.replaceBomHeader.serialNumber"></el-input>
          </el-form-item>
        </el-col>
          <!-- 有效日期 -->
        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="replacementMaterialForm.fromDateStr.label" :prop="replacementMaterialForm.fromDateStr.name">
            <el-date-picker readonly value-format="yyyy-MM-dd" type="date" v-model="mate.replaceDetail.replaceBomHeader.fromDateStr"></el-date-picker>
          </el-form-item>
        </el-col>
        <!-- 工序 -->
        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="replacementMaterialForm.procedures.label" :prop="replacementMaterialForm.procedures.name">
            <el-input readonly v-model.lazy="mate.replaceDetail.replaceBomHeader.procedures"></el-input>
          </el-form-item>
        </el-col>
        <!-- 数量 -->
        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="replacementMaterialForm.used.label" :prop="replacementMaterialForm.used.name">
            <el-input readonly v-model.lazy="mate.replaceDetail.replaceBomHeader.used"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    
    <el-row>
      <div>
        <el-button size="mini" class="el-icon-plus" @click="addItem">{{$t('BUTTON_TEXT.ADD')}}</el-button>
      </div>
      <el-row>
        <el-col :span="24">
          <el-table :data="mate.replaceDetail.replaceBomLineList" border style="width: 100%;" max-height="260">
            <!-- <el-table-column fixed="left" type="selection" width="50" id="tableSel"></el-table-column> -->
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column  prop="componentCode" label="替代组件" width="250" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                <!-- <span v-if="!scope.row.isEgdit">{{scope.row.componentCode}}</span> -->
                <el-select filterable :disabled="!scope.row.isEgdit" size="mini" placeholder="请选择" v-model="scope.row.componentCode"  @change="changeComponentCode(scope.row.componentCode)">
                  <el-option :disabled="item.disabled" v-for="(item, index) in componentCodeOptions" :key="index" :label="item.name" :value="item.value">
                    <span style="float: left;margin-right:30px">{{ item.label }}</span>
                    <span style="float: right; color:#212121; font-size: 13px">{{ item.name }}</span>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="componentName" min-widtn="150" label="说明" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="!scope.row.isEgdit">{{scope.row.componentName}}</span>
                <el-input size="mini" disabled readonly v-if="scope.row.isEgdit" v-model="scope.row.componentName" style="height: 28px;"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="unit" min-widtn="80" label="单位" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="!scope.row.isEgdit">{{scope.row.unit}}</span>
                <el-input size="mini" disabled readonly v-if="scope.row.isEgdit" v-model="scope.row.unit" style="height: 28px;"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="used" min-widtn="80" label="用量" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="!scope.row.isEgdit">{{scope.row.used}}</span>
                <el-input size="mini" v-if="scope.row.isEgdit" v-model="scope.row.used" style="height: 28px;" oninput = "value=value.replace(/[^\d.]/g,'')" @change="usedChange" ref="re_used"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="usageReciprocal" min-widtn="100" label="用量的倒数" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="!scope.row.isEgdit">{{scope.row.usageReciprocal}}</span>
                <el-input size="mini" v-if="scope.row.isEgdit" v-model="scope.row.usageReciprocal" style="height: 28px;" oninput = "value=value.replace(/[^\d.]/g,'')" @change="usageReciprocalChange" ref="re_usageReciprocal"></el-input>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align='center' min-width="100">
              <template slot-scope="scope">
                <el-button-group>
                <el-button v-if="!scope.row.isEgdit&&scope.row.disableFlag=='1'" size="mini" type="primary" @click='edit(scope.$index,scope.row)' icon="el-icon-edit">{{$t('BUTTON_TEXT.EDIT')}}</el-button><!-- 修改 -->
                <el-button v-if="scope.row.isEgdit&&scope.row.disableFlag=='1'" size="mini" type="success" @click='editSuccess(scope.$index,scope.row)' icon="el-icon-check">{{$t('BUTTON_TEXT.SAVE')}}</el-button><!-- 保存 -->
                <el-button v-if="scope.row.disableFlag=='0'" size="mini" type="success" @click='cancelDeleteItem(scope.$index,scope.row)'>{{$t('BUTTON_TEXT.UN_DELETE')}}</el-button><!-- 取消删除 -->
                <el-button :disabled="scope.row.disableFlag=='0'" @click.native.prevent="deleteItem(scope.$index, mate.replaceDetail.replaceBomLineList)" type="danger" size="mini" icon="el-icon-delete">{{$t('BUTTON_TEXT.DELETE')}}</el-button><!-- 删除 -->
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-button size="mini" @click="replaceConfirm" type="primary">{{$t('BUTTON_TEXT.SUBMIT')}}</el-button>
        <el-button size="mini" @click="replaceCancel">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import { BOM_API } from "@/services/apis";
import { DateFormat, trimSpace, isPositivenumber } from '@/utils/util.js';
import ColumnFormatterMixin from '@/mixins/ColumnFormatterMixin';
import KBtn from '@/components/KBtn';
import Boxer from '@/components/Boxer';

export default {
  mixins: [ColumnFormatterMixin],
  components: {
    KBtn,
    Boxer,
    KTable: function index (resolve) {
      require(['@/components/KTable.vue'], resolve)
    }
  },
  props: {
    mate: Object
  },
  data(){
    return {
      replaceLineForm: {}, // 
      replaceDetail: {},
      replacementMaterialForm: {}, // 替换料弹窗表单
      lineObject: {},              // 行列表
      lineRows: [],                // 替换料行数据
      lineRowsContrast: [],        // 替换料行数据 对比用
      componentCodeOptions: [],    // 组件选项列表
      row:{},                      // 当前编辑行
      isSaveLine: true,            // 控制一次只能操作一条数据
      oriLine: null
    }
  },
  computed: {},
  created () {
    // Form Header  头部表单
    this.mate.mateFormerHeader.fields.map((item) => { this.replacementMaterialForm[item.name] = item; });

    this.replaceLineForm = this.mate.mateFormerLine;
    this.replaceLineForm.fields.map((item) => { this.lineObject[item.name] = item; });
    this.lineRows = this.mate.replaceDetail.replaceBomLineList;
    this.lineRowsContrast = Object.assign([],this.mate.replaceDetail.replaceBomLineList);
    // 获取替代组件
    this.getMaterialsCode();
  },
  mounted() {
  },
  methods:{
    /**
     * 计算用量的倒数
     * @param {String} value 默认传参
     * @return void
     */
    usedChange (value) {
      let curValue = Number(value);
      if(curValue==0) {
        // this.row.usageReciprocal = value;
        this.$set(this.row, 'usageReciprocal', value);
      }else{
        let num = (1/curValue).toFixed(5); // 保留五位小数
        // this.row.used = curValue.toFixed(5); // 保留五位小数
        // this.row.usageReciprocal = num;
        this.$set(this.row, 'used', curValue.toFixed(5));
        this.$set(this.row, 'usageReciprocal', num);
      }
    },
    /**
     * 计算用量
     * @param {String} value 默认传参
     * @return void
     */
    usageReciprocalChange (value) {
      let curValue = Number(value);
      if(curValue==0) {
        // this.row.used = value;
        this.$set(this.row, 'used', value);
      }else{
        let num = (1/curValue).toFixed(5); // 保留五位小数
        // this.row.usageReciprocal = curValue.toFixed(5); // 保留五位小数
        // this.row.used = num;
        this.$set(this.row, 'usageReciprocal', curValue.toFixed(5));
        this.$set(this.row, 'used', num);
      }
    },
    /**
     * 获取替换组件 说明 单位 并保存到 componentCodeOptions
     * @param {String} id 组织机构id 
     * @return void
     */
    getMaterialsCode (id) {
      let _this = this;
      let orgUnit = this.mate.orgUnit || id;
      _this.$root.ajaxData(`${BOM_API.MATERIALS_CODE}/${orgUnit}?type=2`, {}, data => {
        if (data.length > 0 ){
          data.forEach(item => {
            _this.componentCodeOptions.push({
              label: item.subcode,
              value: item.id,
              name: item.name,
              category: item.materialCategory,
              unit: item.basicUnit,
              disabled: false
            })
          });
          // 过滤替换料组件(把要替换的组件去掉)和父组件 
          let curComponentCode = _this.mate.replaceDetail.replaceBomHeader.componentCode;
          let parentComponentCode = _this.mate.replaceDetail.replaceBomHeader.materialsCode;
          _this.componentCodeOptions = _this.componentCodeOptions.filter(item =>{
            return item.label != curComponentCode && item.label != parentComponentCode;
          })
        }
      }, 'GET');
    },
    /**
     * 选择组件 
     * 选择组件 带出组件说明和单位 
     * 清空组件时 清空组件说明和单位
     * @param {String} value 组件的id 自动获取
     * @return void
     */
    changeComponentCode (value) {
      // 先验证组件是否已被占用 不能重复选择
      let row = this.row;
      if(value){ // 如果改变组件
        // 取组件列表中当前组件
        let obj = this.componentCodeOptions.find(item => {
          return item.value === value;
        });
        row.componentId = obj.value;
        row.componentCode = obj.label;
        row.componentName = obj.name;
        row.materialsType = obj.category;
        row.unit = obj.unit;
        this.controlComponentOptions(value);// 禁用已被占用选项
      }else{ // 如果清空组件
        row.componentId = '';
        row.componentCode = '';
        row.componentName = '';
        row.materialsType = '';
        row.unit = '';
        this.controlComponentOptions(value);// 恢复选项
      }
    },
    /**
     * 禁用/恢复组件列表选项
     * 禁用已被选过的选项
     * @param {String} code 编码
     * @return void
     */
    controlComponentOptions(code){
      let _this = this;
      this.componentCodeOptions.forEach(item =>{
        item.disabled = false;
      });
      this.mate.replaceDetail.replaceBomLineList.forEach(line =>{
        let componentItem = _this.componentCodeOptions.find(item =>{
          return item.label == line.componentCode;
        });
        if (componentItem) componentItem.disabled = true;
      })
    },
    /**
     * 新增行 新增替代组件行 
     * @param void
     * @return void
     */
    addItem() {
      if(this.isSaveLine){
        this.isSaveLine = false;
        let item = {
          id: null,
          lineId: this.mate.lineId,
          componentCode: null,
          componentName: null,
          unit: null,
          used: null,
          usageReciprocal: null,
          isEgdit: true,
          disableFlag: 1
        };
        this.row = item;
        this.mate.replaceDetail.replaceBomLineList.push(item);
        // this.lineRows.push(item);
        this.controlComponentOptions();
      }else{ 
        this.$message({
          type: 'warning',
          message: '请先保存当前行再继续新增'
        });
      }
    },
    /**
     * 删除当前行
     * @param {String} index 当前行索引
     * @param {Object} row 当前行信息
     * @return void
     */
    deleteItem (index, lineRows) {
      // 如果删除的是当前编辑行 改变isSaveLine状态
      if(lineRows[index].isEgdit) this.isSaveLine = true;
      // 删除当前行 后台需要传标识来删除
      this.mate.replaceDetail.replaceBomLineList[index].disableFlag = '0';
      this.controlComponentOptions();
    },
    /**
     * 取消删除
     * 改变标识状态
     * @param {String} index 当前行索引
     * @param {Object} row 当前行信息
     * @return void
     */
    cancelDeleteItem (index, lineRows) {
      this.mate.replaceDetail.replaceBomLineList[index].disableFlag = '1';
    },
    //编辑数据
    /**
     * 编辑行 对行替代组件、用量、用量的倒数 字段进行编辑
     * @param {String} index 当前行索引
     * @param {Object} row 当前行信息
     * @return void
     */
    edit(index, row) {
      if(this.isSaveLine){
        this.isSaveLine = false;
        this.$set(row, 'isEgdit', true);
        this.row = row;
        this.controlComponentOptions();
      }else{
        this.$message({
          type: 'warning',
          message: '请先保存其他行再继续新增'
        });
      }
    },
    /**
     * 编辑行保存 对 替代组件、用量、用量的倒数进行验证不能为空
     * @param {String} index 当前行索引
     * @param {Object} row 当前行信息
     * @return void
     */
    editSuccess(index, row) {
      if(row.componentCode == '' || row.componentCode == null){
        this.$message({
          type: 'warning',
          message: '替代组件不能为空'
        });
        return;
      }else if(row.used == '' || row.used == null){
        this.$message({
          type: 'warning',
          message: '用量不能为空'
        })
        return;
      }else if(row.usageReciprocal == '' || row.usageReciprocal == null){
        this.$message({
          type: 'warning',
          message: '用量的倒数不能为空'
        })
        return;
      }
      this.isSaveLine = true;
      this.$set(row, 'isEgdit', false); 
    },
    /**
     * 替换料提交保存
     * @param void
     * @return void
     */
    replaceConfirm() {
      if(this.isSaveLine){
        this.isSaveLine = false;
        let url = BOM_API.SAVE_REPLACE_MATERIALS;
        // this.mate.replaceDetail.replaceBomLineList = this.lineRows;
        let replaceData = this.mate.replaceDetail;
        this.$root.ajaxData(url, replaceData, data => {
          if (data.length > 0 ){
            
          }
          this.lineRows = [];
        }, 'POST');
        this.$emit('replaceConfirm');
      }else{
        this.$message({
          type: 'warning',
          message: '不能提交空行'
        });
      }
    },
    /**
     * 替换料取消
     * @param void
     * @return void
     */
    replaceCancel(){
      this.$confirm(this.$t('TIPS_WARNING.UN_SAVE_TIPS'), this.$t('TITLE_TEXT.TIPS'), {
        confirmButtonText: this.$t('BUTTON_TEXT.CONFIRM'), // 确认
        cancelButtonText: this.$t('BUTTON_TEXT.CANCEL'), // 取消
        type: 'warning'
      }).then(() => {
        this.lineRows = [];
        this.isSaveLine = true;
        this.$emit('replaceCancel');
      }).catch(() => { });
    }
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
  
  .el-table .cell, .el-table th>div {
    padding-right: 0;
    /* padding-left: 25px; */
  }
</style>
