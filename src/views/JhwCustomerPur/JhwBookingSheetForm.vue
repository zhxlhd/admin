<!-- created by fengjing on 2020/05/20 -->
<!-- 预订单新增 -->
<template>
  <div>
    <h-btn @click="handleBtns" :btns="['保存','取消']"></h-btn>
    <DynamicForm ref="headForm" :mate="mate.mateFormerHeader" :rules="headerFormRules" :eventCfg="headerFormEventConfig" @events="handleFormEvents"></DynamicForm>
    <!-- 配置 checkType 不渲染勾选列 -->
    <main-table ref="lineTable"
                :mateList="mate.mateListLine" 
                @action="handleActions" 
                :checkType="'noCheck'"
                ></main-table>
    <!-- 底部 lineList End -->
    <el-dialog :visible.sync="bookDialog" width="80%" :title="bookTitle">
      <h-btn @click="handleLineBtns" :btns="['保存','取消']"></h-btn>
      <DynamicForm ref="lineForm" :mate="mate.mateFormerLine" :rules="lineFormRules"  :eventCfg="lineFormEventConfig" @events="handleLineEvents"></DynamicForm>
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
      queryUrl: '?listName=jhw_booking_sheet_list&lineList=jhw_booking_sheet_list_line&listFormName=jhw_booking_sheet_form', // 元数据表名
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
        // // 收货仓库
        // warehouse: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
      }, 
      // 表头校验
      lineFormRules: {
        // 确认数量
        confirmQuantity : [{ required: true, type:"number", trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 确认承认日期
        confirmedDeliveryDate: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
      }, // 行校验
      headerFormEventConfig: {}, //表头change事件
      lineFormEventConfig: {
        confirmQuantity:{change: true}
      }, //表行change事件
      isEdit: false,//行是否编辑
      companyName: '', //当前公司名
      tableData: [],
      carId: this.$store.state.JHWShopping['carId'],
      fileList: [],
      filesDialog: false
    }
  },
  mounted(){
    // 编辑
    SERVICES.JHW_BOOKING_SHEET.getBookingSheet(this.carId).then(res=>{
      this.mate.mateFormerHeader.values = res.data.data.head
      this.isPurchas = this.mate.mateFormerHeader.values.state
      this.mate.mateListLine.rows = res.data.data.lineList
      this.tableData = this.mate.mateListLine.rows
    })
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
    handleFormEvents(){

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
        confirmQuantity: (val, name) => this.handleConfirmQuantity(val),
        // driverName: (val, name) => this.handleDriverNameChange(val),
        files: val => this.handleFileList(val),
        default: () => { return }
      }
      return (changeControl[name] || changeControl.default)(val);
    },
    /** 上传附件/移除附件
     * @param {Array} val 附件列表
     * @return void
     ** Author: zhongxiaolong
     */
    handleFileList(val){
      if(typeof val !== "string"){
        if(val.length > 0){
          this.mate.mateFormerLine.values['files'] = JSON.stringify(val);
        } else {
          this.mate.mateFormerLine.values['files'] = ''
        }
      }
    },
    /**
     * 保存
     */
    handleSave(){
      let _this = this
      this.$refs['headForm'].$refs["form"].validate((valid) => {
        if (valid) {
          this.mate.mateListLine.rows.forEach(item=>{
            if(!item.confirmQuantity){
              item.confirmQuantity = item.quantity
            }
          })
          let param = {}
          param.head = this.mate.mateFormerHeader.values
          param.lineList = this.mate.mateListLine.rows
          SERVICES.JHW_BOOKING_SHEET.update(param).then(res=>{
              if(res.data.code === 200){
                _this.backToList()
                _this.$message.success("操作成功");
              } else {
                _this.$message.warning(res.data.message);
              }
            })
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
     * 确认数量编辑
     * 供应商修改确认数量 不能大于数量
     */
    handleConfirmQuantity(val){
      if(val > this.mate.mateFormerLine.values.quantity){
        this.$message.warning("确认数量不能超过订单数量");
        return
      }
      let amountIncludingTax = (Number(val) * Number(this.mate.mateFormerLine.values.unitPriceIncludingTax)).toFixed(2)
      let amountExcludingTax = (Number(amountIncludingTax)/(1+Number(this.mate.mateFormerLine.values.taxRate)/100)).toFixed(2)
      let taxAmount = (Number(amountIncludingTax) - Number(amountExcludingTax)).toFixed(2)
      this.mate.mateFormerLine.values.amountIncludingTax =  amountIncludingTax
      this.mate.mateFormerLine.values.amountExcludingTax =  amountExcludingTax
      this.mate.mateFormerLine.values.taxAmount =  taxAmount
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
     * 查看
     * @param {String} val 
     * 附件路径
     */
    viewFile(val){
      window.open(val)
    },
    /**
     * 编辑行
     */
    handleUpdate(act, row){
      this.bookDialog = true
      this.bookTitle = '编辑'
      this.isEdit = true
      this.$nextTick(()=>{
        if(!row.files){
          row.files = []
        }
        this.mate.mateFormerLine.values = {...row}
          if(!this.mate.mateFormerLine.values.confirmQuantity){
          this.mate.mateFormerLine.values.confirmQuantity = this.mate.mateFormerLine.values.quantity
        }
      })
      // this.$refs['lineForm'].$refs["upload"]
      // 其他状态 采购方不能编辑
      this.mate.mateFormerLine.fields.forEach(item =>{
        item.disabled = true
        item.rowId =1
        // 只有确认数量 确认送货日期可以编辑
        if(item.name === 'confirmQuantity') {
          item.disabled = false
        }
        if(item.name === 'confirmedDeliveryDate') {
          item.disabled = false
        }
      })
    },
    /**
     * 行 保存
     */
    handleLineSave(){
      // 新增 编辑区分
      if(this.mate.mateFormerLine.values.confirmQuantity > this.mate.mateFormerLine.values.quantity){
        this.$message.warning("确认数量不能超过订单数量");
        return
      }
      if('files' in this.mate.mateFormerLine.values){
        this.handleFileList(this.mate.mateFormerLine.values.files);
      }
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
        item.name = item.fileName;
        item.url = item.fileUrl;
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
          item.amountExcludingTax = (Number(item.amountIncludingTax)/(1+Number(item.taxRate)/100)).toFixed(2)
          item.taxAmount = (Number(item.amountIncludingTax) - Number(item.amountExcludingTax)).toFixed(2)
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
