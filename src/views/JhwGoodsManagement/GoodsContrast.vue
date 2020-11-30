<!-- created by fengjing on 2020/05/13 -->
<!--商品交叉对照  goodscontrast -->
<template>
  <div id="good_list">
    <k-table-list ref="listTable" 
      :mate="mate" 
      :mateSearch="mate.mateSearch" 
      :isIndex="isIndex"
      :isIndexDialog="isIndexDialog"
      :formModel="formModel"
      :word="word"
      :querySize="querySize"
      :isShowSearchBtn="false"
      @initQueryData="convertData"
      @btnClick="handleButtons" 
      @action="handleActions"
    ></k-table-list>
    <el-dialog :visible.sync="goodsDialog" width="80%" :title="goodsTitle">
      <div>
       <!-- 头部button Start-->
        <h-btn @click="handleBtns" :btns="['保存','取消']"></h-btn>
        <!-- 头部button End-->
        <!-- 头部Form Start-->
        <DynamicForm ref="headForm" :mate="mate.mateFormerHeader" :rules="headerFormRules" :eventCfg="headerFormEventConfig" @events="handleEvents"></DynamicForm>
        <!-- 头部Form End-->
    </div>
    </el-dialog>
  </div>
</template>

<script>
import SERVICES from '@/services';
import { LANGS } from '../../i18n/lang';
import { API_GATEWAY } from '@/config/index.js';
import axios from '@/utils/http';
import KTableList from '@/components/table/KTableList';
import DynamicForm from '@/components/form/DynamicForm'
import DictStore from '@/store/dict-store.js'
const BASEAPI = `${API_GATEWAY}/api`;

export default {
  components:{
    KTableList,
    HBtn: function index(resolve){
      require(["@/components/Button/HBtn.vue"], resolve);
    },
    DynamicForm
  },
  props: {
    mate: Object
  },
  data () {
    return {
      isIndex: true,                     // Table 是否渲染序号列
      isIndexDialog: true,               // 详情 Dialog Table 是否渲染序号列
      lineTableFlag: false,              // 行Table 是否渲染
      rowStatus: null,                   // 列表订单行状态
      multipleSelection: [],             // 勾选项数组
      word: true,                        // 按钮是否显示文字
      dictFormInline: false,             // 表单是否行内显示
      dictTitle: '',                     // 表单标题
      labelWidth: '120px',               // 表单字段宽度
      querySize: 10,  // 查询默认每页条数
      params: '?listName=jhw_goods_encode&listFormName=jhw_goodscontrast_form', // 元数据表名
      listUrl: '/common/toList', // 元数据接口
      dataUrl: '/agriculture/product/getProductCodeContrast/list',  // 列表数据接口
      queryUrl: '/agriculture/product/getProductCodeContrast/list',  // 查询分页接口
      deleteUrl: '', // 删除接口
      saveUrl: '',
      isEdit: false,             // 当前是否在编辑
      isMaintain: false, // 是否是维护操作
      pageSize: 10,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      langs: LANGS,
      hasSelected: false,
      formModel: "dialog",
      page: 1,
      goodsDialog: false,
      goodsTitle: "新增",
      headerFormRules: {
            //商品编码
            selfItemId: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
            // // 商品名称
            // name: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
            // 客户编码
            customerId: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
            cusItemCode: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
            cusItemName: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
            cusItemExplain: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        },
        headerFormEventConfig: {
            // 商品编码
            selfItemId: { change: true },
            // 客户编码
            customerId: { change: true }
      },
      productUrl: '/agriculture/product/list',  // 查询分页接口
      customerList: [],
      queryValue: {
        ifNeedPage: true,
        pageNum: 1,
        pageSize: 10,
      },
      isCheck: false, //校验重复是否通过
      editSelfItemCode: '',  //记录编辑前的商品code
      editCustomerCode: '', // 记录编辑前的客户code
      editCusItemCode: '', // 记录编辑前的客户商品code
    }
  },
  computed: {},
  created () {
  },
  mounted () {
  },
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     ** Author: fengjing
     */
    init () {
      this.getListData();
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} rowId 勾选行 id数据  rowId.id
     * @param {Array} selection 勾选行数据
     * @return {Function} 执行操作的方法
     ** Author: fengjing
     */
    handleButtons (btn, rowId, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const rowIds = (rowId && rowId.id) ? rowId : { id: selection && selection.map(r => r.id) };
      const btnEvents = {
        add: (btn) => this.handleCreate(btn),                     // 弹窗新增
        updateDetail: (btn, rowIds) => this.handleUpdate(btn, rowIds), // 编辑
        // putaway: (btn, rowIds) => this.handlePutaway(btn, rowIds),  // 批量上架
        // shelves: (btn) => this.handleShelves(btn, rowIds),                // 批量下架
        // downloadTemplate: (btn, rowIds) => this.handleTemplate(btn, rowIds),   // 下载模板
        // import: (btn) => this.handleImport(btn),                      // 导入
        // export: (btn) => this.handleExport(btn),                      // 导出
        delete: (btn) => this.handleDelete(btn,rowIds), //删除
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, rowIds);
    },
    /**
     * actions 操作
     * 点击 action 根据按钮配置的 action 做对应操作
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return {Function} 执行操作的方法
     ** Author: fengjing
     */
    handleActions (act, row) {
      let action = act && act.action;
      let rowId = { id: [row.id] };
      const actions = {
        // delete: (act, row) => this.handleDelete(act, rowId),  // 删除
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 新增
     * @param {Object} btn 按钮配置信息
     * @return void
     ** Author: fengjing
    */
    handleCreate(btn) {
      this.goodsTitle = "新增"
      this.goodsDialog = true
      this.isEdit = false
      this.reSetValues()
      this.getProductCode()
      this.getCustomerList()
      // this.$root.monitor({ url: `${this.listUrl}${this.addParams}` });
    },
    /**
     * 刷新缓存
     * @param {Object} btn 按钮配置信息
     * @return void
     ** Author: fengjing
     */
    handleRefresh(btn){
      DictStore.fetch();
    },
    /**
     * 删除
     * @param {Object} btn 按钮配置
     * @param {Array} rowIds 勾选行ids
     * @return void
     ** Author: fengjing
    */
    handleDelete(btn,rowIds){
      let _this = this
      this.$root.handleAction(btn, rowIds, () => _this.getListData(), btn.method);
    },
    /**
     * 编辑
     * @param {Object} btn 按钮配置
     * @param {Array} row 当按钮为行数据
     * @return void
     ** Author: fengjing
     * 需要权限控制移至头部按钮 -- hzq
    */
    handleUpdate(btn, rowIds){
      const _this = this
      // 只能勾选一条数据
      if (this.multipleSelection.length > 1) {
        this.$message.warning("请选择一条数据修改");
        return
      };
      this.goodsDialog = true
      this.goodsDialog = '编辑'
      this.isEdit = true
      let url = btn.url+ rowIds.id[0]
      axios.get(url,{}).then(res => {
        if(res.data.data){
          this.mate.mateFormerHeader.values = res.data.data
          this.editSelfItemCode = this.mate.mateFormerHeader.values.selfItemCode  //记录编辑前的商品code
          this.editCustomerCode = this.mate.mateFormerHeader.values.customerCode // 记录编辑前的客户code
          this.editCusItemCode = this.mate.mateFormerHeader.values.cusItemCode // 记录编辑前的客户商品code
        }
      })
      this.getProductCode()
      this.getCustomerList()
    },
    /** 获取列表
     * @param void
     * @return void
     ** Author: fengjing
     */
    getListData() {
      const _this = this;
      let url = `${this.queryUrl}`;
      axios.post(url, this.queryValue).then(res => {
        if (res.status === 200 && !!res.data) {
          const data = res.data.data
          let total = data.total
          let rows = data.list;
          let page = data.pageNum;
          let size = data.size;
          let dataApi = url;
          _this.mate.mateList = { ..._this.mate.mateList, size, page, total, rows, dataApi };
        }
      });
    },
    /** 
     * 新增/编辑 
     * @param void
     * @return void
     ** Author: fengjing
     */
    handleSave () {
      let _this = this
      this.$refs['headForm'].$refs["form"].validate((valid) => {
        if (valid) {
          let params = {
            selfItemCode: this.mate.mateFormerHeader.values.selfItemCode,
            customerCode: this.mate.mateFormerHeader.values.customerCode,
            cusItemCode: ''
          }
          // 编辑的时候 将编辑前的值存储起来 如果改变了 就校验是否存在 
          if(this.isEdit){
            if(this.editSelfItemCode !== params.selfItemCode || this.editCustomerCode !== params.customerCode ) {
              this.checkOut(params)
            } else {
              this.isCheck = true
              this.goodsDialog = false;
              SERVICES.JHW_GOODS_CONTRAST.handleUpdate(this.mate.mateFormerHeader.values).then(res =>{
                _this.getListData()
              });
            }
          } else {
            // 新增时校验
            this.checkOut(params)
          }   
        } else {
          this.goodsDialog = true;
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          return
        }
      })
    },
    /**
     * @param {Object}params
     * 校验是否重复
     */
    checkOut(params){
      let _this = this
      SERVICES.JHW_GOODS_CONTRAST.handleCheckout(params).then(res=>{
        let data = res.data.data
        if(data === '0'){
          this.isCheck = true
          this.goodsDialog = false;
          if (!this.isEdit) {
            SERVICES.JHW_GOODS_CONTRAST.handleSave(this.mate.mateFormerHeader.values).then(res =>{
              _this.getListData()
            });
          } else {
            SERVICES.JHW_GOODS_CONTRAST.handleUpdate(this.mate.mateFormerHeader.values).then(res =>{
              _this.getListData()
            });
          }
        } else {
          this.isCheck = false
          this.$message.warning("商品编码对照存在重复信息，请核对")
        }
      })
    },
    /**
     * 新增/编辑商品取消
     * @param void
     * @return void
     */
    cancelDialog () {
      this.goodsDialog = false;
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     ** Author: fengjing
     */
    reRenderList() {
      this.$root.monitor({ url: `${this.listUrl}${this.params}` });
    },
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
        selfItemId: (val, name) => this.handleSelfItemCode(val),
        customerId: (val, name) => this.handleCustomerCode(val),
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
        // 默认
        default: () => { return }
      }
      return (btnEvents[name] || btnEvents.default)();
    },
    /**
     * 取消操作
     * 通知父组件关闭弹框
     * @returns {void}
     */
    backward(){
      this.cancelDialog()
    },
    /**
     * @param {String} val 商品编码 id
     * 
     */
    handleSelfItemCode(val){
      let codeObj = this.mate.mateFormerHeader.fields.find(item=> item.name === "selfItemId") || {};
      let product = codeObj.options.find(item=>item.value === val) || {};
      this.mate.mateFormerHeader.values.selfItemName = product.name
      // this.mate.mateFormerHeader.values.selfItemId = val
      this.mate.mateFormerHeader.values.selfItemCode = product.label
    },
    /**
     * @param {String} val 客户 id
     * 
     */
    handleCustomerCode(val){
      let customer = this.customerList.find(item=> item.value === val) || {};
      this.mate.mateFormerHeader.values.customerName = customer.name
      this.mate.mateFormerHeader.values.customerCode = customer.id
    },
   /**
     * 获取商品编码下拉
     */
    getProductCode(){
     let _this = this
      let url = `${this.productUrl}`;
      let param = {ifNeedPage: true}
      this.$root.ajaxData(url, param, function (data) {
      // 设置商品编码为空
        _this.productOptions = []
        data.data.list.map((i) => {
          _this.productOptions.push({ 'label': i.code, 'value': i.id ,'name': i.name,'marketPriceWithTax': i.marketPriceWithTax,'taxRate':i.taxRate,'categoryId': i.categoryId,'categoryName':i.categoryName})
        })
        _this.mate.mateFormerHeader.fields.forEach(item=>{
           if(item.name == "selfItemId"){
             item.options = _this.productOptions
           }
         })
      }, 'POST')
    },
    /** 获取客户列表
     * 获取客户列表并处理对应的地点列表
     * @param void
     * @return void
     */
    getCustomerList () {
      let _this = this;
      this.customerList = []
      this.$root.ajaxData('/companys/companyInfo/4?auditStatus=1&nopaging=1&status=1&dataOnly=true', {}, function (data) {
        if (data.length=='0') return;
        data.forEach(item =>{
          _this.customerList.push({ 
            'label': item.code,
            'name': item.name,
            'value': item.id,
            'id': item.code,
            'ifNeedQuotation': item.ifNeedQuotation
          })
        })
        let customerObj = _this.mate.mateFormerHeader.fields.find(item => item.name==="customerId") || {};
        customerObj.options = _this.customerList;
      })
    },
    /**
     * 表单重置
     */
    reSetValues(){
      this.mate.mateFormerHeader.values.selfItemId = ''
      this.mate.mateFormerHeader.values.selfItemName = ''
      this.mate.mateFormerHeader.values.customerId = ''
      this.mate.mateFormerHeader.values.customerName = ''
      this.mate.mateFormerHeader.values.cusItemCode = ''
      this.mate.mateFormerHeader.values.cusItemName = ''
      this.mate.mateFormerHeader.values.cusItemExplain = ''
      this.mate.mateFormerHeader.values.selfItemExplain = ''
    },
    /**
     * 数据转换 
     * 后台返回数据结构不统一做数据转换处理
     * @param {Object} data 数据
     * @return void
     */
    convertData({ pageSize, total, pageNum, list, ...resData}) {
      let rows = resData.data.list;
      let page = resData.data.pageNum;
      let size = resData.data.pageSize;
      total = resData.data.total;
      this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
    },
  },
  watch: {
    mate: {
      handler(newMate, oldMate) {
      　 this.init();
  　　},
  　　immediate: true
    }
  },
}
</script>

<style lang="scss" scoped>
  #dict_list{
    /deep/ .el-dialog__body{
      padding-bottom: 0;
    }
    /deep/ .el-divider--horizontal{
      margin-top: 0;
    }
  }
</style>
