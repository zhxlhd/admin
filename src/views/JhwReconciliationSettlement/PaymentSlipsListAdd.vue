<!-- created by zhongxiaolong on 2020/54/12 -->
<!-- 付款单新增 PaymentSlipsListAdd -->
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
      @events="handleEvents"></dynamic-form>
    <!-- 头部Form End-->
    <!-- 底部 lineList Start-->
    <k-table-line
      :mate="mate.mateListLine"
      @actionSelected="handleSelected"
      @btnClick="handleButtons" 
      @action="handleActions"
      :isIndex="isIndex" 
      :toSort="toSort"
      ref="lineTable"
      :btnDisable="btnDisable"
      :actDisable="actDisable"
      :inLineEdit="inLineEdit"
      :inlineEditSubmit="inlineEditSubmit"
      @editSubmit="editSubmit"
      @inlineEdit="inlineEdit"
      :word="word"
    >
      <!-- <span slot="moreBtn">
        <el-select label="对账单" v-model="statement" placeholder="请选择对账单" size='mini'>
          <el-option
            v-for="(item,index) in statementOptions"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </span> -->
    </k-table-line>
    <!-- 底部 lineList End-->

    <!-- 新增行弹窗 Start -->
    <dialog-table :mate="dialogMate" ref="dialogTable"
      :target="mate.mateListLine.rows"
      :dialogVisible="dialogFormVisible" 
      tableTitle="新增明细行"
      :showClose="true"
      :maxHeight="maxHeight"
      :judgeBy="'reconciliationId'"
      :isShowSearchBtn="isShowSearchBtn"
      @handleConfirm="handleConfirm"></dialog-table>
    <!-- 新增行弹窗 End -->
  </div>
</template>

<script>
import { SMART_ORDER_API } from "@/services/apis";
import SERVICES from "@/services";
import { dateFormatter } from "@/utils/DateUtils";
import { mapGetters, mapActions } from "vuex";
import { getAction, postAction, metaAction } from '@/services/manage.js';

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
    DialogTable: function index(resolve){
      require(["@/components/Dialog/DialogTable.vue"], resolve)
    }
  },
  props: {
    mate: Object
  },
  data() {
    return {
      username: JSON.parse(window.sessionStorage.getItem('user')).username,
      state: "1",                // 新建状态 （1-新建 2-审核中 3-已驳回 4-已通过)
      btns: ['提交','保存','取消','重置'],      // 责任人列表
      inLineEdit: true,          // 是否行内编辑
      inlineEditSubmit: true,    // 行编辑提交
      word: true,                // 按钮是否显示文字
      isIndex: true,             // table 序号
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
      headId: null,            // 任务 id
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
      url:{
        detail: '/agriculture/payment/headLineList',        // 详情接口
        deleteLine: '/agriculture/payment/deleteLineOne',   // 删除行接口
      },
      // 头部表单控件规则
      headerFormRules: {
        // 付款编号
        paymentNo: [{ disabled: true }],
        // 供应商编号
        supplierNo: [{ required: false, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "change", disabled: false }],
        // 供应商名称
        supplierName: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "blur"}],
        // 地点
        supplierAddress: [{ required: false, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "change", disabled: false }],
        // 付款日期
        paymentDate: [{ required: false, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "change", disabled: false }],
        // 付款人
        drawee: [{ disabled: true }],
        // 币种
        currency: [{ disabled: false }],
        // 付款方式
        paymentMethod: [{ disabled: false }],
        // 应付总金额
        totalAmountPayable: [{ required: false, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "blur", type: "number", disabled: true }],
        // 付款金额合计
        totalPaymentAmount: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "blur", type: "number", disabled: false }],
        // 状态
        state: [{ disabled: true }],
        // 备注
        remarks: [{ disabled: false }]
      },
      // 头部表单事件配置
      headerFormEventConfig: {
        // 客户编码
        supplierName:{change: true},
        // 上传附件
        files:{change: true}
      },
      dialogMate: {
        mateList: {},
        mateSearch: {}
      }
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
    // 付款日期日期默认值，默认为当天
    let date = this.mate.mateFormerHeader.values['paymentDate'] || '';
    this.mate.mateFormerHeader.values['paymentDate'] = date || dateFormatter("YYYY-MM-DD");
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
      // 行表单数据
      let mateFormLineValues = this.mate.mateFormerLine.values;
      // 行列表
      this.mate.mateListLine.columns.map(item => {
        this.objectColumns[item.name] = item;
      });
      // 头表单
      mate.mateFormerHeader.fields.map((item) => { this.headForm[item.name] = item; });
      // *el-input-number 默认值为0,若要置空需要将值设置为 undefined
      mateFormHeaderValues['drawee'] = this.username;          // 收款人
      mateFormHeaderValues['totalAmountPayable'] = undefined;  // 应付总金额
      mateFormHeaderValues['totalPaymentAmount'] = undefined;  // 付款金额合计
      mateFormHeaderValues['outstandAmount'] = undefined;  // 付款金额合计

      mateFormLineValues['receivedQuantity'] = undefined;      // 收货数量
      mateFormLineValues['unitPriceIncludingTax'] = undefined; // 单价（含税）
      mateFormLineValues['amountIncludingTax'] = undefined;    // 含税金额
      mateFormLineValues['amountPaid'] = undefined;            // 已付款金额
      mateFormLineValues['amountPayable'] = undefined;         // 应付金额
      mateFormLineValues['thisPayment'] = undefined;           // 本次支付
      mateFormLineValues['balance'] = undefined;               // 余额
      // 保存行表单默认数据
      this.lineFormValues = {...mate.mateFormerLine.values};
      // 获取详情数据
      this.getData();
      // 初始化弹窗列表 mate
      this.initDialogMate();
      // 获取供应商列表
      this.getSupplierList()
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
        }else{
          mateFormerHeaderValues['files'] = [];
        }
        // 如果没有当前付款人 赋值当前登录用户
        if(!mateFormerHeaderValues.drawee){
          mateFormerHeaderValues['drawee'] = this.username;
        }
        // 如果没有币种 默认这是人民币
        if(!mateFormerHeaderValues.currency){
          mateFormerHeaderValues['currency'] = 'CNY';
        }
      })
    },
    /**
     * 弹窗列表初始化数据
     * 增加自定义列
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    initDialogMate(){
      let params = {
        listName: 'jhw_reconciliation'
      }
      let { dialogMate } = this;
      metaAction(params).then(res =>{
        let data = res.data;
        let {size, page, total, columns, rows, dataApi} = data.mate.mateList;
        dialogMate.mateList = { ...dialogMate.mateList, size, page, total, columns, rows, dataApi };
        dialogMate.mateSearch = {...data.mate.mateSearch};
        dialogMate.mateSearch.values['ifFromCustomer'] = true;
        dialogMate.mateSearch.values['status'] = '5';
      });
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
        // 删除行
        deleteLine: () => this.handleDelete(row),
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
          SERVICES.BASE.handleSave(url, mate).then((res) =>{
            if(res.data.code === 200){
              _this.$root.monitor({url: next});
            }
          })
        }
      });
    },
    /**
     * 保存表单数据
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    handleSave() {
      let mate = {};
      let _this = this;
      let [url,next] = [this.mate.mateFormerHeader.url,this.mate.mateFormerHeader.next];
      this.$refs['headForm'].$refs["form"].validate(valid => {
        if (valid) {
          let isOk = this.lineEditConfirm(); // 行编辑要确认保存
          mate = _this.saveData(1);
          if (!isOk || !mate) return;
          SERVICES.BASE.handleSave(url, mate).then((res) =>{
            if(res.data.code === 200){
              _this.isEdit = false;
              this.$message.success(res.data.message)
            }
          }).catch(function (err) {
            
          });
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
      if('files' in values){
        this.handleFileList(values.files);
      }
      values.id = this.headId || null;
      // 新建状态默认“新建”
      values.state = this.state;
      // 后台需要标识 有效状态 1:有效   默认为 1
      values.disableFlag = '1';
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
        // if (this.mate.mateListLine.rows.length < 1) {
        //   // 保存的时候明细行不能为空
        //   this.$message({
        //     type: "warning",
        //     message: "明细行不能为空"
        //   });
        //   return
        // }
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
    /** 重置按钮
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    handleReset() {
      this.$refs['headForm'].$refs["form"].resetFields();
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
        supplierName: (val) => this.handleSupplier(val),
        files: (val) => this.handleFileList(val),
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
    /** 上传附件/移除附件
     * @param {Array} val 附件列表
     * @return void
     ** Author: zhongxiaolong
     */
    handleFileList(val){
      if(typeof val !== "string"){
        this.mate.mateFormerHeader.values['files'] = JSON.stringify(val);
      }
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
     * 新增行
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    handleCreate () {
      // this.$refs['headForm'].$refs["form"].validate(valid => {
      //   if(valid){
        let mateFormerHeaderValues = this.mate.mateFormerHeader.values;
        if(mateFormerHeaderValues['supplierName'] == '' || mateFormerHeaderValues['supplierName'] == undefined){
          this.$message.warning('请先维护供应商名称');
          return
        }
        this.dialogMate.mateSearch.values['supplierNo'] = mateFormerHeaderValues['supplierNo'];
        // 该操作是新增行 改变新增行状态
        this.isAddLine = true;
        // 显示弹窗
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          // this.clearForm('lineForm');
          // 查询全部数据
          this.$refs['dialogTable'].$refs["listTable"].$refs["multipleQueryForm"].query();
        })
        // }else{
        //   this.$message({
        //     message: "请先维护头表单信息",
        //     type: "info"
        //   });
        // }
      // })
    },
    /** 新增成员保存到后台并关闭弹窗 
     * @param {String} ids 所选行 id
     * @param {Object} rows 所选行数据
     * @return void
     ** Author: zhongxiaolong
     */
    handleConfirm(ids, rows) {
      if(ids){
        let data = [];
        // 检查勾选项是否都是 sign = true 才能进行对账 (账期)
        let isPaymentAllow = rows.every(item => {
          return (item.sign === true )
        });
        if(isPaymentAllow){
          rows.forEach(item => {
          let reconciliationId = item.id,
              reconciliationNo = item.statementNo, // 对账单号
              reconciliationAmount = item.billedAmount || 0, // 已对账金额
              thisPayment = 0, // 本次支付
              balance = 0, // 余额
              remarks = item.remarks; // 备注
          // 已付款金额 应付金额
          let { amountPaid = 0, amountPayable = 0 } = item;
          data.push({ reconciliationId,reconciliationNo, reconciliationAmount, amountPaid, amountPayable, thisPayment, balance, remarks });
        })
          this.mate.mateListLine.rows = [...this.mate.mateListLine.rows,...data];
          this.initLineData(this.mate.mateListLine.rows);
          this.handleSummary(this.mate.mateListLine.rows);
          this.dialogFormVisible = false;
        } else {
          this.$message.warning('当前账单未到付款时间')
        }
      }else{
        this.dialogFormVisible = false;
      }
    },
    /** 计算应付总金额
     * @param {Array} arr 新增付款单行
     * @return void
     */
    handleSummary(arr){
      let mateFormerHeaderValues = this.mate.mateFormerHeader.values;
      arr.forEach(item =>{
        // 应付金额 = 已对账金额 - 已付款金额
        item.amountPayable = item.reconciliationAmount - item.amountPaid;
      })
      // 头-应付总金额
      mateFormerHeaderValues['totalAmountPayable'] = arr.reduce((prev, item) =>{
        if(!item.reconciliationAmount){
          item.reconciliationAmount = 0
        }
        return prev + Number(item.reconciliationAmount);
      }, 0).toFixed(2);
      // 头-付款金额合计
      mateFormerHeaderValues['totalPaymentAmount'] = arr.reduce((prev, item) =>{
        if(!item.thisPayment){
          item.thisPayment = 0
        }
        return prev + Number(item.thisPayment);
      }, 0).toFixed(2);
      // 头-剩余付款金额合计
      mateFormerHeaderValues['outstandAmount'] =(mateFormerHeaderValues['totalAmountPayable'] - mateFormerHeaderValues['totalPaymentAmount']).toFixed(2);
    },
    /**
     * 删除行
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    handleDelete (row) {
      let _this = this;
      let selectedLines = _this.selectedLines;
      let selectedIds = _this.selectedIds;
      // 行数据
      let lineListRows = _this.mate.mateListLine.rows;
      // 先过滤删除没有行id的数据
      selectedLines = selectedLines.filter(item=> !!item.id );
      // 过滤删除的行 剩下没有删除的
      selectedIds.forEach(item => {
        lineListRows = lineListRows.filter(line => line.index != item);
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
        let params = {
          ids: rowId.id.join(',')
        }
        getAction(_this.url.deleteLine, params).then(res =>{
          //重新渲染删除后的行列表
          _this.mate.mateListLine.rows = lineListRows;
          _this.handleSummary(_this.mate.mateListLine.rows);
          // 保存数据 重新排序后的
          // _this.save();
        })
      } else {
        _this.mate.mateListLine.rows = lineListRows;
        _this.handleSummary(_this.mate.mateListLine.rows);
        // _this.save();
      }
    },
    /** 行编辑按钮
     * @param {Object} row 行数据
     * @return void
     */
    inlineEdit(row){
      row.edit = !row.edit;
    },
    /** 行编辑Ok
     * @param {Object} row 行数据
     * @return void
     */
    editSubmit(row){
      let { reconciliationAmount = 0, amountPaid = 0, thisPayment = 0, amountPayable= 0 } = row;
      // if (thisPayment > amountPayable){
      //   this.$message.warning('本次支付不能大于应付金额');
      //   row.edit = true;
      //   return
      // }
      // 余额=已对账金额-已付款金额-本次支付
      row['balance'] = (reconciliationAmount - amountPaid - thisPayment).toFixed(2);
      let mateFormerHeaderValues = this.mate.mateFormerHeader.values;
      // 头-付款金额合计
      mateFormerHeaderValues['totalPaymentAmount'] = this.mate.mateListLine.rows.reduce((prev, item) =>{
        if(!item.thisPayment){
          item.thisPayment = 0;
        }
        return prev + Number(item.thisPayment);
      }, 0).toFixed(2);
       // 头-剩余付款金额合计
      mateFormerHeaderValues['outstandAmount'] = (mateFormerHeaderValues['totalAmountPayable'] - mateFormerHeaderValues['totalPaymentAmount']).toFixed(2);
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
      data.forEach((item,index) =>{
        // 设置索引 从 1 开始
        item.index = index + 1;
        this.$set(item, 'edit', false);
      })
      return data;
    },
    /**
     * 重置弹窗表单 用于新增
     * 数据清空，验证信息重置
     * @param {String} formName 需要重置的表单 ref 名称
     * @return void
     ** Author: zhongxiaolong
     */
    resetForm (formName) {
      this.$refs[formName].resetForm();
    },
    /**
     * 重置弹窗表单 用于编辑
     * 验证信息重置
     * @param {String} formName 需要重置的表单 ref 名称
     * @return void
     ** Author: zhongxiaolong
     */
    clearForm (formName) {
      this.$refs[formName].clearForm();
    },
    /** 获取供应商列表（此方法暂时不用）
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    getSupplierList () {
      let _this = this;
      let supplierOptions = [];
      SERVICES.BASE.getSupplierListUsable().then(res =>{
        this.supplierList = res.data;
        if (this.supplierList.length=='0') return;
        this.supplierList.forEach(item =>{
          if ((item.name == "") || (item.name == undefined) || (item.code == "")) return;
          let addressList = [];
          if (item.addressList.length){
            item.addressList.forEach(aItem =>{
              if ((aItem.address == "") || (aItem.address == undefined) || (aItem.id == "")) return;
              addressList.push({
                "label": aItem.name,
                "value": aItem.id,
                "id": aItem.id
              })
            })
          }
          supplierOptions.push({ 
            'addressList': addressList,
            'label': item.name,
            'value': item.name,
            'code': item.code,
            'id': item.id,
          })
        })
        let supplierObj = _this.mate.mateFormerHeader.fields.find(item => item.name==="supplierName") || {};
        supplierObj.options = supplierOptions;
        if(_this.isEdit){
          // 供应商编号
          let supplier = _this.mate.mateFormerHeader.values['supplierNo'];
          // 当前供应商对象
          let curSupplier = supplierObj.options.find(item => item.value === supplier);
          // 货到地点控件
          let addressObj = this.mate.mateFormerHeader.fields.find(item => item.name==="supplierAddress") || {};
          // 给地点赋值下拉选项
          addressObj.options = curSupplier.addressList;
        }
      });
    },
    /** 
     * 供应商改变
     * 带出供应商名称
     * 编辑/修改的时候也需要根据客户设置地点列表
     * @param {String} val 客户的 code
     * @return void
     ** Author: zhongxiaolong
     */
    handleSupplier(val) {
      let mateFormerHeaderValues = this.mate.mateFormerHeader.values;
      if(val !== '') {
        // 到当前供应商对象 对象包含对应的名称和地点等
        let obj = this.supplierList.find(item => item.value === val || item.name === val);
        // 货到地点控件
        let AddressObj = this.mate.mateFormerHeader.fields.find(item => item.name==="supplierAddress") || {};
        // 给供应商名称赋值
        this.$set(mateFormerHeaderValues,'supplierNo',obj.code)
        // 给地点赋值下拉选项
        AddressObj.options = obj.addressList;
        if(obj.addressList.length){
          // 如果有地点 默认选中第一个
          mateFormerHeaderValues['supplierAddress'] = obj.addressList[0].label;
        }else{
          mateFormerHeaderValues['supplierAddress'] = '';
        }
      }else{
        mateFormerHeaderValues['supplierNo'] = '';
        mateFormerHeaderValues['supplierAddress'] = '';
      }
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

