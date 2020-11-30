<!-- created by zhongxiaolong on 2019/10/12 -->
<!-- 交货单模块下新增模块 DeliveryOrderAdd -->
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
    <!-- 底部 lineList Start-->
    <k-table-line
      :mate="mate.mateListLine"
      @actionSelected="handleSelected"
      @btnClick="handleButtons"
      @action="handleActions"
      :toSort="toSort"
      ref="lineTable"
      :btnDisable="btnDisable"
      :actDisable="actDisable"
    ></k-table-line>
    <!-- 底部 lineList End-->
    <!-- 新增行弹窗 Start -->
    <el-dialog title="填写明细行" width="80%" :visible.sync="dialogFormVisible"  :before-close="lineDialogClose" >
      <dynamic-form ref="lineForm" 
                    :mate="mate.mateFormerLine" 
                    :rules="lineFormRules" 
                    :eventCfg="lineFormEventConfig" 
                    @events="handleEvents"></dynamic-form>
      <el-row type="flex" justify="start">
        <el-button size="mini" @click="submitForm" type="primary">{{$t('BUTTON_TEXT.CONFIRM')}}</el-button>
        <el-button size="mini" @click="lineDialogClose">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
      </el-row>
    </el-dialog>
    <!-- 新增行弹窗 End -->
    <!--加工单号弹窗 Start -->
    <table-dialog :mate="mate" 
                  v-if="dialogVisible"
                  :dialogVisible="dialogVisible" 
                  :tableTitle="'选择加工单'" 
                  :formModel="'dialog'"
                  :customerName="mate.mateFormerHeader.values.customerName"
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
      // status: "CREATE",          // 新建状态默认“未启动”
      headForm: {},              // 头部表单
      headerId: null,            // 任务 id
      isEdit: false,             // 当前行是否在编辑
      isDirty: false,            // 是否修改了数据
      isAddLine: false,          // 是否新增行
      isEditLine: false,         // 是否修改行
      toSort: true,              // 是否本地排序 一般用于没有分页的列表
      dialogFormVisible: false,  // 新增行弹窗是否显示
      customerList: [],          // 客户列表
      btnDisable: false,
      actDisable: false,
      // 头部表单控件规则
      headerFormRules: {
        // 交货单编号
        deliveryCode: [
          { required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }
        ],
        // 客户
        customerCode: [
          { required: true, message: "该输入项为必输项", trigger: "change", disabled: false }
        ],
        // 检验日期
        orderDateStr: [
          { required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }
        ],
        // 备注
        remarks: [{disabled: false}]
      },
      // 头部表单事件配置
      headerFormEventConfig: {
        // 交货单编号
        deliveryCode:{change: true},
        // 客户
        customerCode:{change: true},
      },
      lineFormRules: {
        // 加工单编号
        processingOrderCode: [
          { required: true, message: "该输入项为必输项", trigger: "change", disabled: false }
        ],
        // 行号
        processingOrderLineNum: [
          { disabled: true, type: "number" }
        ],
        // 客户
        // customerName: [
        //   { disabled: true }
        // ],
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
        // 交货数量
        deliveryCount: [
          { disabled: false, type: "number" }
        ],
        // 合格数
        deliveryQualifiedCount: [
          { disabled: false, type: "number" }
        ],
        // 不合格数
        deliveryFailuresCount: [
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
        // 关闭订单
        closeFlag: [{disabled: false, type: "boolean"}]
      },
      lineFormEventConfig: {
        // 订单编号
        processingOrderCode:{focus: true}
      },
      dialogVisible: false,  // 加工单选择重新渲染弹窗是否显示
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
        // 保存行列表数据
        let lineListRows = detail.lineList || [];
        // 保存头表单数据
        let mateFormerHeaderValues = detail.header || {};
        // 改变当前模块为编辑/修改状态
        this.isEdit = true;
        // 保存头部 id
        this.headerId = detail.header.id;
        // this.status = mateFormerHeaderValues.status || "CREATE";
        // 初始化行列表数据 添加 index 索引等...
        lineListRows = this.initLineData(lineListRows);
        // 行列表赋值
        mate.mateListLine.rows = lineListRows;
        // 头表单赋值
        mate.mateFormerHeader.values = mateFormerHeaderValues;
        // 禁用交货单编号，检验日期，加工单编号
        this.headerFormRules['deliveryCode'][0].disabled = true;
        this.headerFormRules['orderDateStr'][0].disabled = true;
        this.headerFormRules['customerCode'][0].disabled = true;
      }
      // 获取客户列表
      this.getCustomerList();
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
        // 编辑行
        editLine: (act, row) => this.handleUpdate(act, row),
        // 默认
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(act, row);
    },
    /**
     * 公共模块 KTableLine 按钮事件
     * @param {Object} btn 当前按钮信息
     * @param {Object} row 当前行信息
     * @return void
     */
    handleButtons(btn, row) {
      this.row = row;
      this.btn = btn;
      let action = btn.action;
      const btnEvents = {
        // 新增
        addLine: () => this.handleCreate(),
        // 删除行
        deleteLine: () => this.handleDelete(),
        // 导入模板
        upload: () => this.handleUpload(),
        // 导出为模板
        download: () => this.handleDownload(),
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
      // values.status = this.status;
      // 后台需要标识 有效状态 1:有效   默认为 1
      values.disableFlag = '1';
      mate.header = values;
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
    checkCount (values = {}) {
      // 定义订单数量/交货数量/合格数/不合格数
      let [orderCount, deliveryCount, qualifiedCount, failuresCount] = [values.orderCount, values.deliveryCount, values.deliveryQualifiedCount, values.deliveryFailuresCount]
      if (deliveryCount > orderCount) {
        this.$message({ 
          type: "warning", 
          message: "交货数量不能大于订单数量" 
        });
        return true;
      }else if((qualifiedCount + failuresCount) != deliveryCount){
        this.$message({ 
          type: "warning", 
          message: "合格数与不合格数之和要等于交货数量" 
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
        deliveryCode: () => this.handleCode(val),
        customerCode: (val) => this.handleCustomer(val),
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
      SERVICES.DELIVERY_ORDER.checkCode(val).then(res =>{
        let exist = res.data.data;
        if (exist){
          this.$message({
            message: "此编号已存在请重新输入",
            type: 'warning'
          })
          this.mate.mateFormerHeader.values['deliveryCode'] = "";
        }
      })
    },
    /** 
     * 客户地点设置
     * 切换客户改变对应地点的列表
     * 编辑/修改的时候也需要根据客户设置地点列表
     * @param {String} val 客户的 code
     * @return void
     */
    handleCustomer(val) {
      let customerObj = this.customerList.find(item => item.value === val);
      // let AddressObj = this.mate.mateFormerHeader.fields.find(item => item.name==="customerAddressId") || {};
      // AddressObj.options = customerObj.addressList;
      this.mate.mateFormerHeader.values['customerName'] = customerObj.label;
      // this.mate.mateFormerHeader.values['customerAddressId'] = "";
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
     * checkbox 勾选计算 拿到勾选的序号数组
     * param {Boolean} hasSelected 是否有勾选
     * param {Array} multipleSelection 勾选数组 
     * @return void
     */
    handleSelected(hasSelected, multipleSelection) {
      this.selectedLines = multipleSelection;
      // 第一步就是要清空selectedIds里面的所勾选行的序号
      this.selectedIds = [];
      // map方法也可以
      multipleSelection.forEach(item => this.selectedIds.push(item.processingOrderLineNum));
      // 每次点击都会执行这个函数，要点击两下的时候，this.selectedIds里面包括了前面一次的数据，所以会有重复，要去重
      let arr = [];
      arr = [...new Set(this.selectedIds)];
      this.selectedIds = arr;
    },
    /**
     * 新增行
     * @param void
     * @return void
     */
    handleCreate () {
      let _this = this;
      this.$refs['headForm'].$refs["form"].validate(valid => {
        if(valid){
          // 该操作是新增行 改变新增行状态
          _this.isAddLine = true;
          _this.resetDialogForm(this.mate.mateFormerLine.values);
          // 显示弹窗
          _this.dialogFormVisible = true;
          _this.$nextTick(() => {
            _this.clearForm('lineForm');
          })
        }else{
          _this.$message({
            message: "请先维护头表单信息",
            type: "info"
          });
        }
      })
    },
    /**
     * 编辑行
     * 编辑明细行
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
        this.clearForm('lineForm');
      })
    },
    /**
     * 删除行
     * @param void
     * @return void
     */
    handleDelete () {
      let _this = this;
      this.$confirm("此操作将永久删除该行, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let selectedLines = _this.selectedLines;
        let selectedIds = _this.selectedIds;
        // 行数据
        let lineListRows = _this.mate.mateListLine.rows;
        // 先过滤删除没有行id的数据
        selectedLines = selectedLines.filter(item=> !!item.id );
        // 过滤删除的行 剩下没有删除的
        selectedIds.forEach(item => {
          lineListRows = lineListRows.filter(line => line.processingOrderLineNum != item);
        });
        // 需要删除的行的 id数组 保存在 rowId 里
        let rowId = { id: selectedLines.map(item => item.id) };
        // 删除之后，就将剩余从新排序
        // for (let l = 0; l < lineListRows.length; l++) {
        //   lineListRows[l].index = l + 1;
        // }
        _this.initLineData(lineListRows);
        // 如果删除行有行id就向后台请求删除
        if (rowId.id.length > 0) {
          SERVICES.PROCESSING_ORDER_ENTRY.handleDeleteLine(rowId.id).then(() =>{
            //重新渲染删除后的行列表
            _this.mate.mateListLine.rows = lineListRows;
            // 保存数据 重新排序后的
            // _this.save();
          })
        } else {
          _this.mate.mateListLine.rows = lineListRows;
          // _this.save();
        }
      }).catch(() => {
        _this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    /**
     * 行新增/修改确认
     * @param {Object} val 行表单数据
     * @return void
     */
    submitForm(val) {
      let _this = this;
      let mate = this.mate;
      let lineId = mate.mateFormerLine.values.id;
      if (this.checkCount(mate.mateFormerLine.values)) return;
      // 验证表单 通过后保存信息到列表行中
      this.$refs['lineForm'].$refs['form'].validate((valid,obj) => {
        if (valid) {
          let curIdx = mate.mateFormerLine.values.index;
          let values = mate.mateFormerLine.values;
          // let values = this.closeFlagFilter(mate.mateFormerLine.values);
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
     * 关闭订单 formatter
     * @param {Object} values 行的表单值
     * @return {Object} values 关闭订单formatter后行的表单值
     */
    closeFlagFilter(values){
      let closeFlag = values.closeFlag;
      if(closeFlag !== "" && closeFlag != undefined && closeFlag != null){
        switch (closeFlag) {
        case true:
          values.isClose = "是";
          break;
        case false:
          values.isClose = "否";
          break;
        default:
          break;
        }
      }
      return values;
    },
    /**
     * 新建行弹窗取消
     * 隐藏弹窗并弹窗初始化
     * @param void
     * @return void
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
     * 重置新增行、编辑行状态
     * @params void
     * @return void
     */
    resetLineState () {
      this.isAddLine = false;
      this.isEditLine = false;
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
     * 行表单数据初始化
     * 自动生成序号
     * @param {Object} values 表单数据
     * @return void
     */
    resetDialogForm (values){
      values['processingOrderCode'] = "";        // 加工单编号
      values['processingOrderLineNum'] = "";     // 加工单行号
      values['materialsCode'] = "";              // 物料编码
      values['materialsName'] = "";              // 物料名称
      values['specs'] = "";                      // 规格
      values['unit'] = "";                       // 单位
      values['productionRequire'] = "";          // 加工要求
      values['orderCount'] = undefined;          // 订单数量
      values['deliveryCount'] = undefined;       // 交货数量
      values['deliveryQualifiedCount'] = undefined;  // 合格数
      values['deliveryFailuresCount'] = undefined;   // 不合格数
      values['closeFlag'] = false;                      // 关闭订单
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
      })
      return data;
    },
    /**
     * 刷新tab页签
     * @param void
     * @return void
     */
    backToList () {
      this.$root.monitor({ url: BE_ENTRUST_PROCESSING_API.DELIVERY_ORDER_MAIN_LIST });
    },
    /** 获取客户列表
     * 获取客户列表并处理对应的地点列表
     * @param void
     * @return void
     */
    getCustomerList () {
      let _this = this;
      SERVICES.BASE.getCustomerList().then(res =>{
        let data = res.data;
        if (data.length=='0') return;
        data.forEach(item =>{
          if ((item.name == "") || (item.name == undefined) || (item.code == "")) return;
          // let addressList = [];
          // if (item.addressList.length){
          //   item.addressList.forEach(aItem =>{
          //     if ((aItem.address == "") || (aItem.address == undefined) || (aItem.id == "")) return;
          //     addressList.push({
          //       "label": aItem.address,
          //       "value": aItem.id,
          //       "id": aItem.id
          //     })
          //   })
          // }
          this.customerList.push({ 
            // 'addressList': addressList,
            'label': item.name,
            'value': item.code,
            'id': item.code,
          })
        })
        let customerObj = _this.mate.mateFormerHeader.fields.find(item => item.name==="customerCode") || {};
        customerObj.options = _this.customerList;
        if(_this.isEdit){// 如果是编辑/修改 设置客户对应的地点
          let curCustomer = _this.mate.mateFormerHeader.values['customerCode'];
          // _this.handleCustomer(curCustomer);
          let customerObj = this.customerList.find(item => item.value === curCustomer);
          // let AddressObj = this.mate.mateFormerHeader.fields.find(item => item.name==="customerAddressId") || {};
          // AddressObj.options = customerObj.addressList;
          this.mate.mateFormerHeader.values['customerName'] = customerObj.label;
        }
      });
    },
  }
};
</script>
