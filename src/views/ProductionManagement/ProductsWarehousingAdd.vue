<!-- created by zhongxiaolong on 2019/11/12 -->
<!-- 产成品入库下新增模块 ProductsWarehousingAdd -->
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
      locationList: [],          // 货位列表（选配）
      ticketClassificationList: [], // 仓库列表（选配）
      componentCodeOptions: [],  // 子件物料编码
      selectedIds: [],           // 所勾选行的序号
      selectedLines: [],         // 勾选行
      headForm: {},              // 头部表单（必配）
      lineValues: {},            // 新增行表单默认数据（必配）
      toSort: true,              // 是否本地排序 一般用于没有分页的列表
      showDict: '',              // 数字词典是否禁用 '1'/'0'
      dialogRender: true,        // 用作强制重新渲染弹窗
      dialogFormVisible: false,  // 新增行弹窗是否显示
      objectColumns: {},         // 列表行字段
      headerId: null,            // 任务 id
      isEdit: false,             // 当前行是否在编辑
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
        // 工单数量
        productCount: [{disabled: true, type: "number"}],
        // 已完成数量
        completedCount: [{disabled: true, type: "number"}],
        // 完工数量
        orderCount: [{ required: true, message: "该输入项为必输项", trigger: "blur",disabled: false, type: "number"}],
        // 仓库
        warehouseId: [{ required: true, message: "该输入项为必输项", trigger: "change", disabled: false }],
        // 仓库名称
        warehouseName: [{disabled: true}],
        // 货位
        locationId: [{ required: false, message: "该输入项为必输项", trigger: "change", disabled: false }],
        // 合格
        qualifiedFlag: [{ required: true, message: "该输入项为必输项", trigger: "change", disabled: false }],
        // 备注
        remarks: [{disabled: false}]
      },
      // 头部表单事件配置
      headerFormEventConfig: {
        // 工单编号
        workOrderCode:{change: true},
        // 仓库
        warehouseId:{change: true},
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
      // 头表单
      mate.mateFormerHeader.fields.map((item) => { this.headForm[item.name] = item; });
      // 编辑/修改 后台会传detail回来
      let detail = mate.detail;
      // *el-input-number 默认值为0,若要置空需要将值设置为 undefined
      mateFormerHeaderValues['productCount'] = undefined;   // 工单数量
      mateFormerHeaderValues['completedCount'] = undefined; // 已完成数量
      mateFormerHeaderValues['orderCount'] = undefined;     // 完工数量
      // 如果有 detail 说明当前操作是编辑/修改
      if (detail) {
        // 保存头表单数据
        mateFormerHeaderValues = detail.header || {};
        // 改变当前模块为编辑/修改状态
        this.isEdit = true;
        // 保存头部 id
        this.headerId = detail.header.id;
        this.status = mateFormerHeaderValues.status || "SAVE";
        // 头表单赋值
        mate.mateFormerHeader.values = mateFormerHeaderValues;
        // 禁用控件
        let headerFormRules = this.headerFormRules;
        headerFormRules['workOrderCode'][0].disabled = true;
        this.orgId = mateFormerHeaderValues.orgId;
        this.getWarehouse();
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
     * 提交表单数据
     * @param void
     * @return void
     */
    handleSubmit() {
      let mateFormerHeaderValues = this.mate.mateFormerHeader.values;
      if((mateFormerHeaderValues.orderCount + mateFormerHeaderValues.completedCount) > mateFormerHeaderValues.productCount){
        this.$message({
          type: 'error',
          message: `${this.headForm['orderCount'].label}和${this.headForm['completedCount'].label}的和不能大于${this.headForm['productCount'].label}`
        })
        return
      }
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
      if (mate.lineList && !mate.lineList.length) {
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
      let mateFormerHeaderValues = this.mate.mateFormerHeader.values;
      let warehouse = this.headForm["warehouseId"].options.find(item => item.value == val);
      mateFormerHeaderValues["warehouseName"] = warehouse["name"];
      mateFormerHeaderValues["warehouseCode"] = warehouse["label"];
      mateFormerHeaderValues["locationId"] = "";
      this.headForm['locationId'].options = [];
      this.headerFormRules["locationId"][0].required = false;
      // 获取货位列表
      this.getLocation(val);
    },
    /** 货位change事件
     * @param {Any} val 控件的值
     * @return void
     */
    handleLocationId(val) {
      let mateFormerHeaderValues = this.mate.mateFormerHeader.values;
      let location = this.headForm["locationId"].options.find(item => item.value == val);
      mateFormerHeaderValues["location"] = location["label"];
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
        this.headForm['warehouseId'].options = this.warehouseList;
        // 如果是编辑/修改 根据仓库 id 请求货位列表
        if (this.isEdit) this.getLocation(this.mate.mateFormerHeader.values["warehouseId"]);
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
          this.headerFormRules["locationId"][0].required = true;
        }else{
          this.$notify.info({
            title: '消息',
            message: '此仓库未启用货位'
          });
        }
        this.headForm['locationId'].options = this.locationList;
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
        }else{
          this.$notify.info({
            title: '消息',
            message: '此工单下尚未配置物料'
          });
        }
      })
    },
    /** 
     * 编号检索
     * 带出工单信息
     * @param {String} val 编号
     * @return void
     */
    handleCodeInfo(val) {
      let mateFormerHeaderValues = this.mate.mateFormerHeader.values;
      if (!val) {
        this.resetCodeInfo(mateFormerHeaderValues);
        return;
      }
      let type = "1";
      SERVICES.WORK_ORDER_ISSUE.getCodeInfo(val, type).then(res =>{
        let data = res.data.data && res.data.data.header;
        if (data){
          mateFormerHeaderValues["orgId"] = this.orgId = data.orgId;
          mateFormerHeaderValues["orgName"] = data.orgName;
          mateFormerHeaderValues["materialsCode"] = data.materialsCode;
          mateFormerHeaderValues["materialsName"] = data.materialsName;
          mateFormerHeaderValues["specs"] = data.specs;
          mateFormerHeaderValues["workOrderId"] = data.id;
          mateFormerHeaderValues["productCount"] = data.productCount;
          mateFormerHeaderValues["completedCount"] = data.completedCount;
          mateFormerHeaderValues["orderCount"] = undefined;
          this.getWarehouse();
        }else{
          this.resetCodeInfo(mateFormerHeaderValues);
          this.$message({
            type: "warning",
            message: res.data.message
          });
        }
      })
    },
    /** 重置工单信息
     * @param {Object} values 表单数据
     * @return void
     */
    resetCodeInfo(values){
      // 库存组织 id
      values["orgId"] = this.orgId = "";
      // 库存组织名称
      values["orgName"] = "";
      // 物料编码
      values["materialsCode"] = "";
      // 物料名称
      values["materialsName"] = "";
      // 规格
      values["specs"] = "";
      // 工单数量
      values['productCount'] = undefined;
      // 已完成数量
      values['completedCount'] = undefined;
      // 完工数量
      values['orderCount'] = undefined;
      // 工单 id
      values["workOrderId"] = "";
      // 仓库
      values["warehouseId"] = "";
      // 货位
      values["locationId"] = "";
      // 仓库列表清空
      this.headForm['warehouseId'].options = [];
      // 货位列表清空
      this.headForm['locationId'].options = [];
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
