<!-- created by fengjing on 2020/05/13 -->
<!-- 商品定价（客户） CustomerGoodsPrice -->
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
      :isShowSearchBtn="true"
      @initOperations="initOperations"
      @initQueryData="convertData"
      @btnClick="handleButtons" 
      @action="handleActions"
    ></k-table-list>
    <!--定价-->
    <el-dialog :visible.sync="goodsDialog" width="90%" :title="goodsTitle">
      <DynamicForm ref="headForm" :mate="mate.mateFormerHeader" ></DynamicForm>
        <div class="detailform">
        <el-form id="dynamic-form" :model="mate.mateFormerHeader.values"  :label-width="labelWidth" ref="detailForm">
          <el-row >
              <div v-for="(field,index) of mate.mateFormerHeader.fields" :key="index">
                    <el-col  :sm="field.sm || 24" :md="field.md || 12" :lg="field.lg || 8" v-if="field && field.isRender && field.holder === 'other'" :key="field.name">
                      <el-form-item  :prop="field.name" :label="field.label">
                        <el-input disabled type="number" :controls="false"  :readonly="field.readonly" size="mini" v-model="mate.mateFormerHeader.values[field.name]" @input="handleDetailChange(mate.mateFormerHeader.values[field.name], field.name)">
                          <template v-if="field.suffix" slot="append">{{field.suffix}}</template>
                        </el-input>
                      </el-form-item>
                  </el-col>
              </div>
              </el-row> 
        </el-form>
        <main-table
        :mateList="mate.mateListOther"
        ref="lineTable"
      />
        </div>
    </el-dialog>
    <!--报价-->
    <el-dialog :visible.sync="offerDialog" width="90%" :title="goodsTitle">
      <DynamicForm ref="headForm" :mate="mate.mateFormerLine" ></DynamicForm>
       <main-table
        :mateList="mate.mateListLine"
        ref="lineTable"
      />
    </el-dialog>
    <!--选择审批人-->
    <el-dialog title="处理信息" :visible.sync="formDialog" width="30%" :show-close="true" :close-on-click-modal="false">
      <el-form size="mini" :model="form" :inline="formInline" label-position="right" ref="form" :rules="rules" :label-width="labelWidth">
        <el-form-item label="处理人" prop="approvalName">
          <el-select size="mini" clearable v-model="form['approvalName']" >
            <el-option :label="item.label" :value="item.label" v-for="item of curUsersList" :key= "item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理意见" prop="approvalOption">
          <el-input type="textarea" v-model.trim="form['approvalOption']" placeholder="处理意见"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-divider></el-divider>
        <el-button size='mini' @click="formDialog = false">{{ $t('BUTTON_TEXT.CANCEL') }}</el-button>
        <el-button size='mini' type="primary" @click="passConfirm">{{ $t('BUTTON_TEXT.OK') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog title="审批历史" :visible.sync="historyDialog" width="40%" :show-close="true" >
      <el-table :data="historyData" size="mini">
        <el-table-column prop="approvalName" label="处理人" width="180"></el-table-column>
        <el-table-column prop="approvalState"  label="处理状态" width="180"></el-table-column>
        <el-table-column prop="approvalOption"   label="处理意见" width="180"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 导入/上传文件 -->
    <input type="file" ref="excelFile" style="display:none" @change="fileUpload" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
  </div>
</template>

<script>
import SERVICES from '@/services';
import { LANGS } from '../../i18n/lang';
import MainTable from '@/components/table/MainTable'
import { API_GATEWAY } from '@/config/index.js';
import axios from '@/utils/http';
import KTableList from '@/components/table/KTableList';
import DictStore from '@/store/dict-store.js'
import DynamicForm from '@/components/form/DynamicForm'
import ColumnFormatterMixin from '@/mixins/ColumnFormatterMixin';
import { getAction, postAction, saveService } from '@/services/manage.js';
const BASEAPI = `${API_GATEWAY}/api`;

export default {
  mixins: [ColumnFormatterMixin],
  components:{
    KTableList,
    DynamicForm,
    MainTable,
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
      labelWidth: '150px',               // 表单字段宽度
      querySize: 10,  // 查询默认每页条数
      params: '?listName=jhw_customer_goods_price&listFormName=jhw_goodsprice_form&otherLineList=jhw_goods_price_line&lineList=jhw_offer_price_line&lineForm=jhw_offerprice_form', // 元数据表名
      listUrl: '/common/toList', // 元数据接口
      formUrl: "?listFormName=jhw_goodsprice_form&lineList=jhw_goods_price_line&lineForm=jhw_goodsprice_lines_form", //表单元数据
      offerPricParams: '?listFormName=jhw_offerprice_form&lineList=jhw_offer_price_line&lineForm=jhw_offerprice_line_form',
      dataUrl: '',  // 列表数据接口
      queryUrl: '/agriculture/product/customer/getQuotePriceList',  // 查询分页接口
      productUrl: '/agriculture/product/list',  // 查询分页接口
      deleteUrl: '', // 删除接口
      saveUrl: '',
      isEdit: false,             // 当前是否在编辑
      isMaintain: false, // 是否是维护操作
      pageSize: 10,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      langs: LANGS,
      hasSelected: false,
      formModel: "page",
      page: 1,
      goodsDialog: false,
      offerDialog: false,
      goodsTitle: "查看详情",
      customerList:[],
      curUsersList:[],
      customerContactOptions: [],
      userPass: [],
      rejectDialog: false, //驳回弹框
      rejectReason: '',  //驳回原因
      remark: '',  // 通过备注
      passUrl: '', //通过url
      rejectUrl: '', //驳回url
      form: {
        approvalName: '',
        approvalOption: ''
      },
      formInline: false,             // 表单是否行内显示
      labelWidth: '120px',               // 表单字段宽度
      formDialog: false,     // 是否显示维护弹框
      historyDialog: false,  // 历史记录
      rules: {
        approvalName: [{required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'blur'}],
        approvalOption: [{required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'blur'}],
      },
      isPass: false,  // 是否通过
      isReject: false, // 是否驳回
      historyData: [], //审批历史
      importUrl: '',   // 导入url
    }
  },
  computed: {},
  created () {
  },
  mounted () {},
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     ** Author: fengjing
     */
    init () {
      this.getListData();
      this.getCustomerList();
      this.getCategoryId();
      this.getProductCode()
      this.getUsersList()
      this.getSupplierList();   // 获取供应商列表
    },
    /** 获取供应商列表
     * @param void
     * @return void
     */
    getSupplierList () {
      SERVICES.BASE.getSupplierListUsable().then(res =>{
        let data = res.data;
        let supplierList = [];
        if (data.length=='0') return;
        data.forEach(item =>{
          if ((item.name == "") || (item.name == undefined) || (item.code == "")) return;
          supplierList.push({ 
            'label': item.name,
            'value': item.id,
            'id': item.id,
            'key': item.id
            })
            let supplierObj = this.mate.mateSearch.fields.find(item => item.name==="supplierName") || {};
            supplierObj.options = supplierList;
        })
      });
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
        toAudit: () => this.handleToAudit(btn,rowIds), //送审
        pass: () => this.handlePass(btn,rowIds), // 通过
        deleteReject: () => this.handleReject(btn,rowIds), //驳回
        importPrice: () => this.importPrice(btn,rowIds),   // 线下价格导入
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
        update: (act, row) => this.handleUpdate(act, row), // 编辑
        passHistory: () => this.handlePassHistory(act,row), // 审批历史
        detail: (act,row) => this.handleDetail(act,row), // 详情
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 获取详情
     */
    handleDetail(act,row){
      // 定价 
      if(row.source == 1){
        this.goodsDialog = true
        this.mate.mateFormerHeader.fields.forEach(item =>{
          item.disabled = true
          item.rowId =1
        })
        SERVICES.JHW_GOODSLIST.getDetail(row.productId).then((res) => {
        if(res.status == 200) {
          let data = res.data.data
          this.mate.mateFormerHeader.values.name = data.name
          this.mate.mateFormerHeader.values.ifPutOn = data.ifPutOn
          this.mate.mateFormerHeader.values.taxRate = data.taxRate
          this.mate.mateFormerHeader.values.unitId = data.unitId
          this.mate.mateFormerHeader.values.note = data.note
          this.mate.mateFormerHeader.values.specification = data.specification
          this.mate.mateFormerHeader.values.categoryId = data.categoryId
          this.mate.mateFormerHeader.values.categoryName = data.categoryName
          this.mate.mateFormerHeader.values.productId = data.id
          this.mate.mateFormerHeader.values.marketPriceNoTax = data.marketPriceNoTax
          this.mate.mateFormerHeader.values.marketPriceWithTax = data.marketPriceWithTax
          this.mate.mateFormerHeader.values.grossMargin = data.grossMargin
          this.mate.mateFormerHeader.values.cost = data.cost
          SERVICES.JHW_GOOD_PRICE.getPriceGood(row.productId).then((res) => {
            if(res.status == 200) {
              let priceData = res.data.data
              this.mate.mateListOther.rows = priceData
            }
          })
          this.mate.mateListOther.actions = []
        } else {
          this.mate.mateFormerHeader.values = {}
        }
      })
      } else {
      // 报价
        this.offerDialog = true
        this.mate.mateFormerLine.fields.forEach(item =>{
          item.disabled = true
          item.rowId =1
        })
        SERVICES.JHW_GOOD_PRICE.getCustomerOfferDetail(row.quotationNumber).then((res) => {
        if(res.status == 200) {
          let data = res.data.data
          this.mate.mateFormerLine.values = data.head
          this.mate.mateListLine.rows = data.lineList
          this.mate.mateListLine.actions = []
          // this.getCustomerDetialList() // 获取客户
          // this.getUsersList() // 获取责任人
        } else {
          this.mate.mateFormerLine.values = {}
          this.mate.mateListLine.rows = []
        }
      })
      }
    },
     /**
     * 送审
     *  @param {Object} btn 当前点击按钮配置
     *  @param {Object} ids 当前勾选id对象
     */
    handleToAudit(btn,ids){
      let _this = this
      // 检查勾选项是否都是 已确认状态 才能推送oa送审
      let isAllow = this.multipleSelection.every(item => {
        return item.approvalStatus == 5
        // (item.state === '4');
      });
      let selectedNumber = new Array()
      let selectedIds = new Array()
      // 判断是否来自同一报价单
      this.multipleSelection.forEach(item => selectedNumber.push(item.quotationNumber));
      this.multipleSelection.forEach(item => selectedIds.push(item.id));
      let arr = [];
      arr = [...new Set(selectedNumber)];
      let isOne = arr.length>1 ? false: true
      let url =  btn.url
      if(isAllow){
        if(isOne){
          this.$root.ajaxData(url, selectedIds, function (data) {
            _this.reRenderList();
          }, 'POST')
        } else {
          this.$message.warning("请选择同一报价单的信息进行推送OA送审");
          return
        }
      } else {
        this.$message.warning("请选择状态为新建的报价单进行推送OA送审");
        return
      }
    },
    /**
     * 通过
     *  @param {Object} btn 当前点击按钮配置
     *  @param {Object} ids 当前勾选id对象
     */
    handlePass(btn,ids){
      // 已确认状态
      let isAllow = this.multipleSelection.find(item => item.approvalStatus == 5);
      if (isAllow) {
        this.isPass = true;
        this.isReject = false;
        this.formDialog = true;
        this.resetDialogForm(this.form)
      }else {
        this.$message({
          type: 'warning',
          message: '只能选择新建状态的数据'
        });
      }
    },
    /**
     * 驳回
     *  @param {Object} btn 当前点击按钮配置
     *  @param {Object} ids 当前勾选id对象
     */
    handleReject(btn,ids){
      let isAllow = this.multipleSelection.find(item => item.approvalStatus == 5);
      if (isAllow) {
        this.isPass = false;
        this.isReject = true;
        this.formDialog = true;
        this.resetDialogForm(this.form)
      }else {
        this.$message({
          type: 'warning',
          message: '只能选择新建状态的数据'
        });
      }
    },
    /**
     * 线下价格导入按钮
     * @param void
     * @return void
     */
    importPrice(btn,rowIds) {
      this.importUrl = btn.url;
      this.$refs.excelFile.click();
    },
    fileUpload(file) {
      // 导入模板接口
      let url = this.importUrl;
      // 导入模板接口方法
      let methods = 'POST';
      // 导入数据
      let formdata = new FormData();
      formdata.append('file', file.target.files[0]);
      SERVICES.BASE.uploadTemplateExcel(url, methods, formdata, this.uploadSuccess);
    },
    /**
    * 导入成功
    */
    uploadSuccess(res){
      if (res.code == 200) {
        this.$message({
          type: 'success',
          message: res.message
        });
      } else{
        this.$message({
          type: 'warning',
          message: res.message
        });
        this.$refs.excelFile.value = '';
      }
    },
    /**
     * 审批历史
     *  @param {Object} btn 当前点击按钮配置
     *  @param {Object} ids 当前勾选id对象
     */
    handlePassHistory(btn,row){
      getAction(`${btn.url}${row.id}`).then(res=>{
        if(res.data.data){
          this.historyDialog = true
          this.historyData = res.data.data
          this.historyData.forEach(item=>{
            switch (item.approvalState) {
              case '1':
                item.approvalState = '新建'
                break;
              case '2':
                item.approvalState = '已审批'
                break;
              case '3':
                item.approvalState = '已拒绝'
                break;
            }
          })
        }
      })
    },
    /**
     * 弹框表单数据初始化
     * @param {Object} values 表单数据
     * @return void
    */
    resetDialogForm (values){
      values['approvalName'] = ""; // 处理人
      values['approvalOption'] = ""; // 处理意见
    },
    /**
     * 弹出框确认通过
     */
    passConfirm(){
      let ids = [];
      let bjnum = [];
      let approvalState = '';
      this.multipleSelection.forEach(item => {
        bjnum += item.quotationNumber + ','
        ids += item.id + ','
      });
      if (bjnum.length > 0) {
        bjnum = bjnum.substring(0,bjnum.length-1)
      };
      if (ids.length > 0) {
        ids = ids.substring(0,ids.length-1)
      };
      if (this.isPass) {
        approvalState = '2';
      }else if (this.isReject) {
        approvalState = '3';
      }
      let url =  `agriculture/product/custom/batchUpdate?ids=${ids}&bjNumber=${bjnum}`;
      let mate = {};
      mate = this.form;
      mate.approvalState = approvalState;
      axios.post(url,mate).then(res => {
        if (res.status == 200) {
          this.$message({
            type: 'success',
            message: res.data.message
          });
          this.formDialog = false;
          this.reRenderList();
        } else {
          this.$message({
            type: 'warning',
            message: res.data.message
          })
        }
      })
    },
    /** 获取列表
     * @param void
     * @return void
     ** Author: fengjing
     */
    getListData() {
      const _this = this;
      let url = `${this.queryUrl}`;
      var param = {
        ifNeedPage: true,
        pageSize: 10
      }
      axios.post(url,param).then(res => {
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
     * 新增/编辑商品取消
     * @param void
     * @return void
     */
    cancelDialog () {
      this.goodsDialog = false;
    },
    /** 初始化行操作列按钮的状态配置启用按钮 disabled 的状态
     * ......可以对相关按钮进行初始化
     * enableEdit 是否启用编辑
     * 默认启用编辑 通做行状态再修改启用状态
     * @param void
     * @return void
     ** Author: fengjing
     */
    initOperations() {
      let rows = this.mate.mateList.rows;
      // 如果没有行返回
      if (!rows.length) {
        return
      }else {
        // 默认启用编辑/修改
        rows.forEach(item => {
          item.enableEdit = true;
        });
      }
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
    /**
    /** 获取客户列表
     *
     * @param void
     * @return void
     */
    getCustomerList () {
      let _this = this;
      SERVICES.BASE.getCustomerList().then(res =>{
        let data = res.data;
        let customerList = [];
        if (data.length=='0') return;
        data.forEach(item =>{
          if ((item.name == "") || (item.name == undefined) || (item.code == "")) return;
          customerList.push({ 
            'label': item.name,
            'value': item.id,
            'name': item.name,
            'id': item.code,
          })
        })
        let customerObj = _this.mate.mateSearch.fields.find(item => item.name==="customerId") || {};
        customerObj.options = customerList;
      });
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
        _this.mate.mateFormerHeader.fields.forEach(item=>{
           if(item.name == "categoryId"){
             item.options = data.data
           }
         })
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
        let productOptions = []
        data.data.list.map((i) => {
          productOptions.push({ 'label': i.code, 'value': i.id, 'name': i.name})
        })
        _this.mate.mateFormerHeader.fields.forEach(item=>{
          if(item.name == "productId"){
            item.options = productOptions
          }
        })
      })
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
    /** 获取客户列表
     * 获取客户列表并处理对应的地点列表
     * @param void
     * @return void
     */
    getCustomerDetialList () {
      let _this = this;
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
            'value': item.id,
            'id': item.code,
          })
        })
        let customerObj = _this.mate.mateFormerLine.fields.find(item => item.name==="customerId") || {};
        customerObj.options = _this.customerList;
        if(this.mate.mateFormerLine.values.customerId){
          this.handleCustomerAddress(this.mate.mateFormerLine.values.customerId) //获取地点
        }
        if(this.mate.mateFormerLine.values.customerAddress){
          this.handleCustomerContract(this.mate.mateFormerLine.values.customerAddress)
        }
      });
    },
    /**
     * 获取责任人列表
     * @param void
     * @return void
     */
    getUsersList () {
      let _this = this
      this.curUsersList = []
      SERVICES.BASE.getUsersList().then(res =>{
        let data = res.data;
        if (!data.length) return;
        data.forEach(item =>{
          if ((item.username == "") || (item.username == undefined) || (item.id == "")) return;
          this.curUsersList.push({ 
            'label': item.username,
            'value': item.id,
            'id': item.id,
            'key': item.id
            })
            let customerObj = _this.mate.mateFormerLine.fields.find(item => item.name==="supplierContact") || {};
            customerObj.options = _this.curUsersList;
        })
      });
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
      this.customerList.forEach(item=>{
        if(item.value === val) {
          let customerObj = item
          let AddressObj = this.mate.mateFormerLine.fields.find(item => item.name==="customerAddress") || {};
          AddressObj.options = customerObj.addressList;
        }
      })
    },
    /**
     * 得到客户地址后获取客户下面的联系人
     */
    handleCustomerContract(val){
      let _this = this
      // 客户改变时，获取到客户联系人接口
      this.customerContactOptions = []
      this.$root.ajaxData('/contacts/all/' + val, {}, function (data) {
        data.map((i) => {
          _this.customerContactOptions.push({ 'label': i.name, 'value': i.id, 'phone': i.phoneNumber })
        })
        let UserObj = _this.mate.mateFormerLine.fields.find(item => item.name==="customerContact") || {};
        UserObj.options = _this.customerContactOptions;
      }, 'GET')
    },
    /**
     * 得到联系人后 获取联系人电话
     */
    handleCustomerPhone(val){
      try {
        var obj = this.customerContactOptions.find(item => {
          return item.value === val;
        });
        this.mate.mateFormerLine.values.customerPhone = obj.phone;
      } catch (e) {}
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
  // /deep/ .el-dialog__body{
  //   padding-bottom: 0;
  // }
  // /deep/ .el-divider--horizontal{
  //   margin-top: 0;
  // }
  // /deep/.el-transfer-panel__item.el-checkbox .el-checkbox__label{
  //   display: inline;
  // }
  // /deep/.el-dialog__body .el-transfer-panel {
  //   width: 280px !important;
  // }
</style>
<style lang="scss">
  @import "@/assets/css/baseForm.scss"
</style>
