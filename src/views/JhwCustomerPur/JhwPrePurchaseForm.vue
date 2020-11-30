<!-- created by fengjing on 2020/05/20 -->
<!-- 请购单新增 -->
<template>
  <div>
    <h-btn @click="handleBtns" :btns="['保存','取消']"></h-btn>
    <DynamicForm ref="headForm" :mate="mate.mateFormerHeader" :rules="headerFormRules" :eventCfg="headerFormEventConfig" @events="handleFormEvents"></DynamicForm>
    <div class="button">
      <!-- 状态为新建 并且是采购方 才可以新增-->
      <el-button type="primary" size="mini" @click="addBooking" v-if="isPurchas == 1 || isPurchas == 7">新增</el-button>
    </div>
    <!-- 配置 checkType 不渲染勾选列 -->
    <main-table ref="lineTable"
                :mateList="mate.mateListLine" 
                @action="handleActions" 
                :checkType="'noCheck'"
                ></main-table>
    <!-- 底部 lineList End -->
    <el-dialog :visible.sync="bookDialog" width="80%" :title="bookTitle">
      <h-btn @click="handleLineBtns" :btns="['保存','取消','重置']"></h-btn>
      <DynamicForm ref="lineForm" @typeChange="handleAccept" :mate="mate.mateFormerLine" :rules="lineFormRules"  :eventCfg="lineFormEventConfig" @events="handleLineEvents"></DynamicForm>
    </el-dialog>

      <!--查看附件-->
    <el-dialog :visible.sync="filesDialog" width="80%" title="查看附件">
        <el-row>
        <el-table :data="fileList"  max-height="300" border align="center" size="mini" ref="multipleTable"  show-overflow-tooltip  style="width: 100%" >
          <el-table-column show-overflow-tooltip label="序号"  prop="lineNo"></el-table-column>
          <el-table-column show-overflow-tooltip label="名字"  prop="fileName"></el-table-column>
          <el-table-column show-overflow-tooltip label="操作">
            <template slot-scope="scope">
              <el-button size="mini"  type="primary" @click="viewFile(scope.row.fileUrl)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import SERVICES from '@/services';
export default {
  computed: {
    ...mapGetters({
      pid: 'Common/pid'
    })
  },
  props:{
    mate: Object
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
      queryUrl: '?listName=jhw_pre_purchase_list&lineList=jhw_pre_pruchase_list_line&listFormName=jhw_pre_purchase_form', // 元数据表名
      headerFormRules: {
        // //公司
        // customerName: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // //供应商
        // supplierName: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        //收货地址
        customerAddress: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        //送货日期
        deliverDate: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        //联系人
        contacts: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        //联系电话
        contactPhone: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 收货仓库
        warehouse: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
      }, // 表头校验
      lineFormRules: {
        //商品编码
        itemNo: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 商品名称
        commodityName: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 规格
        commoditySpecifications: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 单位
        unitOfMeasurement: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 数量
        quantity: [{ required: true, type:"number", trigger: "blur", disabled: false, message:"此项不能为空"}],
        // // 确认数量
        // confirmQuantity : [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // // 确认承认日期
        // confirmedDeliveryDate: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 单价
        unitPriceIncludingTax : [{ required: true, type:"number", trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 税率
        taxRate: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}]
      }, // 行校验
       headerFormEventConfig: {
        customerAddress: {change:true},
        deliverDate: {change:true}
      },
      lineFormEventConfig: {
        quantity: {change: true}
      }, //行change事件
      isEdit: false,//行是否编辑
      companyName: '', //当前公司名
      tableData: [],
      isPurchas: 1, // 头状态
      carId: this.$store.state.JHWShopping['carId'], //从购物车带来的购物车id
      isFormEdit: this.$store.state.JHWShopping['isEdit'], //头是编辑 还是从购物车带来
      fileList: [],
      filesDialog: false,
      addressList: []
    }
  },
  mounted(){
    // this.getWarehouse()
    this.getAddressList()
    // 购物车带来
    if(this.carId && !this.isFormEdit){
      SERVICES.JHW_GOOD_PRICE.toBookingSheet(this.carId).then(res=>{
        this.mate.mateFormerHeader.values = res.data.data.head
        this.isPurchas = this.mate.mateFormerHeader.values.state
        this.mate.mateListLine.rows = res.data.data.lineList
        this.tableData = this.mate.mateListLine.rows
        this.mate.mateListLine.rows.forEach((item,index)=>{
          item.lineNo = this.creatDetailNum()
        })
      })
    } else {
      // 编辑
      SERVICES.JHW_BOOKING_SHEET.getBookingSheet(this.carId).then(res=>{
        this.mate.mateFormerHeader.values = res.data.data.head
        this.isPurchas = this.mate.mateFormerHeader.values.state
        this.mate.mateListLine.rows = res.data.data.lineList
        this.tableData = this.mate.mateListLine.rows
        this.mate.mateListLine.rows.forEach((item,index)=>{
          item.lineNo = this.creatDetailNum()
        })
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
    /** 弹出框按钮事件
     * @param {String} name 按钮名称
     * @return {Function} 按钮事件
     ** Author: zhongxiaolong
     */
    handleLineBtns(name){
      const btnEvents = {
        // 提交按钮
        save: () => this.handleLineSave(),
        // 取消按钮
        cancel: () => this.backwardLine(),
        // 重置按钮
        reset: () => this.handleResetLine(),
        // 默认
        default: () => { return }
      }
      return (btnEvents[name] || btnEvents.default)();
    },
    handleActions(act, row) {
      let action = act.action;
      let rowId = { id: [row.id] };
      const btnEvents = {
        // 编辑行
        editLine: (act, row) => this.handleUpdate(act, row),
        // 删除行
        deleteLine: () => this.handleDelete(row),
        // 查看附件
        showFile: (act,row) => this.handleShowFile(act,row.files),
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
    /** 头formchange 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} change事件执行函数
     */
    handleFormChange(val, name){
      const changeControl = {
        customerAddress: (val, name) => this.handleCustomerAddress(val),
        deliverDate: (val, name) => this.handleDeliveryDate(val),
        default: () => { return }
      }
      return (changeControl[name] || changeControl.default)(val);
    },
    /**
     * 根据交货日期获取单价
     */
    handleDeliveryDate (val) {
      let param = {};
      param.head = this.mate.mateFormerHeader.values;
      param.lineList = this.mate.mateListLine.rows;
      let isOK = false;   // 判断是否已更新单价
      SERVICES.JHW_BOOKING_SHEET.getPrice(param).then(res => {
        if (res.data.code == 200) {
          let data = res.data.data;
          if (data.length > 0) {
            data.forEach(i => {
              this.mate.mateListLine.rows.forEach(y => {
                if (i.shoppingCarId == y.shoppingCarId) {
                  this.$set(y,'unitPriceIncludingTax',i.unitPriceIncludingTax);
                  isOK = true;
                  y.amountIncludingTax = (Number(y.quantity) * Number(y.unitPriceIncludingTax)).toFixed(2)
                  y.amountExcludingTax = (Number(y.amountIncludingTax)/(1+Number(y.taxRate)/100)).toFixed(2)
                  y.taxAmount = (Number(y.amountIncludingTax) - Number(y.amountExcludingTax)).toFixed(2)
                }
              })
            });
          };
        }
      });
      if (isOK = true) {
        this.$message({
          type: 'success',
          message: '单价已按送货日期进行更新'
        })
      }
    },
     /** 行动态表单事件管理
     * @param {String} event 事件名称
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleLineEvents(event, val, name){
      const eventControl = {
        change: (val, name) => this.handleLineChange(val, name),
        default: () => { return }
      }
      return (eventControl[event] || eventControl.default)(val, name);
    },
    /** 行formchange 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} change事件执行函数
     */
    handleLineChange(val, name){
      this.isDirty = true;
      const changeControl = {
        quantity: (val,name) => this.handleQuantityChange(val),
        unitPriceIncludingTax: (val,name) => handleUnitPriceIncludingTaxChange(val),
        // driverName: (val, name) => this.handleDriverNameChange(val),
        default: () => { return }
      }
      return (changeControl[name] || changeControl.default)(val);
    },
    /**
     * 明细行数量变化计算
     */
    handleQuantityChange(val){
      if(this.mate.mateFormerLine.values.unitPriceIncludingTax && this.mate.mateFormerLine.values.taxRate){
        let amountIncludingTax = (Number(val) * Number(this.mate.mateFormerLine.values.unitPriceIncludingTax)).toFixed(2)
        let amountExcludingTax = (Number(amountIncludingTax)/(1+Number(this.mate.mateFormerLine.values.taxRate)/100)).toFixed(2)
        let taxAmount = (Number(amountIncludingTax) - Number(amountExcludingTax)).toFixed(2)
        this.mate.mateFormerLine.values.amountIncludingTax =  amountIncludingTax
        this.mate.mateFormerLine.values.amountExcludingTax =  amountExcludingTax
        this.mate.mateFormerLine.values.taxAmount =  taxAmount
      }
    },
    /**
     * 明细行单价变化
     */
    handleUnitPriceIncludingTaxChange(val){
      if(this.mate.mateFormerLine.values.quantity && this.mate.mateFormerLine.values.taxRate){
        let amountIncludingTax = (Number(val) * Number(this.mate.mateFormerLine.values.quantity)).toFixed(2)
        let amountExcludingTax = (Number(amountIncludingTax)/(1+Number(this.mate.mateFormerLine.values.taxRate)/100)).toFixed(2)
        let taxAmount = (Number(amountIncludingTax) - Number(amountExcludingTax)).toFixed(2)
        this.mate.mateFormerLine.values.amountIncludingTax =  amountIncludingTax
        this.mate.mateFormerLine.values.amountExcludingTax =  amountExcludingTax
        this.mate.mateFormerLine.values.taxAmount =  taxAmount
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
    },
    /**
     * 接受字典change 税率切换
     * @param void
     */
    handleAccept (val,name) {
      if(name == 'taxRate') {
        if(this.mate.mateFormerLine.values.quantity && this.mate.mateFormerLine.values.unitPriceIncludingTax) {
          let amountIncludingTax = (this.mate.mateFormerLine.values.quantity * this.mate.mateFormerLine.values.unitPriceIncludingTax).toFixed(2)
          let amountExcludingTax = (Number(amountIncludingTax)/(1+Number(this.mate.mateFormerLine.values.taxRate)/100)).toFixed(2)
          let taxAmount = (Number(amountIncludingTax) - Number(amountExcludingTax)).toFixed(2)
          this.mate.mateFormerLine.values.amountIncludingTax = amountIncludingTax
          this.mate.mateFormerLine.values.amountExcludingTax = amountExcludingTax
          this.mate.mateFormerLine.values.taxAmount = taxAmount
        }
      }
    },
    /**
     * 新增行预订单
     * @param {Void}
     */
    addBooking(){
      this.bookDialog = true
      this.bookTitle = '新增'
      this.isEdit = false
      this.mate.mateFormerLine.values = {}
      this.mate.mateFormerLine.values.lineNo = this.creatDetailNum();     // 序号
      this.mate.mateFormerLine.values.rowType = "2"
      this.mate.mateFormerLine.fields.forEach(item =>{
        // 编码
        if (item.name === 'itemNo' ) {
          item.disabled = false
        }
        // 名称
        if (item.name === 'commodityName' ) {
          item.disabled = false
        }
        // 单位
        if (item.name === 'unitOfMeasurement') {
            item.rowId = 0
          }
        // 规格
        if(item.name === 'commoditySpecifications'){
          item.disabled = false
        }
        // 数量
        if (item.name === 'quantity' ) {
          item.disabled = false
        }
        // 单价
        if (item.name === 'unitPriceIncludingTax' ) {
          item.disabled = false
        }
        // 税率
        if (item.name === 'taxRate' ) {
          item.rowId = 0
        }
        // 附件
        if (item.name === 'fileUrl' ) {
          item.disabled = false
        }
      })
    },
    /**
     * 保存
     */
    handleSave(){
      let _this = this
      this.$refs['headForm'].$refs["form"].validate((valid) => {
        if (valid) {
          let param = {};
          let isOK = true;  // 判断是否可以保存
          param.head = this.mate.mateFormerHeader.values
          param.lineList = this.mate.mateListLine.rows
          param.lineList.forEach(item=>{
            item.confirmedDeliveryDate = param.head.deliverDate
            if (item.unitPriceIncludingTax == "" || item.unitPriceIncludingTax == null) {
              isOK = false;
            }
          })
          if (isOK == false) {
            this.$message({
              type: 'warning',
              message: '存在单价为空的数据请删除后再保存'
            });
            return;
          }
          if(this.mate.mateFormerHeader.values.id){
            SERVICES.JHW_BOOKING_SHEET.update(param).then(res=>{
              if(res.data.code === 200){
                _this.backToList()
                _this.$message.success("操作成功");
              } else {
                _this.$message.warning(res.data.message);
              }
            })
          } else {
            SERVICES.JHW_BOOKING_SHEET.saveBookingSheet(param).then(res=>{
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
    handleUpdate(act, row){
      this.bookDialog = true
      this.bookTitle = '编辑'
      this.isEdit = true
      this.mate.mateFormerLine.values = {...row}
      // 根据商品类型进行区分 2=》手工 除了确认 确认数量 确认收货日期 都可以修改
      if(this.mate.mateFormerLine.values.rowType === '2'){
        this.mate.mateFormerLine.fields.forEach(item =>{
        if (item.name === 'itemNo' ) {
          item.disabled = false
        }
        if (item.name === 'commodityName' ) {
          item.disabled = false
        }
        if (item.name === 'unitOfMeasurement') {
          item.rowId = 0
        }
        if (item.name === 'unitPriceIncludingTax' ) {
          item.disabled = false
        }
        if (item.name === 'taxRate' ) {
          item.rowId = 0
        }
        if (item.name === 'orderTax' ) {
          item.disabled = true
        }
        if(item.name === 'quantity'){
          item.disabled = false
        }
      })
      } else {
        // 根据商品类型进行区分 1=》商品 除了类型 都可以修改
        this.mate.mateFormerLine.fields.forEach(item =>{
          if (item.name === 'itemNo' ) {
            item.disabled = true
          }
          if (item.name === 'commodityName' ) {
            item.disabled = true
          }
          if (item.name === 'unitOfMeasurement') {
            item.rowId = 1
          }
          if (item.name === 'unitPriceIncludingTax' ) {
            item.disabled = true
          }
          if(item.name === 'quantity'){
            item.disabled = false
          }
          if (item.name === 'taxRate' ) {
            item.rowId = 1
          }
          if (item.name === 'orderTax' ) {
            item.disabled = false
          }
          if(item.name === 'commoditySpecifications'){
            item.disabled = true
          }
        })
      }
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
     * 查看附件
     * @param {Object} act
     * @param {String} files 行文件
     */
    handleShowFile(act,files){
      if(files) {
        var fileArray = new Array()
        // JSON.parse(_this.mate.mateFormerHeader.values.files)
        fileArray = JSON.parse(files)
        this.fileList = this.initLineData(fileArray)
        this.filesDialog = true
      } else {
        this.$message.warning("未上传附件");
      }
    },
    
    /**
     * 行 保存
     */
    handleLineSave(){
      // 新增 编辑区分
      this.$refs["lineForm"].$refs["form"].validate(valid=>{
        if(valid) {
          if(!this.isEdit){
            this.mate.mateListLine.rows.push(this.mate.mateFormerLine.values)
          } else {
            this.mate.mateListLine.rows.forEach((item,index)=>{
              if(item.lineNo === this.mate.mateFormerLine.values.lineNo){
                this.mate.mateListLine.rows.splice(index, 1, this.mate.mateFormerLine.values);
              }    
            })
          }
          this.bookDialog = false
        } else {
          this.$message.warning("请将信息填写完整");
        }
      })
    },
    /**
     * 行 取消
     */
    backwardLine(){
      this.bookDialog = false
    },
    /**
     * 行重置
     */
    handleResetLine(){
      this.$refs['lineForm'].$refs["form"].resetFields();
    },
    /**
     * 获取当前公司信息 
     */
    getOwnCompanyIfno(){
      let _this = this
      SERVICES.JHW_GOOD_PRICE.getOwnCompanyIfno().then(res =>{
        let data = res.data.data
        _this.companyName = data.name
      })
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
  },
  watch: {
    // 计算每行 小计 税额 不含税金额
    tableData: {
      handler: function (val, oldVal) {
        val.forEach(item => {
          // 如果有确认数量 用确认数量计算
          if(item.confirmQuantity){
            item.amountIncludingTax = (Number(item.confirmQuantity) * Number(item.unitPriceIncludingTax)).toFixed(2)
          } else {
            item.amountIncludingTax = (Number(item.quantity) * Number(item.unitPriceIncludingTax)).toFixed(2)
          }
          if(item.confirmQuantity){
            if(item.confirmQuantity !== item.quantity){
              item.isRowEdit = true
            }
          }
          if(item.confirmedDeliveryDate){
            if(item.confirmedDeliveryDate !== this.mate.mateFormerHeader.values.deliverDate) {
              item.isRowEdit = true
            }
          }
         // item.amountIncludingTax = (Number(item.quantity) * Number(item.unitPriceIncludingTax)).toFixed(2)
          item.amountExcludingTax = (Number(item.amountIncludingTax)/(1+Number(item.taxRate)/100)).toFixed(2)
          item.taxAmount = (Number(item.amountIncludingTax) - Number(item.amountExcludingTax)).toFixed(2)
        });
        this.mate.mateListLine.rows = val
      },
      deep: true
    },
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
