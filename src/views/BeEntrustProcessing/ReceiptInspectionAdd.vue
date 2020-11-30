<!-- created by zhongxiaolong on 2019/10/12 -->
<!-- 收货检验模块下新增模块 ReceiptInspectionAdd -->
<template>
  <div>
    <!-- 头部button Start-->
    <h-btn @click="handleBtns"></h-btn>
    <!-- 头部button End-->
    <!-- 头部Form Start-->
    <dynamic-form ref="headForm" 
                  :mate="mate.mateFormerHeader" 
                  :rules="headerFormRules" 
                  :eventCfg="headerFormEventConfig" 
                  @events="handleEvents"></dynamic-form>
    <!-- 头部Form End-->
    <!--加工单号弹窗 Start -->
    <table-dialog :mate="mate" 
                  :dialogVisible="dialogVisible" 
                  :tableTitle="'选择加工单'" 
                  @handleConfirm="hideTableDialog"></table-dialog>
    <!-- 加工单号弹窗 End -->
  </div>
</template>

<script>
import { BE_ENTRUST_PROCESSING_API } from "@/services/apis";
import { dateInit } from "@/utils/util";
import SERVICES from "@/services";

export default {
  components: {
    HBtn: function index(resolve){
      require(["@/components/Button/HBtn.vue"], resolve);
    },
    DynamicForm: function index(resolve){
      require(["@/components/form/DynamicForm.vue"], resolve);
    },
    TableDialog: function index(resolve){
      require(["./components/TableDialog.vue"], resolve)
    }
  },
  props: {
    mate: Object
  },
  data() {
    return {
      status: "CREATE",          // 新建状态默认“未启动”
      usersList: [],             // 责任人列表
      customerList: [],          // 客户列表
      supplierList: [],          // 供应商列表
      headForm: {},              // 头部表单
      toSort: true,              // 是否本地排序 一般用于没有分页的列表
      showDict: '',              // 数字词典是否禁用 '1'/'0'
      objectColumns: {},         // 列表行字段
      headerId: null,            // 任务 id
      isEdit: false,             // 当前行是否在编辑
      isDirty: false,            // 是否修改了数据
      uploadUrl: "",             // 上传/导入 api
      uploadMethod: "POST",      // 请求上传/导入服务的方法
      // 头部表单控件规则
      headerFormRules: {
        // 检验单编号
        inspectionCode: [
          { required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }
        ],
        // 检验日期
        orderDateStr: [
          { required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }
        ],
        // 加工单编号
        processingOrderCode: [
          { required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }
        ],
        // 行号
        processingOrderLineNum: [
          { disabled: true, type: "number" }
        ],
        // 客户
        customerName: [
          { disabled: true }
        ],
        // 客户地点
        customerAddress: [
          { disabled: true }
        ],
        // 物料编码
        materialsCode: [
          { disabled: true }
        ],
        // 物料名称
        materialsName: [
          { disabled: true }
        ],
        // 规格
        specs: [
          { disabled: true }
        ],
        // 订单数量
        orderCount: [
          { disabled: true, type: "number" }
        ],
        // 收货数量
        receiptCount: [
          { disabled: false, type: "number" }
        ],
        // 合格数
        receiptQualifiedCount: [
          { disabled: false, type: "number" }
        ],
        // 不合格数
        receiptFailuresCount: [
          { disabled: false, type: "number" }
        ],
        // 加工要求
        processingRequire: [
          { disabled: true }
        ],
        // 单位
        unit: [
          { disabled: true }
        ],
        // 备注
        remarks: [{disabled: false}]
      },
      // 头部表单事件配置
      headerFormEventConfig: {
        // 收货检验单编号
        inspectionCode:{change: true},
        // 订单编号
        processingOrderCode:{focus: true},
        customerCode:{change: true},
      },
      dialogVisible: false,  // 加工单选择重新渲染弹窗是否显示
      processingOrderCodeData: {}, // 选择加工单编号
      selectedLine: []  // 选择加工单编号勾选行
    };
  },
  created() {
    this.init();
  },
  mounted() {
    // 初始化日期，默认为当天
    let date = this.mate.mateFormerHeader.values.orderDateStr || '';
    this.mate.mateFormerHeader.values.orderDateStr = date || dateInit();
  },
  watch: {
  },
  computed: {},
  methods: {
    /** 数据初始化
     * 初始化新增修改页面的数据
     * @param void
     * @return void
     */
    init() {
      // 模块数据
      let mate = this.mate;
      // 头表单
      mate.mateFormerHeader.fields.map((item) => { this.headForm[item.name] = item; });
      // 编辑/修改 后台会传detail回来
      let detail = mate.detail;
      // 如果有 detail 说明当前操作是编辑/修改
      if (detail) {
        // 保存头表单数据
        let mateFormerHeaderValues = detail.header || {};
        // 改变当前模块为编辑/修改状态
        this.isEdit = true;
        // 保存头部 id
        this.headerId = detail.header.id;
        this.status = mateFormerHeaderValues.status || "CREATE";
        // 头表单赋值
        mate.mateFormerHeader.values = mateFormerHeaderValues;
        // 禁用检验单编号，检验日期，加工单编号
        this.headerFormRules['inspectionCode'][0].disabled = true;
        this.headerFormRules['orderDateStr'][0].disabled = true;
        this.headerFormRules['processingOrderCode'][0].disabled = true;
      }
    },
    /** 头部按钮事件
     * @param {String} name 按钮名称
     * @return {Function} 按钮事件
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
    handleActions(act, row) {
      let action = act.action;
      const btnEvents = {
        
        // 默认
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)();
    },
    /**
     * 提交表单数据
     * @param void
     * @return void
     */
    handleSubmit() {
      let mate = {};
      let _this = this;
      let [url,next] = [this.mate.mateFormerHeader.url,this.mate.mateFormerHeader.next];
      this.$refs['headForm'].$refs["form"].validate(valid => {
        if (valid) {
          mate = _this.saveData();
          if (!mate) return;
          SERVICES.BASE.handleSave(url, mate).then((res) =>{
            let status = res.status; 
            if(status === 200){
              _this.$root.monitor({url: next});
            }
          }).catch(function (err) {
            
          });
        }
      });
    },
    /**
     * 提取提交和保存
     * 需要传给后台的数据
     * @params void
     * @return {Object} mate 头部数据和行数据
     */
    saveData () {
      let mate = {};
      let values = this.mate.mateFormerHeader.values;
      values.id = this.headerId || null;
      // 新建状态默认“未启动”
      values.status = this.status;
      // 后台需要标识 有效状态 1:有效   默认为 1
      values.disableFlag = '1';
      mate.header = values;
      return mate;
    },
    checkCount () {
      let values = this.mate.mateFormerHeader.values;
      // 定义订单数量/收货数量/合格数/不合格数
      let [orderCount, receiptCount, receiptQualifiedCount, receiptFailuresCount] = [values.orderCount, values.receiptCount, values.receiptQualifiedCount, values.receiptFailuresCount]
      if (receiptCount > orderCount) {
        this.$message({ 
          type: "warning", 
          message: "收货数量不能大于订单数量" 
        });
        return true;
      }else if((receiptQualifiedCount + receiptFailuresCount) != receiptCount){
        this.$message({ 
          type: "warning", 
          message: "合格数与不合格数之和要等于收货数量" 
        });
        return true;
      }
    },
    /** 动态表单事件管理
     * @param {String} event 事件名称
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
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
     * @return void
     */
    handleChange(val, name) {
      this.isDirty = true;
      const changeControl = {
        inspectionCode: (val) => this.handleCode(val),
        customerCode: (val) => this.handleCustomerAddress(val),
        default: () => { return }
      }
      return (changeControl[name] || changeControl.default)(val);
    },
    /** blur 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
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
     */
    handleFocus(val, name) {
      const focusControl = {
        processingOrderCode: () => this.showTableDialog(val),
        default: () => { return }
      }
      return (focusControl[name] || focusControl.default)(val);
    },
    /** clear 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
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
     */
    handleRemoveTag(val, name) {
      const removeTagControl = {

        default: () => { return }
      }
      return (removeTagControl[name] || removeTagControl.default)(val);
    },
    /** 
     * 编号检索
     * 是否已存在 编号不允许重复
     * @param {String} val 编号
     * @return void
     */
    handleCode(val) {
      if (!val) return;
      SERVICES.RECEIPT_INSPECTION.checkCode(val).then(res =>{
        let exist = res.data.data;
        if (exist){
          this.$message({
            message: "此编号已存在请重新输入",
            type: 'warning'
          })
          this.mate.mateFormerHeader.values['inspectionCode'] = "";
        }
      })
    },
    /**
     * 加工单编号弹窗显示
     * @return void
     */
    showTableDialog() {
      this.dialogVisible = true;
    },
    /**
     * 加工单编号弹窗关闭
     * @return void
     */
    hideTableDialog() {
      this.dialogVisible = false;
    },
    /**
     * 取消返回Ecn List页面
     * @param void
     * @return void
     */
    backward() {
      if(this.isEdit){
        this.$confirm("数据未提交,是否离开当前页面?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          //TODO 明细行不能为空
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
     * 刷新数据
     * 保存后刷新本页面数据
     * 并把头部表单数据 Number 转 String
     * 并设定索引和已实施勾选状态
     * @params {Object} data ecn数据
     */
    updateDate(data) {
      let detail = data.detail;
      this.mate.mateFormerHeader.values = detail.header;
    },
    /**
     * 重置弹窗表单 用于新增
     * 数据清空，验证信息重置
     * @param {String} formName 需要重置的表单 ref 名称
     * @return void
     */
    resetForm (formName) {
      this.$refs[formName].resetForm();
    },
    /**
     * 重置弹窗表单 用于编辑
     * 验证信息重置
     * @param {String} formName 需要重置的表单 ref 名称
     * @return void
     */
    clearForm (formName) {
      this.$refs[formName].clearForm();
    },
    /**
     * 获取责任人列表
     * @param void
     * @return void
     */
    getUsersList () {
      let _this = this;
      SERVICES.BASE.getUsersList().then(res =>{
        let data = res.data;
        if (data.length=='0') return;
        data.forEach(item =>{
          if ((item.username == "") || (item.username == undefined) || (item.id == "")) return;
          this.usersList.push({ 
            'label': item.username,
            'value': item.id,
            'id': item.id,
          })
        })
        let chargeObj = _this.mate.mateFormerLine.fields.find(item => item.name==="chargeId") || {};
        chargeObj.options = _this.usersList;
      });
    },
    /**
     * 刷新tab页签
     * @param void
     * @return void
     */
    backToList () {
      this.$root.monitor({ url: BE_ENTRUST_PROCESSING_API.RECEIPT_INSPECTION_MAIN_LIST });
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
