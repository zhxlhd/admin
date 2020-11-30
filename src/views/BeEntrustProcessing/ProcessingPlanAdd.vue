<!-- created by yxj on 2019/10/12 -->
<!-- 排产计划模块下新增模块 -->
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
                   @events="handleEvents" 
                   @isDirty="dirtyChange"></dynamic-form>
    <!-- 头部Form End-->
    <!-- 底部 lineList Start-->
    <k-table-line
      :mate="mate.mateListLine"
      @actionSelected="handleSelected"
      @btnClick="handleButton"
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
    <el-dialog title="填写明细行" width="80%" v-if="dialogRender" :visible.sync="dialogFormVisible"  :before-close="lineDialogClose" >
      <dynamic-form ref="lineForm" 
                    :mate="mate.mateFormerLine" 
                    :rules="lineFormRules" 
                    :eventCfg="lineEventConfig" 
                    @events="handleEvents" 
                    @isDirty="dirtyChange"></dynamic-form>
      <!--加工单号弹窗 start -->
      <el-dialog title="选择加工单" width="80%" :visible.sync="workOrderDialogVisible" append-to-body>
        <div style="font-size: 16px;overflow-y: auto;height: 600px">
          <span>请选择一条加工单编号</span>
          <k-table-list :mate="processingOrderCodeData" :mateSearch="processingOrderCodeData.mateSearch" @handleSelected="handleProcessingOrderCodeSelected"></k-table-list>
          <span slot="footer" class="dialog-footer">
            <el-button @click="workOrderDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="chooseprocessingOrderCode" :disabled="processingOrderCodeSelectedLine == 0">确认选择</el-button>
          </span>
        </div>
      </el-dialog>
      <!--加工单号弹窗 end -->
      <!--技术方案编码弹窗 start -->
      <el-dialog title="选择技术方案编码" width="80%" :visible.sync="technicalProposalCodeDialogVisible" append-to-body>
        <div style="font-size: 16px;overflow-y: auto;height: 600px;overflow-x: hidden">
          <span>请选择一条最优的技术方案编码</span>
          <k-table-list :mate="technicalProposalCodeData" :mateSearch="technicalProposalCodeData.mateSearch" @handleSelected="handleTechnicalProposalCodeSelected"></k-table-list>
          <span slot="footer" class="dialog-footer">
            <el-button @click="technicalProposalCodeDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="chooseTechnicalProposalCode" :disabled="technicalProposalCodeSelectedLine == 0">确认选择</el-button>
          </span>
        </div>
      </el-dialog>
      <!--技术方案编码弹窗 end -->
      <el-row type="flex" justify="start">
        <el-button size="mini" @click="submitForm" type="primary">{{$t('BUTTON_TEXT.CONFIRM')}}</el-button>
        <el-button size="mini" @click="lineDialogClose">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
      </el-row>
    </el-dialog>
    <!-- 新增行弹窗 End -->
  </div>
</template>

<script>
import { BE_ENTRUST_PROCESSING_API } from "@/services/apis";
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
    },
    KTableList: function index(resolve) {
      require(["@/components/table/KTableList.vue"], resolve);
    }
  },
  props: {
    mate: Object
  },
  data() {
    var checkDate = (rule, value, callback) => {
      let startDate = '';
      let endDate = '';
      let formName = '';
      switch (rule.field) {
        case 'endWorkDate': startDate = 'startWorkDate'; endDate = 'endWorkDate'; formName = 'mateFormerLine';break;
        case 'startWorkDate': startDate = 'startWorkDate'; endDate = 'endWorkDate'; formName = 'mateFormerLine';break;
        case 'endDate': startDate = 'startDate'; endDate = 'endDate'; formName = 'mateFormerHeader';break;
        default:break;
      }
      if(this.mate[formName].values[endDate] == '' || this.mate[formName].values[endDate] == null) {
        callback(new Error('该输入项为必输项'));
      }
      clearTimeout(this.timerOut);
      this.timerOut = setTimeout(() => {
        if(new Date(this.mate[formName].values[startDate]) > new Date(this.mate[formName].values[endDate])){
          callback(new Error('终止日期不能小于起始日期'));
        }else{
          callback();
        }
      }, 300);
    };
    var isNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('此项不能为空'));
      }
      setTimeout(() => {
        if (!Number.isInteger(parseInt(value)) || (value<0) || !(/^\+?[1-9][0-9]*$/.test(value))) {
          callback(new Error('请输入大于零的正整数数字值'));
        } if(this.mate.mateFormerLine['values'].orderCount == '') {
          callback(new Error('请先选择加工单编号，订单数量不能为空'));
        } if(parseInt(this.mate.mateFormerLine['values'].orderCount) < parseInt(value)) {
          callback(new Error('生产数量不能大于订单数量'));
        } else {
          callback();
        }
      }, 500);
    };
    return {
      actionWidth: "",           // action 操作列宽度
      selectedIds: [],           // 所勾选行的序号
      selectedLines: [],         // 勾选行
      headForm: {},              // 头部表单
      toSort: true,              // 是否本地排序 一般用于没有分页的列表
      dialogRender: true,        // 用作强制重新渲染弹窗
      dialogFormVisible: false,  // 新增行弹窗是否显示
      objectColumns: {},         // 列表行字段
      orderId: "",               // 任务 id
      isEdit: false,             // 当前行是否在编辑
      isAddLine: false,          // 是否新增行
      isEditLine: false,         // 是否修改行
      isDirty: false,            // 是否修改了数据
      materialsCodeDirty: false, // 是否修改了物料编码
      uploadUrl: "",             // 上传/导入 api
      btnDisable: false,
      actDisable: false,
      workOrderRender :true,     // 加工单选择重新渲染弹窗
      workOrderDialogVisible: false,  // 加工单选择重新渲染弹窗是否显示
      technicalProposalCodeDialogVisible: false,  // 技术方案编码渲染弹窗是否显示
      timerOut: null,
      headerFormRules: {
        // 计划编号
        planCode: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }],
        // 计划名称
        planName: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }],
        // 计划员
        designer: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }],
        // 开始日期
        startDate: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }],
        // 结束日期
        endDate: [{ required: true, type:'date', validator: checkDate, trigger: 'change' }]
      },
      lineFormRules: {
        // 开工日期
        startWorkDate: [{ required: true, message: "该输入项为必输项", trigger: "change" }],
        // 加工单号
        processingOrderCode: [{ required: true, message: "该输入项为必输项", trigger: "change", disabled: false }],
        // 订单数量
        processingCount: [{ required: true, trigger: "change", disabled: false }],
        // 生产线
        assemblyLine: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }],
        // 生产数量
        processingCount: [{ required: true, trigger: "blur", disabled: false, validator:isNumber }],
        // 预计完工日期
        endWorkDate: [{ required: true, type:'date', validator: checkDate, trigger: 'change' }],
      },
      lineEventConfig: {
        // 加工单编号  
        processingOrderCode: { focus: true },
        // 技术方案编码  
        technicalProposalCode: { focus: true },  
      },
      headerFormEventConfig: {
        planCode: { blur: true }
      },
      processingOrderCodeData: {}, // 选择加工单编号
      processingOrderCodeSelectedLine: [],  // 选择加工单编号勾选行
      technicalProposalCodeData: {}, // 选择技术方案编码
      technicalProposalCodeSelectedLine: []  // 选择技术方案编码勾选行
    };
  },
  created() {
    let mate = this.mate;
    // 列表行
    this.mate.mateListLine.columns.map(item => {
      this.objectColumns[item.name] = item;
    });
    mate.mateFormerHeader.fields.map((item) => { this.headForm[item.name] = item; });
    // 编辑
    let mateData = mate.mateData;
    if(mateData.heard && mateData.heard.id && mateData.heard.id !== '') {
      mate.mateFormerHeader.values = mateData.heard;
      mate.mateListLine.rows = this.initLineData(mateData.lineList);
    }
  },
  mounted() {
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
    handleButton(btn, row) {
      this.row = row;
      this.btn = btn;
      let action = btn.action;
      const btnEvents = {
        // 新增
        addLine: () => this.addLine(),
        // 编辑行
        editLine: () => this.editLine(),
        // 删除行
        deleteLine: () => this.deleteLine(),
        // 默认
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)();
    },
    handleActions(act, row) {
      let action = act.action;
      const btnEvents = {
        // 编辑行
        editLine: () => this.editRemark(act, row),
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
            }else{
              _this.$message({
                  type: "warning",
                  message: this.$t("TIPS_WARNING.ADD_FAIL")
              });
            }
          }).catch(function (err) {
            
          });
        }
      });
    },
    /** 动态表单事件管理
     * @param {String} event 事件名称
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleEvents(event, val, name) {
      const eventControl = {
        focus: (val, name) => this.handleFocus(val, name),
        blur: (val, name) => this.handlePlanCodeBlur(val, name),
        default: () => { return }
      }
      return (eventControl[event] || eventControl.default)(val, name);
    },
    /** focus 事件 processingOrderCode 加工单编号 有焦点弹窗
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleFocus(val, name) {
      const focusControl = {
        processingOrderCode: () => this.processingOrderCode(val),
        technicalProposalCode: () => this.technicalProposalCode(val),  
        default: () => { return }
      }
      return (focusControl[name] || focusControl.default)(val);
    },
    /** blur 事件 PlanCode 计划编号 校验是否唯一
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handlePlanCodeBlur(val, name) {
      if (val !== '') {
        SERVICES.PROCESSING_PLAN.checkPlanCode(val).then(res => {
          if(res.data.code == 200){
             if(!res.data.status) {
               this.mate.mateFormerHeader.values[name] = '';
               this.$message({
                   type: "warning",
                   message: "此计划编号已存在，请重新录入！"
               });
             }
          }else{
            this.$message({
                type: "warning",
                message: "校验计划编号是否唯一失败，请稍后再试！"
            });
          }
        });
      }
    },
    /** 加工单编号弹窗事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    processingOrderCode(val) {
      SERVICES.PROCESSING_PLAN.getProcessingOrderCodeData({processingOrderCode:'',customerName:'',fromDateStr:'',toDateStr:''}).then(res => {
        let codeData = res.data.mate;
        let params = { total:codeData.total, size:codeData.size, rows:codeData.rows };
        this.processingOrderCodeData = SERVICES.PROCESSING_PLAN.processingOrderCodeData(params);
        this.workOrderDialogVisible = true;
      }).catch(err => {
        this.$message({ type: "warning", message: "获取选择加工单列表失败" });
      });
    },
    /** 技术方案编码弹窗事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    technicalProposalCode(val) {
      SERVICES.PROCESSING_PLAN.getTechnicalSchemeCode().then(res => {
        let tachnicalCodeData = res.data.mate;
        // 数据从数据统计里面获取的，需要在前端去掉“导出”按钮
        tachnicalCodeData.mateList["btns"] = [];
        this.technicalProposalCodeData = tachnicalCodeData;
        this.technicalProposalCodeDialogVisible = true;
      }).catch(err => {
        this.$message({ type: "warning", message: "获取选择技术方案编码列表失败" });
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
      mate.heard = this.mate.mateFormerHeader.values;
      mate.lineList = this.mate.mateListLine.rows;
      if (mate.lineList.length < 1) {
        // 保存的时候明细行不能为空
        this.$message({
          type: "warning",
          message: "明细行不能为空"
        });
        this.submitBtnDisabled = false;
        return false;
      }
      return mate;
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
     * 加工单编号选择
     * checkbox 勾选计算 拿到勾选的序号数组
     * param {Boolean} hasSelected 是否有勾选
     * param {Array} multipleSelection 勾选数组
     * @return void
     */
    handleProcessingOrderCodeSelected(hasSelected, multipleSelection) {
      this.processingOrderCodeSelectedLine = multipleSelection;
    },
    /**
     * 技术方案编码选择
     * checkbox 勾选计算 拿到勾选的序号数组
     * param {Boolean} hasSelected 是否有勾选
     * param {Array} multipleSelection 勾选数组
     * @return void
     */
    handleTechnicalProposalCodeSelected(hasSelected, multipleSelection) {
      this.technicalProposalCodeSelectedLine = multipleSelection;
    },
    /**
     * 加工单编号选择 确认按钮
     * @return void
     */
    chooseprocessingOrderCode() {
      let processingOrderCodeSelected = this.processingOrderCodeSelectedLine;
      if(processingOrderCodeSelected.length>1) {
        this.$message({
            type: "warning",
            message: '当前只能选择一条加工单编号'
        });
        return;
      }
      for(let code in processingOrderCodeSelected[0]) {
        if(code == 'id'){
          this.mate.mateFormerLine.values['processingOrderLineId'] = processingOrderCodeSelected[0]['id'];
        }else{
          this.mate.mateFormerLine.values[code] = processingOrderCodeSelected[0][code];
        }
      }
      this.workOrderDialogVisible = false;
    },
    /**
     * 新增行
     * @param void
     * @return void
     */
    addLine () {
      // 该操作是新增行 改变新增行状态
      this.isAddLine = true;
      // 显示弹窗
      this.lineDialogShow();
      this.clearDialogFrom(this.mate.mateFormerLine.values);
    },
    /**
     * 编辑行
     */
    editLine () {
      // 编辑行
      if (this.selectedLines.length !== 1) {
        this.$message({
          message: this.$t("seladata"),
          type: "warning"
        });
        return;
      }
      // 该操作是编辑行 改变编辑行状态
      this.isEditLine = true;
      this.lineDialogShow();
      this.mate.mateFormerLine.values = {...this.selectedLines[0]};
    },
    /**
     * 删除行
     * @param void
     * @return void
     */
    deleteLine () {
      let _this = this;
      this.$confirm("此操作将删除该行, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let selectedLines = _this.selectedLines;
        let selectedIds = _this.selectedIds;
        selectedLines.forEach((item, index) => {
          this.mate.mateListLine.rows.forEach((lineItem,index2) => {
            if(item.index == lineItem.index) {
              this.mate.mateListLine.rows.splice(index2,1);
            }
          });
        });
      }).catch(() => {
        _this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    /**
     * 上传成功
     * 暂时留用 todo
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
                // splice将i行数据删除，并将mateFormerValues1填充进
                mate.mateListLine.rows.splice(index, 1, mateFormerValues);
              }
            });
          }
          // 是否是新增
          if (_this.isAddLine) {
            values.index = mate.mateListLine.rows.length + 1;
            // 新增行时加 id=0
            values.id = 0;
            let mateFormerValues = Object.assign({},values);
            mate.mateListLine.rows.push(mateFormerValues);
          }
          _this.lineDialogClose();
        }else{
          console.log('un vailid');
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
      data.forEach((item,index) => {
        // 设置索引 从 1 开始
        item.index = index + 1;
      });
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
      this.lineDialogHide();
      // 重新渲染行弹窗
      this.reRenderLineDialog();
      // 重置行状态
      this.resetLineState();
    },
    /**
     * 显示弹窗
     * @param void
     * @return void
     */
    lineDialogOpen () {
      this.lineDialogShow();
    },
    /**
     * 隐藏弹窗
     * 重置弹窗表单
     * @param void
     * @return void
     */
    lineDialogHide() {
      this.dialogFormVisible = false;
      this.resetForm('lineForm');
      // this.clearDialogFrom(this.mate.mateFormerLine.values);
    },
    lineDialogShow () {
      this.dialogFormVisible = true;
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
     * 重置弹窗表单
     * 数据清空，验证信息重置
     * @param {String} formName 需要重置的表单 ref 名称
     * @return void
     */
    resetForm (formName) {
      this.$refs[formName].resetForm();
    },
    /**
     * 行表单数据初始化
     * 自动生成序号
     * @param {Object} values 表单数据
     * @return void
     */
    clearDialogFrom (values){
      for(let item in values) {
        values[item] = '';
      }
    },
    dirtyChange(bool) {
      this.isDirty = bool;
    },
    /**
     * 刷新tab页签
     * @param void
     * @return void
     */
    backToList () {
      this.$root.monitor({ url: BE_ENTRUST_PROCESSING_API.PROCESSING_PLAN_LIST });
    },
    /**
     * 技术方案编码 确认按钮
     * @return void
     */
    chooseTechnicalProposalCode() {
      let technicalProposalCodeSelected = this.technicalProposalCodeSelectedLine;
      if(technicalProposalCodeSelected.length>1) {
        this.$message({
          type: "warning",
          message: '当前只能选择一条技术方案编码'
        });
        return;
      }
      this.mate.mateFormerLine.values['technicalProposalCode'] = technicalProposalCodeSelected[0]['technicalSolutionCode'];
      this.mate.mateFormerLine.values['technicalProposalDesc'] = technicalProposalCodeSelected[0]['technicalSolutionDesc'];
      this.technicalProposalCodeDialogVisible = false;
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
