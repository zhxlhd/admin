<!-- 商品报价-表单 -->
<template>
    <div>
       <!-- 头部button Start-->
        <h-btn @click="handleBtns" :btns="['保存','取消']"></h-btn>
        <!-- 头部button End-->
        <!-- 头部Form Start-->
        <DynamicForm ref="headForm" :mate="mate.mateFormerHeader" :rules="headerFormRules" :eventCfg="headerFormEventConfig" @events="handleEvents"></DynamicForm>
        <k-table-line
        :mate="mate.mateListLine"
        @btnClick="handleButtons"
        @action="handleActions"
        ref="lineTable"
      ></k-table-line>
        <!-- 头部Form End-->
      <el-dialog :visible.sync="goodsprice" width="80%" :title="goodsPriceTitle">
        <DynamicForm ref="lineForm" :mate="mate.mateFormerLine" :rules="rulesLine" :eventCfg="headerLineFormEventConfig" @events="handleLineEvents"></DynamicForm>
         <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="goodsprice = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="sureRow">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script>
import SERVICES from "@/services"
import DynamicForm from '@/components/form/DynamicForm'
import { dateFormatter } from "@/utils/DateUtils"
import { getAction, postAction, saveService } from '@/services/manage.js';
export default {
   components:{
    DynamicForm,
    KTableLine: function index(resolve) {
      require(["@/components/table/KTableLine.vue"], resolve);
    },
    HBtn: function index(resolve){
      require(["@/components/Button/HBtn.vue"], resolve);
    },
  },
  props:{
      mate: Object
  },
  data(){
    return {
        headerFormRules: {
            // 客户编号
            customerName: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
            // 客户联系人
            customerContact: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
            //供应商联系人
            supplierContact: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
            // 客户地址
            customerAddress: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
            // 客户电话
            customerPhone: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}]
        },
        headerFormEventConfig: {
            // 客户编码
            customerName: { change: true },
            // 客户地址
            customerAddress: { change: true },
            // 客户联系人
            customerContact: { change: true },
      },
      rulesLine: {
        // 商品id
        productId: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 商品分类
        // categoryId: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 折扣
        // discount: [{ required: true,type: "number", trigger: "blur", disabled: false, message:"此项不能为空"}],
        //含税
        priceWithTax: [{ required: true, type: "number", trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 有效期从
        effectiveStartDate: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 有效期至
        effectiveEndDate: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
      },
      listUrl: '/common/toList', // 元数据接口
      productUrl: '/agriculture/product/list?ifNeedSetPrice=true',  // 查询分页接口
      dataUrl: '/agriculture/product/list',  // 列表数据接口
      queryUrl: '?listName=jhw_goods_price&lineList=jhw_offer_price_line&listFormName=jhw_goodsprice_form&lineForm=jhw_offerprice_form',  // 查询分页接口
      goodsprice: false,
      goodsPriceTitle: '新增',
      customerList: [], //客户信息
      curUsersList: [], //供应商联系人,
      customerContactOptions: [], //客户联系人
      productOptions: [], //商品下拉
      headerLineFormEventConfig: {
        // 折旧
        discount: {change: true},
        // 定价（含税）
        priceWithTax: {change: true},
        // 商品分类
        categoryId: {change: true},
        // 商品id
        productId: {change: true}
      },
    }
  },
  created(){
    this.mate.mateFormerHeader.values.createDate = dateFormatter("YYYY-MM-DD HH:mm:ss",new Date())
    this.getCustomerList()
    this.getUsersList()
    this.getOwnCompanyIfno()
    this.getCategoryId()
    this.getProductCode()
  },
  computed:{
      // 计算宽度
    labelWidth: function() {
      // 字段 label 宽度
      let width = "";
      // 声明保存每个字段宽度数组,默认 120 和 mongodb配置的 labelWidth
      let labelLengthArr = [120, this.mate.mateFormerHeader.labelWidth];
      // 遍历字段,计算每个字段的宽度并 push 到数组里
      this.mate.mateFormerHeader.fields.forEach(field =>{
        let len = field.label.length*14 + 6;
        labelLengthArr.push(len);
      })
      // 先数组去重,再获取最大值作为字段 label 的宽度
      width = `${Math.max(...[...new Set(labelLengthArr)])}px`;
      return width;
    }
  },
  methods: {
    /** 动态表单事件管理
     * @param {String} event 事件名称
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleEvents(event, val, name) {
      const eventControl = {
        change: (val, name) => this.handleChange(val, name),
        default: () => { return }
      }
      return (eventControl[event] || eventControl.default)(val, name);
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
    /** change 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} change事件执行函数
     */
    handleChange(val, name) {
      this.isDirty = true;
      const changeControl = {
        customerContact: (val) => this.handleCustomerPhone(val),
        customerName: (val) => this.handleCustomerAddress(val),
        customerAddress: (val) => this.handleCustomerContract(val),
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
        discount: (val, name) => this.handleDiscountChange(val),
        priceWithTax: (val, name) => this.handlePriceWithTaxChange(val),
        categoryId: (val,name) => this.handleCategoryIdChange(val),
        productId: (val,name) => this.handleProductIdChange(val),
        // driverName: (val, name) => this.handleDriverNameChange(val),
        default: () => { return }
      }
      return (changeControl[name] || changeControl.default)(val);
    },
      /** 按钮事件
     * @param {String} name 按钮名称
     * @return {Function} 按钮事件
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
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @param {Array} selection 勾选行数据
     * @return void
     */
    handleButtons (btn, row, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const btnEvents = {
        add: (btn) => this.handleCreate(btn),                     // 明细行新增
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
        updateDetail: (btn) => this.handleUpdate(row),            // 明细行编辑
        delete: (btn) => this.handleDelete(row),                     // 明细行删除
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, row);
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
      this.$emit('closeTab', this.mate.title);
    },
    /**
     *重置操作
     *   @returns {void}
     */
    handleReset(){
        this.$refs['headForm'].$refs["form"].resetFields();
    },
     /**
      明细行添加按钮
     */
    handleCreate(){
      this.$refs['headForm'].$refs["form"].validate((valid) => {
        if (valid) {
          this.goodsprice = true
          this.resetDialogForm(this.mate.mateFormerLine.values);
          this.isEdit = false
          this.getProductCode()
        } else {
          this.$message.warning("请将信息填写完整");
          return
        }
      })
    },
    /**
      明细行删除
      @param {Object} row 行信息
     */
    handleDelete(row){
      this.mate.mateListLine.rows.forEach((item,index)=>{
        if(item.lineNum === row.lineNum) {
          this.mate.mateListLine.rows.splice(index,1)
          this.mate.mateListLine.rows = this.initLineData(this.mate.mateListLine.rows);
        }
      })
    },
    /**
     * 明细行编辑
     * @param {Object} row  行信息
     */
    handleUpdate(row){
      this.goodsprice = true
      this.goodsPriceTitle = "编辑"
      this.mate.mateFormerLine.values = {...row}
      this.isEdit = true
    },
     /**
     * 新增明细行保存
     * 
     */
    sureRow(){
      this.$refs["lineForm"].$refs["form"].validate(valid=>{
        if(valid) {
          if(this.mate.mateFormerLine.values.categoryId){
            this.mate.mateFormerLine.values.categoryId = this.mate.mateFormerLine.values.categoryId[this.mate.mateFormerLine.values.categoryId.length - 1]
          }
          let values = this.mate.mateFormerLine.values;
          let mateFormerValues = Object.assign({},values);
          if(!this.isEdit){
            this.mate.mateListLine.rows.push(mateFormerValues);
          } else {
            this.mate.mateListLine.rows.forEach((item,index)=>{
              if(item.lineNum === this.mate.mateFormerLine.values.lineNum){
                this.mate.mateListLine.rows.splice(index, 1, mateFormerValues);           
              }    
            })
          }
          this.goodsprice = false
        } else {
          this.$message.warning("请将信息填写完整");
        }
      })
    },
    /**
     * 折旧
     * @param {Number} 
     */
    handleDiscountChange(val){
      // 根据折扣 计算 定价（含税）
      // 定价（含税） = 市场价（含税）*折扣自动
      if(val && this.mate.mateFormerLine.values.marketPriceWithTax){
        let priceWithTax = (val * this.mate.mateFormerLine.values.marketPriceWithTax).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,"priceWithTax",priceWithTax)
        // 定价 不含税=含税/（1+税率）
        let priceNoTax = (priceWithTax/(1+this.mate.mateFormerLine.values.taxRate/100)).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,"priceNoTax",priceNoTax)
        // 税额 含税-不含税
        let tax =  (priceWithTax - priceNoTax).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,"tax",tax)
      }
    },
    /**
     * 定价含税
     * @param {Number} 
     */
    handlePriceWithTaxChange(val){
      // 根据折扣 计算 定价（含税）
      // 定价（含税） = 市场价（含税）*折扣自动 || 手工填写报价含税
      if(val && this.mate.mateFormerLine.values.marketPriceWithTax){
        let discount = (val / this.mate.mateFormerLine.values.marketPriceWithTax).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,"discount",discount)
      }
      // 不含税=含税/（1+税率）
      let priceNoTax = (val/(1+this.mate.mateFormerLine.values.taxRate/100)).toFixed(2)
      this.$set(this.mate.mateFormerLine.values,"priceNoTax",priceNoTax)
      // 税额 含税-不含税
      let tax =  (val - priceNoTax).toFixed(2)
      this.$set(this.mate.mateFormerLine.values,"tax",tax)
    },
    /**
     * 明细行 商品分类切换 查询已定价的商品列表
     * @param {Array} val 商品分类id
     */
    handleCategoryIdChange(val){
      let id = val[val.length - 1]
      var pathvalue = this.$refs['lineForm'].$refs["cascader"][0].getCheckedNodes()[0].pathLabels.join('/');
      this.mate.mateFormerLine.values.productCategoryName = pathvalue
      let _this = this
      let url = `${this.productUrl}`;
      let param = {
        categoryId: id,
        ifNeedPage: false
      }
      let productOptions = []
      this.mate.mateFormerLine.values.productId = ""
      this.$root.ajaxData(url, param, function (data) {
        // 设置商品编码为空
        if(data.data.list.length > 0){
          data.data.list.map((i) => {
            productOptions.push({ 'label': i.code, 'value': i.id ,'name': i.name,'marketPriceWithTax': i.marketPriceWithTax,'taxRate':i.taxRate})
          })
        } else {
          productOptions = []
        }
         _this.mate.mateFormerLine.fields.forEach(item=>{
          if(item.name == "productId"){
          _this.$set(item,"options",productOptions)    
          item.options = productOptions
          }
         })
        }, 'POST')
    },
    /**
     * 明细行商品id切换 获取商品名称 商品市场价 商品税率
     * @param {String} val 商品id
     */
    handleProductIdChange(val){
      const option = this.productOptions.find(function(item) {
        if (item.value === val) {
          return item;
        }
      });
      if (option !== undefined) {
        this.mate.mateFormerLine.values.productName = option.name;
        this.mate.mateFormerLine.values.marketPriceWithTax = option.marketPriceWithTax;
        this.mate.mateFormerLine.values.taxRate = option.taxRate;
        this.mate.mateFormerLine.values.categoryId = option.categoryId
        this.mate.mateFormerLine.values.productCategoryName = option.categoryName
      }
    },
    /** 
     * 客户地点设置
     * 切换客户改变对应地点的列表
     * 编辑/修改的时候也需要根据客户设置地点列表
     * @param {String} val 客户的 code
     * @return void
     */
    handleCustomerAddress(val) {
      let _this = this
      let customerObj = this.customerList.find(item => item.value === val);
      this.mate.mateFormerHeader.values.customerName = customerObj.label
      this.mate.mateFormerHeader.values.customerId = val
      let AddressObj = this.mate.mateFormerHeader.fields.find(item => item.name==="customerAddress") || {};
      AddressObj.options = customerObj.addressList;
      this.mate.mateFormerHeader.values['ifNeedQuotation'] = customerObj.ifNeedQuotation;
      if(this.mate.mateFormerHeader.values.ifNeedQuotation !== "true") {
        this.$message.warning("该用户不需要报价");
        return
      }
      this.mate.mateFormerHeader.values['customerAddress'] = "";
    },
    /**
     * 得到客户地址后获取客户下面的联系人
     * @param {String} val 地址id
     */
    handleCustomerContract(val){
      let _this = this
      // 客户改变时，获取到客户联系人接口
      this.customerContactOptions = []
      let AddressObj = this.mate.mateFormerHeader.fields.find(item => item.name==="customerAddress") || {};
      let addresDetial = AddressObj.options.find(item=> item.value === val);
      this.mate.mateFormerHeader.values['customerAddress'] = addresDetial.label
      this.mate.mateFormerHeader.values['customerContact'] = "";
      this.$root.ajaxData('/contacts/all/' + val, {}, function (data) {
        data.map((i) => {
          _this.customerContactOptions.push({ 'label': i.name, 'value': i.name, 'phone': i.phoneNumber })
        })
        let UserObj = _this.mate.mateFormerHeader.fields.find(item => item.name==="customerContact") || {};
        UserObj.options = _this.customerContactOptions;
      }, 'GET')
    },
    /**
     * 得到联系人后 获取联系人电话
     * @param {String} val 联系人id
     */
    handleCustomerPhone(val){
      try {
        var obj = this.customerContactOptions.find(item => {
          return item.value === val;
        });
        this.mate.mateFormerHeader.values.customerPhone = obj.phone;
      } catch (e) {}
    },
     /**
     * 递归自动生成明细行序号 1/2/3....
     * 默认为 1 如果当前行序号有1了 则递增1
     * @param {Number} num 序号
     * @return {Number} lineNum 序号
     */
    creatDetailNum (num) {
      let lineNum = num || 1;
      if (this.checkDetailNum(lineNum)){
        lineNum += 1;
        lineNum = this.creatDetailNum(lineNum);
      }
      return lineNum;
    },
     /**
     * 明细行序号检验 
     * 校验是否已经存在当前序号
     * @param {Number} num 序号
     * @return {Boolean}  num是否已存在
     */
    checkDetailNum (num, index) {
      let lineNumArr = [];
      let listLineRows = [...this.mate.mateListLine.rows];
      if (index) {
        listLineRows = listLineRows.filter(item => item.index != index);
      }
      listLineRows.forEach(item => lineNumArr.push(item.lineNum));
      return lineNumArr.indexOf(num) != -1;
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
        item.lineNum = index + 1;
      })
      return data;
    },
    /** 获取客户列表
     * 获取客户列表并处理对应的地点列表
     * @param void
     * @return void
     */
    getCustomerList () {
      let _this = this;
      SERVICES.BASE.getCustomerListUsable().then(res =>{
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
            'value': item.id,
            'id': item.code,
            'ifNeedQuotation': item.ifNeedQuotation
          })
        })
        let customerObj = _this.mate.mateFormerHeader.fields.find(item => item.name==="customerName") || {};
        customerObj.options = _this.customerList;
      });
    },
    /**
     * 获取责任人列表
     * @param void
     * @return void
     */
    getUsersList () {
      let _this = this
      SERVICES.BASE.getUsersList().then(res =>{
        let data = res.data;
        if (!data.length) return;
        data.forEach(item =>{
          if ((item.username == "") || (item.username == undefined) || (item.id == "")) return;
          this.curUsersList.push({ 
            'label': item.username,
            'value': item.username,
            'id': item.id,
            })
            let customerObj = _this.mate.mateFormerHeader.fields.find(item => item.name==="supplierContact") || {};
            customerObj.options = _this.curUsersList;
        })
      });
    },
    /**
     * 获取当前公司信息 
     */
    getOwnCompanyIfno(){
      let _this = this
      SERVICES.JHW_GOOD_PRICE.getOwnCompanyIfno().then(res =>{
        let data = res.data.data
        _this.mate.mateFormerHeader.values.supplierPhone = data.telephone
        _this.mate.mateFormerHeader.values.supplierAddress = data.address
        _this.mate.mateFormerHeader.values.supplierName = data.name
      })
    },
    /**
     * 获取商品编码下拉
     */
    getProductCode(){
      let _this = this
      let url = `${this.productUrl}`;
      let param = {ifNeedPage: false}
      postAction(url, param).then(res =>{
        let data =res.data
       // 设置商品编码为空
        _this.productOptions = []
        data.data.list.map((i) => {
          _this.productOptions.push({ 'label': i.name, 'value': i.id ,'name': i.code,'marketPriceWithTax': i.marketPriceWithTax,'taxRate':i.taxRate,'categoryId': i.categoryId,'categoryName':i.categoryName})
        })
        _this.mate.mateFormerLine.fields.forEach(item=>{
           if(item.name == "productId"){
             item.options = _this.productOptions
           }
         })
      })
    },
    /**
     * 获取商品分类下拉
     * @param void
     * @return {objdet}
     */
    getCategoryId(){
      let _this = this
        getAction('/agriculture/customerPurchase/getIndustryCategory?industryName=农业', {}).then(res =>{
        let data =res.data
        _this.materialChange(data.data)
        _this.mate.mateFormerLine.fields.forEach(item=>{
           if(item.name == "categoryId"){
             item.options = data.data
           }
         })
      }, 'GET')
    },
    materialChange (data) {
      for (const i of data) {
        i.label = i.name
        i.value = i.id
        if (i.children) {
          this.materialChange(i.children)
        }
      }
    },
    /**
     * 提交按钮
     */
    handleSave(){
      let _this = this
      if(this.mate.mateFormerHeader.values.ifNeedQuotation !== "true") {
        this.$message.warning("该用户不需要报价");
        return
      }
      this.$refs['headForm'].$refs["form"].validate((valid) => {
       let param = {}
        param.head = this.mate.mateFormerHeader.values
        param.head.source = "2"
        param.lineList = this.mate.mateListLine.rows
        SERVICES.JHW_GOOD_PRICE.handleOfferSave(param).then(res=>{
          if(res.data.code === 200){
            _this.backToList()
            _this.$message.success("操作成功");
          } else {
            _this.$message.warning(res.data.message);
          }
        })
      })
    },
    /**
     * 行表单数据初始化
     * 自动生成序号
     * @param {Object} values 表单数据
     * @return void
     ** 
     */
    resetDialogForm (values){
      values.lineNum = this.creatDetailNum();     // 序号
      values.approvalStatus = '1' 
      values.ifAllowedBuy ='1' 
      values.productId = '' 
      values.categoryId = '' 
      values.productId = '' 
      values.discount =  undefined
      values.marketPriceWithTax = undefined
      values.priceWithTax = undefined
      values.tax =  undefined
      values.priceNoTax =  undefined
      values.minOrderQuanitity =  undefined
      values.effectiveStartDate =  '' 
      values.effectiveEndDate =  '' 
      values.note =  ''        
    },
  }
}
</script>
<style scoped lang="scss">
.tbutton{
    margin-bottom: 20px;
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
