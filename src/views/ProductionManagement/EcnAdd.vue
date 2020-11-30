/**
 * BOM模块下新增模块
 */
<template>
  <div>
    <!-- 头部button Start-->
    <h-btn :btns="['提交', '保存', '取消']" @click="handleBtns"/>
    <!-- 头部button End-->
    <!-- 头部Form Start-->
    <header-form :mate="mate.mateFormerHeader" ref="EcnAddHeaderForm" @bomLineList="setBomLineList" @materialsCode="setMaterialsCode" @clearEcnLineList="clearEcnLineList" />
    <!-- 头部Form End-->
    <!-- 底部 lineList Start-->
    <KTable
      :mate="mate.mateListLine"
      :height="maxHeight"
      @actionSelected="handleSelected"
      @action="handleKtable"
      :toSort="toSort"
    />
    <!-- 底部 lineList End-->
    <!-- 新增行弹窗 Start -->
    <el-dialog title="填写Ecn明细单" width="80%" v-if="dialogRender" :visible.sync="dialogFormVisible"  :before-close="lineDialogClose" >
      <el-row>
        <el-form
          size="mini"
          :model="dialogForm.values"
          label-position="right"
          ref="LineForm"
          :rules="rules"
          :label-width="labelWidth"
        >
          <!-- 活动 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject.action.label" :prop="dialogObject.action.name">
              <dict-selected
                v-model="dialogForm.values.action"
                dictType="ecnAction"
                :initValue="dialogForm.values.action"
                @input="actionStateChange"
                :rowId="showDict"
              ></dict-selected>
            </el-form-item>
          </el-col>
          <!-- 物料序号 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item
              :label="dialogObject.serialNumber.label"
              :prop="dialogObject.serialNumber.name"
            >
              <el-input :disabled="rules.serialNumber[0].disabled"  v-model="dialogForm.values.serialNumber"></el-input>
            </el-form-item>
          </el-col>
          <!-- 工序 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item
              :label="dialogObject.procedures.label"
              :prop="dialogObject.procedures.name"
            >
              <el-input :disabled="rules.procedures[0].disabled" v-model="dialogForm.values.procedures"></el-input>
            </el-form-item>
          </el-col>
          <!-- 组件 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item
              :label="dialogObject.componentCode.label"
              :prop="dialogObject.componentCode.name"
            >
              <el-select
                clearable
                filterable
                v-model="dialogForm.values.componentCode"
                @change="changeComponentCode(dialogForm.values['componentCode'])"
                :disabled="rules.componentCode[0].disabled"
              >
                <el-option
                  :label="mItem.name"
                  :value="mItem.value"
                  v-for="(mItem,index) of componentCodeOptions"
                  :key="index"
                >
                  <span style="float: left;margin-right:30px">{{ mItem.label }}</span>
                  <span style="float: right; color:#212121; font-size: 13px">{{ mItem.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 物料说明 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item
              :label="dialogObject.componentName.label"
              :prop="dialogObject.componentName.name"
            >
              <el-input disabled readonly v-model="dialogForm.values.componentName"></el-input>
            </el-form-item>
          </el-col>
          <!-- 物料类型 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item
              :label="dialogObject.materialsType.label"
              :prop="dialogObject.materialsType.name"
            >
              <el-input disabled readonly v-model="dialogForm.values.materialsType"></el-input>
            </el-form-item>
          </el-col>
          <!-- 版本 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject.version.label" :prop="dialogObject.version.name">
              <el-input disabled readonly v-model="dialogForm.values.version"></el-input>
            </el-form-item>
          </el-col>
          <!-- 单位 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject.unit.label" :prop="dialogObject.unit.name">
              <el-input disabled readonly v-model="dialogForm.values.unit"></el-input>
            </el-form-item>
          </el-col>
          <!-- 用量 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject.used.label" :prop="dialogObject.used.name">
              <el-input
                v-model.lazy="dialogForm.values.used"
                oninput="value=value.replace(/[^\d.]/g,'')"
                @change="usedChange"
                ref="used"
                :disabled="rules.used[0].disabled"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- 用量的倒数 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item
              :label="dialogObject.usageReciprocal.label"
              :prop="dialogObject.usageReciprocal.name"
            >
              <el-input
                v-model.lazy="dialogForm.values.usageReciprocal"
                oninput="value=value.replace(/[^\d.]/g,'')"
                @change="usageReciprocalChange"
                ref="usageReciprocal"
                :disabled="rules.usageReciprocal[0].disabled"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- 良率 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject.yieldRate.label" :prop="dialogObject.yieldRate.name">
              <el-input
                v-model="dialogForm.values.yieldRate"
                oninput="value=value.replace(/[^\d.]/g,'')"
                :disabled="rules.yieldRate[0].disabled"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- 有效日期-开始 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item
              :label="dialogObject.fromDateStr.label"
              :prop="dialogObject.fromDateStr.name"
            >
              <el-date-picker
                :picker-options="pickerOptions"
                clearable
                v-model="dialogForm.values.fromDateStr"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :disabled="rules.fromDateStr[0].disabled"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 有效日期-结束 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject.toDateStr.label" :prop="dialogObject.toDateStr.name">
              <el-date-picker
                disabled
                v-model="dialogForm.values.toDateStr"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 已实施 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item
              :label="dialogObject.deployFlag.label"
              :prop="dialogObject.deployFlag.name"
            >
              <el-checkbox disabled v-model="dialogForm.values.deployFlag"></el-checkbox>
            </el-form-item>
          </el-col>
          <!-- 位号 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject.fileds.label" :prop="dialogObject.fileds.name">
              <el-input :disabled="rules.fileds[0].disabled" v-model="dialogForm.values.fileds"></el-input>
            </el-form-item>
          </el-col>
          <!-- 备注 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject.remarks.label" :prop="dialogObject.remarks.name">
              <el-input :disabled="rules.remarks[0].disabled" type="textarea" v-model="dialogForm.values.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row type="flex" justify="start" >
        <el-button size="mini" @click="materielConfirm" type="primary">确 定</el-button>
        <el-button size="mini" @click="lineDialogClose">取 消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import ColumnFormatterMixin from "@/mixins/ColumnFormatterMixin"
import SERVICES from "@/services"
import { BOM_API,ECN_API,BASE_API } from "@/services/apis"
import DictStore from '@/store/dict-store.js'

export default {
  mixins: [ColumnFormatterMixin],
  components: {
    HBtn: function index(resolve){
      require(["@/components/Button/HBtn.vue"], resolve);
    },
    KTable: function index(resolve) {
      require(["@/components/KTable.vue"], resolve);
    },
    HeaderForm: function index(resolve) {
      require(["./components/EcnAddHeaderForm"], resolve);
    },
    'dict-selected': function index (resolve) {
      require(['@/components/DictSelected.vue'], resolve)
    }
  },
  props: {
    mate: Object
  },
  data() {
    return {
      maxHeight: 380,
      toSort: true,              // 是否本地排序 一般用于没有分页的列表
      showDict: '',              // 数字词典是否禁用 '1'/'0'
      bomLineOptions: [],        // bom行列表  活动失效时加载
      materialsCodeOptions: [],  // 物料编码列表  活动新增时加载
      dictEcnActionOptions: [],  // 活动数字词典下拉列表
      bomList: [],
      dialogRender: true,        // 用作强制重新渲染弹窗
      dialogFormVisible: false,  // 新增行弹窗是否显示
      dialogForm: {},            // 新增行弹窗表单
      bomHeaderForm: {},         // 新建Bom头部表单
      lineList: {},              // 新建Bom底部行
      dialogObject: {},          // 新增行弹窗表单信息
      componentOptions: [],      // 组件options选项列表
      objectColumns: {},
      dialogVisible: false,
      applicantOptions: [],
      bomId: "",
      componentCodeOptions: [], // 组件选项列表
      stringValArr: ['version','serialNumber','used','usageReciprocal','yieldRate'], // 需要将后台对应字段的值转为字符串 表单校验字符串类型
      rules: {
        action:[{ required: true, message: "该输入项为必输项", trigger: "change", disabled: false }], // 活动
        version: [{}], // 版本
        fromDateStr: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }], // 日期 有效日期-开始
        componentCode:[{ required: true, message: '该输入项为必输项', trigger: 'blur'}], // 组件
        procedures: [{disabled: false }], // 工序
        used: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }], // 用量
        usageReciprocal: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }], // 用量的倒数
        yieldRate: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }], // 良率
        serialNumber:[{disabled: false}], // 物料序号
        remarks:[{disabled: false}],// 备注
        fileds:[{disabled: false}] // 位号
      },
      selectedLines: [],
      itemId: null,
      orgUnit: "", // 组织机构
      pickerOptions: {
        // 日期禁用今天之前的
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      isAction: false, // 当前为活动 新增/失效 操作
      isActionChange: false, // 是否活动改变 新增/失效 
      isEdit: false, // 当前行是否在编辑
      isDisabled: false, // 活动是否是失效
      replacementMaterialObjBackup: {} // 替换料暂存
    };
  },
  computed: {
    labelWidth: function() {
      let width = "";
      if (this.mate.inline) {
        // width = undefined
        width = "100px";
      } else if (typeof this.mate.labelWidth === "undefined") {
        width = "100px";
      } else {
        width = this.mate.labelWidth;
      }
      return width;
    },
    actionWidth() {
      // return this.mate.mateListLine.actions.length * 60 + 30
    }
  },
  created() {
    let mate = this.mate;
    this.formatterBefore(mate.mateListLine.columns);
    // Form Header 新建Ecn 头部表单
    mate.mateFormerHeader.fields.map(item => {
      this.bomHeaderForm[item.name] = item;
    });
    // Form Line 新建Ecn 底部行
    this.lineList = mate.mateListLine;
    this.lineList.columns.map(item => {
      this.objectColumns[item.name] = item;
    });
    // Form Line DialogList 新建Ecn 新增底部行弹窗表单
    this.dialogForm = mate.mateFormerLine;
    this.dialogForm.fields.map(item => {
      this.dialogObject[item.name] = item;
    });
    // Ecn编辑
    let ecnDetail = mate.ecnDetail;
    let listLineRows = ecnDetail ? ecnDetail.ecnLineList : [];
    let mateFormerHeaderValues = ecnDetail ? ecnDetail.ecnHeader : {};
    if (ecnDetail) {
      mateFormerHeaderValues = this.typeConver(mateFormerHeaderValues);
      this.bomId = ecnDetail.ecnHeader.bomId;
      this.orgUnitId = mateFormerHeaderValues.orgUnit;
      listLineRows = this.initLineData(listLineRows);
      mate.mateListLine.rows = listLineRows;
      mate.mateFormerHeader.values = mateFormerHeaderValues;
    }
  },
  methods: {
    /** 头部按钮事件
     * @param {String} name 按钮名称
     * @return {Function} 按钮事件
     */
    handleBtns(name) {
      const btnEvents = {
        // 提交按钮
        submit: () => this.handleSubmit(),
        // 提交按钮
        save: () => this.saveEcn(),
        // 取消按钮
        cancel: () => this.backward(),
        // 重置按钮
        reset: () => this.handleReset(),
        // 默认
        default: () => { return }
      }
      return (btnEvents[name] || btnEvents.default)();
    },
    /**
     * 数据类型转换
     * Number 转 String
     * @params {Object} data 表单数据
     * @return {Object} data 表单数据
     */
    typeConver (data) {
      this.stringValArr.forEach(item =>{
        Object.keys(data).forEach(res =>{
          if (res==item){
            data[res] = String(data[res]);
          }
        })
      })
      data.checkState = data.ployFlag === 1 ? true : false;
      return data
    },
    /**
     * 初始化行数据
     * 添加索引 从 1 开始
     * 已实施状态赋值
     * @params {Object} data 行数据
     * @return {Object} data 行数据
     */
    initLineData (data) {
      data.forEach((item,index) =>{
        // 设置索引 从 1 开始
        item.index = index + 1;
        // 已实施的组状态
        item.checkState = item.deployFlag === 1 ? true : false;
      })
      return data;
    },
    /**
     * 头部表单数据转换
     * 后台穿回来新版本为数字 为必填项 表单校验必填无法校验数字 
     * @params {Object} data 表单头部数据
     * @return {Object} data 表单头部数据
     */
    formHeaderDataConver (data) {
      data.version = String(data.version);
      return data;
    },
    /**
     * 活动状态改变
     * 新增 “ecnAction_add” 取消禁用表单
     * 失效 “ecnAction_disable” 禁用表单
     */
    actionStateChange (action) {
      let _this = this;
      if(action === "ecnAction_add" || action === ""){ // 活动为新增
        if (action === "ecnAction_add") {
          // this.clearDialogFrom();
          this.componentCodeOptions = this.materialsCodeOptions;
          // if(this.isAction) this.isActionChange = true;
          let values = this.mate.mateFormerLine.values;
          let bomSubLineLen = this.bomLineOptions.length;
          let ecnSubLineLen = this.mate.mateListLine.rows.length;
          values.serialNumber = (bomSubLineLen + ecnSubLineLen) * 10 + 10;
          values.serialNumber = String(this.createNum(values.serialNumber));
          values['componentCode'] = '';
        }
        if (action === ""){
          this.resetDialogFrom();
          this.componentCodeOptions = [];
        }
        // 取消禁用表单
        Object.keys(this.rules).forEach(item =>{
          if(_this.rules[item][0].disabled === true) _this.rules[item][0].disabled = false;
          if(_this.rules[item][0].required === false) _this.rules[item][0].required = true;
        })
      }else if(action === "ecnAction_disable" ){ // 活动为失效
        this.componentCodeOptions = this.bomLineOptions;
        // if(this.isAction) this.isActionChange = true;
        // 禁用表单
        Object.keys(this.rules).forEach(item =>{
          if(_this.rules[item][0].disabled === false) _this.rules[item][0].disabled = true;
          if(_this.rules[item][0].required === true) _this.rules[item][0].required = false;
        })
        this.rules['componentCode'][0].required = true;
        this.mate.mateFormerLine.values['componentCode'] = '';
      }
    },
    /**
     * 控制表单项是否禁用
     * 点活动按钮的时候如果当前行有行id(保存过)不能对表单进行修改
     * 点新增可以手动填写表单
     * @param {String} action 活动字段的值
     * @return void
     */
    diabledFormControl (action) {
      let _this = this;
      Object.keys(this.rules).forEach(item =>{
        if(_this.rules[item][0].disabled === false && action) _this.rules[item][0].disabled = true;
        else if (_this.rules[item][0].disabled === true && !action) _this.rules[item][0].disabled = false;
        if (_this.rules[item][0].required === true && action) _this.rules[item][0].required = false;
        else if (_this.rules[item][0].required === false && !action) _this.rules[item][0].required = true;
      })
    },
    /**
     * bom 行列表
     */
    setBomLineList (data) {
      this.bomLineOptions = data;
    },
    /**
     * 物料编码列表
     */
    setMaterialsCode (data) {
      this.materialsCodeOptions = data;
    },
    setBomSubLine(data){
      this.bomList = data;
      if (!data.length > 0) return
      data.forEach(item => {
        item.deployFlag === 1 ? item.checkState = true : item.checkState = false;
      })
      this.mate.mateListLine.rows = data;
    },
    /**
     * 计算用量的倒数
     * @param {String} value 默认传参
     * @return void
     */
    usedChange(value) {
      let curValue = Number(value);
      if (curValue == 0) {
        this.$set(this.mate.mateFormerLine.values, 'usageReciprocal', value);
      } else {
        let num = (1 / curValue).toFixed(5); // 保留五位小数
        // this.mate.mateFormerLine.values.used = curValue.toFixed(5); // 保留五位小数
        // this.mate.mateFormerLine.values.usageReciprocal = num;
        this.$set(this.mate.mateFormerLine.values, 'used', curValue.toFixed(5));
        this.$set(this.mate.mateFormerLine.values, 'usageReciprocal', num);
      }
    },
    /**
     * 计算用量
     * @param {String} value 默认传参
     * @return void
     */
    usageReciprocalChange(value) {
      let curValue = Number(value);
      if (curValue == 0) {
        this.$set(this.mate.mateFormerLine.values, 'used', value);
      } else {
        let num = (1 / curValue).toFixed(5); // 保留五位小数
        // this.mate.mateFormerLine.values.usageReciprocal = curValue.toFixed(5); // 保留五位小数
        // this.mate.mateFormerLine.values.used = num;
        this.$set(this.mate.mateFormerLine.values, 'usageReciprocal', curValue.toFixed(5));
        this.$set(this.mate.mateFormerLine.values, 'used', num);
      }
    },
    /**
     * 有效日期-开始 选择日期的时候,把日期保存到mateFormerLine的values中去
     * @param {String} value 默认传参
     * @return void
     */
    getFromDate(value) {
      this.mate.mateFormerLine.values["fromDateStr"] = value;
    },
    /**
     * 有效日期-结束 选择日期的时候,把日期保存到mateFormerLine的values中去
     * @param value 默认传参
     * @return void
     */
    getToDate(value) {
      this.mate.mateFormerLine.values["toDateStr"] = value;
    },
    /**
     * 数据转换
     */
    convertDate(date) {},
    /**
     * 提交表单数据
     * @param void
     * @return void
     */
    handleSubmit() {
      let mate = {};
      let _this = this;
      this.$refs.EcnAddHeaderForm.$refs["headerForm"].validate(valid => {
        if (valid) {
          mate = this.saveData();
          if (!mate) return;
          SERVICES.ECN.saveEcn(mate).then((res) =>{
            let status = res.status; 
            if(status === 200){
              this.$root.monitor({url: BASE_API.ECN_LIST});
            }
          });
        }
      });
    },
    /**
     * 保存 Ecn
     * @param void
     * @return void
     */
    saveEcn () {
      let mate = {};
      let _this = this;
      _this.$refs.EcnAddHeaderForm.$refs["headerForm"].validate(valid => {
        if (valid) {
          mate = this.saveData();
          if (!mate) return;
          SERVICES.ECN.saveEcn(mate).then(res =>{
            let ecnId = res.data.data;
            if(ecnId){
              SERVICES.ECN.upDateEcn(ecnId).then(res =>{
                if (res.data.mate) _this.updateDate(res.data.mate);
              })
            }
          });
        }
      });
    },
    /**
     * 提取提交和保存 公共代码
     * 需要传给后台的数据
     * @params void
     * @return {Object} mate 头部数据和行数据
     */
    saveData () {
      let mate = {};
      let values = this.mate.mateFormerHeader.values;
      values.status = "SAVE";
      // 后台需要标识 有效状态 1:有效   默认为 1
      values.disableFlag = '1';
      mate.ecnHeader = values;
      mate.ecnLineList = this.mate.mateListLine.rows;
      if (mate.ecnLineList.length < 1) {
        // 保存的时候明细行不能为空
        this.$message({
          type: "warning",
          message: "明细行不能为空"
        });
        return false;
      }
      return mate
    },
    /**
     * 取消返回Ecn List页面
     * @param void
     * @return void
     */
    backward() {
      this.$root.monitor({ url: `${ECN_API.ECN_LIST}` });
    },
    clearCode() {
      let values = this.mate.mateFormerHeader.values;
      values.materials_name = "";
      values.materialsType = "";
      values.unit = "";
    },
    lineSelected(val) {
      this.selectedLines = val;
    },
    /**
     * checkbox 勾选计算 拿到勾选的序号数组
     * @param {Object} 勾选数据
     * @return void
     */
    handleSelected(val) {
      this.lineSelected(val);
      // 第一步就是要清空selectedIDS里面的数据
      this.selectedIds = [];
      // map方法也可以
      val.map(item => this.selectedIds.push(item.serialNumber));
      // 每次点击都会执行这个函数，要点击两下的时候，this.selectedIds里面包括了前面一次的数据，所以会有重复，要去重
      var arr = [];
      var json = {};
      for (var i = 0; i < this.selectedIds.length; i++) {
        if (!json[this.selectedIds[i]]) {
          json[this.selectedIds[i]] = 1;
          arr.push(this.selectedIds[i]);
        }
      }
      this.selectedIds = arr;
    },
    /**
     * 公共模块 KTable 按钮事件
     * @param {Object} btn 当前按钮信息
     * @param {Object} row 当前行信息
     * @return void
     */
    handleKtable(btn, row) {
      this.row = row;
      this.btn = btn;
      this.orgUnit = this.mate.mateFormerHeader.values.orgUnit;
      let action = btn.action;
      let orgUnit = this.orgUnit;
      let bomId = this.bomId;
      let _this = this;
      switch(action){
        case 'addLine': // 活动 新增/失效
          this.addLine();
          break;
        case 'editLine': // 编辑行
          this.editLine();
          break;
        case 'deleteLine': // 删除行
          this.deleteLine();
          break;
      }
    },
    /**
     * 新增行
     * @param void
     * @return void
     * 
     */
    addLine () {
      this.isAction = true;
      this.diabledFormControl();
      this.showDict = 0;
      let values = this.mate.mateFormerHeader.values;
      if (
        values.materialsCode === null ||
        values.materialsCode === "" 
      ) {
        this.$message({
          type: "warning",
          message: "请填写产品料号"
        });
        return;
      }
      this.componentCodeOptions = []; // 组件列表
      this.materialData = [];
      this.lineDialogShow(); // 显示弹窗
      this.clearDialogFrom(this.mate.mateFormerLine.values);
    },
    editLine () {
      // 编辑行
      if (this.selectedLines.length !== 1) {
        this.$message({
          message: this.$t("seladata"),
          type: "warning"
        });
        return;
      }
      let action = this.selectedLines[0].action;
      this.actionStateChange(action);
      this.showDict = 1;
      this.rules.action[0].required = false;
      this.lineDialogShow();
      if (action === "ecnAction_add") {
        this.componentCodeOptions = this.materialsCodeOptions;
      }else if(action === "ecnAction_disable"){
        this.componentCodeOptions = this.bomLineOptions;;
      }else{
        this.componentCodeOptions = [];
      }
      this.selectedLines[0] = this.typeConver(this.selectedLines[0]);
      this.mate.mateFormerLine.values = Object.assign({}, this.selectedLines[0]);
    },
    deleteLine () {
      let _this = this;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let selectedLines = _this.selectedLines;
        let selectedIds = _this.selectedIds;
        // 行数据
        let listLineRows = _this.mate.mateListLine.rows;
        // 先过滤删除没有行id的数据
        selectedLines = selectedLines.filter(item=> !!item.id );
        // 过滤删除的行 剩下没有删除的
        selectedIds.forEach(item => {
          listLineRows = listLineRows.filter(line => {
            return line.serialNumber != item;
          });
        });
        // 需要删除的行的id数组
        let rowId = { id: selectedLines.map(item => item.id) };
        // 删除行的接口
        let url = BOM_API.BOM_DELETE_LINE;
        // 删除之后，就将剩余从新排序
        for (let l = 0; l < listLineRows.length; l++) {
          listLineRows[l].index = 10 * l + 1;
        }
        _this.initLineData(listLineRows);
        // 如果删除行有行id就向后台请求删除
        if (rowId.id.length > 0) {
          SERVICES.ECN.deleteEcnLine(rowId.id).then(() =>{
            //重新渲染删除后的行列表
            _this.mate.mateListLine.rows = listLineRows;
            // 保存数据 重新排序后的
            _this.saveEcn();
          })
        } else {
          _this.mate.mateListLine.rows = listLineRows;
          _this.saveEcn();
        }
      }).catch(() => {
        _this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    /**
     * 物料序号检查
     * 在bom 物料行中是否已存在
     * 在ecn 行中是否已存在
     * 两个判断条件 必须都满足
     * @params {Number} num  物料序号
     * @return {Boolean} unRepeat   true 不存在 ; false 存在
     */
    checkSerialNum (num,idx) {
      // 若在 bom 物料行中不存在 则 bomLineRepeat 为 true 反则为 false
      let bomLineClone = Object.assign([], this.bomLineOptions);
      let bomLineRepeat = bomLineClone.filter(item => idx != item.bomLineId).every(item => num != item.serialNumber);
      // 若在 ecn 行中不存在 则 lineRepeat 为 true 反则为 false
      let lineClone = Object.assign([], this.mate.mateListLine.rows);
      // 没修改物料序号过滤修改本身的行 
      let lineRepeat = lineClone.filter(item => idx != item.index).every(item => num != item.serialNumber);
      let unRepeat = bomLineRepeat&&lineRepeat&&true;
      return unRepeat;
    },
    /**
     * 刷新数据
     * 保存后刷新本页面数据
     * 并把头部表单数据 Number 转 String
     * 并设定索引和已实施勾选状态
     * @params {Object} data ecn数据
     */
    updateDate(data) {
      let detail = data.ecnDetail;
      detail.ecnHeader = this.typeConver(detail.ecnHeader);
      detail.ecnLineList = this.initLineData(detail.ecnLineList);
      this.mate.mateFormerHeader.values = detail.ecnHeader;
      this.mate.mateListLine.rows = detail.ecnLineList;
    },
    /**
     * 选择 组件 带出 物料说明 物料类型 版本 单位
     * param {String} 点击的value值
     * return void
     */
    changeComponentCode(value) {
      // this.isActionChange = false;
      // 先验证组件是否已被占用 不能重复选择
      let values = this.mate.mateFormerLine.values;
      // 如果没有被占用 就把相关信息带出来
      if (value) {
        let obj = this.componentCodeOptions.find(item => {
          return item.value === value;
        });
        // 行列表中是否有包含该组件的行
        let lineRowsExist = this.mate.mateListLine.rows.filter(item => item.componentCode === obj.label);
        if (lineRowsExist.length > 0) { // 如果有
          // 行列表中的该组件的行 活动是否是 新增
          let lineActionAdd = lineRowsExist.filter(item => item.action ==="ecnAction_add")
          // 行列表中的该组件的行 活动是否是 失效
          let lineActionDisable = lineRowsExist.filter(item => item.action ==="ecnAction_disable")
          // 当活动是失效的时候并且列表中
          if (values.action == "ecnAction_disable" && lineActionDisable.length > 0){
            this.$message({
              type: "warning",
              message: "该组件已存在，请重新选择！"
            });
            // 清除组件数据
            this.clearDialogFrom(values);
            return;
          }
          if (values.action == "ecnAction_add" && lineActionAdd.length > 0){
            this.$message({
              type: "warning",
              message: "该组件已存在，请重新选择！"
            });
            // 清除组件数据
            this.clearDialogFrom(values);
            return;
          }
        }
        // 选中组件操作
        // let obj = this.componentCodeOptions.find(item => {
        //   return item.value === value;
        // });
        values.procedures = obj.procedures || ''; //工序
        values.serialNumber = obj.serialNumber || values.serialNumber || '';// 物料序号
        values.componentCode = obj.label; // 组件
        values.componentExplain = obj.label;
        values.componentName = obj.name; // 物料说明
        values.materialsType = obj.category; // 物料类型
        values.version = obj.version || "0"; //版本 默认为 0
        values.unit = obj.unit; // 单位
        values.used = obj.used?String(obj.used) : ''; //用量
        values.usageReciprocal = obj.usageReciprocal?String(obj.usageReciprocal) : ''; // 用量的倒数
        values.yieldRate = obj.yieldRate?String(obj.yieldRate) : ''; // 良率
        values.fromDateStr = obj.fromDateStr || ''; //开始日期
        values.toDateStr = obj.toDateStr || ''; //结束日期
        values.fileds = obj.fileds?String(obj.fileds) : '';      // 位号
        values.remarks = obj.remarks || ''; //备注
        values.bomLineId = obj.bomLineId
      } else {
        // 清空组件操作
        this.clearDialogFrom(values);
      }
    },
    /**
     * 新建行弹窗确认
     */
    createNum (num,idx) {
      let unRepeat = this.checkSerialNum(num,idx);
      if (!unRepeat){
        num += 10;
        num = this.createNum(num,idx)
      }
      return num
    },
    /**
     * ecn 行新增/修改确认
     */
    materielConfirm(val) {
      let mate = this.mate;
      let num = this.dialogForm.values.serialNumber;
      let idx = this.dialogForm.values.index;
      let bomLineId = this.dialogForm.values.bomLineId;
      let action = this.dialogForm.values.action;
      if (!idx) idx = bomLineId;
      let unRepeat = this.checkSerialNum(num, idx);
      if (action != "ecnAction_disable" && !unRepeat) {
        this.$notify.error({
          title: "消息",
          type: 'warning',
          message: "物料序号已存在"
        });
        return
      }
      // if (this.isActionChange) {
      //   this.$message({
      //     type: "warning",
      //     message: "该组件已存在，请重新选择"
      //   });
      //   return
      // }
      this.$refs.LineForm.validate(valid => {
        if (valid) {
          let curIdx = mate.mateFormerLine.values.index;
          let values = mate.mateFormerLine.values;
          // 如果没有物料序号
          if (!num) {
            let bomSubLineLen = this.bomLineOptions.length;
            let ecnSubLineLen = mate.mateListLine.rows.length;
            // 修改行 干掉序号后处逻辑
            if (curIdx) {
              mate.mateListLine.rows.map((item, index) => {
                if (curIdx === item.index) {
                  values.serialNumber = (bomSubLineLen + ecnSubLineLen) * 10 + 10;
                  values.serialNumber = this.createNum(values.serialNumber, curIdx);
                  let mateFormerValues = Object.assign({},values);
                  // 添加disableFlag 新增line后台需要前端传标识
                  mateFormerValues.disableFlag = "1";
                  // splice将i行数据删除，并将mateFormerValues1填充进
                  mate.mateListLine.rows.splice(index, 1, mateFormerValues);
                  this.lineDialogClose();
                }
              });
            }else{
              // 新建行逻辑
              values.serialNumber = (bomSubLineLen + ecnSubLineLen) * 10 + 10;
              values.serialNumber = this.createNum(values.serialNumber);
              values.index = ecnSubLineLen + 1;
              let mateFormerValues = Object.assign({},values);
              // 添加disableFlag 新增line后台需要前端传标识
              mateFormerValues.disableFlag = "1";
              mate.mateListLine.rows.push(mateFormerValues);
              this.lineDialogClose();
            }
          } else {
            if (curIdx){
              mate.mateListLine.rows.map((item, index) => {
                if (curIdx === item.index) {
                  let mateFormerValues = Object.assign({},values);
                  // 添加disableFlag 新增line后台需要前端传标识
                  mateFormerValues.disableFlag = "1";
                  // splice将i行数据删除，并将mateFormerValues1填充进
                  // if (values.id === item.id) {
                  mate.mateListLine.rows.splice(index, 1, mateFormerValues);
                  // }
                  this.lineDialogClose();
                }
              });
            }else{
              values.index = mate.mateListLine.rows.length + 1;
              let mateFormerValues = Object.assign({},values);
              // 添加disableFlag 新增line后台需要前端传标识
              mateFormerValues.disableFlag = "1";
              mate.mateListLine.rows.push(mateFormerValues);
              this.lineDialogClose();
            }
          }
        } else {
          this.$notify.error({
            title: "消息",
            message: "数据验证未通过"
          });
        }
      });
    },
    /**
     * 清空ecn 行数据
     */
    clearEcnLineList (){
      this.mate.mateListLine.rows = [];
    },
    /**
     * 新建行弹窗取消
     */
    lineDialogClose () {
      this.lineDialogHide();
      this.reRenderLineDialog();
    },
    lineDialogOpen () {
      this.lineDialogShow();
    },
    lineDialogHide() {
      this.dialogFormVisible = false;
      this.isAction = false;
      // this.isActionChange = false;
      this.mate.mateFormerLine.values.action = ''; // 活动
      this.mate.mateFormerLine.values.serialNumber = '';// 物料序号
      this.clearDialogFrom(this.mate.mateFormerLine.values);
    },
    lineDialogShow () {
      this.dialogFormVisible = true;
    },
    reRenderLineDialog () {
      this.dialogRender = false;
      this.$nextTick(()=>{
        this.dialogRender = true;
      })
    },
    resetDialogFrom () {
      this.$refs['LineForm'].resetFields();
    },
    clearDialogFrom (values){
      // values.action = ''; //活动
      // values.serialNumber = '';// 物料序号
      values.procedures = ''; //工序
      values.componentCode = ''; // 组件
      values.componentExplain = '';
      values.componentName = ''; // 物料说明
      values.materialsType = ''; // 物料类型
      values.version = '0'; //版本 默认为 0
      values.unit = ''; // 单位
      values.used = ''; //用量
      values.usageReciprocal = ''; // 用量的倒数
      values.yieldRate = ''; // 良率
      values.fromDateStr = ''; //开始日期
      values.toDateStr = ''; //结束日期
      values.fileds = '';      // 位号
      values.remarks = ''; //备注
      values.index = null; // 索引
      values.bomLineId = ''
    }
  },
  watch: {}
};
</script>

<style scoped lang="scss">
.el-form-item__label {
  line-height: inherit;
}
.el-form--inline > * {
  margin-right: 10px;
}
.el-form-item {
  margin: 15px 20px 2px 0px;
}
.leftFloat .el-row {
  float: left;
  width: 250px;
}
.leftFloat .el-row input {
  width: 250px;
}
.leftFloat .el-form-item {
  margin: 0;
}
.leftFloat .button {
  float: left;
}
.el-form--inline .el-form-item {
  width: 200px;
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
}
.el-form-item.is-required .el-form-item__label:before {
  content: "";
}
.el-form-item.is-required .el-form-item__label:after {
  content: "*";
  color: #ff4949;
  margin-right: 4px;
}
.el-cascader {
  width: 100%;
}
.hidden {
  display: none;
}
h4 {
  margin-top: 40px;
  margin-bottom: 10px;
}
.el-select {
  width: 100%;
}
.el-date-editor.el-input {
  width: 100%;
}
.el-form--inline.el-form--label-top .el-form-item__content {
  width: 90%;
}
.leftFloat .el-form--inline .el-form-item {
  margin-right: 10px;
}
.tbutton {
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.fbutton {
  margin: 5px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.el-input__suffix {
  right: 80px;
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-input--mini .el-input__inner {
  width: 80%;
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
</style>
