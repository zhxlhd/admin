<!-- created by zhongxiaolong on 2019/11/12 -->
<!-- 生产工单模块下新增模块 ProductionWorkOrderAdd -->
<template>
  <div style="position: relative;">
    <!-- 头部button Start-->
    <h-btn :btns="btns" @click="handleBtns"></h-btn>
    <!-- 头部button End-->
    <!-- 头部Form Start-->
    <dynamic-form ref="headForm" 
                  :mate="mate.mateFormerHeader" 
                  :rules="headerFormRules" 
                  :eventCfg="headerFormEventConfig" 
                  @btnClick="handleClick"
                  @events="handleEvents"></dynamic-form>
    <!-- 头部Form End-->
    <!-- 底部 lineList Start-->
    <k-table-line ref="lineTable"
                  :mate="mate.mateListLine"
                  @actionSelected="handleSelected"
                  @btnClick="handleButtons"
                  @action="handleActions"
                  :toSort="toSort"
                  @uploadSuccess="uploadSuccess"
                  :btnDisable="btnDisable"
                  :actDisable="actDisable"
                  :actionWidth="actionWidth">
      <div slot="tips" v-if="!isEdit" style="color: red; font-size: 12px; position: absolute; top: -18px; left: 0;">{{tips}}</div>
    </k-table-line>
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
  </div>
</template>

<script>
import SERVICES from "@/services"
import DictStore from '@/store/dict-store.js'

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
      soNumDirty: false,         // 是否修改了订单编号
      uploadUrl: "",             // 上传/导入 api
      uploadMethod: "POST",      // 请求上传/导入服务的方法
      btnDisable: false,         // 头部按钮是否禁用
      actDisable: false,         // 操作列按钮是否禁用
      orgId: "",                 // 当前库存组织 id
      tips: "注：如果需要载入物料行，请先载入物料行，在进行新增操作",
      // 头部表单控件规则
      headerFormRules: {
        // 工单编号
        workOrderCode: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }],
        // 库存组织
        orgId: [{ required: true, message: "该输入项为必输项", trigger: "change", disabled: false }],
        // 工单类型
        categoryType: [{ required: true, message: "该输入项为必输项", trigger: "change", disabled: true }],
        // 工单分类
        categoryId: [{ required: true, message: "该输入项为必输项", trigger: "change", disabled: true }],
        // 物料编码
        materialsCode: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: true }],
        // 开工时间
        startTimeStr: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }],
        // 预计完工时间
        completeTimeStr: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }],
        // 生产数量
        productCount: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false, type: "number" }],
        // 供应类型
        supplyType: [{ required: true, message: "该输入项为必输项", trigger: "change", disabled: false }],
        // 供应仓库
        warehouseId: [{ required: true, message: "该输入项为必输项", trigger: "change", disabled: true }],
        // 仓库名称
        warehouseName: [{disabled: true}],
        // 物料名称
        materialsName: [{disabled: false}],
        // 单位
        unit: [{disabled: false}],
        // 规格
        specs: [{disabled: false}],
        // 备注
        remarks: [{disabled: false}]
      },
      // 头部表单事件配置
      headerFormEventConfig: {
        // 工单编号
        workOrderCode:{change: true},
        // 库存组织编号
        orgId:{change: true},
        // 工单类型
        categoryType:{change: true},
        // 物料编码
        materialsCode:{change: true},
        // 供应仓库
        warehouseId:{change: true}
      },
      // 行列表新增表单控件规则
      lineFormRules: {
        // 序号
        serialNumber: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false, type: "number" }],
        // 子件编码
        componentCode: [{ required: true, message: "该输入项为必输项", trigger: "blur"}],
        // 子件名称
        componentName: [{ disabled: true }],
        // 子件类型
        type: [{ disabled: true }],
        // 规格
        specs: [{ disabled: true }],
        // 单位
        unit: [{ disabled: true }],
        // 用量
        used: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false, type: "number" }],
        // 用量倒数
        usageReciprocal: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false, type: "number" }],
        // 损耗数量
        lossCount: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false, type: "number" }],
        // 应领数量
        shouldCount: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false, type: "number" }],
        // 已发数量
        sentCount: [{ disabled: true, type: "number" }],
      },
      // 行列表新增表单事件配置
      lineFormEventConfig: {
        // 子件编码
        componentCode: {change: true},
        // 用量
        used: {change: true},
        // 用量倒数
        usageReciprocal: {change: true}
      }
    };
  },
  computed: {},
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
      // *el-input-number 默认值为0,若要置空需要将值设置为 undefined
      mateFormerHeaderValues['productCount'] = undefined;     // 数量
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
        headerFormRules['categoryId'][0].disabled = false; // 允许修改工单分类
        headerFormRules['workOrderCode'][0].disabled = true;
        headerFormRules['orgId'][0].disabled = true;
        headerFormRules['materialsCode'][0].disabled = true;
        headerFormRules['materialsName'][0].disabled = true;
        headerFormRules['unit'][0].disabled = true;
        headerFormRules['specs'][0].disabled = true;
        this.orgId = mateFormerHeaderValues.orgId;
        let categoryType = mateFormerHeaderValues.categoryType;
        // 获取仓库
        this.getWarehouse(this.orgId);
        // 获取工单分类
        this.getTicketClassification(categoryType);
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
        // 导入模板
        upload: () => this.handleUpload(),
        // 导出为模板
        download: () => this.handleDownload(),
        // 载入行
        loadLine: () => this.handleLoad(),
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
    /** 动态表单按钮事件管理
     * @param {String} name 控件的 name
     * @return {Function} 执行事件函数
     */
    handleClick(name){
      const btnControl = {
        blue: () => this.handleBlue(),
        default: () => { return }
      }
      return (btnControl[name] || btnControl.default)();
    },
    handleBlue(){
      alert('btnClick')
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
        workOrderCode: (val) => this.handleCode(val),
        // 组织机构
        orgId: (val) => this.handleOrgId(val),
        // 供应仓库
        warehouseId: (val) => this.handleWarehouseId(val),
        // 工单类型
        categoryType: (val) => this.handleCategoryType(val),
        // 物料编码
        materialsCode: (val) => this.handleMaterialsInfo(val),
        // 子件编码
        componentCode: (val) => this.handleComponentCodeInfo(val),
        // 用量
        used: (val) => this.usedChange(val),
        // 用量倒数
        usageReciprocal: (val) => this.usageReciprocalChange(val),
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
    /** 库存组织change事件
     * 库存组织变化的时候 保存当前的库存组织 id 请求物料编码、工单分类、供应仓库需要用到
     * 库存组织变化的时候 清空与库存组织相关联字段的值 
     * @param void
     * @return void
     */
    handleOrgId(val) {
      let orgName = this.headForm["orgId"].options.find(item => item.value == val).label;
      this.mate.mateFormerHeader.values["orgName"] = orgName;
      // 保存当前库存 id
      this.orgId = val;
      if(val) {
        this.headerFormRules["categoryType"][0].disabled = false;
        this.headerFormRules["warehouseId"][0].disabled = false;
        this.headerFormRules["materialsCode"][0].disabled = false;
      }
      // 清空相关联字段值
      let mateFormerHeaderValues = this.mate.mateFormerHeader.values;
      mateFormerHeaderValues["warehouseId"] = "";
      mateFormerHeaderValues["warehouseName"] = "";
      mateFormerHeaderValues["categoryType"] = "";
      mateFormerHeaderValues["categoryId"] = "";
      mateFormerHeaderValues["materialsCode"] = "";
      mateFormerHeaderValues["materialsName"] = "";
      mateFormerHeaderValues["unit"] = "";
      mateFormerHeaderValues["specs"] = "";
      // 获取库存组织下仓库列表
      this.getWarehouse(val);
    },
    /** 仓库change事件
     * @param {Any} val 控件的值
     * @return void
     */
    handleWarehouseId(val) {
      let mateFormerHeaderValues = this.mate.mateFormerHeader.values;
      let warehouse = this.headForm["warehouseId"].options.find(item => item.value == val);
      mateFormerHeaderValues["warehouseName"] = warehouse["name"];
      mateFormerHeaderValues["warehouseCode"] = warehouse["label"];
    },
    /** 工单类型change事件
     * @param {String} val 工单类型 value "1": 标准工单; "2": 非标准工单 
     * @return void
     */
    handleCategoryType(val) {
      if (val) this.headerFormRules["categoryId"][0].disabled = false;
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
      // 获取工单分类
      this.getTicketClassification(val);
    },
    /** 物料编码change事件
     * @param void
     * @return void
     */
    handleMaterialsInfo(val) {
      this.getMaterialsInfo(val)
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
        mateLineFormValues["type"] = '';
        mateLineFormValues["unit"] = '';
        this.handleComponentOptions();
      }else {
        let curItem = this.componentCodeOptions.find(item => {
          return item.value === val;
        });;
        mateLineFormValues["componentName"] = curItem.name;
        mateLineFormValues["specs"] = curItem.specs;
        mateLineFormValues["type"] = curItem.category;
        mateLineFormValues["unit"] = curItem.unit;
        this.handleComponentOptions();
      }
    },
    /**
     * 计算用量的倒数
     * @param {String} value 默认传参
     * @return void
     */
    usedChange (value) {
      let mateFormerLineValues = this.mate.mateFormerLine.values;
      let curValue = Number(value);
      if(curValue==0) {
        this.$set(mateFormerLineValues, 'usageReciprocal', value);
      }else{
        let num = (1/curValue).toFixed(5); // 保留五位小数
        this.$set(mateFormerLineValues, 'used', curValue.toFixed(5));
        this.$set(mateFormerLineValues, 'usageReciprocal', num);
      }
    },
    /**
     * 计算用量
     * @param {String} value 默认传参
     * @return void
     */
    usageReciprocalChange (value) {
      let mateFormerLineValues = this.mate.mateFormerLine.values;
      let curValue = Number(value);
      if(curValue==0) {
        this.$set(mateFormerLineValues, 'used', value);
      }else{
        let num = (1/curValue).toFixed(5); // 保留五位小数
        this.$set(mateFormerLineValues, 'usageReciprocal', curValue.toFixed(5));
        this.$set(mateFormerLineValues, 'used', num);
      }
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
          this.resetDialogForm(this.mate.mateFormerLine.values);
          this.getSubMaterialsCode();
          this.handleComponentOptions();
          // 取消禁用控件
          let lineFormRules = this.lineFormRules;
          lineFormRules['serialNumber'][0].disabled = false;
          lineFormRules['componentCode'][0].disabled = false;
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
      // 禁用控件
      let lineFormRules = this.lineFormRules;
      lineFormRules['serialNumber'][0].disabled = true;
      lineFormRules['componentCode'][0].disabled = true;

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
          SERVICES.PRODUCTION_WORK_ORDER.handleDeleteLine(rowId.id).then(() =>{
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
     * 导入模板
     * @param void
     * @return void
     */
    handleUpload () {
      let requestDateStr = this.mate.mateFormerHeader.values.requestDateStr;
      let headerId = this.mate.mateFormerHeader.values.id || "";
      let data = {'requestDateStr':requestDateStr, 'headerId':headerId};
      if(!requestDateStr){
        this.$message({
          type: "info",
          message: "请先选择需求日期!"
        });
        return;
      }
      let url = this.uploadUrl || this.btn.url;
      let method = this.uploadMethod;
      this.$refs['lineTable'].uploadFile(url, method, data);
    },
    /**
     * 上传成功
     * 
     */
    uploadSuccess(data) {
      this.isEdit = true;
      data = this.initLineData(data);
      this.mate.mateListLine.rows = data;
      this.$message({
        type:'success', 
        message:`成功导入“ ${data.length} ”条任务`
      })
    },
    /**
     * 导出为模板
     * @param void
     * @return void
     */
    handleDownload () {
      let mate = {};
      mate.header = this.mate.mateFormerHeader.values;
      mate.lineList = this.mate.mateListLine.rows;
      mate = JSON.stringify(mate);
      this.$http({
        url: `${this.BASEAPI}${this.btn.url}`,
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
          'Accept': 'application/json',
          'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
          'Content-Type': 'application/json;charset=utf8'
        },
        responseType: 'arraybuffer',
        body: mate
      }).then(function (response) {
        // blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
        let blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display:none');
        a.setAttribute('href', objectUrl);
        a.setAttribute('download', this.btn.modular);
        a.click();
        URL.revokeObjectURL(objectUrl);
      })
    },
    /**
     * 载入行
     * @param void
     * @return void
     */
    handleLoad() {
      if (this.isEdit) {
        this.$message({
          type: "info",
          message: "修改状态不允许载入操作"
        })
        return;
      }
      let _this = this;
      // 头部表单数据
      let mateFormerHeaderValues = this.mate.mateFormerHeader.values
      // 工单类型
      let categoryType = mateFormerHeaderValues["categoryType"];
      // 物料编码
      let materialsCode = mateFormerHeaderValues["materialsCode"];
      // 生产数量
      let productCount = mateFormerHeaderValues["productCount"];
      if (categoryType === "2"){
        this.$message({
          type:'warning', 
          message:"只允许载入标准工单的物料行"
        })
        return;
      }
      if (!materialsCode || !productCount){
        this.$message({
          type:'warning', 
          message:"请先输入物料编码和生产数量"
        })
        this.$refs['headForm'].$refs["form"].validateField(["materialsCode","productCount"]);
        return;
      }
      // 如果新增了物料行再点载入提示
      if(this.mate.mateListLine.rows.length){
        this.$confirm('此操作将会覆盖已新增的物料行, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 获取物料编码下的物料行
            this.getSubMaterialsLines(materialsCode, productCount);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消载入'
            });          
          });
      }else {
        // 获取物料编码下的物料行
        this.getSubMaterialsLines(materialsCode, productCount);
      }
    },
    /** 获取物料编码下的物料行
     * @param {String} materialsCode 物料编码
     * @param {Number} productCount 生产数量
     * @return void
     */
    getSubMaterialsLines(materialsCode, productCount){
      SERVICES.BASE.getSubMaterialsLines(materialsCode, productCount).then(res =>{
        let lineListRows = res.data ? res.data.lineList : [];
        if(lineListRows.length){
          lineListRows = this.initLineData(lineListRows);
          // 行列表赋值
          this.mate.mateListLine.rows = lineListRows;
        }else {
          this.$notify.info({
            title: '消息',
            message: '该物料编码尚未配置BOM,请到BOM模块配置BOM,或者手动新增物料行'
          });
        }
      })
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
     * @param {Object} values 表单数据
     * @return void
     */
    resetDialogForm (values){
      values['serialNumber'] = this.createNum();  //序号
      values['componentCode'] = "";              // 子件编码
      values['componentName'] = "";              // 子件名称
      values['specs'] = "";                      // 规格
      values['type'] = "";                      // 子件类型
      values['unit'] = "";                       // 单位
      values['lossCount'] = undefined;           // 损耗数量
      values['sentCount'] = undefined;           // 已发数量
      values['shouldCount'] = undefined;         // 应领数量
      values['usageReciprocal'] = undefined;     // 用量倒数
      values['used'] = undefined;                // 用量
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
     * @param {String} id 库存组织 id
     * @return void
     */
    getWarehouse (id){
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
        this.headForm['warehouseId'].options = this.warehouseList;
      })
    },
    /** 获取工单分类
     * @param {String} val 工单类型 id
     * @return void
     */
    getTicketClassification (val){
      let orgId = this.orgId;
      SERVICES.BASE.getTicketClassificationList(orgId, val).then(res =>{
        let data = res.data ? res.data.data : [];
        this.ticketClassificationList = [];
        if(data.length){
          data.forEach(item =>{
            this.ticketClassificationList.push({
              value: item.id,
              label: item.categoryName,
              id: item.id
            })
          })
        }else{
          this.$notify.info({
            title: '消息',
            message: '此库存组织下尚未配置工单分类'
          });
        }
        this.headForm['categoryId'].options = this.ticketClassificationList;
      })
    },
    /** 获取子件物料编码
     * @param void
     * @return void
     */
    getSubMaterialsCode (){
      let _this = this;
      let orgId = this.orgId;
      let type = "";
      let options = this.componentCodeOptions;
      if (options.length) return;
      SERVICES.BASE.getMaterialsCode(orgId, type).then(res =>{
        let data = res.data ? res.data : [];
        _this.componentCodeOptions = [];
        if(data.length){
          data.forEach(item => {
            _this.componentCodeOptions.push({
              label: item.subcode,             // 编码
              value: item.subcode,             // 编码
              name: item.name,                 // 名称
              id: item.subcode,                // id
              unit: item.basicUnit,            // 单位
              specs: item.basicSpec,           // 规格
              category: item.materialCategory, // 类型
              disabled: false                  // 选项是否禁用
            })
          });
          // 过滤父组件
          let parentComponent = _this.mate.mateFormerHeader.values["materialsCode"];
          _this.componentCodeOptions = _this.componentCodeOptions.filter(item =>{
            return item.label != parentComponent;
          });
          // _this.lineForm['componentCode'].options = _this.componentCodeOptions;
          _this.handleComponentOptions();
        }else{
          this.$notify.info({
            title: '消息',
            message: '此库存组织下尚未配置物料编码'
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
     * 检索物料编码
     * 检索物料是否存在，
     * 存在的话，自动带出产品名称（物料名称），产品规格（物料规格）。
     * 不存在提示“此物料编码不存在”
     * @param {Sting} val 物料编码 (基础数据-物料管理-物料编码)
     * @return void
     */
    getMaterialsInfo(val) {
      if (!val) return;
      let _this = this;
      let orgId = this.orgId;
      SERVICES.BASE.getMaterialsInfo(val, orgId).then(res => {
        let values = _this.mate.mateFormerHeader.values;
        let data = res.data && res.data.data;
        if (data) {
          values["materialsName"] = data.name || "";
          values["specs"] = data.basicSpec || "";
          values["unit"] = data.basicUnit || "";
        } else {
          _this.$message({
            type: "warning",
            message: "此物料编码不存在,请手动输入物料名称、规格和单位"
          });
          values["materialsName"] = "";
          values["specs"] = "";
          values["unit"] = "";
        }
      });
    },
    /** 
     * 客户地点设置
     * 切换客户改变对应地点的列表
     * 编辑/修改的时候也需要根据客户设置地点列表
     * @param {String} val 客户的 code
     * @return void
     */
    handleCustomerAddress(val) {
      let customerObj = this.customerList.find(item => item.value === val);
      let AddressObj = this.mate.mateFormerHeader.fields.find(item => item.name==="customerAddressId") || {};
      AddressObj.options = customerObj.addressList;
      this.mate.mateFormerHeader.values['customerName'] = customerObj.label;
    },
    /** 
     * 编号检索
     * 是否已存在 编号不允许重复
     * @param {String} val 编号
     * @return void
     */
    handleCode(val) {
      if (!val) return;
      SERVICES.PRODUCTION_WORK_ORDER.checkCode(val).then(res =>{
        let exist = res.data.data;
        if (exist){
          this.$message({
            message: "此编号已存在请重新输入",
            type: 'warning'
          })
          this.mate.mateFormerHeader.values['workOrderCode'] = "";
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

