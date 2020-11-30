<!-- created by hezhiqiang on 2020/05/14 -->
<!-- 入库-新增 -->
<template>
  <div>
    <!-- 头部button Start-->
    <h-btn :btns="btns" @click="handleBtns"></h-btn>
    <!-- 头部button End-->
    <!-- 头部Form Start-->
    <dynamic-form ref="headForm" 
      :mate="mate.mateFormerHeader" 
      :rules="headerFormRules" 
      :eventCfg="headerFormEventConfig"
      @events="handleEvents"></dynamic-form>
    <!-- 头部Form End-->
    <!-- 底部 lineList Start-->
    <k-table-line
      :mate="mate.mateListLine"
      @actionSelected="handleSelected"
      @btnClick="handleButtons"
      :toSort="toSort"
      ref="lineTable"
    ></k-table-line>
    <!-- 底部 lineList End-->
    <!--明细行 form-dialog Start -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="80%" :show-close="true" :close-on-click-modal="false">
      <dynamic-form ref="lineForm" 
        :mate="mate.mateFormerLine" 
        :rules="lineFormRules" 
        :eventCfg="lineFromEventConfig" 
        @events="handleEvents"></dynamic-form>
        <el-row type="flex" justify="start">
            <el-button size="mini" @click="submitForm" type="primary">{{$t('BUTTON_TEXT.CONFIRM')}}</el-button>
            <el-button size="mini" @click="lineDialogClose">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
        </el-row>
    </el-dialog>
    <!--明细行 form-dialog End -->
  </div>
</template>

<script>
import SERVICES from "@/services";
import {JHW_GOODS_MANAGEMENT_API} from '@/services/apis';
import { dateFormatter } from "@/utils/DateUtils";

export default {
  components: {
    HBtn: function index(resolve){
      require(["@/components/Button/HBtn.vue"], resolve);
    },
    DynamicForm: function index(resolve){
      require(["@/components/form/DynamicForm.vue"], resolve);
    },
    KTableLine: function index(resolve) {
      require(["@/components/table/KTableLine.vue"], resolve);
    }
  },
  props: {
    mate: Object
  },
  data() {
    return {
      status: "SAVE",            // 新建状态
      btns: ['提交','取消','重置'],      // 按钮
      isShowSearchBtn: false,    // 是否显示搜索展开按钮
      maxHeight: 300,            // 添加成员弹窗 table 的最大高度
      usersList: [],             // 责任人列表
      customerList: [],          // 客户列表
      supplierList: [],          // 供应商列表
      selectedIds: [],           // 所勾选行的序号
      selectedLines: [],         // 勾选行
      headForm: {},              // 头部表单
      lineValues: {},            // 新增行表单默认数据
      toSort: true,              // 是否本地排序 一般用于没有分页的列表
      showDict: '',              // 数字词典是否禁用 '1'/'0'
      dialogRender: true,        // 用作强制重新渲染弹窗
      dialogFormVisible: false,  // 新增行弹窗是否显示
      objectColumns: {},         // 列表行字段
      headerId: null,            // 任务 id
      isEdit: false,             // 当前行是否在编辑
      isAddLine: false,          // 是否新增行
      isEditLine: false,         // 是否修改行
      isDirty: false,            // 是否修改了数据
      dialogTitle: '',           // 新增明细行弹框标题
      params: '?listName=stock_in_list&lineList=stock_in_line_list&listFormName=stock_in_form&lineForm=stock_in_line_form', // 元数据表名
      listUrl: '/common/toList',  // 元数据接口
      // 头部表单控件规则
      headerFormRules: {
        // 创建人
        creator: [{ disabled: true}],
      },
      // 头部表单事件配置
      headerFormEventConfig: {

      },
      // 明细行表单控件规则
      lineFormRules : {
        // 入库单价（含税）
        priceInTax: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "blur"}],
        // 商品编码
        commodityCode: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "change"}],
      },
      // 明细行表单事件配置
      lineFromEventConfig: {
        // 商品编码
        commodityCode: {input: true,change: true},
        // 入库数量
        stockQuantity: {input: true},
        // 入库单价（含税）
        priceInTax: {input: true},
      },
      goodsData: [],   // 商品数据
    };
  },
  created() {
    this.init();
  },
  mounted() {
    // 入库时间默认当前时间
    let date = this.mate.mateFormerHeader.values['warehouseTime'] || '';
    this.mate.mateFormerHeader.values['warehouseTime'] = date || dateFormatter("YYYY-MM-DD HH:mm:ss");
    // 创建人默认当前登录用户
    let localStorage = window.localStorage;
    var localuser = JSON.parse(localStorage.getItem('user'));
    this.mate.mateFormerHeader.values['creator'] = (localuser.firstname + localuser.lastname);
  },
  methods: {
    /** 数据初始化
     * 初始化新增修改页面的数据
     * @param void
     * @return void
     ** 
     */
    init() {
      // 模块数据
      let mate = this.mate;
      // 行表单数据
      let mateFormLineValues = this.mate.mateFormerLine.values;
      // 行列表
      this.mate.mateListLine.columns.map(item => {
        this.objectColumns[item.name] = item;
        if (item.label === "采购单号" || item.label === "采购单行号" || item.label === "供应商名称"){
          item.isShow = false
        }
      });
      // 头表单
      mate.mateFormerHeader.fields.map((item) => { this.headForm[item.name] = item; });
      // 保存行表单默认数据
      this.lineFormValues = {...mate.mateFormerLine.values};
      // 编辑/修改 后台会传detail回来
      let detail = mate.detail;
      // 如果有 detail 说明当前操作是编辑/修改
      if (detail) {
        // 保存行列表数据
        let lineListRows = detail.lineList || [];
        // 保存头表单数据
        let mateFormerHeaderValues = detail.header || {};
        // 改变当前模块为编辑/修改状态
        this.isEdit = true;
        // 保存头部 id
        this.headerId = detail.header.id;
        this.status = mateFormerHeaderValues.status || "SAVE";
        // 初始化行列表数据 添加 index 索引等...
        lineListRows = this.initLineData(lineListRows);
        // 行列表赋值
        mate.mateListLine.rows = lineListRows;
        // 头表单赋值
        mate.mateFormerHeader.values = mateFormerHeaderValues;
      }
    },
    /** 头部按钮事件
     * @param {String} name 按钮名称
     * @return {Function} 按钮事件
     ** 
     */
    handleBtns(name) {
      const btnEvents = {
        // 提交按钮
        submit: () => this.handleSubmit(),
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
     * 公共模块 KTableLine 按钮事件
     * @param {Object} btn 当前按钮信息
     * @param {Object} row 当前行信息
     * @return void
     ** 
     */
    handleButtons(btn, row) {
      this.row = row;
      this.btn = btn;
      let action = btn.action;
      const btnEvents = {
        // 新增
        addLine: () => this.handleCreate(),
        // 默认
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)();
    },
    /**
     * 提交表单数据
     * @param void
     * @return void
     ** 
     */
    handleSubmit() {
      let mate = {};
      let _this = this;
      this.$refs['headForm'].$refs["form"].validate(valid => {
        if (valid) {
          // let isOk = this.lineEditConfirm(); // 行编辑要确认保存
          mate = _this.saveData();
          if (!mate) return;
          SERVICES.STOCK_LIST.save(mate).then((res) =>{
            let status = res.status; 
            if(status === 200){
              _this.$root.monitor({ url: `${this.listUrl}${this.params}` });
            }else if(status === 500){
              _this.$message({
                type: 'warning',
                message: '操作失败'
              })
            }
          });
        }
      });
    },
    /**
     * 提取提交和保存
     * 需要传给后台的数据
     * @params void
     * @return {Object} mate 头部数据和行数据
     ** 
     */
    saveData () {
      let mate = {};
      let values = this.mate.mateFormerHeader.values;
      values.id = this.headerId || null;
      values.state = '0';    // 新增默认状态为0/新建
      // 新建状态默认“未启动”
      values.status = this.status;
      // 后台需要标识 有效状态 1:有效   默认为 1
      values.disableFlag = '1';
      mate.head = values;
      mate.lineList = this.mate.mateListLine.rows;
      if (mate.lineList.length < 1) {
        // 保存的时候明细行不能为空
        this.$message({
          type: "warning",
          message: "明细行不能为空"
        });
        return false;
      }
      return mate;
    },
    /** 
     * 行编辑确认
     ** 
     */
    // lineEditConfirm(){
    //   let lineRows = this.mate.mateListLine.rows;
    //   let isOk = lineRows.every(row => row.edit === false);
    //   if(!isOk){
    //     this.$message.error("请先确认行编辑")
    //     return false
    //   }else{
    //     return true
    //   }
    // },
    /** 动态表单事件管理
     * @param {String} event 事件名称
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} 执行事件函数
     ** 
     */
    handleEvents(event, val, name) {
      const eventControl = {
        input: (val, name) => this.handleInput(val, name),
        change: (val, name) => this.handleChange(val, name),
        default: () => { return }
      }
      return (eventControl[event] || eventControl.default)(val, name);
    },
    /** input事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     ** 
     */
    handleInput(val, name) {
      const inputControl = {
        // 商品编码
        commodityCode: (val, name) => this.handleCode(val),
        // 入库数量
        stockQuantity: (val, name) => this.handleQuantity(val),
        // 入库单价（含税）
        priceInTax: (val) => this.handlePriceInTax(val),
        default: () => { return }
      }
      return (inputControl[name] || inputControl.default)(val);
    },
    /** change 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} change事件执行函数
     **
     */
    handleChange(val, name) {
      this.isDirty = true;
      const changeControl = {
        // 商品编码
        commodityCode: (val, name) => this.changeCode(val),
        default: () => { return }
      }
      return (changeControl[name] || changeControl.default)(val);
    },
    /**
     * 填写商品编码搜索
     * @param {String} val
     * 
     */
    handleCode (val) {
      let params= {
        'code': val
      };
      let goodsOptions = [];
      SERVICES.JHW_GOODSLIST.getListData(param).then(res => {
        this.goodsData = res.data.data.list
        if (this.goodsData.length > 0) {
          this.goodsData.forEach(item => {
            goodsOptions.push({
              label: item.code,
              name: item.name,
              value: item.code,
              key: item.id,
            })
          })
          // 商品数据保存到表单配置中
          this.mate.mateFormerLine.fields.forEach(item =>{
            if (item.name === 'commodityCode') {
              item.options = goodsOptions
            }
          })
        }
      })
    },
    /**
     * 入库数量*含税单价=获取含税金额
     * 含税金额/1+税率=不含税金额
     * @param {String} val 入库数量
     * @param {String} 含税单价
     */
    handleQuantity(val){
      if (val && this.mate.mateFormerLine.values.priceInTax) {
        let data = (val * this.mate.mateFormerLine.values.priceInTax).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,"amountIncludingTax",data)
        let data2 = (data/(1 + (this.mate.mateFormerLine.values.taxRateCode/100))).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,"amountExcludingTax",data2)
      }
    },
    /**
     * 入库数量*含税单价=获取含税金额
     * 含税金额/1+税率=不含税金额
     * @param {String} val 含税单价
     * @param {String} 入库数量
     */
    handlePriceInTax(val){
      if (val && this.mate.mateFormerLine.values.stockQuantity) {
        let data = (val * this.mate.mateFormerLine.values.stockQuantity).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,"amountIncludingTax",data)
        let data2 = (data/(1 + (this.mate.mateFormerLine.values.taxRateCode/100))).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,"amountExcludingTax",data2)
      }
    },
    /** 
     * 选择/修改商品编码
     * @param {String} val
     * @return void
     */
    changeCode(val) {
      if (!val) return;
      this.goodsData.forEach(i => {
        if (i.code === val) {
          this.$set(this.mate.mateFormerLine.values,"commodityName",i.name)
          this.$set(this.mate.mateFormerLine.values,"commoditySpecifications",i.specification)
          this.$set(this.mate.mateFormerLine.values,"unitMeasurement",i.unitId)
          this.$set(this.mate.mateFormerLine.values,"taxRateCode",i.taxRate)
        }
      })
    },
    /**
     * 取消返回List页面
     * @param void
     * @return void
     ** 
     */
    backward() {
      this.$confirm("数据未提交,是否离开当前页面?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.backToList();
      }).catch(() => {
        this.$message({
          type: "info",
          message: "取消离开"
        });
      });
    },
    /**
     *重置操作
     *
     */
    handleReset(){
        this.$refs['headForm'].$refs["form"].resetFields();
    },
    /**
     * checkbox 勾选计算 拿到勾选的序号数组
     * param {Boolean} hasSelected 是否有勾选
     * param {Array} multipleSelection 勾选数组 
     * @return void
     ** 
     */
    handleSelected(hasSelected, multipleSelection) {
      this.selectedLines = multipleSelection;
      // 第一步就是要清空selectedIds里面的所勾选行的序号
      this.selectedIds = [];
      // map方法也可以
      multipleSelection.forEach(item => this.selectedIds.push(item.index));
      // 每次点击都会执行这个函数，要点击两下的时候，this.selectedIds里面包括了前面一次的数据，所以会有重复，要去重
      let arr = [];
      arr = [...new Set(this.selectedIds)];
      this.selectedIds = arr;
    },
    /**
     * 新增行
     * @param void
     * @return void
     ** 
     */
    handleCreate () {
      this.isAddLine = true;
      // 显示弹窗
      this.dialogFormVisible = true;
      this.resetDialogForm(this.mate.mateFormerLine.values);
      this.$nextTick(() => {
        this.clearForm('lineForm');
      })
      // 获取商品数据
      this.getGoodsData();
    },
    /**
     * 获取商品信息
     * @param void
     */
    getGoodsData () {
      let param = {};
      let goodsOptions = []
      SERVICES.JHW_GOODSLIST.getListData(param).then(res => {
        this.goodsData = res.data.data.list
        if (this.goodsData.length > 0) {
          this.goodsData.forEach(item => {
            goodsOptions.push({
              label: item.code,
              name: item.name,
              value: item.code,
              key: item.id,
            })
          })
          // 商品数据保存到表单配置中
          this.mate.mateFormerLine.fields.forEach(item =>{
            if (item.name === 'commodityCode') {
              item.options = goodsOptions
            }
          })
        }
      })
    },
    /** 新增保存到后台并关闭弹窗 
     * @param {String} ids 所选行 id
     * @param {Object} rows 所选行数据
     * @return void
     ** 
     */
    handleConfirm(ids, rows) {
      if(ids){
        let data = [];
        rows.forEach(item => {
          let [smartOrderId,deliveryCount] = [item.id,item.quantity];
          let { soNum, materialsCode, materialsName, specs, unit, remarks } = item;
          data.push({ smartOrderId, deliveryCount, soNum, materialsCode, materialsName, specs, unit, remarks });
        })
        this.mate.mateListLine.rows = [...this.mate.mateListLine.rows,...data]
        this.initLineData(this.mate.mateListLine.rows);
        this.dialogFormVisible = false;
      }else{
        this.dialogFormVisible = false;
      }
    },
    /**
     * 刷新数据
     * 保存后刷新本页面数据
     * 并把头部表单数据 Number 转 String
     * 并设定索引和已实施勾选状态
     * @params {Object} data ecn数据
     ** 
     */
    updateDate(data) {
      let detail = data.detail;
      detail.lineList = this.initLineData(detail.lineList);
      this.mate.mateFormerHeader.values = detail.header;
      this.mate.mateListLine.rows = detail.lineList;
    },
    /**
     * 行新增确认
     * @param {Object} val 行表单数据
     * @return void
     ** 
     */
    submitForm(val) {
      let _this = this;
      let mate = this.mate;
      let lineId = mate.mateFormerLine.values.id;
      // 验证表单 通过后保存信息到列表行中
      this.$refs['lineForm'].$refs['form'].validate((valid,obj) => {
        if (valid) {
          let curIdx = mate.mateFormerLine.values.index;
          let values = mate.mateFormerLine.values;
          // 检验手动填写序号是否已存在 给出提示并自动填写序号
          let isExist = _this.checkNum(mate.mateFormerLine.values.index, curIdx, lineId);
          if (isExist){
            mate.mateFormerLine.values.index = _this.createNum();
          };
          // 是否是编辑
          if (_this.isEditLine){
            mate.mateListLine.rows.map((item, index) => {
              if (curIdx === item.index) {
                let mateFormerValues = Object.assign({},values);
                // 添加disableFlag 新增line后台需要前端传标识
                mateFormerValues.disableFlag = "1";
                // splice将i行数据删除，并将mateFormerValues1填充进
                mate.mateListLine.rows.splice(index, 1, mateFormerValues);
              }
            });
          }
          // 是否是新增
          if (_this.isAddLine) {
            values.index = mate.mateListLine.rows.length + 1;
            let mateFormerValues = Object.assign({},values);
            // 添加disableFlag 新增line后台需要前端传标识
            mateFormerValues.disableFlag = "1";
            mate.mateListLine.rows.push(mateFormerValues);
          }
          _this.lineDialogClose();
        } else {
          _this.$notify.error({
            title: "消息",
            message: "数据验证未通过"
          });
        }
      });
    },
    /**
     * 重置新增行、编辑行状态
     * @params void
     * @return void
     ** 
     */
    resetLineState () {
      this.isAddLine = false;
      this.isEditLine = false;
    },
    /**
     * 初始化行数据
     * 添加索引 从 1 开始
     * 已实施状态赋值
     * @params {Object} data 行数据
     * @return {Object} data 行数据
     ** 
     */
    initLineData (data) {
      data.forEach((item,index) =>{
        // 设置索引 从 1 开始
        item.lineNo = index + 1;
        this.$set(item, 'edit', false);
      })
      return data;
    },
    /**
     * 清空行数据
     * @param void
     * @return void
     ** 
     */
    clearLineList (){
      this.mate.mateListLine.rows = [];
    },
    /**
     * 新建行弹窗取消
     * 隐藏弹窗并弹窗初始化
     * @param void
     * @return void
     ** 
     */
    lineDialogClose () {
      // 隐藏行弹窗
      this.dialogFormVisible = false;
      // 重置行弹窗状态
      // this.reRenderLineDialog();
      // 重置行状态
      this.resetLineState();
    },
    /**
     * 重新渲染行表单弹窗
     * @param void
     * @return void
     ** 
     */
    reRenderLineDialog () {
      this.dialogRender = false;
      this.$nextTick(()=>{
        this.dialogRender = true;
      })
    },
    /**
     * 重置弹窗表单 用于新增
     * 数据清空，验证信息重置
     * @param {String} formName 需要重置的表单 ref 名称
     * @return void
     ** 
     */
    resetForm (formName) {
      this.$refs[formName].resetForm();
    },
    /**
     * 重置弹窗表单 用于编辑
     * 验证信息重置
     * @param {String} formName 需要重置的表单 ref 名称
     * @return void
     ** 
     */
    clearForm (formName) {
      this.$refs[formName].clearForm();
    },
    /**
     * 行表单数据初始化
     * 自动生成序号
     * @param {Object} values 表单数据
     * @return void
     ** 
     */
    resetDialogForm (values){
      values['lineNo'] = this.createNum(); //行号
      values['commodityCode'] = "";              // 商品编码
      values['commodityName'] = "";              // 商品名称
      values['commoditySpecifications'] = "";    // 商品规格
      values['unitMeasurement'] = "";            // 计量单位
      values['stockQuantity'] = "";              // 入库数量
      values['priceInTax'] = undefined;          // 入库单价（含税）
      values['taxRateCode'] = "";                // 税率代码
      values['amountIncludingTax'] = "";         // 入库金额（含税）
      values['amountExcludingTax'] = "";         // 入库金额（不含税）
      values['remark'] = "";                     // 备注
    },
    /**
     * 递归自动生成序号 10/20/30....
     * 默认为 10 如果当前行序号有10了 则递增10
     * @param {Number} num 序号
     * @return {Number} number 序号
     ** 
     */
    createNum (num, step) {;
      let number = num || 1;
      let lineLen = this.mate.mateListLine.rows.length;
      if (this.checkNum(number)){
        number += step || 1;
        number = this.createNum(number, step);
      }
      return number;
    },
    /**
     * 序号检验 
     * 校验是否已经存在当前序号
     * @param {Number} num 序号
     * @param {Number} id 行 id
     * @return {Boolean}  num是否已存在
     ** 
     */
    checkNum (num, index, id) {
      let serialNumberArr = [];
      let lineListRows = [...this.mate.mateListLine.rows];
      if (index) {
        lineListRows = lineListRows.filter(item => item.index != index);
      }
      if (id) {
        lineListRows = lineListRows.filter(item => item.id != id);
      }
      lineListRows.forEach(item => serialNumberArr.push(item.index));
      return serialNumberArr.indexOf(num) != -1;
    },
    /**
     * 刷新tab页签
     * @param void
     * @return void
     ** 
     */
    backToList () {
      this.$root.monitor({ url: `${this.listUrl}${this.params}` });
    },
  }
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
