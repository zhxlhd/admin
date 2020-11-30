<!-- created by fengjing on 2020/05/20 -->
<!-- 预订单新增 -->
<template>
  <div>
    <h-btn @click="handleBtns" :btns="['保存','取消']"></h-btn>
    <DynamicForm ref="headForm" @typeChange="handleAccept" :mate="mate.mateFormerHeader" :rules="headerFormRules" :eventCfg="headerFormEventConfig" @events="handleFormEvents"></DynamicForm>
    <div class="button">
      <el-button type="primary" size="mini" @click="addBooking">新增</el-button>
    </div>
    <!-- 配置 checkType 不渲染勾选列 -->
    <main-table ref="lineTable"
                :mateList="mate.mateListLine" 
                @action="handleActions" 
                :checkType="'noCheck'"
                ></main-table>
    <!-- 底部 lineList End -->
    <!--明细行 form-dialog Start -->
    <el-dialog :title="bookTitle" :visible.sync="bookDialog" width="80%" :show-close="true" :close-on-click-modal="false">
      <dynamic-form ref="lineForm" 
        :mate="mate.mateFormerLine" 
        :rules="lineFormRules" 
        :eventCfg="lineFormEventConfig" 
        @typeChange="handleAccept"
        @events="handleLineEvents"></dynamic-form>
        <el-row type="flex" justify="start">
            <el-button size="mini" @click="submitForm" type="primary">{{$t('BUTTON_TEXT.CONFIRM')}}</el-button>
            <el-button size="mini" @click="lineDialogClose">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
        </el-row>
    </el-dialog>
    <!--明细行 form-dialog End -->
  </div>
</template>
<script>
import SERVICES from '@/services';
import { mapGetters, mapActions } from "vuex";
export default {
  props:{
    mate: Object
  },
  computed: {
    ...mapGetters({
      pid: 'Common/pid'
    })
  },
  components:{
    DynamicForm: function index(resolve) {
      require(["@/components/form/DynamicForm.vue"], resolve);
    },
    MainTable: function index(resolve) {
      require(["@/components/table/MainTable.vue"], resolve);
    },
    HBtn: function index(resolve){
      require(["@/components/Button/HBtn.vue"], resolve);
    },
  },
  data(){
    return{
      bookDialog: false,
      bookTitle: '新增',
      listUrl: '/common/toList', // 元数据接口
      dataUrl: '/agriculture/product/list',  // 列表数据接口
      queryUrl: '?listName=jhw_purchase_order_list&lineList=jhw_purchase_order_list_line&listFormName=jhw_purchase_order_form',  // 列表接口
      headerFormRules: {
        // //公司
        // customerName: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // //供应商
        supplierName: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        //收货地址
        customerAddress: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        //采购日期
        createAt: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        //联系人
        contacts: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        //联系电话
        contactPhone: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 收货仓库
        warehouse: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 采购类型
        purchaseType: [{ required: true, trigger: "change", disabled: false, message:"此项不能为空"}],
      }, // 表头校验
      lineFormRules: {
        //商品编码
        itemNo: [{ required: true, trigger: "blur", message:"此项不能为空"}],
        // 商品名称
        commodityName: [{ required: true, trigger: "blur", message:"此项不能为空"}],
        // 规格
        // commoditySpecifications: [{ required: true, trigger: "blur", message:"此项不能为空"}],
        // 单位
        unitOfMeasurement: [{ required: true, trigger: "blur", message:"此项不能为空"}],
        // 数量
        confirmQuantity: [{ required: true, type:"number", trigger: "blur", message:"此项不能为空"}],
        // // 确认数量
        // confirmQuantity : [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // // 确认承认日期
        // confirmedDeliveryDate: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 单价
        unitPriceIncludingTax : [{ required: true, type:"number", trigger: "blur", message:"此项不能为空"}],
        // 税率
        taxRate: [{ required: true, trigger: "change", message:"此项不能为空"}]
      }, // 行校验
      headerFormEventConfig: {
        customerAddress: {change:true},
        supplierName: {change:true},   // 供应商
      }, //表头change事件
      lineFormEventConfig: {  
        itemNo: {input: true,change: true},  // 商品编码
        confirmQuantity: {change:true},
        unitPriceIncludingTax:{change: true}
      }, //表行change事件
      isEdit: false,//行是否编辑
      supplierList: [], //供应商下拉
      addressList: [], // 收获地址
      goodsData: [],        // 商品数据
    }
  },
  created(){
    this.getOwnCompanyIfno()
    this.getSupplierList()
    this.getAddressList()
    this.getWarehouse()
    if(this.pid){
      SERVICES.JHW_PURCHASE_ORDER.getPurchaseOrder(this.pid).then(res=>{
        let data = res.data.data
        this.mate.mateFormerHeader.values = data.head
        this.mate.mateListLine.rows = data.lineList
      })
    }
  },
  methods: {
    /** 头部按钮事件
     * @param {String} name 按钮名称
     * @return {Function} 按钮事件
     ** Author: zhongxiaolong
     */
    handleBtns(name) {
      const btnEvents = {
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
        // 删除行
        deleteLine: () => this.handleDelete(row),
        // 默认
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(act, row);
    },
    /**
     * 头change 事件
     */
    handleFormEvents(event, val, name){
      const eventControl = {
        change: (val, name) => this.handleFormChange(val, name),
        default: () => { return }
      }
      return (eventControl[event] || eventControl.default)(val, name);
    },
    /**
     * 行change事件
     */
    handleLineEvents(event, val, name){
      const eventControl = {
        change: (val, name) => this.handleLineChange(val, name),
        default: () => { return }
      }
      return (eventControl[event] || eventControl.default)(val, name);
    },
    /** 头formchange 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} change事件执行函数
     */
    handleFormChange(val, name){
      const changeControl = {
        customerAddress: (val, name) => this.handleCustomerAddress(val),
        supplierName: (val, name) => this.changeSupplierName(val),    // 选择供应商
        default: () => { return }
      }
      return (changeControl[name] || changeControl.default)(val);
    },
    /** 行formchange 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} change事件执行函数
     */
    handleLineChange(val, name){
      this.isDirty = true;
      const changeControl = {
        confirmQuantity: (val, name) => this.handleQuantity(val),
        unitPriceIncludingTax: (val, name) => this.handleUnitPriceIncludingTax(val),
        itemNo: (val, name) => this.changeCode(val),   // 商品编码
        default: () => { return }
      }
      return (changeControl[name] || changeControl.default)(val);
    },
    /**
     * 保存
     */
    handleSave(){
      // 判断明细行不能为空
      if (this.mate.mateListLine.rows.length === 0) {
        this.$message.warning("明细行不能为空");
        return;
      };
      let _this = this
      this.$refs['headForm'].$refs["form"].validate((valid) => {
        if (valid) {
          let param = {}
          this.mate.mateFormerHeader.values.state = '1'
          this.mate.mateFormerHeader.values.source = '2'
          // 默认制单人为当前登录用户
          let localStorage = window.localStorage;
          var localuser = JSON.parse(localStorage.getItem('user'));
          this.mate.mateFormerHeader.values.creator = (localuser.firstname + localuser.lastname);
          param.head = this.mate.mateFormerHeader.values
          param.lineList = this.mate.mateListLine.rows
          if(this.mate.mateFormerHeader.values.id){
            SERVICES.JHW_PURCHASE_ORDER.update(param).then(res=>{
              if(res.data.code === 200){
                _this.backToList()
                _this.$message.success("操作成功");
              } else {
                _this.$message.warning(res.data.message);
              }
            })
          } else {
            SERVICES.JHW_PURCHASE_ORDER.save(param).then(res=>{
              if(res.data.code === 200){
                _this.backToList()
                _this.$message.success("操作成功");
              } else {
                _this.$message.warning(res.data.message);
              }
            })
          }
        } else {
          _this.$message.warning("表单校验失败");
        }
      })
    },
    /**
     * 获取客户仓库
     * @param void
     * @return void
     */
    getWarehouse () {
      const param = {};
      let _this = this
      SERVICES.STOCK_LIST.getWarehouse(param).then(res => {
        if (res.status === 200) {
          const data = res.data.data
          data.forEach(item=>{
            item.label =  item.name
            item.value = item.name
          })
          if (data.length) {
            let chargeObj = _this.mate.mateFormerHeader.fields.find(item => item.name==="warehouse") || {};
            chargeObj.options = data
          }
        }
      })
    },
    /**
     * 新增行预订单
     * @param {Void}
     */
    addBooking(){
      let isOk = true;  // 判断是否允许新增
      if (!this.mate.mateFormerHeader.values.purchaseType) {
        this.$message({
          type: 'warning',
          message: '请选择采购类型'
        });
        return;
      };
      if (this.mate.mateFormerHeader.values.purchaseType === "2" && !this.mate.mateFormerHeader.values.supplierName) {
        this.$message({
          type: 'warning',
          message: '请选择供应商'
        });
        return;
      };
      if (this.mate.mateFormerHeader.values.purchaseType === "2") {
        this.mate.mateFormerLine.values.rowType = '1'
      } else {
        this.mate.mateFormerLine.values.rowType = '2'
      }
      this.mate.mateListLine.rows.forEach(item => {
        if (this.mate.mateFormerLine.values.rowType !== item.rowType) {
          isOk = false;
        }
      });
      if (isOk === false) {
        this.$message({
          type: 'warning',
          message: '行类型不一致，请选择同一采购类型'
        });
        return;
      }
      this.bookDialog = true
      this.bookTitle = '新增'
      this.isEdit = false
      this.resetDialogForm(this.mate.mateFormerLine.values)
      let isDisabled1 = this.mate.mateFormerLine.fields.find(item => item.name == 'itemNo');
      isDisabled1.disabled = false;
       // 类型手工
      if (this.mate.mateFormerLine.values.rowType === "2") {
        let isDisabled2 = this.mate.mateFormerLine.fields.find(item => item.name == 'commodityName');
        let isDisabled3 = this.mate.mateFormerLine.fields.find(item => item.name == 'commoditySpecifications');
        let isDisabled4 = this.mate.mateFormerLine.fields.find(item => item.name == 'taxRate');
        let isDisabled5 = this.mate.mateFormerLine.fields.find(item => item.name == 'unitOfMeasurement');
        let isDisabled6 = this.mate.mateFormerLine.fields.find(item => item.name == 'unitPriceIncludingTax');
        isDisabled2.disabled = false;
        isDisabled3.disabled = false;
        isDisabled4.rowId = 0;
        isDisabled5.rowId = 0;
        isDisabled6.disabled = false;
        this.mate.mateFormerLine.fields.forEach(item => {
          if (item.name == 'itemNo' && item.holder == 'textc') {
            item.isRender = true;
          };
          if (item.name == 'itemNo' && item.holder == 'select') {
            item.isRender = false;
          };
        })
      }
      // 类型为商品
      else if (this.mate.mateFormerLine.values.rowType === "1") {
        let isDisabled2 = this.mate.mateFormerLine.fields.find(item => item.name == 'commodityName');
        let isDisabled3 = this.mate.mateFormerLine.fields.find(item => item.name == 'commoditySpecifications');
        let isDisabled4 = this.mate.mateFormerLine.fields.find(item => item.name == 'taxRate');
        let isDisabled5 = this.mate.mateFormerLine.fields.find(item => item.name == 'unitOfMeasurement');
        let isDisabled6 = this.mate.mateFormerLine.fields.find(item => item.name == 'unitPriceIncludingTax');
        isDisabled2.disabled = true;
        isDisabled3.disabled = true;
        isDisabled4.rowId = 1;
        isDisabled5.rowId = 1;
        isDisabled6.disabled = false;
        this.mate.mateFormerLine.fields.forEach(item => {
          if (item.name == 'itemNo' && item.holder == 'textc') {
            item.isRender = false;
          };
          if (item.name == 'itemNo' && item.holder == 'select') {
            item.isRender = true;
          };
        });
        this.getGoodsData();   // 获取商品信息
      }
    },
    /**
     * 获取商品信息
     * @param void
     */
    getGoodsData () {
      let name = this.mate.mateFormerHeader.values.supplierName;
      let goodsOptions = [];
      SERVICES.JHW_PURCHASE_ORDER.getPurchaseGoods(name).then(res => {
        this.goodsData = res.data.data
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
          this.$set(this.mate.mateFormerLine.values,"taxRate",i.taxRate);
          this.$set(this.mate.mateFormerLine.values,"unitOfMeasurement",i.unitId)
          this.$set(this.mate.mateFormerLine.values,"unitPriceIncludingTax",i.priceWithTax)
        }
      })
    },
     /**
     * 取消操作
     * @returns {void}
     */
    backward(){
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
    backToList(){
      this.$root.monitor({ url: `${this.listUrl}${this.queryUrl}` });
    },
    /**
     *重置操作
     *   @returns {void}
     */
    handleReset(){
      this.$refs['headForm'].$refs["form"].resetFields();
    },
    /**
     * 编辑行
     */
    handleUpdate(act,row){
      // 行类型为商品
      if (row.rowType === '1') {
        let isDisabled1 = this.mate.mateFormerLine.fields.find(item => item.name == 'itemNo');
        let isDisabled2 = this.mate.mateFormerLine.fields.find(item => item.name == 'commodityName');
        let isDisabled3 = this.mate.mateFormerLine.fields.find(item => item.name == 'commoditySpecifications');
        let isDisabled4 = this.mate.mateFormerLine.fields.find(item => item.name == 'unitPriceIncludingTax');
        let isDisabled5 = this.mate.mateFormerLine.fields.find(item => item.name == 'taxRate');
        let isDisabled6 = this.mate.mateFormerLine.fields.find(item => item.name == 'unitOfMeasurement');
        isDisabled1.disabled = true;
        isDisabled2.disabled = true;
        isDisabled3.disabled = true;
        isDisabled4.disabled = false;
        isDisabled5.rowId = 1;
        isDisabled6.rowId = 1;
      } 
      // 行类型为手工
      else if (row.rowType === '2') {
        let isDisabled1 = this.mate.mateFormerLine.fields.find(item => item.name == 'itemNo');
        let isDisabled2 = this.mate.mateFormerLine.fields.find(item => item.name == 'commodityName');
        let isDisabled3 = this.mate.mateFormerLine.fields.find(item => item.name == 'commoditySpecifications');
        let isDisabled4 = this.mate.mateFormerLine.fields.find(item => item.name == 'taxRate');
        let isDisabled5 = this.mate.mateFormerLine.fields.find(item => item.name == 'unitOfMeasurement');
        isDisabled1.disabled = false;
        isDisabled2.disabled = false;
        isDisabled3.disabled = false;
        isDisabled4.rowId = 0;
        isDisabled5.rowId = 0;
      }
      this.bookDialog = true
      this.bookTitle = '编辑'
      this.isEdit = true
      this.mate.mateFormerLine.values = {...row}
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
     * 行 保存
     */
    submitForm() {
      let _this = this;
      let mate = this.mate;
      // 验证表单 通过后保存信息到列表行中
      this.$refs['lineForm'].$refs['form'].validate((valid,obj) => {
        if (valid) {
          let curIdx = mate.mateFormerLine.values.lineNo;
          let values = mate.mateFormerLine.values;
          if(!this.isEdit){
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
     * 行 取消
     */
    lineDialogClose(){
      this.bookDialog = false
    },
    /**
     * 行表单数据初始化
     * 自动生成序号
     * @param {Object} values 表单数据
     * @return void
     ** 
     */
    resetDialogForm (values){
      values['lineNo'] = this.creatDetailNum();         //行号          
      values['itemNo'] = "";    
      values['commodityName'] = "";            
      values['commoditySpecifications'] = "";               
      values['unitOfMeasurement'] = "";   
      values['confirmQuantity'] = undefined;                    
      values['unitPriceIncludingTax'] = undefined;             
      values['amountIncludingTax'] = "";  
      values['taxRate'] = "";            
      values['taxAmount'] = "";    
      values['amountExcludingTax'] = "";      
    },
    /**
     * 递归自动生成明细行序号 1/2/3....
     * 默认为 1 如果当前行序号有1了 则递增1
     * @param {Number} num 序号
     * @return {Number} lineNo 序号
     */
    creatDetailNum (num) {
      let lineNo = num || 1;
      if (this.checkDetailNum(lineNo)){
        lineNo += 1;
        lineNo = this.creatDetailNum(lineNo);
      }
      return lineNo;
    },
     /**
     * 明细行序号检验 
     * 校验是否已经存在当前序号
     * @param {Number} num 序号
     * @return {Boolean}  num是否已存在
     */
    checkDetailNum (num, index) {
      let lineNoArr = [];
      let listLineRows = [...this.mate.mateListLine.rows];
      if (index) {
        listLineRows = listLineRows.filter(item => item.index != index);
      }
      listLineRows.forEach(item => lineNoArr.push(item.lineNo));
      return lineNoArr.indexOf(num) != -1;
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
      };
      if (name == 'purchaseType') {
        if (val == '1') {
          this.mate.mateFormerLine.values.rowType = '2'   // 线上采购行类型为手工
        } else if (val == '2') {
          this.mate.mateFormerLine.values.rowType = '1'  // 线下采购行类型为商品
        }
      }
    },
    /**
     * 数量变化时
     */
    handleQuantity(val){
      if(val && this.mate.mateFormerLine.values.unitPriceIncludingTax){
        let amountIncludingTax = (val * this.mate.mateFormerLine.values.unitPriceIncludingTax).toFixed(2)
        // 如果有税率 计算不含税金额 税额
        if(this.mate.mateFormerLine.values.taxRate) {
          let amountExcludingTax = (Number(amountIncludingTax)/(1+Number(this.mate.mateFormerLine.values.taxRate)/100)).toFixed(2)
          let taxAmount = (Number(amountIncludingTax) - Number(amountExcludingTax)).toFixed(2)
          this.mate.mateFormerLine.values.amountIncludingTax = amountIncludingTax
          this.mate.mateFormerLine.values.amountExcludingTax = amountExcludingTax
          this.mate.mateFormerLine.values.taxAmount = taxAmount
        }
      }
    },
    /**
     * 单价切换
     */
    handleUnitPriceIncludingTax(val){
      if(val && this.mate.mateFormerLine.values.confirmQuantity){
        let amountIncludingTax = (val * this.mate.mateFormerLine.values.confirmQuantity).toFixed(2)
        // 如果有税率 计算不含税金额 税额
        if(this.mate.mateFormerLine.values.taxRate) {
          let amountExcludingTax = (Number(amountIncludingTax)/(1+Number(this.mate.mateFormerLine.values.taxRate)/100)).toFixed(2)
          let taxAmount = (Number(amountIncludingTax) - Number(amountExcludingTax)).toFixed(2)
          this.mate.mateFormerLine.values.amountIncludingTax = amountIncludingTax
          this.mate.mateFormerLine.values.amountExcludingTax = amountExcludingTax
          this.mate.mateFormerLine.values.taxAmount = taxAmount
        }
      }
    },
    // 收获地址变化val
    handleCustomerAddress(val){
      let addressObj = this.addressList.find(item => item.value === val);
      if (addressObj) {
        this.mate.mateFormerHeader.values.contacts = addressObj.contacts
        this.mate.mateFormerHeader.values.contactPhone = addressObj.contactPhone
      }
    },
    /**
     * 获取当前公司信息 
     */
    getOwnCompanyIfno(){
      let _this = this
      SERVICES.JHW_GOOD_PRICE.getOwnCompanyIfno().then(res =>{
        let data = res.data.data
        _this.mate.mateFormerHeader.values.customerName = data.name
      })
    },
    /** 获取供应商列表
     * @param void
     * @return void
     ** Author: fengjing
     */
    getSupplierList () {
      let _this = this;
      SERVICES.BASE.getSupplierListUsable().then(res =>{
        let data = res.data;
        if (data.length=='0') return;
        _this.supplierList = data
        let supplierNames = []
        data.forEach(item =>{
          if ((item.name == "") || (item.name == undefined) || (item.code == "")) return;
          supplierNames.push({ 
            'label': item.name,
            'value': item.name,
            'name': item.name,
            'id': item.id,
          })
        })
        let chargeObj = _this.mate.mateFormerHeader.fields.find(item => item.name==="supplierName") || {};
        chargeObj.options = supplierNames;
      });
    },
    /**
     * 选择供应商带出对应供应商分类
     * @param void
     * @return void
     */
    changeSupplierName (val) {
      let typeObj = this.supplierList.find(item => item.name === val);
      if (typeObj) {
        this.$set(this.mate.mateFormerHeader.values,'supplierType',typeObj.merchantsCategory)
      };
      if (val && this.mate.mateFormerHeader.values.purchaseType === "2") {
        this.$set(this.mate.mateListLine,'rows',[])   // 更改供应商清空明细行
      }
    },
    /**
     * 获取收获地址下拉选
     */
    getAddressList(){
      let _this = this;
      SERVICES.JHW_PURCHASE_ORDER.getAddress({}).then(res =>{
        let data = res.data.data;
        if (data.length=='0') return;
        data.forEach(item =>{
          if ((item.customerAddress == "") || (item.customerAddress == undefined) || (item.customerAddress == "")) return;
          _this.addressList.push({ 
            'label': item.customerAddress + '/' + item.contacts + '/' + item.contactPhone,
            'value': item.customerAddress,
            'contactPhone': item.contactPhone,
            'contacts': item.contacts,
          })
        })
        let chargeObj = _this.mate.mateFormerHeader.fields.find(item => item.name==="customerAddress") || {};
        chargeObj.options = _this.addressList;
      })
    }
  }
}
</script>
<style scoped lang="scss">
.button{
    margin-bottom: 10px;
  }
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
