<!-- created by zhongxiaolong on 2020/05/29 -->
<!-- 对账单编辑页面 ReconciliationSlipsListAdd -->
<template>
  <div>
    <!-- 头部button Start-->
    <h-btn :btns="btns" @click="handleBtns"></h-btn>
    <el-divider></el-divider>
    <!-- 头部button End-->
    <!-- 头部Form Start-->
    <dynamic-form ref="headForm" 
      :mate="mate.mateFormerHeader" 
      :rules="headerFormRules" 
      :eventCfg="headerFormEventConfig" 
      :filedReadOnly="filedReadOnly"
      @events="handleEvents"></dynamic-form>
    <!-- 头部Form End-->
    <!-- 底部 lineList Start-->
    <k-table-line ref="lineTable"
      :mate="mate.mateListLine"
      @actionSelected="handleSelected"
      @btnClick="handleButtons" 
      @action="handleActions"
      :isIndex="isIndex" 
      :toSort="toSort"
      :btnDisable="btnDisable"
      :actDisable="actDisable"
      :inLineEdit="inLineEdit"
      :inlineEditSubmit="inlineEditSubmit"
      @editSubmit="editSubmit"
      @inlineEdit="inlineEdit"
      @inlineDel="inlineDel"
      :word="word"
    >
    </k-table-line>
    <!-- 底部 lineList End-->

  </div>
</template>

<script>
import { SMART_ORDER_API } from "@/services/apis";
import SERVICES from "@/services";
import { dateFormatter } from "@/utils/DateUtils";
import { mapGetters, mapActions } from "vuex";
import { getAction, postAction, saveService } from '@/services/manage.js';

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
      username: JSON.parse(window.sessionStorage.getItem('user')).username,
      state: "1",                // 新建状态 （1-新建 2-对账中 3-已对账 4-预开发票 5-已开票)
      btns: ['提交','取消'],     // 责任人列表
      inLineEdit: true,          // 是否行内编辑
      inlineEditSubmit: true,    // 行编辑提交
      word: true,                // 按钮是否显示文字
      isIndex: true,             // table 序号
      isShowSearchBtn: false,    // 是否显示搜索展开按钮
      maxHeight: 300,            // 添加成员弹窗 table 的最大高度
      filedReadOnly: true,       // 表单只读
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
      headId: null,              // 任务 id
      isEdit: false,             // 当前行是否在编辑
      isAddLine: false,          // 是否新增行
      isEditLine: false,         // 是否修改行
      isDirty: false,            // 是否修改了数据
      uploadUrl: "",             // 上传/导入 api
      uploadMethod: "POST",      // 请求上传/导入服务的方法
      btnDisable: false,
      actDisable: false,
      url:{
        detail: '/agriculture/reconciliationController/head/selectOne',        // 详情接口
      },
      // 头部表单控件规则
      headerFormRules: {},
      // 头部表单事件配置
      headerFormEventConfig: {},
      config: {},                        // 取 mongoDb 的 config 区分 当前用户
    };
  },
  computed: {
    ...mapGetters({
      pid: 'Common/pid'
    })
  },
  created() {
    this.init();
  },
  mounted() {
  },
  methods: {
    /** 数据初始化
     * 初始化新增修改页面的数据
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    init() {
      // 模块数据
      let mate = this.mate;
      // 头数据
      let mateFormHeaderValues = this.mate.mateFormerHeader.values;
      // 获取配置
      this.config = this.mate.mateFormerHeader.config;
      // 不是客户方 不允许编辑
      if(!this.config.ifFromCustomer){
        this.inLineEdit = false
        this.mate.mateListLine.actions = [
          {
            "action" : "deleteLine",
            "label" : "删除",
            "i18n" : this.$t('BUTTON_TEXT.DELETE'),
            "isApi" : false,
            "useId" : "1",
            "url" : "/agriculture/reconciliationController/deleteLine",
            "method" : "GET",
            "icon" : "el-icon-delete"
          }
        ]
      }
      // 行列表
      this.mate.mateListLine.columns.map(item => {
        this.objectColumns[item.name] = item;
      });
      // 设置行列表按钮 url
      this.mate.mateListLine.actions.forEach(item => {
        this.$set(this.url, item.action, item.url)
      })
      // 头表单
      mate.mateFormerHeader.fields.map((item) => { this.headForm[item.name] = item; });
      // 获取详情数据
      this.getData();
      // 初始化弹窗列表 mate
      // this.initDialogMate();
      // 获取供应商列表
      // this.getSupplierList()
    },
    /** 后台无法区分角色需特殊传参处理
     * @param {Object} params 参数
     * @return {Object} params
     */
    initParams(params){
      if(this.config.ifFromCustomer){
        params.ifFromCustomer = true;
      }
      return params
    },
    /** 获取数据 头和行
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    getData(){
      let { pid } = this;
      if(!pid) return;
      let param ={
        id: pid
      }
      getAction(this.url.detail, param).then(res =>{
        let detail = res.data.data;
        // 保存行列表数据
        let lineListRows = detail.lineList || [];
        // 保存头表单数据
        let mateFormerHeaderValues = detail.head || {};
        // 改变当前模块为编辑/修改状态
        this.isEdit = true;
        // 保存头部 id
        this.headId = detail.head.id;
        // this.state = mateFormerHeaderValues.state || "1";
        // 初始化行列表数据 添加 index 索引等...
        lineListRows = this.initLineData(lineListRows);
        // 行列表赋值
        this.mate.mateListLine.rows = lineListRows;
        // 头表单赋值
        this.mate.mateFormerHeader.values = mateFormerHeaderValues;
        if(mateFormerHeaderValues.files){
          mateFormerHeaderValues['files'] = JSON.parse(mateFormerHeaderValues['files']);
           mateFormerHeaderValues['files'].forEach(item =>{
             item.name = item.fileName;
             item.response = item.fileUrl;
           })
        }
        // 如果没有当前付款人 赋值当前登录用户
        if(!mateFormerHeaderValues.drawee){
          mateFormerHeaderValues['drawee'] = this.username;
        }
        // 如果没有币种 默认这是人民币
        if(!mateFormerHeaderValues.currency){
          mateFormerHeaderValues['currency'] = 'CNY';
        }
        // 计算对账单金额和已对账金额
        this.handleSummary();
      })
    },
    /** 头部按钮事件
     * @param {String} name 按钮名称
     * @return {Function} 按钮事件
     ** Author: zhongxiaolong
     */
    handleBtns(name) {
      const btnEvents = {
        // 提交按钮
        submit: () => this.handleSubmit(),
        // 提交按钮
        save: () => this.handleSave(),
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
     ** Author: zhongxiaolong
     */
    handleButtons(btn, row) {
      this.row = row;
      this.btn = btn;
      let action = btn.action;
      const btnEvents = {
        // 默认
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)();
    },
    handleActions(act, row) {
      let action = act.action;
      const btnEvents = {
        // 编辑行
        editLine: (act, row) => this.handleUpdate(act, row),
        // 删除行
        deleteLine: (act, row) => this.handleDelete(row),
        // 默认
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(act, row);
    },
    /**
     * 提交表单数据
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    handleSubmit() {
      let mate = {};
      let _this = this;
      let [url,next] = [this.mate.mateFormerHeader.url,this.mate.mateFormerHeader.next];
      this.$refs['headForm'].$refs["form"].validate(valid => {
        if (valid) {
          let isOk = this.lineEditConfirm(); // 行编辑要确认保存
          mate = _this.saveData(1);
          if (!isOk || !mate) return;
          saveService(url, mate).then((res) =>{
            if(res.data.code === 200){
              _this.$root.monitor({url: next});
            }
          })
        }
      });
    },
    /**
     * 提取提交和保存
     * 需要传给后台的数据
     * @params flag 提交 1 还是保存 0
     * @return {Object} mate 头部数据和行数据
     ** Author: zhongxiaolong
     */
    saveData (flag) {
      let mate = {};
      let values = this.mate.mateFormerHeader.values;
      values.id = this.headId || null;
      // 新建状态默认“新建”
      values.state = this.state;
      mate.head = values;
      mate.lineList = this.mate.mateListLine.rows;
      // if (flag && mate.lineList.length < 1) {
      //   // 保存的时候明细行不能为空
      //   this.$message({
      //     type: "warning",
      //     message: "明细行不能为空"
      //   });
      //   return false;
      // }
      return mate;
    },
    /** 取消返回Ecn List页面
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    backward() {
      if(this.isEdit){
        if (this.mate.mateListLine.rows.length < 1) {
          // 保存的时候明细行不能为空
          this.$message({
            type: "warning",
            message: "明细行不能为空"
          });
          return
        }
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
      }else{
        this.backToList();
      }
    },
    /** 
     * 行编辑确认
     ** Author: zhongxiaolong
     */
    lineEditConfirm(){
      let lineRows = this.mate.mateListLine.rows;
      let isOk = lineRows.every(row => (row.edit === false) || (row.edit === undefined));
      if(!isOk){
        this.$message.error("请先确认行编辑")
        return false
      }else{
        return true
      }
    },
    /** 动态表单事件管理
     * @param {String} event 事件名称
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} 执行事件函数
     ** Author: zhongxiaolong
     */
    handleEvents(event, val, name) {
      const eventControl = {
        input: (val, name) => this.handleInput(val, name),
        change: (val, name) => this.handleChange(val, name),
        blur: (val, name) => this.handleBlur(val, name),
        focus: (val, name) => this.handleFocus(val, name),
        clear: (val, name) => this.handleClear(val, name),
        visibleChange: (val, name) => this.handleVisibleChange(val, name),
        removeTag: (val, name) => this.handleRemoveTag(val, name),
        default: () => { return }
      }
      return (eventControl[event] || eventControl.default)(val, name);
    },
    /** input事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     ** Author: zhongxiaolong
     */
    handleInput(val, name) {
      const inputControl = {

        default: () => { return }
      }
      return (inputControl[name] || inputControl.default)(val);
    },
    /** change 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} change事件执行函数
     ** Author: zhongxiaolong
     */
    handleChange(val, name) {
      this.isDirty = true;
      const changeControl = {
        supplierNo: (val) => this.handleSupplier(val),
        processingOrderCode: (val) => this.handleCode(val),
        customerCode: (val) => this.handleCustomerAddress(val),
        default: () => { return }
      }
      return (changeControl[name] || changeControl.default)(val);
    },
    /** blur 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} blur事件执行函数
     ** Author: zhongxiaolong
     */
    handleBlur(val, name) {
      const blurControl = {
        default: () => { return }
      }
      return (blurControl[name] || blurControl.default)(val);
    },
    /** focus 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     ** Author: zhongxiaolong
     */
    handleFocus(val, name) {
      const focusControl = {

        default: () => { return }
      }
      return (focusControl[name] || focusControl.default)(val);
    },
    /** clear 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     ** Author: zhongxiaolong
     */
    handleClear(val, name) {
      const clearControl = {

        default: () => { return }
      }
      return (clearControl[name] || clearControl.default)(val);
    },
    /** visibleChange 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     ** Author: zhongxiaolong
     */
    handleVisibleChange(val, name) {
      const visibleChangeControl = {

        default: () => { return }
      }
      return (visibleChangeControl[name] || visibleChangeControl.default)(val);
    },
    /** removeTag 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     ** Author: zhongxiaolong
     */
    handleRemoveTag(val, name) {
      const removeTagControl = {

        default: () => { return }
      }
      return (removeTagControl[name] || removeTagControl.default)(val);
    },
    /**
     * checkbox 勾选计算 拿到勾选的序号数组
     * param {Boolean} hasSelected 是否有勾选
     * param {Array} multipleSelection 勾选数组 
     * @return void
     ** Author: zhongxiaolong
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
     * 编辑行
     * 编辑明细行
     ** Author: zhongxiaolong
     */
    handleUpdate (act, row) {
      // 编辑行
      // 该操作是编辑行 改变编辑行状态
      this.isEditLine = true;
      // 显示弹窗
      this.dialogFormVisible = true;
      // 复制行数据
      this.mate.mateFormerLine.values = {...row};
      // 重置表单验证
      this.$nextTick(() => {
        // this.clearForm('lineForm');
      })
    },
    /** 行编辑按钮
     * @param {Object} row 行数据
     * @return void
     */
    inlineEdit(row){
      row.edit = !row.edit;
    },
    /** 行删除按钮
     * @param {Object} row 行数据
     * @return void
     */
    inlineDel(row){
      row.edit = false;
      this.handleDelete(row);
    },
    /** 行编辑Ok
     * @param {Object} row 行数据
     * @return void
     */
    editSubmit(row){
      if(row['reconciliationQuantity'] > row['signedInQuantity']){
        this.$message.error('对账数量不能大于签收数量');
        row.edit = true;
        return
      }
      // 对账金额 = 对账数量 * 单价
      row['reconciliationAmount'] = +row['reconciliationQuantity'] * +row['unitPrice'];
      // 计算对账单金额和已对账金额
      this.handleSummary()
    },
    /** 计算对账单金额和已对账金额
     * @param void
     * @return void
     */
    handleSummary(){
      let mateFormerHeaderValues = this.mate.mateFormerHeader.values;
      // 头-已对账金额 = 行-对账金额总和
      mateFormerHeaderValues['billedAmount'] = this.mate.mateListLine.rows.reduce((prev,item) => {
        if(!item.reconciliationAmount){
          item.reconciliationAmount = 0;
        }
        return prev + Number(item.reconciliationAmount);
      },0).toFixed(2)
      // 头-对账单金额 = 行-含税金额总和
      mateFormerHeaderValues['statementAmount'] = this.mate.mateListLine.rows.reduce((prev,item) => {
        if(!item.amountIncludingTax){
          item.amountIncludingTax = 0;
        }
        
        return prev + Number(item.amountIncludingTax);
      },0).toFixed(2)
      
    },
    /**
     * 删除行
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    handleDelete (row) {
      let _this = this;
      let selectedLines = row;
      let selectedId = row.id;
      // 行数据
      let lineListRows = _this.mate.mateListLine.rows;
      // 过滤删除的行 剩下没有删除的
      lineListRows = lineListRows.filter(item => item.index != row.index);
      _this.initLineData(lineListRows);
      // 如果删除行有行id就向后台请求删除
      if (row.id) {
        let params = {
          id: row.id
        }
        if(_this.url.deleteLine == ''){
          this.$alert('接口调试中，请稍后再尝试...');
          return
        }
        getAction(_this.url.deleteLine, params).then(res =>{
          if(res.data.code === 200){
            this.$message.success(res.data.message)
            _this.mate.mateListLine.rows = lineListRows;
            _this.handleSummary();
          }else{
            _this.mate.mateListLine.rows = _this.mate.mateListLine.rows;
            this.$message.error(res.data.message)
          }
          //重新渲染删除后的行列表
        })
      } else {
        _this.mate.mateListLine.rows = lineListRows;
        _this.handleSummary();
      }
    },
    /**
     * 刷新数据
     * 保存后刷新本页面数据
     * 并把头部表单数据 Number 转 String
     * 并设定索引和已实施勾选状态
     * @params {Object} data ecn数据
     ** Author: zhongxiaolong
     */
    updateDate(data) {
      let detail = data.detail;
      detail.lineList = this.initLineData(detail.lineList);
      this.mate.mateFormerHeader.values = detail.head;
      this.mate.mateListLine.rows = detail.lineList;
    },
    /**
     * 初始化行数据
     * 添加索引 从 1 开始
     * 已实施状态赋值
     * @params {Object} data 行数据
     * @return {Object} data 行数据
     ** Author: zhongxiaolong
     */
    initLineData (data) {
      data.forEach((row,index) =>{
        // 设置索引 从 1 开始
        row.index = index + 1;
        this.$set(row, 'edit', false);
        this.$set(row, '_del', true);
      })
      return data;
    },
    /**
     * 刷新tab页签
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    backToList () {
      this.$root.monitor({ url: this.mate.mateFormerHeader.next });
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

