<!-- created by hezhiqiang on 2020/06/20 -->
<!-- 供货列表-新增 -->
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
      @events="handleEvents"></dynamic-form>
    <!-- 头部Form End-->
    <!-- 底部 lineList Start-->
    <k-table-line
      :mate="mate.mateListLine"
      @actionSelected="handleSelected"
      @btnClick="handleButtons"
      @action="handleActions" 
      :toSort="toSort"
       :isIndex="isIndex"
      ref="lineTable"
    ></k-table-line>
    <!-- 底部 lineList End-->
    <!--明细行 form-dialog Start -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="80%" :show-close="true" :close-on-click-modal="false">
      <dynamic-form ref="lineForm" 
        :mate="mate.mateFormerLine" 
        :rules="lineFormRules" 
        :eventCfg="lineFromEventConfig" 
        @events="handleEvents"></dynamic-form>
        <el-row type="flex" justify="start">
            <el-button size="mini" @click="submitForm" type="primary">{{$t('BUTTON_TEXT.CONFIRM')}}</el-button>
            <el-button size="mini" @click="lineDialogClose">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
        </el-row>
    </el-dialog>
    <!--明细行 form-dialog End -->
  </div>
</template>

<script>
import SERVICES from "@/services";
import { dateFormatter } from "@/utils/DateUtils";
import { mapGetters, mapActions } from "vuex";

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
  computed: {
    ...mapGetters({
      pid: 'Common/pid'
    })
  },
  data() {
    return {
      isIndex: true,               // table是否渲染序号
      status: "SAVE",            // 新建状态
      btns: ['提交','取消','重置'],      // 按钮
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
      headerId: null,            // 任务 id
      isEdit: false,             // 当前行是否在编辑
      isAddLine: false,          // 是否新增行
      isEditLine: false,         // 是否修改行
      isDirty: false,            // 是否修改了数据
      dialogTitle: '',           // 新增明细行弹框标题
      params: '?listName=jhw_supply_list&listFormName=jhw_supply_form&lineList=jhw_supply_line_list&lineForm=jhw_supply_line_form', // 元数据表名
      listUrl: '/common/toList',  // 元数据接口
      // 头部表单控件规则
      headerFormRules: {
        // 供应商名称
        supplierName: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "change"}],
        // 客户仓库
        warehouse: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "change"}],
      },
      // 头部表单事件配置
      headerFormEventConfig: {
        supplierName: {change: true},
      },
      // 明细行表单控件规则
      lineFormRules : {
        // 商品编码
        itemNo: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "change"}],
      },
      // 明细行表单事件配置
      lineFromEventConfig: {
        // 商品编码
        itemNo: {input: true,change: true},
      },
      goodsData: [],   // 商品数据
      selectSup: '',   // 供应商名称
    };
  },
  created() {
    this.init();
    if(this.pid){
      let param = {
        'id': this.pid
      }
      SERVICES.JHW_SUPPLY.getList(param).then(res=>{
        if (res.status == 200) {
          let data = res.data.data.list
          this.mate.mateFormerHeader.values = data[0]
          this.mate.mateListLine.rows = data
          if (this.mate.mateFormerHeader.values['supplierName']) {
            this.selectSup = this.mate.mateFormerHeader.values['supplierName'];
            this.getGoods();
          }
        }
      })
    };
  },
  mounted() {
    // 出库日期默认当前日期
    let date = this.mate.mateFormerHeader.values['issueDate'] || '';
    this.mate.mateFormerHeader.values['issueDate'] = date || dateFormatter("YYYY-MM-DD");
    // 制单人默认当前登录用户
    let localStorage = window.localStorage;
    var localuser = JSON.parse(localStorage.getItem('user'));
    this.mate.mateFormerHeader.values['creator'] = (localuser.firstname + localuser.lastname);
  },
  methods: {
    /** 数据初始化
     * 初始化新增修改页面的数据
     * @param void
     * @return void
     ** 
     */
    init() {
      // 模块数据
      let mate = this.mate;
      // 行表单数据
      let mateFormLineValues = this.mate.mateFormerLine.values;
      // 头表单
      mate.mateFormerHeader.fields.map((item) => { this.headForm[item.name] = item; });
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
      };
      // 获取供应商列表
      this.getSupplierList();
      // 获取客户仓库
      this.getCustomerWarehouse();
    },
    /** 获取客户仓库
     * @param void
     * @return void
     ** 
     */
    getCustomerWarehouse () {
      SERVICES.JHW_SUPPLY.getWarehouse().then(res => {
        let data = res.data.data;
        let warehouseOptions = [];
        if (data.length > 0) {
          data.forEach(item => {
            warehouseOptions.push({
              'label': item.warehouseName,
              'value': item.warehouseId,
              'key': item.warehouseId,
            })
          });
        };
        let warehouseObj = this.mate.mateFormerHeader.fields.find(item => item.name==="warehouse") || {};
        warehouseObj.options = warehouseOptions;
      })
    },
    /** 头部按钮事件
     * @param {String} name 按钮名称
     * @return {Function} 按钮事件
     ** 
     */
    handleBtns(name) {
      const btnEvents = {
        // 提交按钮
        submit: () => this.handleSubmit(),
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
     ** 
     */
    handleButtons(btn, row) {
      this.row = row;
      this.btn = btn;
      let action = btn.action;
      const btnEvents = {
        addLine: () => this.handleCreate(),    // 新增
        batchAdd: () => this.handleBatchAdd(),    // 批量新增
        // 默认
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)();
    },
    /**
     * 明细行按钮操作
     * @returns {void}
     */
    handleActions(btn, row){
      let action = btn.action;
      const btnEvents = {
        deleteLine: (btn,row) => this.handleDelete(row), // 明细行删除
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, row);
    },
    /**
     * 新增行
     * @param void
     * @return void
     ** 
     */
    handleCreate () {
      if (this.mate.mateFormerHeader.values.supplierName == '' || this.mate.mateFormerHeader.values.supplierName == null) {
        this.$message({
          type: 'warning',
          message: '请先选择供应商名称'
        });
        return;
      }
      this.isAddLine = true;
      // 显示弹窗
      this.dialogFormVisible = true;
      this.resetDialogForm(this.mate.mateFormerLine.values);
      this.$nextTick(() => {
        this.clearForm('lineForm');
      })
    },
    /**
     * 批量新增
     * @param void
     * @return void
     ** 
     */
    handleBatchAdd () {
      if (this.mate.mateFormerHeader.values.supplierName == '' || this.mate.mateFormerHeader.values.supplierName == null) {
        this.$message({
          type: 'warning',
          message: '请先选择供应商名称'
        });
        return;
      }
      let param = {};
      param.supplierName = this.mate.mateFormerHeader.values.supplierName;
      SERVICES.JHW_SUPPLY.getGoods(param).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: 'success',
            message: res.data.message
          });
          let data = res.data.data.list;
          if (data.length > 0) {
            this.$set(this.mate.mateListLine,'rows',this.initLineData(data))
          }
        }
      })
    },
    /**
     * 删除行
     * @param {Object} row 删除行信息
     */
    handleDelete(row){
      this.mate.mateListLine.rows.forEach((item,index)=>{
        if(item.index === row.index) {
          this.mate.mateListLine.rows.splice(index,1)
          this.mate.mateListLine.rows = this.initLineData(this.mate.mateListLine.rows);
        }
      })
    },
    /** 获取供应商列表
     * @param void
     * @return void
     */
    getSupplierList () {
      let _this = this;
      let supplierOptions = [];
      SERVICES.BASE.getSupplierListUsable().then(res =>{
        this.supplierList = res.data;
        if (this.supplierList.length=='0') return;
        this.supplierList.forEach(item =>{
          supplierOptions.push({ 
            'label': item.name,
            'value': item.name,
            'code': item.code,
            'id': item.id,
          })
        });
        let supplierObj = this.mate.mateFormerHeader.fields.find(item => item.name==="supplierName") || {};
        supplierObj.options = supplierOptions;
      });
    },
    /**
     * 修改供应商名称
     */
    changeName (val) {
      this.supplierList.forEach(item => {
        if (item.name == val) {      
          // 根据供应商名称导出供应商编号
          this.$set(this.mate.mateFormerHeader.values,'supplierNo',item.code)
        }
      });
      if (this.mate.mateListLine.rows.length > 0) {
        this.mate.mateListLine.rows.forEach(item => {
          if (item.supplierName !== val) {
            this.mate.mateListLine.rows = [];
          }
        })
      };
      this.selectSup = val;
      this.getGoods();
    },
    /**
     * 通过供应商名称查询商品数据
     */
    getGoods () {
      let param = {};
      param.supplierName = this.selectSup;
      SERVICES.JHW_SUPPLY.getGoods(param).then(res => {
        this.goodsData = res.data.data.list;
        let goodsOptions = [];
        if (this.goodsData.length > 0) {
          this.goodsData.forEach(item => {
            goodsOptions.push({
              label: item.itemNo,
              name: item.commodityName,
              value: item.itemNo,
              key: item.id,
            })
          })
          // 商品数据保存到表单配置中
          this.mate.mateFormerLine.fields.forEach(item =>{
            if (item.name === 'itemNo') {
              item.options = goodsOptions
            }
          })
        }
      })
    },
    /**
     * 提交表单数据
     * @param void
     * @return void
     ** 
     */
    handleSubmit() {
      let mate = [];
      let _this = this;
      this.$refs['headForm'].$refs["form"].validate(valid => {
        if (valid) {
          // let isOk = this.lineEditConfirm(); // 行编辑要确认保存
          mate = _this.saveData();
          if (!mate) return;
          // 修改保存
          if (this.mate.mateFormerHeader.values.id) {
            SERVICES.JHW_SUPPLY.updateSave(mate).then((res) =>{
              let status = res.status; 
              if(status === 200){
                _this.$message({
                  type: 'success',
                  message: res.data.message
                });
                _this.backToList();
              }else if(status === 500){
                _this.$message({
                  type: 'warning',
                  message: res.data.message
                })
              }
            });
          }
          // 新增保存 
          else {
            SERVICES.JHW_SUPPLY.addSave(mate).then((res) =>{
              let status = res.data.code; 
              if(status === 200){
                _this.$message({
                  type: 'success',
                  message: res.data.message
                });
                _this.backToList();
              }else {
                _this.$message({
                  type: 'warning',
                  message: res.data.message
                })
              }
            });
          }
        }
      });
    },
    /**
     * 提取提交和保存
     * 需要传给后台的数据
     * @params void
     * @return {Object} mate 头部数据和行数据
     ** 
     */
    saveData () {
      let mate = [];
      mate = this.mate.mateListLine.rows;
      if (mate.length < 1) {
        // 保存的时候明细行不能为空
        this.$message({
          type: "warning",
          message: "明细行不能为空"
        });
        return false;
      };
      if (this.mate.mateFormerHeader.values.id && mate.length !== 1) {
        // 修改保存的时候明细行只能有一行
        this.$message({
          type: "warning",
          message: "修改保存操作明细行只能为一行"
        });
        return false;
      };
      mate.forEach(item => {
        this.$set(item,'supplierNo',this.mate.mateFormerHeader.values.supplierNo);
        this.$set(item,'supplierName',this.mate.mateFormerHeader.values.supplierName);
        this.$set(item,'warehouse',this.mate.mateFormerHeader.values.warehouse);
      })
      return mate;
    },
    /** 动态表单事件管理
     * @param {String} event 事件名称
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} 执行事件函数
     ** 
     */
    handleEvents(event, val, name) {
      const eventControl = {
        input: (val, name) => this.handleInput(val, name),
        change: (val, name) => this.handleChange(val, name),
        default: () => { return }
      }
      return (eventControl[event] || eventControl.default)(val, name);
    },
    /** input事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     ** 
     */
    handleInput(val, name) {
      const inputControl = {
        // 商品编码
        itemNo: (val, name) => this.handleCode(val),
        default: () => { return }
      }
      return (inputControl[name] || inputControl.default)(val);
    },
    /** change 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} change事件执行函数
     **
     */
    handleChange(val, name) {
      this.isDirty = true;
      const changeControl = {
        // 商品编码
        itemNo: (val, name) => this.changeCode(val),
        // 供应商名称
        supplierName: (val, name) => this.changeName(val),
        default: () => { return }
      }
      return (changeControl[name] || changeControl.default)(val);
    },
    /**
     * 填写商品编码搜索
     * @param {String} val
     * 
     */
    handleCode (val) {
      let params= {
        'code': val
      };
      let goodsOptions = [];
      SERVICES.JHW_GOODSLIST.getListData(param).then(res => {
        this.goodsData = res.data.data.list
        if (this.goodsData.length > 0) 
          this.goodsData.forEach(item => {
            goodsOptions.push({
              label: item.code,
              name: item.name,
              value: item.code,
              key: item.id,
            })
          })
        // 商品数据保存到表单配置中
        this.mate.mateFormerLine.fields.forEach(item =>{
          if (item.name === 'itemNo') {
            item.options = goodsOptions
          }
        })
      })
    },
    /** 
     * 选择/修改商品编码
     * @param {String} val
     * @return void
     */
    changeCode(val) {
      if (!val) return;
      this.goodsData.forEach(i => {
        if (i.itemNo === val) {
          this.$set(this.mate.mateFormerLine.values,"commodityCategory",i.commodityCategory)
          this.$set(this.mate.mateFormerLine.values,"commodityName",i.commodityName)
          this.$set(this.mate.mateFormerLine.values,"specifications",i.specifications)
          this.$set(this.mate.mateFormerLine.values,"unitOfMeasurement",i.unitOfMeasurement)
          this.$set(this.mate.mateFormerLine.values,"placeOfOrigin",i.placeOfOrigin)
        }
      })
    },
    /**
     * 取消返回List页面
     * @param void
     * @return void
     ** 
     */
    backward() {
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
    },
    /**
     *重置操作
     *
     */
    handleReset(){
        this.$refs['headForm'].$refs["form"].resetFields();
    },
    /**
     * checkbox 勾选计算 拿到勾选的序号数组
     * param {Boolean} hasSelected 是否有勾选
     * param {Array} multipleSelection 勾选数组 
     * @return void
     ** 
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
     * 行新增/修改确认
     * @param {Object} val 行表单数据
     * @return void
     ** 
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
          let isExist = _this.checkNum(mate.mateFormerLine.values.index, curIdx, lineId);
          if (isExist){
            mate.mateFormerLine.values.index = _this.createNum();
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
     * 新建行弹窗取消
     * 隐藏弹窗并弹窗初始化
     * @param void
     * @return void
     ** 
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
     ** 
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
     ** 
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
     * 新建行弹窗取消
     * 隐藏弹窗并弹窗初始化
     * @param void
     * @return void
     ** 
     */
    lineDialoogClose () {
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
     ** 
     */
    resetForm (formName) {
      this.$refs[formName].resetForm();
    },
    /**
     * 重置弹窗表单 用于编辑
     * 验证信息重置
     * @param {String} formName 需要重置的表单 ref 名称
     * @return void
     ** 
     */
    clearForm (formName) {
      this.$refs[formName].clearForm();
    },
    /**
     * 行表单数据初始化
     * 自动生成序号
     * @param {Object} values 表单数据
     * @return void
     ** 
     */
    resetDialogForm (values){
      values['index'] = this.createNum();         //行号
      values['commodityCategory'] = "";          // 商品类别
      values['itemNo'] = "";              // 商品编码
      values['commodityName'] = "";              // 商品名称
      values['specifications'] = "";    // 商品规格
      values['unitOfMeasurement'] = "";            // 计量单位
      values['placeOfOrigin'] = "";              // 产地
      values['remarks'] = "";                     // 备注
    },
    /**
     * 递归自动生成序号 10/20/30....
     * 默认为 10 如果当前行序号有10了 则递增10
     * @param {Number} num 序号
     * @return {Number} number 序号
     ** 
     */
    createNum (num, step) {;
      let number = num || 1;
      let lineLen = this.mate.mateListLine.rows.length;
      if (this.checkNum(number)){
        number += step || 1;
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
     ** 
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
      lineListRows.forEach(item => serialNumberArr.push(item.index));
      return serialNumberArr.indexOf(num) != -1;
    },
    /**
     * 刷新tab页签
     * @param void
     * @return void
     ** 
     */
    backToList () {
      this.$root.monitor({ url: `${this.listUrl}${this.params}` });
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
