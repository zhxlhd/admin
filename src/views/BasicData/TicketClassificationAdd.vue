<!-- created by zhongxiaolong on 2019/10/10 -->
<!-- 新增工单分类模块 TicketClassificationAdd -->
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
  </div>
</template>

<script>
import SERVICES from "@/services";

export default {
  components: {
    HBtn: function index(resolve){
      require(["@/components/Button/HBtn.vue"], resolve);
    },
    DynamicForm: function index(resolve){
      require(["@/components/form/DynamicForm.vue"], resolve);
    }
  },
  props: {
    mate: Object
  },
  data() {
    return {
      status: "ENABLE",          // 新建状态默认“未启动” （必配）
      headForm: {},              // 头部表单（必配）
      headerId: null,            // 任务 id（必配）
      isEdit: false,             // 当前行是否在编辑（必配）
      isDirty: false,            // 是否修改了数据（必配）
      // 头部表单控件规则
      headerFormRules: {
        // 库存组织
        orgId: [
          { required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }
        ],
        // 工单类型
        categoryType: [
          { required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }
        ],
        // 分类
        categoryName: [
          { required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }
        ],
        // 分类说明
        description: [
          { disabled: false }
        ],
      },
      // 头部表单事件配置
      headerFormEventConfig: {
        orgId:{ change: true}
      }
    };
  },
  created() {
    this.init();
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
        this.status = mateFormerHeaderValues.status || "ENABLE";
        // 头表单赋值
        mate.mateFormerHeader.values = mateFormerHeaderValues;
      }
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
      let [url, next] = [this.mate.mateFormerHeader.url, this.mate.mateFormerHeader.next];
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
    /** 动态表单事件管理
     * @param {String} event 事件名称
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} 操作函数
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
     * @return {Function} input操作函数
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
     * @return {Function} change操作函数
     */
    handleChange(val, name) {
      this.isDirty = true;
      const changeControl = {
        orgId: () => this.handleOrgId(val),
        default: () => { return }
      }
      return (changeControl[name] || changeControl.default)(val);
    },
    /** blur 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} blur操作函数
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
     * @return {Function} focus操作函数
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
     * @return {Function} clear操作函数
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
     * @return {Function} visibleChange操作函数
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
     * @return {Function} removeTag操作函数
     */
    handleRemoveTag(val, name) {
      const removeTagControl = {
        default: () => { return }
      }
      return (removeTagControl[name] || removeTagControl.default)(val);
    },
    /** 保存库存组织名字
     * 当库存组织改变的时候 保存对应的库存组织名字
     * @param {String} val 库存组织的 value
     * @return void
     */
    handleOrgId(val){
      let orgName = this.headForm["orgId"].options.find(item => item.value == val).label;
      this.mate.mateFormerHeader.values["orgName"] = orgName;
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
     * 刷新tab页签
     * @param void
     * @return void
     */
    backToList () {
      this.$root.monitor({ url: this.mate.mateFormerHeader.next });
    },
  }
};
</script>

