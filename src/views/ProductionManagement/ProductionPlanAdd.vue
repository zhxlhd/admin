<!-- created by zhongxiaolong on 2019/11/12 -->
<!-- 生产计划下新增模块 ProductionPlanAdd -->
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
                  :formLayout="headerFormLayout"
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
      @uploadSuccess="uploadSuccess"
      :btnDisable="btnDisable"
      :actDisable="actDisable"
      :actionWidth="actionWidth"
    ></k-table-line>
    <!-- 底部 lineList End-->
    <!-- 新增行弹窗 Start -->
    <el-dialog title="填写明细行" width="80%" :visible.sync="dialogFormVisible" :before-close="lineDialogClose" :close-on-click-modal="false">
      <dynamic-form ref="lineForm" 
        :mate="mate.mateFormerLine" 
        :rules="lineFormRules" 
        :eventCfg="lineFormEventConfig" 
        :orgId = "orgId"
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
import { PRODUCTION_MANAGEMENT_API } from "@/services/apis";
import SERVICES from "@/services";

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
      status: "SAVE",            // 新建状态默认“未启动”
      actionWidth: "",           // action 操作列宽度
      btns: ['提交','取消'],      // 责任人列表
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
      soNumDirty: false,         // 是否修改了订单编号
      materialsCodeDirty: false, // 是否修改了物料编码
      uploadUrl: "",             // 上传/导入 api
      uploadMethod: "POST",      // 请求上传/导入服务的方法
      btnDisable: false,
      actDisable: false,
      orgId: null,
      headerFormLayout: [ // 渲染表单字段和字段布局
        ['orgId'],
        ['planCode','planName'],
        ['startDateStr','endDateStr'],
        ['remarks']
      ],
      // 头部表单控件规则
      headerFormRules: {
        // 库存组织
        orgId: [{ required: true, message: "该输入项为必输项", trigger: "change", disabled: false }],
        // 计划编号
        planCode: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }],
        // 计划名称
        planName: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }],
        // 开始日期
        startDateStr: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }],
        // 结束日期
        endDateStr: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }],
        // 备注
        remarks: [{ disabled: false }]
      },
      // 头部表单事件配置
      headerFormEventConfig: {
        // 库存组织
        orgId:{change: true},
        // 计划编号
        planCode:{change: true},
      },
      // 行列表新增表单控件规则
      lineFormRules: {
        // 开工时间
        startTimeStr: [{ required: true, message: "该输入项为必输项", trigger: "blur"}],
        // 预计完工时间
        forecastCompleteTimeStr: [{ required: true, message: "该输入项为必输项", trigger: "blur"}],
        // 生产数量
        productCount: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false, type: "number" } ],
        // 工单编号
        workOrderCode: [{ required: false, message: "该输入项为必输项", trigger: "blur", disabled: false} ],
        // 订单编号
        soNum: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false}],
        // 客户编号
        customerCode: [{ disabled: false }],
        // 客户名称
        customerName: [{ disabled: false }],
        // 物料编码
        materialsCode: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }],
        // 物料名称
        materialsName: [{ disabled: true }],
        // 规格
        specs: [{ disabled: true }],
        // 订单数量
        orderCount: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false, type: "number" } ],
        // 生产部门
        department: [{ disabled: false } ],
        // 交货日期
        deliveryDateStr: [{ disabled: false}],
        // 客户需求部门
        demandDepartment: [{ disabled: false }],
        // 二级部门
        secondDepartment: [{ disabled: false }],
        // 客户联系人
        contact: [{ disabled: false }],
      },
      // 行列表新增表单事件配置
      lineFormEventConfig: {
        // 物料编码
        materialsCode: {change: true}
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
      let mateFormerHeaderValues = this.mate.mateFormerLine.values;
      // 行列表
      this.mate.mateListLine.columns.map(item => {
        this.objectColumns[item.name] = item;
      });
      // 头表单
      mate.mateFormerHeader.fields.map((item) => { this.headForm[item.name] = item; });
      // *el-input-number 默认值为0,若要置空需要将值设置为 undefined
      mateFormerHeaderValues['productCount'] = undefined;   // 生产数量
      mateFormerHeaderValues['orderCount'] = undefined;     // 订单数量
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
        headerFormRules['orgId'][0].disabled = true;
        headerFormRules['planCode'][0].disabled = true;
      }
      // 获取库存组织
      this.getOrgUnit();
      // 获取客户列表
      // this.getCustomerList();
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
      // 新建状态默认“新建”
      values.status = this.status;
      // 后台需要标识 有效状态 1:有效   默认为 1
      values.disableFlag = '1';
      mate.header = values;
      mate.lineList = this.mate.mateListLine.rows;
      if (!mate.lineList.length) {
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
     * @return {Function} change事件执行函数
     */
    handleChange(val, name) {
      this.isDirty = true;
      const changeControl = {
        // 组织机构
        orgId: (val) => this.handleOrgId(val),
        // 计划编号
        planCode: (val) => this.handleCode(val),
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
        materialsCode: (val) => this.getMaterialsInfo(val),
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
    soNumControl(val) {
      this.soNumDirty = true;
    },
    materialsCodeControl(val) {
      this.materialsCodeDirty = true;
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
      this.$refs['headForm'].$refs["form"].validate(valid => {
        if(valid){
          // 该操作是新增行 改变新增行状态
          this.isAddLine = true;
          this.resetDialogForm(this.mate.mateFormerLine.values);
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
     */
    handleUpdate (act, row) {
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
          SERVICES.DOCUMENTARY_LIST.deleteLine(rowId.id).then(() =>{
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
        a.click()
        URL.revokeObjectURL(objectUrl);
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
      // 重置行弹窗状态
      // this.reRenderLineDialog();
      // 重置行状态
      this.resetLineState();
    },
    /**
     * 重新渲染行表单弹窗
     * @param void
     * @return void
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
    },
    /**
     * 行表单数据初始化
     * 自动生成序号
     * @param {Object} values 表单数据
     * @return void
     */
    resetDialogForm (values){
      values['startTimeStr'] = "";               // 开工时间
      values['forecastCompleteTimeStr'] = "";    // 预计完工时间
      values['materialsCode'] = "";              // 物料编码
      values['materialsName'] = "";              // 物料名称
      values['specs'] = "";                      // 规格
      values['workOrderCode'] = "";              // 工单编号
      values['productCount'] = undefined;         // 生产数量
      values['soNum'] = "";                      // 订单编号
      values['customerCode'] = "";               // 客户编号
      values['customerName'] = "";               // 客户名称
      values['orderCount'] = undefined;           // 订单数量
      values['department'] = "";                 // 生产部门
      values['deliveryDateStr'] = "";            // 交货日期
      values['demandDepartment'] = "";           // 客户需求部门
      values['secondDepartment'] = "";           // 二级部门
      values['contact'] = "";                    // 客户联系人
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
          let addressList = [];
          if (item.addressList.length){
            item.addressList.forEach(aItem =>{
              if ((aItem.address == "") || (aItem.address == undefined) || (aItem.id == "")) return;
              addressList.push({
                "label": aItem.address,
                "value": aItem.id,
                "id": aItem.id
              })
            })
          }
          this.customerList.push({ 
            'addressList': addressList,
            'label': item.name,
            'value': item.code,
            'id': item.code,
          })
        })
        let customerObj = _this.mate.mateFormerHeader.fields.find(item => item.name==="customerCode") || {};
        customerObj.options = _this.customerList;
        if(_this.isEdit){// 如果是编辑/修改 设置客户对应的地点
          let curCustomer = _this.mate.mateFormerHeader.values['customerCode'];
          _this.handleCustomerAddress(curCustomer);
        }
      });
    },
    /** 获取供应商列表（此方法暂时不用）
     * @param void
     * @return void
     */
    getSupplierList () {
      let _this = this;
      SERVICES.BASE.getSupplierList().then(res =>{
        let data = res.data;
        if (data.length=='0') return;
        data.forEach(item =>{
          if ((item.name == "") || (item.name == undefined) || (item.code == "")) return;
          let addressList = [];
          if (item.addressList.length){
            item.addressList.forEach(aItem =>{
              if ((aItem.address == "") || (aItem.address == undefined) || (aItem.id == "")) return;
              addressList.push({
                "label": aItem.address,
                "value": aItem.id,
                "id": aItem.id
              })
            })
          }
          this.supplierList.push({ 
            'addressList': addressList,
            'label': item.username,
            'value': item.id,
            'id': item.id,
          })
        })
        let chargeObj = _this.mate.mateFormerLine.fields.find(item => item.name==="chargeId") || {};
        chargeObj.options = _this.supplierList;
      });
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
      if (val == "") return;
      SERVICES.BASE.getMaterialsInfo(val).then(res => {
        let values = this.mate.mateFormerLine.values;
        let data = res.data && res.data.data;
        if (data) {
          values["materialsName"] = data.name || "";
          values["specs"] = data.basicSpec || "";
          values["unit"] = data.basicUnit || "";
          this.materialsCodeDirty = false;
        } else {
          this.$message({
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
      SERVICES.PRODUCTION_PLAN.checkCode(val).then(res =>{
        let exist = res.data.data;
        if (exist){
          this.$message({
            message: "此编号已存在请重新输入",
            type: 'warning'
          })
          this.mate.mateFormerHeader.values['planCode'] = "";
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

