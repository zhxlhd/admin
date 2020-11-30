<!-- created by hezhiqiang on 2020/05/19 -->
<!-- 销售订单-新增 -->
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
      ref="lineTable"
    ></k-table-line>
    <!-- 底部 lineList End-->
    <!--明细行 form-dialog Start -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="80%" :show-close="true" :close-on-click-modal="false">
      <dynamic-form ref="lineForm" 
        :mate="mate.mateFormerLine" 
        :rules="lineFormRules" 
        :eventCfg="lineFromEventConfig" 
        @typeChange="handleAccept"
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
      status: "SAVE",            // 新建状态
      btns: ['提交','取消','重置'],      // 责任人列表
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
      isEditLine: false,         // 是否修改行
      isDirty: false,            // 是否修改了数据
      dialogTitle: '',           // 新增明细行弹框标题
      params: '?listName=jhw_sales_order_list&lineList=jhw_sales_order_line_list&listFormName=jhw_sales_order_form&lineForm=jhw_sales_order_line_form', // 元数据表名
      listUrl: '/common/toList',  // 元数据接口
      // 头部表单控件规则
      headerFormRules: {
      },
      // 头部表单事件配置
      headerFormEventConfig: {
        // 客户编码
        customerName: { change: true },
        // 客户地址
        customerAddress: { change: true },
        // 客户联系人
        contacts: { change: true },
      },
      // 明细行表单控件规则
      lineFormRules : {
        // 商品名称
        commodityName: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "blur"}],
        // 商品规格
        // commoditySpecifications: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "blur"}],
        // 计量单位
        unitMeasurement: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "blur"}],
        // 确认的数量
        confirmQuantity: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "blur"}],
        // 确认的交货日期
        confirmedDeliveryDate: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "blur"}],
        // 含税单价
        unitPriceIncludingTax: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "blur"}],
        // 商品编码
        itemNo: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "change"}],
        // 税率
        taxRate: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "change"}],
      },
      // 明细行表单事件配置
      lineFromEventConfig: {
        // 商品编码
        itemNo: {change: true},
        // 确认数量
        confirmQuantity: {input: true},
        // 含税单价
        unitPriceIncludingTax: {input: true},
      },
      goodsData: [],        // 商品数据
      contactOptions: [],   // 联系人下拉值
      detailRows: this.mate.mateListLine.rows,
    };
  },
  created() {
    this.init();
    if(this.pid){
      SERVICES.JHW_SALES_ORDER.getSalesData(this.pid).then(res=>{
        if (res.status == 200) {
          let data = res.data.data
          this.mate.mateFormerHeader.values = data.head
          this.mate.mateListLine.rows = data.lineList
        }
      })
    }
    // 获取客户信息
    this.getCustomerData();
  },
  mounted() {
    // 订单日期默认当前日期
    let date = this.mate.mateFormerHeader.values['orderDate'] || '';
    this.mate.mateFormerHeader.values['orderDate'] = date || dateFormatter("YYYY-MM-DD");
    // 制单人默认当前登录用户
    let localStorage = window.localStorage;
    var localuser = JSON.parse(localStorage.getItem('user'));
    this.mate.mateFormerHeader.values['creator'] = (localuser.firstname + localuser.lastname);
  },
  watch: {
    detailRows: {
      handler (val) {
        if (val.length > 0) {
          let total = 0;
          let total1 = 0;
          let total2 = 0;
          val.forEach(item => {
            if (item.amountIncludingTax && item.amountExcludingTax && item.taxAmount) {
              total += Number(item.amountIncludingTax);
              total1 += Number(item.amountExcludingTax);
              total2 += Number(item.taxAmount);
            }
          });
          this.$set(this.mate.mateFormerHeader.values,'amountIncludingTax',total.toFixed(2))
          this.$set(this.mate.mateFormerHeader.values,'amountExcludingTax',total1.toFixed(2))
          this.$set(this.mate.mateFormerHeader.values,'orderTax',total2.toFixed(2))
        }
      },
      deep: true
    },
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
      }
    },
    /**
     * 接受字典change
     * @param void
     */
    handleAccept (val,name) {
      if(name == 'taxRate') {
        if(this.mate.mateFormerLine.values.confirmQuantity && this.mate.mateFormerLine.values.unitPriceIncludingTax) {
          let amountIncludingTax = (this.mate.mateFormerLine.values.confirmQuantity * this.mate.mateFormerLine.values.unitPriceIncludingTax).toFixed(2)
          let amountExcludingTax = (Number(amountIncludingTax)/(1+Number(this.mate.mateFormerLine.values.taxRate)/100)).toFixed(2)
          let taxAmount = (Number(amountIncludingTax) - Number(amountExcludingTax)).toFixed(2)
          this.mate.mateFormerLine.values.amountIncludingTax = amountIncludingTax
          this.mate.mateFormerLine.values.amountExcludingTax = amountExcludingTax
          this.mate.mateFormerLine.values.taxAmount = taxAmount
        }
      }
    },
    /**
     * 获取客户信息
     * @param void
     * @return void
     */
    getCustomerData () {
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
            'value': item.name,
            'id': item.code,
          })
        })
        let customerObj = this.mate.mateFormerHeader.fields.find(item => item.name==="customerName") || {};
        customerObj.options = this.customerList;
        // this.mate.mateFormerHeader.values['customerName'] = this.customerList.label;
        if (this.mate.mateFormerHeader.values.customerName) {
          this.changeCustomer(this.mate.mateFormerHeader.values.customerName);
        }
      });
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
    handleButtons (btn, row, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const btnEvents = {
        addLine: (btn) => this.handleCreate(btn),  // 新增
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, row);
    },
    /**
     * 明细行按钮操作
     * @returns {void}
     */
    handleActions(btn, row){
      let action = btn.action;
      const btnEvents = {
        editLine: (btn,row) => this.handleUpdate(row),            // 明细行编辑
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
      this.isEditLine = false;
      this.dialogTitle = '新增'
      // 显示弹窗
      this.dialogFormVisible = true;
      this.resetDialogForm(this.mate.mateFormerLine.values);
      // 获取商品数据
      this.getGoodsData();
    },
    /**
     * 编辑行
     */
    handleUpdate(row){
      if (row.rowType === '1') {
        this.$message({
          type: 'warning',
          message: '行类型为商品无法编辑'
        });
        return;
      }
      this.dialogFormVisible = true;
      this.dialogTitle = '编辑';
      this.isEditLine = true;
      this.mate.mateFormerLine.values = {...row};
    },
    /**
     * 删除行
     * @param {Object} row 删除行信息
     */
    handleDelete(row){
      this.mate.mateListLine.rows.forEach((item,index)=>{
        if(item.lineNo === row.lineNo) {
          this.mate.mateListLine.rows.splice(index,1)
          this.mate.mateListLine.rows = this.initLineData(this.mate.mateListLine.rows);
        }
      })
    },
    /**
     * 获取商品信息
     * @param void
     */
    getGoodsData () {
      let param = {};
      let goodsOptions = []
      SERVICES.JHW_GOODSLIST.getListData(param).then(res => {
        this.goodsData = res.data.data.list
        if (this.goodsData.length > 0) {
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
      let mate = {};
      let _this = this;
      this.$refs['headForm'].$refs["form"].validate(valid => {
        if (valid) {
          // let isOk = this.lineEditConfirm(); // 行编辑要确认保存
          mate = _this.saveData();
          if (!mate) return;
          SERVICES.JHW_SALES_ORDER.save(mate).then((res) =>{
            let status = res.status; 
            if(status === 200){
              _this.backToList();
            }else if(status === 500){
              _this.$message({
                type: 'warning',
                message: '操作失败'
              })
            }
          });
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
      let mate = {};
      let values = this.mate.mateFormerHeader.values;
      values.state = '0';
      values.disableFlag = '1';
      values.orderSource = '1' // 新增时订单来源为 手工录入
      mate.head = values;
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
    /** 
     * 行编辑确认
     ** 
     */
    // lineEditConfirm(){
    //   let lineRows = this.mate.mateListLine.rows;
    //   let isOk = lineRows.every(row => row.edit === false);
    //   if(!isOk){
    //     this.$message.error("请先确认行编辑")
    //     return false
    //   }else{
    //     return true
    //   }
    // },
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
        // 确认的数量
        confirmQuantity: (val, name) => this.handleQuantity(val),
        // 含税单价
        unitPriceIncludingTax: (val) => this.handleunitPriceIncludingTax(val),
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
        // 客户编码
        customerName: (val) => this.changeCustomer(val),
        // 客户地址
        customerAddress: (val) => this.changeAddress(val),
        // 客户联系人
        contacts: (val) => this.changeContacts(val),
        // 商品编码
        itemNo: (val, name) => this.changeCode(val),
        default: () => { return }
      }
      return (changeControl[name] || changeControl.default)(val);
    },
    /** 
     * 客户地点设置
     * 切换客户改变对应地点的列表
     * @param {String} val 客户
     * @return void
     */
    changeCustomer (val) {
      if (val) {
        this.mate.mateFormerHeader.fields.forEach(item => {
          if (item.name === "customerAddress") {
            item.disabled = false
          }
        })
      };
      let _this = this;
      let customerObj = this.customerList.find(item => item.value === val);
      let AddressObj = this.mate.mateFormerHeader.fields.find(item => item.name === 'customerAddress') || {};
      AddressObj.options = customerObj.addressList;
    },
    /** 
     * 选择客户地址获取
     * 联系人数据
     * @param {String} val 客户地址
     * @return void
     */
    changeAddress(val) {
      if (val) {
        this.mate.mateFormerHeader.fields.forEach(item => {
          if (item.name === "contacts") {
            item.disabled = false
          }
        })
      };
      let _this = this
      this.contactOptions = [];
      // 客户改变时，获取到客户联系人接口
      this.mate.mateFormerHeader.values['contacts'] = "";
      this.$root.ajaxData('/contacts/all/' + val, {}, function (data) {
        if (data.length > 0) {
          data.forEach(i => {
            _this.contactOptions.push({ 
              'label': i.name, 
              'value': i.name, 
              'phone': i.phoneNumber 
            })
          })
        }
        let UserObj = _this.mate.mateFormerHeader.fields.find(item => item.name==="contacts") || {};
        UserObj.options = _this.contactOptions;
      }, 'GET')
    },
    /** 
     * 选择联系人获取
     * 电话
     * @param {String} val 客户地址
     * @return void
     */
    changeContacts (val) {
      if (val) {
        this.contactOptions.forEach(item => {
          if (item.value === val) {
            this.$set(this.mate.mateFormerHeader.values,'contactPhone',item.phone)
          }
        })
      }
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
        if (this.goodsData.length > 0) {
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
        }
      })
    },
    /**
     * 确认数量*含税单价=获取含税金额
     * 含税金额/1+税率=不含税金额
     * @param {String} val 确认数量
     * @param {String} 含税单价
     */
    handleQuantity(val){
      if (val && this.mate.mateFormerLine.values.unitPriceIncludingTax) {
        let data = (val * this.mate.mateFormerLine.values.unitPriceIncludingTax).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,"amountIncludingTax",data)
        let data2 = (data/(1 + (this.mate.mateFormerLine.values.taxRate/100))).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,"amountExcludingTax",data2)
        let data3 = (data - data2).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,'taxAmount',data3)
      }
    },
    /**
     * 确认数量*含税单价=获取含税金额
     * @param {String} val 含税单价
     * @param {String} 确认数量
     */
    handleunitPriceIncludingTax (val){
      if (val && this.mate.mateFormerLine.values.confirmQuantity) {
        let data = (val * this.mate.mateFormerLine.values.confirmQuantity).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,"amountIncludingTax",data)
        let data2 = (data/(1 + (this.mate.mateFormerLine.values.taxRate/100))).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,"amountExcludingTax",data2)
        let data3 = (data - data2).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,'taxAmount',data3)
      }
    },
    /** 
     * 选择/修改商品编码
     * @param {String} val
     * @return void
     */
    changeCode(val) {
      if (!val) return;
      this.goodsData.forEach(i => {
        if (i.code === val) {
          this.$set(this.mate.mateFormerLine.values,"commodityName",i.name)
          this.$set(this.mate.mateFormerLine.values,"commoditySpecifications",i.specification)
          this.$set(this.mate.mateFormerLine.values,"unitMeasurement",i.unitId)
          this.$set(this.mate.mateFormerLine.values,"taxRate",i.taxRate);
          this.$set(this.mate.mateFormerLine.values,"unitOfMeasurement",i.unitId)
          this.$set(this.mate.mateFormerLine.values,"unitPriceIncludingTax",i.marketPriceWithTax)
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
    /** 新增保存到后台并关闭弹窗 
     * @param {String} ids 所选行 id
     * @param {Object} rows 所选行数据
     * @return void
     ** 
     */
    handleConfirm(ids, rows) {
      if(ids){
        let data = [];
        rows.forEach(item => {
          let [smartOrderId,deliveryCount] = [item.id,item.quantity];
          let { soNum, materialsCode, materialsName, specs, unit, remarks } = item;
          data.push({ smartOrderId, deliveryCount, soNum, materialsCode, materialsName, specs, unit, remarks });
        })
        this.mate.mateListLine.rows = [...this.mate.mateListLine.rows,...data]
        this.initLineData(this.mate.mateListLine.rows);
        this.dialogFormVisible = false;
      }else{
        this.dialogFormVisible = false;
      }
    },
    /**
     * 刷新数据
     * 保存后刷新本页面数据
     * 并把头部表单数据 Number 转 String
     * 并设定索引和已实施勾选状态
     * @params {Object} data ecn数据
     ** 
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
     ** 
     */
    submitForm(val) {
      let _this = this;
      let mate = this.mate;
      // 验证表单 通过后保存信息到列表行中
      this.$refs['lineForm'].$refs['form'].validate((valid,obj) => {
        if (valid) {
          let curIdx = mate.mateFormerLine.values.lineNo;
          let values = mate.mateFormerLine.values;
          if(!this.isEditLine){
            values.lineNo = mate.mateListLine.rows.length + 1;
            let mateFormerValues = Object.assign({},values);
            mate.mateListLine.rows.push(mateFormerValues);
          } else {
            mate.mateListLine.rows.map((item, lineNo) => {
              if (curIdx === item.lineNo) {
                let mateFormerValues = Object.assign({},values);
                // splice将i行数据删除，并将mateFormerValues1填充进
                mate.mateListLine.rows.splice(lineNo, 1, mateFormerValues);
              }
            });
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
        item.lineNo = index + 1;
      })
      return data;
    },
    /**
     * 清空行数据
     * @param void
     * @return void
     ** 
     */
    clearLineList (){
      this.mate.mateListLine.rows = [];
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
    },
    /**
     * 重新渲染行表单弹窗
     * @param void
     * @return void
     ** 
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
      values['lineNo'] = this.createNum();         //行号
      values['rowType'] = "2";               
      values['itemNo'] = "";            
      values['commodityName'] = "";  
      values['commoditySpecifications'] = "";            
      values['unitMeasurement'] = "";    
      values['unitOfMeasurement'] = "";   
      values['confirmQuantity'] = "";           
      values['confirmedDeliveryDate'] = "";          
      values['unitPriceIncludingTax'] = "";          
      values['amountIncludingTax'] = "";             
      values['amountExcludingTax'] = "";  
      values['taxRate'] = "";            
      values['taxAmount'] = "";    
      values['quantityShipped'] = "";           
      values['signedInQuantity'] = "";          
      values['remark'] = "";           
    },
    /**
     * 递归自动生成序号 10/20/30....
     * 默认为 10 如果当前行序号有10了 则递增10
     * @param {Number} num 序号
     * @return {Number} number 序号
     ** 
     */
    createNum (num) {
      let lineNo = num || 1;
      if (this.checkNum(lineNo)){
        lineNo += 1;
        lineNo = this.createNum(lineNo);
      }
      return lineNo;
    },
    /**
     * 序号检验 
     * 校验是否已经存在当前序号
     * @param {Number} num 序号
     * @param {Number} id 行 id
     * @return {Boolean}  num是否已存在
     ** 
     */
    checkNum (num, index) {
      let lineNumArr = [];
      let listLineRows = [...this.mate.mateListLine.rows];
      if (index) {
        listLineRows = listLineRows.filter(item => item.index != index);
      }
      listLineRows.forEach(item => lineNumArr.push(item.lineNo));
      return lineNumArr.indexOf(num) != -1;
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
