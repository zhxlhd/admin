<!-- created by zhongxiaolong on 2019/11/12 -->
<!-- 工单发料下新增模块 WorkOrderIssuedAdd -->
<template>
  <div style="position: relative;">
    <!-- 头部button Start-->
    <h-btn :btns="btns" 
           @click="handleBtns"></h-btn>
    <!-- 头部button End-->
    <!-- 头部Form Start-->
    <dynamic-form ref="headForm" 
                  :mate="mate.mateFormerHeader" 
                  :rules="headerFormRules" 
                  :eventCfg="headerFormEventConfig" 
                  @events="handleEvents"></dynamic-form>
    <!-- 头部Form End-->
    <!-- 底部 lineList Start-->
    <k-table-line ref="lineTable" 
                  :mate="mate.mateListLine" 
                  @actionSelected="handleSelected" 
                  @btnClick="handleButtons" 
                  @action="handleActions" 
                  :toSort="toSort" 
                  :btnDisable="btnDisable" 
                  :actDisable="actDisable" 
                  :actionWidth="actionWidth"></k-table-line>
    <!-- 底部 lineList End-->
    <!-- 新增行弹窗 Start -->
    <el-dialog title="填写明细行" 
               width="80%" 
               :visible.sync="dialogFormVisible" 
               :before-close="lineDialogClose">
      <!-- 新增行表单 Start -->
      <dynamic-form ref="lineForm" 
                    :mate="mate.mateFormerLine" 
                    :rules="lineFormRules" 
                    :eventCfg="lineFormEventConfig" 
                    @events="handleEvents"></dynamic-form>
      <!-- 新增行表单 End -->
      <!-- 按钮组 Start -->
      <el-row type="flex" justify="start">
        <el-button size="mini" @click="submitForm" type="primary">{{$t('BUTTON_TEXT.CONFIRM')}}</el-button>
        <el-button size="mini" @click="lineDialogClose">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
      </el-row>
      <!-- 按钮组 End -->
    </el-dialog>
    <!-- 新增行弹窗 End -->
  </div>
</template>

<script>
import SERVICES from "@/services";
import { dateInit } from "@/utils/util";

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
      status: "SAVE",            // 新建状态默认“未启动” （必配）
      actionWidth: "",           // action 操作列宽度（选配）
      btns: ['提交','取消'],     // 责任人列表（选配）
      warehouseList: [],         // 仓库列表（选配）
      ticketClassificationList: [], // 仓库列表（选配）
      componentCodeOptions: [],  // 子件物料编码
      selectedIds: [],           // 所勾选行的序号
      selectedLines: [],         // 勾选行
      headForm: {},              // 头部表单（必配）
      lineForm: {},              // 行表单（必配）
      lineValues: {},            // 新增行表单默认数据（必配）
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
      uploadUrl: "",             // 上传/导入 api
      uploadMethod: "POST",      // 请求上传/导入服务的方法
      btnDisable: false,         // 头部按钮是否禁用
      actDisable: false,         // 操作列按钮是否禁用
      orgId: "",                 // 当前库存组织 id
      // 头部表单控件规则
      headerFormRules: {
        // 工单编号
        workOrderCode: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }],
        // 单据类型
        orderType: [{ required: true, message: "该输入项为必输项", trigger: "change", disabled: false }],
        // 单据日期
        orderDateStr: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }],
        // 库存组织
        orgId: [{ disabled: true }],
        // 装配件料号
        materialsCode: [{disabled: true}],
        // 装配件名称
        materialsName: [{disabled: true}],
        // 规格
        specs: [{disabled: true}],
        // 规格
        excessFlag: [{disabled: false}],
        // 备注
        remarks: [{disabled: false}]
      },
      // 头部表单事件配置
      headerFormEventConfig: {
        // 工单编号
        workOrderCode:{change: true}
      },
      // 行列表新增表单控件规则
      lineFormRules: {
        // 序号
        serialNumber: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false, type: "number" }],
        // 子件编码
        componentCode: [{ required: true, message: "该输入项为必输项", trigger: "change"}],
        // 子件名称
        componentName: [{ disabled: true }],
        // 规格
        specs: [{ disabled: true }],
        // 需求数量
        shouldCount: [{ disabled: true, type: "number" }],
        // 工序
        procedures: [{ disabled: true, type: "number" }],
        // 已发数量
        sentCount: [{ disabled: true, type: "number" }],
        // 发料数量
        orderCount: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false, type: "number" }],
        // 仓库
        warehouseId: [{ disabled: false }],
        // 仓库名称
        warehouseName: [{ disabled: true }],
        // 货位
        locationId: [{ required: false, message: "该输入项为必输项", trigger: "change", disabled: false }],
        // 批次
        batchNo: [{ required: false, message: "该输入项为必输项", trigger: "blur", disabled: false }],
      },
      // 行列表新增表单事件配置
      lineFormEventConfig: {
        // 子件编码
        componentCode: {change: true},
        // 仓库
        warehouseId: {change: true},
        // 货位
        locationId:{change: true},
      }
    };
  },
  computed: {},
  created() {
    this.init();
  },
  mounted() {
    // 初始化日期，默认为当天
    let date = this.mate.mateFormerHeader.values.orderDateStr || '';
    this.mate.mateFormerHeader.values.orderDateStr = date || dateInit();
  },
  methods: {
    /** 数据初始化
     * 初始化新增修改页面的数据
     * @param void
     * @return void
     */
    init() {
      // 模块数据
      let mate = this.mate;
      // 头部表单数据
      let mateFormerHeaderValues = mate.mateFormerHeader.values;
      // 行列表
      this.mate.mateListLine.columns.map(item => {
        this.objectColumns[item.name] = item;
      });
      // 头表单
      mate.mateFormerHeader.fields.map((item) => { this.headForm[item.name] = item; });
      // 行表单
      mate.mateFormerLine.fields.map((item) => { this.lineForm[item.name] = item; });
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
        // 禁用控件
        let headerFormRules = this.headerFormRules;
        headerFormRules['workOrderCode'][0].disabled = true;
        this.orgId = mateFormerHeaderValues.orgId;
        let categoryType = mateFormerHeaderValues.categoryType;
      }
      // 获取库存组织
      this.getOrgUnit();
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
        // 默认
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(act, row);
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
    /** 动态表单事件管理
     * @param {String} event 事件名称
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} 执行事件函数
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
     * @return {Function} input事件执行函数
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
     */
    handleChange(val, name) {
      this.isDirty = true;
      const changeControl = {
        // 工单编号
        workOrderCode: (val) => this.handleCodeInfo(val),
        // 物料编码
        componentCode: (val) => this.handleComponentCodeInfo(val),
        // 供应仓库
        warehouseId: (val) => this.handleWarehouseId(val),
        // 货位
        locationId: (val) => this.handleLocationId(val),
        default: () => { return }
      }
      return (changeControl[name] || changeControl.default)(val);
    },
    /** blur 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} blur事件执行函数
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
     * @return {Function} focus事件执行函数
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
     * @return {Function} clear事件执行函数
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
     * @return {Function} visibleChange事件执行函数
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
     * @return {Function} removeTag事件执行函数
     */
    handleRemoveTag(val, name) {
      const removeTagControl = {
        default: () => { return }
      }
      return (removeTagControl[name] || removeTagControl.default)(val);
    },
    /** 仓库change事件
     * @param {Any} val 控件的值
     * @return void
     */
    handleWarehouseId(val) {
      let mateFormerLineValues = this.mate.mateFormerLine.values;
      let warehouse = this.lineForm["warehouseId"].options.find(item => item.value == val);
      mateFormerLineValues["warehouseName"] = warehouse["name"];
      mateFormerLineValues["warehouseCode"] = warehouse["label"];
      mateFormerLineValues["locationId"] = "";
      this.lineForm['locationId'].options = [];
      this.lineFormRules["locationId"][0].required = false;
      // 获取货位列表
      this.getLocation(val);
    },
    /** 工单类型change事件
     * @param {String} val 工单类型 value "1": 标准工单; "2": 非标准工单 
     * @return void
     */
    handleCategoryType(val) {
      let mateFormerHeaderValues = this.mate.mateFormerHeader.values;
      // 清空工单分类、物料编码、物料名称、规格、单位
      mateFormerHeaderValues["categoryId"] = "";
      mateFormerHeaderValues["materialsCode"] = "";
      mateFormerHeaderValues["materialsName"] = "";
      mateFormerHeaderValues["unit"] = "";
      mateFormerHeaderValues["specs"] = "";
      mateFormerHeaderValues["categoryTypeName"] = val === "1" ? "标准工单" : "非标准工单";
      // 标准工单允许物料编码带出物料信息,非标准工单不允许
      this.headerFormEventConfig["materialsCode"].change = val === "1" ? true : false;
    },
    /** 子物料编码change事件
     * @param void
     * @return void
     */
    handleComponentCodeInfo(val) {
      let mateLineFormValues = this.mate.mateFormerLine.values;
      if (!val){
        mateLineFormValues["componentName"] = '';
        mateLineFormValues["specs"] = '';
        mateLineFormValues["shouldCount"] = '';
        mateLineFormValues["procedures"] = '';
        mateLineFormValues["sentCount"] = '';
        mateLineFormValues["workOrderLineId"] = '';
        this.handleComponentOptions();
      }else {
        let curItem = this.componentCodeOptions.find(item => {
          return item.value === val;
        });;
        mateLineFormValues["componentName"] = curItem.name;
        mateLineFormValues["specs"] = curItem.specs;
        mateLineFormValues["shouldCount"] = curItem.shouldCount;
        mateLineFormValues["procedures"] = curItem.procedures || 10;
        mateLineFormValues["sentCount"] = curItem.sentCount;
        mateLineFormValues["workOrderLineId"] = curItem.id;
        let batchCtrl = curItem.batchCtrl;
        if (batchCtrl){
          this.lineFormRules['batchNo'][0].required = true; 
        }else {
          this.lineFormRules['batchNo'][0].required = false;
        };
        this.handleComponentOptions();
      }
    },
    /** 货位change事件
     * @param {Any} val 控件的值
     * @return void
     */
    handleLocationId(val) {
      let mateFormerLineValues = this.mate.mateFormerLine.values;
      let location = this.lineForm["locationId"].options.find(item => item.value == val);
      mateFormerLineValues["location"] = location["label"];
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
          // TODO 明细行不能为空
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
      multipleSelection.forEach(item => this.selectedIds.push(item.serialNumber));
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
      this.$refs['headForm'].$refs["form"].validate(valid => {
        if(valid){
          // 该操作是新增行 改变新增行状态
          this.isAddLine = true;
          this.resetDialogForm();
          // 获取工单下物料行列表
          this.getSubMaterialsCode();
          // 获取库存组织下仓库列表
          if (!this.warehouseList.length) this.getWarehouse();
          // 物料编码列表控制
          // if (!this.componentCodeOptions.length) this.handleComponentOptions();
          this.handleComponentOptions();
          // 取消禁用控件
          let lineFormRules = this.lineFormRules;
          // lineFormRules['serialNumber'][0].disabled = false;
          lineFormRules['componentCode'][0].disabled = false; 
          // 批次必填初始化
          lineFormRules['batchNo'][0].required = false;
          // 显示弹窗
          this.dialogFormVisible = true;
          this.$nextTick(() => {
            this.clearForm('lineForm');
          })
        }else{
          this.$message({
            message: "请先维护头表单信息",
            type: "info"
          });
        }
      })
    },
    /**
     * 编辑行
     * 编辑明细行
     * @param {Object} act 按钮配置信息
     * @param {Object} row 行信息
     * @return void
     */
    handleUpdate (act, row) {
      // 编辑行
      // 该操作是编辑行 改变编辑行状态
      this.isEditLine = true;
      // 显示弹窗
      this.dialogFormVisible = true;
      // 复制行数据
      this.mate.mateFormerLine.values = {...row};
      if (row.batchNo){
        this.lineFormRules['batchNo'][0].required = true; 
      }else {
        this.lineFormRules['batchNo'][0].required = false;
      };
      // 获取库存组织下仓库列表
      if (!this.warehouseList.length) this.getWarehouse();
      // 获取工单下物料行列表
      if (!this.componentCodeOptions.length) this.getSubMaterialsCode();;
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
          lineListRows = lineListRows.filter(line => line.serialNumber != item);
        });
        // 需要删除的行的 id数组 保存在 rowId 里
        let rowId = { id: selectedLines.map(item => item.id) };
        // 删除之后，就将剩余从新排序
        // for (let l = 0; l < lineListRows.length; l++) {
        //   lineListRows[l].index = l + 1;
        // }
        _this.initLineData(lineListRows);
        this.handleComponentOptions();
        // 如果删除行有行id就向后台请求删除
        if (rowId.id.length > 0) {
          SERVICES.WORK_ORDER_ISSUE.handleDeleteLine(rowId.id).then(() =>{
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
     * 刷新数据
     * 保存后刷新本页面数据
     * 并把头部表单数据 Number 转 String
     * 并设定索引和已实施勾选状态
     * @params {Object} data ecn数据
     */
    updateDate(data) {
      let detail = data.detail;
      detail.lineList = this.initLineData(detail.lineList);
      this.mate.mateFormerHeader.values = detail.header;
      this.mate.mateListLine.rows = detail.lineList;
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
      // 验证表单 通过后保存信息到列表行中
      this.$refs['lineForm'].$refs['form'].validate((valid,obj) => {
        if (valid) {
          let curIdx = mate.mateFormerLine.values.index;
          let values = mate.mateFormerLine.values;
          // 检验手动填写序号是否已存在 给出提示并自动填写序号
          let isExist = _this.checkNum(mate.mateFormerLine.values["serialNumber"], curIdx, lineId);
          if (isExist){
            mate.mateFormerLine.values["serialNumber"] = _this.createNum();
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
     */
    initLineData (data) {
      data.forEach((item,index) =>{
        // 设置索引 从 1 开始
        item.index = index + 1;
      })
      return data;
    },
    /**
     * 清空行数据
     * @param void
     * @return void
     */
    clearLineList (){
      this.mate.mateListLine.rows = [];
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
      // 重置行状态
      this.resetLineState();
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
     * @param void
     * @return void
     */
    resetDialogForm (){
      let values = this.mate.mateFormerLine.values;
      values['serialNumber'] = this.createNum();  //序号
      values['componentCode'] = "";              // 子件编码
      values['componentName'] = "";              // 子件名称
      values['specs'] = "";                      // 规格
      values['shouldCount'] = undefined;         // 需求数量
      values['procedures'] = 10;                 // 工序
      values['sentCount'] = undefined;           // 已发数量
      values['orderCount'] = undefined;          // 发料数量
      values['warehouseId'] = "";                // 仓库 id
      values['warehouseName'] = "";              // 供应名称
      values['warehouseCode'] = "";              // 仓库编码
      values['excessFlag'] = "0";                // 是否超领
      values['locationId'] = "";                 // 货位 id
      values['location'] = "";                   // 货位名称
      values['batchNo'] = "";                    // 批次
    },
    /**
     * 递归自动生成序号 10/20/30....
     * 默认为 10 如果当前行序号有10了 则递增10
     * @param {Number} num 序号
     * @return {Number} number 序号
     */
    createNum (num, step) {
      let number = num || 10;
      let lineLen = this.mate.mateListLine.rows.length;
      if (this.checkNum(number)){
        number += step || 10;
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
      lineListRows.forEach(item => serialNumberArr.push(item.serialNumber));
      return serialNumberArr.includes(num);
    },
    /**
     * 获取库存组织 并保存到 orgUnitOptions
     * @param void
     * @return void
     */
    getOrgUnit () {
      SERVICES.BASE.getOrgUnit().then((res) =>{
        let data = res.data;
        let orgUnitOptions = [];
        if (data.length){
          data.forEach(item => {
            orgUnitOptions.push({
              label: item.name,
              value: item.id,
              id: item.id
            })
          });
          // 将库存组织保存到表单配置中
          this.headForm['orgId'].options = orgUnitOptions;
        }else{
          this.$notify.info({
            title: '消息',
            message: '尚未配置库存组织，请联系管理员'
          });
        }
      })
    },
    /** 获取供应仓库
     * @param void
     * @return void
     */
    getWarehouse (){
      let id = this.orgId;
      let _this= this;
      if (!id) return;
      SERVICES.BASE.getWarehouseList(id).then(res =>{
        let data = res.data || [];
        this.warehouseList = [];
        if(data.length){
          data.forEach(item =>{
            this.warehouseList.push({
              value: item.id,
              label: item.code,
              id: item.id,
              name: item.name
            })
          })
        }else{
          this.$notify.info({
            title: '消息',
            message: '此库存组织下尚未配置仓库'
          });
        }
        this.lineForm['warehouseId'].options = this.warehouseList;
        // 如果是编辑/修改 根据仓库 id 请求货位列表
        if (_this.isEdit) {
          _this.getLocation(_this.mate.mateFormerLine.values["warehouseId"]);
        }
      })
    },
    /** 获取货位
     * @param {String} val 仓库 id
     * @return void
     */
    getLocation (val){
      if (!val) return;
      SERVICES.BASE.getLocationList(val).then(res =>{
        let data = res.data || [];
        this.locationList = [];
        if(data.length){
          data.forEach(item =>{
            this.locationList.push({
              value: item.id,
              label: item.name
            })
          })
          this.lineFormRules["locationId"][0].required = true;
        }else{
          this.$notify.info({
            title: '消息',
            message: '此仓库未启用货位'
          });
        }
        this.lineForm['locationId'].options = this.locationList;
      })
    },
    /** 获取工单下行的子件物料编码
     * @param void
     * @return void
     */
    getSubMaterialsCode (){
      let _this = this;
      let code = this.mate.mateFormerHeader.values["workOrderCode"];
      let type = "2";
      let options = this.componentCodeOptions;
      if (options.length || !code) return;
      SERVICES.WORK_ORDER_ISSUE.getCodeInfo(code, type).then(res =>{
        let data = res.data.data && res.data.data.lineList;
        _this.componentCodeOptions = [];
        if(data && data.length){
          _this.componentCodeOptions = [...data];
          _this.componentCodeOptions.forEach(item =>{
            item.label = item.componentCode;
            item.name = item.componentName;
            item.value = item.componentCode;
          })
          _this.handleComponentOptions();
        }else{
          this.$notify.info({
            title: '消息',
            message: '此工单下尚未配置物料'
          });
        }
      })
    },
    /**
     * 禁用/恢复组件列表选项
     * 禁用已被选过的选项
     * @param {String} code 编码
     * @return void
     */
    handleComponentOptions(){
      let _this = this;
      this.componentCodeOptions.forEach(item =>{
        item.disabled = false;
      });
      this.mate.mateListLine.rows.forEach(line =>{
        let componentItem = _this.componentCodeOptions.find(item =>{
          return item.label == line.componentCode;
        });
        if (componentItem) componentItem.disabled = true;
      })
      this.lineForm['componentCode'].options = this.componentCodeOptions;
    },
    /** 
     * 编号检索
     * 带出工单信息
     * @param {String} val 编号
     * @return void
     */
    handleCodeInfo(val) {
      if (!val) return;
      let type = "1";
      let mateFormerHeaderValues = this.mate.mateFormerHeader.values;
      SERVICES.WORK_ORDER_ISSUE.getCodeInfo(val, type).then(res =>{
        let data = res.data.data && res.data.data.header;
        if (data){
          mateFormerHeaderValues["orgId"] = this.orgId = data.orgId;
          mateFormerHeaderValues["orgName"] = data.orgName;
          mateFormerHeaderValues["materialsCode"] = data.materialsCode;
          mateFormerHeaderValues["materialsName"] = data.materialsName;
          mateFormerHeaderValues["specs"] = data.specs;
          mateFormerHeaderValues["workOrderId"] = data.id;
        }else{
          this.$message({
            type: "warning",
            message: res.data.message
          });
        }
      })
    },
    /**
     * 刷新tab页签
     * @param void
     * @return void
     */
    backToList () {
      this.$root.monitor({ url: this.mate.mateFormerHeader.next });
    },
  },
  watch: {}
};
</script>
