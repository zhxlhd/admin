<!-- 商品定价-表单 -->
<template>
    <div>
       <!-- 头部button Start-->
        <h-btn @click="handleBtns" :btns="['保存','取消']"></h-btn>
        <!-- 头部button End-->
        <!-- 头部Form Start-->
        <DynamicForm ref="headForm" :mate="mate.mateFormerHeader" :rules="headerFormRules" :eventCfg="headerFormEventConfig" @events="handleEvents"></DynamicForm>
        <div class="detailform">
        <el-form :model="mate.mateFormerHeader.values" :rules="ruleDetail" :label-width="labelWidth" ref="detailForm">
          <el-row >
              <div v-for="(field,index) of mate.mateFormerHeader.fields" :key="index">
                    <el-col  :sm="field.sm || 24" :md="field.md || 12" :lg="field.lg || 8" v-if="field && field.isRender && field.holder === 'other'" :key="field.name">
                      <el-form-item  :prop="field.name" :label="field.label">
                        <el-input  type="number" :controls="false"  :readonly="field.readonly" size="mini" v-model="mate.mateFormerHeader.values[field.name]" @input="handleDetailChange(mate.mateFormerHeader.values[field.name], field.name)">
                          <template v-if="field.suffix" slot="append">{{field.suffix}}</template>
                        </el-input>
                      </el-form-item>
                  </el-col>
              </div>
              </el-row> 
        </el-form>
        </div>
        <k-table-line
        :mate="mate.mateListLine"
        @btnClick="handleButtons"
        @action="handleActions"
        ref="lineTable"
      ></k-table-line>
        <!-- 头部Form End-->
      <el-dialog :visible.sync="goodsprice" width="80%" :title="goodsPriceTitle">
        <DynamicForm ref="lineForm" :mate="mate.mateFormerLine" :rules="headerLineFormRules" :eventCfg="headerLineFormEventConfig" @events="handleLineEvents"></DynamicForm>
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
      ruleDetail:{
        //成本价
        cost: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        //市场价（含税）
        marketPriceWithTax: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 市场价（不含税）
        marketPrice: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // //市场价毛利率
        // grossMargin:  [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
      },
      headerLineFormRules: {
        // customerCategoryId: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // customerId:[{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // grossMargin: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // discount: [{ required: true, type:"number",trigger: "blur", disabled: false, message:"此项不能为空"}],
        priceWithTax:[{ required: true, type:"number", trigger: "blur", disabled: false, message:"此项不能为空"}],
        effectiveStartDate:[{ required: true, trigger: "blur",  message:"此项不能为空"}],
        effectiveEndDate: [{ required: true, trigger: "blur",  message:"此项不能为空"}],
      },
      headerFormRules: {
        //商品编码
        productId: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
      },
      headerFormEventConfig: {
        // 商品编码
        productId: { change: true },
        // 客户编码
        customerCode: { change: true }
      },
      headerLineFormEventConfig: {
        // 折旧
        discount: {change: true},
        // 定价（含税）
        priceWithTax: {change: true},
        // 客户id
        customerId: {change: true}
      },
      listUrl: '/common/toList', // 元数据接口
      dataUrl: '/agriculture/product/list',  // 列表数据接口
      queryUrl: '?listName=jhw_goods_price&lineList=jhw_offer_price_line&listFormName=jhw_goodsprice_form&lineForm=jhw_offerprice_form',  // 列表接口
      productUrl: '/agriculture/product/list',  // 查询分页接口
      goodsprice: false,
      goodsPriceTitle: '新增',
      customerList: [], // 客户列表
      isEdit: false, // 明细行是否编辑
    }
  },
  created(){
    this.getCustomer() // 获取客户
    this.getProductCode() //获取商品编码
    this.getCategoryId()
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
    /** change 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} change事件执行函数
     */
    handleChange(val, name) {
      this.isDirty = true;
      const changeControl = {
        productId: (val, name) => this.handleCodeChange(val),
        // driverName: (val, name) => this.handleDriverNameChange(val),
        default: () => { return }
      }
      return (changeControl[name] || changeControl.default)(val);
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
        discount: (val, name) => this.handleDiscountChange(val),
        priceWithTax: (val, name) => this.handlePriceWithTaxChange(val),
        customerId: (val,name) => this.handleCustomerIdChange(val),
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
    },
    /**
     *重置操作
     *   @returns {void}
     */
    handleReset(){
        this.$refs['headForm'].$refs["form"].resetFields();
        this.$refs['detailForm'].resetFields();
    },
    /** change 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} change事件执行函数
     */
    handleDetailChange(val, name) {
      this.isDirty = true;
      const changeControl = {
        // 成本
        cost: (val, name) => this.handleCostPriceChange(val),
        // 市场价含税
        marketPriceWithTax: (val, name) => this.handleMarketPriceTaxChange(val),
        // 毛利率
        grossMargin: (val, name) => this.handleGrossMarginChange(val),
        // driverName: (val, name) => this.handleDriverNameChange(val),
        default: () => { return }
      }
      return (changeControl[name] || changeControl.default)(val);
    },
    /**
      明细行添加按钮
     */
    handleCreate(){
      this.$refs['detailForm'].validate((valid) => {
          if (valid) {
            this.goodsprice = true
            this.isEdit = false
            this.resetDialogForm(this.mate.mateFormerLine.values);
          } else {
            this.$message.warning("请将商品价格填写完整");
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
        if(item.linenum === row.linenum) {
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
      let _this = this
      if(!_this.mate.mateFormerLine.values.customerCategoryId && !_this.mate.mateFormerLine.values.customerId){
        _this.$message.warning("请填写客户或客户分类");
        return
      }
       if(this.mate.mateFormerLine.values.ifNeedQuotation == "true") {
        this.$message.warning("该用户需要报价");
        return
      }
      this.$refs["lineForm"].$refs["form"].validate(valid=>{
        if(valid) {
          let values = this.mate.mateFormerLine.values;
          let mateFormerValues = Object.assign({},values);
          if(!_this.isEdit){
            _this.mate.mateListLine.rows.push(mateFormerValues)
          } else {
            _this.mate.mateListLine.rows.forEach((item,index)=>{
              if(item.linenum === _this.mate.mateFormerLine.values.linenum){
                _this.mate.mateListLine.rows.splice(index, 1, mateFormerValues);
              }    
            })
          }
          _this.goodsprice = false
        } else {
          _this.$message.warning("请将信息填写完整");
        }
      })
    },
    /** 获取客户列表
     * 获取客户列表并处理对应的地点列表
     * @param void
     * @return void
     */
    getCustomer () {
      let _this = this;
      SERVICES.BASE.getCustomerListUsable().then(res =>{
        let data = res.data;
        if (data.length=='0') return;
        data.forEach(item =>{
          _this.customerList.push({ 
            'label': item.name,
            'value': item.id,
            'id': item.code,
            'ifNeedQuotation': item.ifNeedQuotation
          })
        })
        let customerObj = _this.mate.mateFormerLine.fields.find(item => item.name==="customerId") || {};
        customerObj.options = _this.customerList;
      });
    },
    /**
     * 成本价格
     * @param {Number} 
     */
    handleCostPriceChange(val){
      // 存在毛利率 计算市场成本价
      if(val && this.mate.mateFormerHeader.values.grossMargin) {
        // 1.计算不含税价
        // 定价毛利率=（定价（不含税）-成本价）/定价（不含税）
        // 不含税 = 成本/（1-毛利率）
        let marketPriceNoTax =  (val/(1 -this.mate.mateFormerHeader.values.grossMargin/100)).toFixed(2)
        this.$set(this.mate.mateFormerHeader.values,"marketPriceNoTax",marketPriceNoTax)
        // 2.计算含税价
        if(this.mate.mateFormerHeader.values.taxRate){
          // 含税价 = 不含税价*（1 + 税率）
          let marketPriceWithTax = (marketPriceNoTax *(1 + this.mate.mateFormerHeader.values.taxRate/100 )).toFixed(2)
          this.$set(this.mate.mateFormerHeader.values,"marketPriceWithTax",marketPriceWithTax)
        }
      }
    },
    /**
     * 市场价
     * @param {Number} 
     */
    handleMarketPriceTaxChange(val){
      if(val && this.mate.mateFormerHeader.values.taxRate){
        // 市场价不含税 = 含税价/（1+税率）
        let data = (val /(1 + this.mate.mateFormerHeader.values.taxRate/100)).toFixed(2)
        // 市场不含税
        this.$set(this.mate.mateFormerHeader.values,"marketPriceNoTax",data)
        if(this.mate.mateFormerHeader.values.cost){
          // 市场毛利率
          let grossMargin = (((data - this.mate.mateFormerHeader.values.cost) / data)*100).toFixed(2)
          this.$set(this.mate.mateFormerHeader.values,"grossMargin",grossMargin)
        }
     }
    },
    /**
     * 毛利率 
     * @param {Number} 
     */
    handleGrossMarginChange(val){
      // 存在成本 计算市场成本价
      if(val && this.mate.mateFormerHeader.values.cost) {
        // 1.计算不含税价
        // 定价毛利率=（定价（不含税）-成本价）/定价（不含税）
        // 不含税 = 成本/（1-毛利率）
        let marketPriceNoTax =  (this.mate.mateFormerHeader.values.cost/(1 -val/100)).toFixed(2)
        this.$set(this.mate.mateFormerHeader.values,"marketPriceNoTax",marketPriceNoTax)
        // 2.计算含税价
        if(this.mate.mateFormerHeader.values.taxRate){
          // 含税价 = 不含税价*（1+税率）
          let marketPriceWithTax = (marketPriceNoTax *(1 + this.mate.mateFormerHeader.values.taxRate/100 )).toFixed(2)
          this.$set(this.mate.mateFormerHeader.values,"marketPriceWithTax",marketPriceWithTax)
        }
      }
    },
    /**
     * 折旧
     * @param {Number} 
     */
    handleDiscountChange(val){
      // 根据折扣 计算 定价（含税）
      // 定价（含税） = 市场价（含税）*折扣自动
      if(val && this.mate.mateFormerLine.values.marketPriceWithTax){
        let priceWithTax = val * this.mate.mateFormerLine.values.marketPriceWithTax
        this.$set(this.mate.mateFormerLine.values,"priceWithTax",priceWithTax)
        // 定价 不含税=含税/（1+税率）
        let priceNoTax = (priceWithTax/(1+this.mate.mateFormerHeader.values.taxRate/100)).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,"priceNoTax",priceNoTax)
        // 税额 含税-不含税
        let tax =  (priceWithTax - priceNoTax).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,"tax",tax)
        // 定毛利率 （不含税-成本）/不含税
        let grossMargin = ((priceNoTax - this.mate.mateFormerLine.values.cost)/priceNoTax).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,"grossMargin",grossMargin)
      }
    },
    /**
     * 定价含税
     * @param {Number} 
     */
    handlePriceWithTaxChange(val){
      // 根据折扣 计算 定价（含税）
      // 定价（含税） = 市场价（含税）*折扣自动
      if(val && this.mate.mateFormerLine.values.marketPriceWithTax){
        let discount = (val / this.mate.mateFormerLine.values.marketPriceWithTax).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,"discount",discount)
        // 定价 不含税=含税/（1+税率）
        let priceNoTax = (val/(1+this.mate.mateFormerHeader.values.taxRate/100)).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,"priceNoTax",priceNoTax)
        // 税额 含税-不含税
        let tax =  (val - priceNoTax).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,"tax",tax)
        // 定毛利率 （不含税-成本）/不含税
        let grossMargin = ((priceNoTax - this.mate.mateFormerLine.values.cost)/priceNoTax).toFixed(2)
        this.$set(this.mate.mateFormerLine.values,"grossMargin",grossMargin)
      }
    },
    /**
     * 客户id 切换获取客户名称
     */
    handleCustomerIdChange(val){
      const option = this.customerList.find(function(item) {
        if (item.value === val) {
          return item;
        }
      });
      if (option !== undefined) {
        this.mate.mateFormerLine.values.customerName = option.label;
        this.mate.mateFormerLine.values.ifNeedQuotation = option.ifNeedQuotation;
        if(this.mate.mateFormerLine.values.ifNeedQuotation == "true") {
          this.$message.warning("该用户需要报价");
          return
        }
      }
    },
    /**
     * 提交按钮
     */
    handleSave(){
      let _this = this
      this.$refs['headForm'].$refs["form"].validate((valid) => {
        if (valid) {
          this.$refs['detailForm'].validate((valid) => {
            if (valid) {
              let param = {}
              param.head = this.mate.mateFormerHeader.values
              param.head.source = "1"
              param.lineList = this.mate.mateListLine.rows
              SERVICES.JHW_GOOD_PRICE.handleSave(param).then(res=>{
                if(res.data.code === 200){
                  _this.backToList()
                  _this.$message.success("操作成功");
                } else {
                  _this.$message.warning(res.data.message);
                }
              })
            }
          })
        } else {
          this.$message.warning("请将信息填写完整");
          return
        }
      })
    },
    /**
     * 商品编码切换
     */
    handleCodeChange(val){
      SERVICES.JHW_GOODSLIST.getDetail(val).then((res) => {
        if(res.status == 200) {
          let data = res.data.data
          this.mate.mateFormerHeader.values.name = data.name
          this.mate.mateFormerHeader.values.ifPutOn = '1'
          this.mate.mateFormerHeader.values.taxRate = data.taxRate
          this.mate.mateFormerHeader.values.unitId = data.unitId
          this.mate.mateFormerHeader.values.note = data.note
          this.mate.mateFormerHeader.values.specification = data.specification
          this.mate.mateFormerHeader.values.categoryId = data.categoryId
          this.mate.mateFormerHeader.values.categoryName = data.categoryName
          this.mate.mateFormerHeader.values.marketPriceNoTax = data.marketPriceNoTax
          this.mate.mateFormerHeader.values.marketPriceWithTax = data.marketPriceWithTax
          this.mate.mateFormerHeader.values.grossMargin = data.grossMargin
          this.mate.mateFormerHeader.values.cost = data.cost
          // this.mate.mateFormerHeader.values.node = data.node
          this.handleMarketPriceTaxChange(data.marketPriceWithTax)
          this.handleCostPriceChange(data.cost)
          this.handleGrossMarginChange(data.grossMargin)
          SERVICES.JHW_GOOD_PRICE.getPriceGood(val).then((res) => {
            if(res.status == 200) {
              let priceData = res.data.data
              this.mate.mateListLine.rows = priceData
              this.mate.mateListLine.rows = this.initLineData(this.mate.mateListLine.rows);
            }
          })
        }else{
          this.$message({
              type: "warning",
              message: this.$t("TIPS_WARNING.DELETE_FAIL")
          });
        }
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
        _this.mate.mateFormerHeader.fields.forEach(item=>{
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
     * 递归自动生成明细行序号 1/2/3....
     * 默认为 1 如果当前行序号有1了 则递增1
     * @param {Number} num 序号
     * @return {Number} linenum 序号
     */
    creatDetailNum (num) {
      let linenum = num || 1;
      if (this.checkDetailNum(linenum)){
        linenum += 1;
        linenum = this.creatDetailNum(linenum);
      }
      return linenum;
    },
     /**
     * 明细行序号检验 
     * 校验是否已经存在当前序号
     * @param {Number} num 序号
     * @return {Boolean}  num是否已存在
     */
    checkDetailNum (num, index) {
      let linenumArr = [];
      let listLineRows = [...this.mate.mateListLine.rows];
      if (index) {
        listLineRows = listLineRows.filter(item => item.index != index);
      }
      listLineRows.forEach(item => linenumArr.push(item.linenum));
      return linenumArr.indexOf(num) != -1;
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
        item.linenum = index + 1;
      })
      return data;
    },
    /**
     * 行表单数据初始化
     * 自动生成序号
     * @param {Object} values 表单数据
     * @return void
     ** 
     */
    resetDialogForm (values){
        values.ifAllowedBuy = '1'
        values.marketPriceNoTax = this.mate.mateFormerHeader.values.marketPriceNoTax
        values.marketPriceWithTax = this.mate.mateFormerHeader.values.marketPriceWithTax
        values.cost = this.mate.mateFormerHeader.values.cost
        values.customerCategoryId = '' 
        values.customerId = ""
        values.grossMargin = ""
        values.discount = undefined
        values.priceWithTax =  undefined
        values.tax=  ""
        values.priceNoTax =  ""
        values.minOrderQuanitity =  ""
        values.effectiveStartDate =  ""
        values.effectiveEndDate =  ""
        values.note =  ""
        values.linenum = this.creatDetailNum();     // 序号     
    },
  }
}
</script>

<style scoped lang="scss">
.tbutton{
    margin-bottom: 20px;
}
.detailform{
  border-top: 1px solid black;
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
