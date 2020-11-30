<!-- created by zhongxiaolong on 2020/05/19 -->
<!-- 开票 ReconciliationSlipsBilling -->
<template>
  <div id="dict_list">
    <k-table-list ref="listTable" 
      :mate="mate" 
      :mateSearch="mate.mateSearch" 
      :isIndex="isIndex"
      :isIndexDialog="isIndexDialog"
      :formModel="formModel"
      :word="word"
      :querySize="pageSize"
      :isShowSearchBtn="false"
      :rowClickSelected="rowClickSelected"
      @initOperations="initOperations"
      @initQueryData="convertData"
      @btnClick="handleButtons" 
      @action="handleActions"
      @rowClick="handleRowClick"
      @resetLineTable="lineTableFlag=false"
    ></k-table-list>
    
    <!-- 配置 checkType：noCheck 不渲染勾选列 -->
    <main-table ref="lineTable"
                v-if="lineTableFlag"
                :mateList="mate.mateListLine" 
                @refreshLine="refreshLine" 
                @action="handleActions" 
                :checkType="'noCheck'"></main-table>
    <!-- 底部 lineList End -->
    
    <el-dialog title="发票信息" :visible.sync="formDialog" width="30%" :show-close="false" :close-on-click-modal="false">
      <el-form size="mini" :model="form" :inline="formInline" label-position="right" ref="form" :rules="rules" :label-width="labelWidth">
        <el-form-item label="发票号" prop="invoiceNo">
          <el-input v-model.trim="form['invoiceNo']" placeholder="请输入发票号"></el-input>
        </el-form-item>
        <el-form-item label="发票代码" prop="invoiceCode">
          <el-input v-model.trim="form['invoiceCode']" placeholder="请输入发票代码"></el-input>
        </el-form-item>
        <el-form-item label="开票日期" prop="invoiceDate">
           <el-date-picker value-format="yyyy-MM-dd" size="mini" type="date" v-model="form['invoiceDate']" placeholder="请选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="附件上传" prop="fileurl">
          <el-upload
            :action="imgAction"
            :on-preview="handleCheck"
            :headers="headers"
            :file-list="fileList"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :limit="1"
            :on-exceed="handleExceed">
            <el-button size="mini" slot="trigger" type="primary">点击上传</el-button>
            <el-button size="mini"  type="primary" @click="viewFile(form.fileurl)">查看</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png/pdf文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-divider></el-divider>
        <el-button size='mini' @click="back">{{ $t('BUTTON_TEXT.CANCEL') }}</el-button>
        <el-button size='mini' type="primary" @click="submit">{{ $t('BUTTON_TEXT.OK') }}</el-button>
      </span>
    </el-dialog>

    
    <el-dialog :visible.sync="visible" width="65%" :before-close="handleClose">
      <invoice-view :myInvoice="myInvoice" :rowStatus="row" :invoiceDetial="invoiceDetail" ref="InvoiceView"></invoice-view>
    </el-dialog>

  </div>
</template>

<script>
import { LANGS } from '../../i18n/lang';
import { API_GATEWAY } from '@/config/index.js';
import axios from '@/utils/http';
import MainTable from '@/components/table/MainTable'
import KTableList from '@/components/table/KTableList';
import DictStore from '@/store/dict-store.js';
import SERVICES from '@/services';
import { getAction, postAction } from '@/services/manage.js';

const BASEAPI = `${API_GATEWAY}/api`;

export default {
  components:{
    KTableList,
    MainTable,
    InvoiceView: function index (resolve) {
      require(['../../components/InvoiceView.vue'], resolve)
    },
  },
  props: {
    mate: Object
  },
  data () {
    return {
      config: {},                        // 取 mongoDb 的 config 区分 当前用户
      isIndex: true,                     // Table 是否渲染序号列
      isIndexDialog: true,               // 详情 Dialog Table 是否渲染序号列
      lineTableFlag: false,              // 行Table 是否渲染
      lineTableInlineEdit: true,         // 行Table 行内编辑
      inlineEditSubmit: true,            // 行编辑提交
      rowStatus: null,                   // 列表订单行状态
      multipleSelection: [],             // 勾选项数组
      word: true,                        // 按钮是否显示文字
      formModel: "dialog",               // 表单模式
      showClose: false,                  // 弹窗关闭按钮
      form: {
        invoiceNo: '',
        invoiceCode: '',
        invoiceDate: '',
        fileurl: ''
      },
      row: {},
      act: {},
      formDialog: false,
      formInline: false,                 // 表单是否行内显示
      labelWidth: '120px',               // 表单字段宽度
      listUrl: '/common/toList',         // 元数据接口
      isEdit: false,                     // 当前是否在编辑
      isMaintain: false,                 // 是否是维护操作
      rowClickSelected: false,           // 列表点击行勾选中
      multipleSelection: [],             // 点击table前面的框框，获取到的内容
      langs: LANGS,                      // 当前语言
      isNeedPage: true,                  // 请求列表数据是否需要分页
      pageNum: 1,                        // 默认第几页
      pageSize: 10,                      // 默认每页条数/查询默认每页条数
      pid: '',                           // 父级 id
      params: '?listName=system_dict&listFormName=', // 元数据表名
      url:{
        meta: '/common/toList',  // 元数据接口
        list: '/agriculture/invoice/list',  // 列表数据
        query: '/agriculture/invoice/list', // 查询/分页
        detail: '/agriculture/invoice/selectOne', // 详情
        lines: '/agriculture/invoice/selectOne', // 行
      },
      rules: {
        invoiceNo: [{required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'blur'}],
        invoiceCode: [{required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'blur'}],
        invoiceDate: [{required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'change'}],
        // fileurl: [{required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'change'}]
      },
      visible: false,
      myInvoice: false,
      invoiceDetail: {},
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      },
      imgAction: API_GATEWAY + '/zuul/api/purchase/goods/release/upload',
      fileList: [], // 附件上传路径
    }
  },
  computed: {},
  created () {},
  mounted () {},
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    init () {
      // 获取配置
      this.config = this.mate.mateList.config;
      // 底部行列表默认不显示
      this.lineTableFlag = false;
      // 获取列表数据
      this.loadData();
      // 初始化行列表参数
      this.initLineTable();
    },
    initLineTable(){
      const mate = this.mate;
      mate.mateListLine = {
        columns: mate.mateList.lineColumns || [],
        btns: mate.mateList.lineBtns || [],
        actions: mate.mateList.lineActions || [],
        rows: []
      }
      // 初始化行状态
      this.initLineData(mate.mateListLine.rows);
    },
    /** 后台无法区分角色需特殊传参处理
     * @param {Object} params 参数
     * @return {Object} params
     */
    initParams(params){
      if(this.config.ifFromCustomer){
        params.ifFromCustomer = true;
      }
      return params
    },
    /**
     * 移除图片
     * @param void
     * @return void
     */
    handleRemove(file, fileList) {
      let imgFile = ''
      fileList.forEach(item => {
        imgFile = item.response
      })
      this.form.fileurl = imgFile.slice(0,imgFile.length-1)
    },
    /**
     * 点击图片名字预览
     * @param void
     * @return void
     */
    handleCheck(file, response) {
      window.open(file.response);
    },
    /**
     * 限制上传文件个数
     * @param void
     * @return void
     */
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    /**
     * 上传成功获取返回值
     * @param void
     * @return void
     */
    handleSuccess (response, file, fileList) {
      this.form.fileurl = response;
    },
    /**
     * 查看图片
     * @param void
     * @return void
     */
    viewFile (val) {
      window.open(val);
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} rowId 勾选行 id数据  rowId.id
     * @param {Array} selection 勾选行数据
     * @return {Function} 执行操作的方法
     ** Author: zhongxiaolong
     */
    handleButtons (btn, rowId, selection) {
      if(btn.url == ''){
        this.$alert('接口调试中，请稍后再尝试...');
        return
      }
      this.multipleSelection = selection;
      let action = btn.action;
      const rowIds = (rowId && rowId.id) ? rowId : { id: selection && selection.map(r => r.id) };
      const btnEvents = {
        billing: (btn, rowIds) => this.handleBilling(btn, rowIds),  // 开票
        signFor: (btn, rowIds) => this.handleSignFor(btn, rowIds),  // 签收
        preview: (btn, rowIds) => this.handlePreview(btn, selection[0]),  // 预览
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
     ** Author: zhongxiaolong
     */
    handleActions (act, row) {
      if(act.url == ''){
        this.$alert('接口调试中，请稍后再尝试...');
        return
      }
      let action = act && act.action;
      let rowId = { id: [row.id] };
      const actions = {
        backfill: (act, row) => this.handleBackfill(act, row),  // 回填
        preview: (act, row) => this.handlePreview(act, row),    // 预览
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /** 开票- 下载xml
     * @param {Object} btn 按钮配置
     * @param {Array} rowIds 当按钮为行数据/头部按钮为勾选行 id 数组
     * @return void
     ** Author: zhongxiaolong
    */
    handleBilling(btn, rowIds) {
      if(this.multipleSelection.length !== 1){
        this.$message.warning(this.$t("seladata"));
        return
      }
      // 状态判断 只允许“已开票”（状态码为 1）状态进行开票  
      // let isAllow = this.multipleSelection.every(item => item.status ==='1');
      // if(isAllow){
        let params = [rowIds.id.join(',')]
        postAction(btn.url, params).then(res =>{
          let blob = new Blob([res.data], { type: 'application/xml' });
          let objectUrl = URL.createObjectURL(blob);
          let a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display:none');
          a.setAttribute('href', objectUrl);
          let filename = btn.filename || 'fps.xml';
          a.setAttribute('download', filename);
          a.click();
          URL.revokeObjectURL(objectUrl);
          this.loadData();
        }).catch((res) =>{
          this.$message.error(res.data.message)
        })
      // }else{
      //   this.$message.warning(this.$t('TIPS_WARNING.CANNOT_BE_OPERATED'));
      //   return
      // }
    },
    /**
     * 回填
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     ** Author: zhongxiaolong
     */
    handleBackfill(act, row){
      if(row.status !== '0'){
        this.$message.warning(this.$t('TIPS_WARNING.CANNOT_BE_OPERATED'));
        return
      }
      this.row = row;
      this.act = act;
      this.form = {...row};
      this.formDialog = true;
      this.$nextTick(()=>{
         this.$refs['form'].clearValidate();
      })
    },
    /** 开票-预览发票
     * @param {Object} btn 按钮配置
     * @param {Array} rowIds 当按钮为行数据/头部按钮为勾选行 id 数组
     * @return void
     ** Author: zhongxiaolong
    */
    handlePreview(act, row) {
      if(this.multipleSelection.length > 1){
        this.$message.warning(this.$t("seladata"));
        return
      }
      this.row = row;
      let params = {
        id: row.id
      }
      // 开票（客户）预览则打开图片 开票（农业）预览调用接口
      if(this.config.ifFromCustomer){
        if(row.fileurl){
          window.open(row.fileurl)
        } else {
          this.$message.warning('对方为上传发票图片');
          return
        }
      } else {
        getAction(act.url, params).then(res =>{
          if(res.status === 200){
            this.visible = true;
            this.invoiceDetail = res.data;
          }
        })
      }
    },
    /** 开票-签收
     * @param {Object} btn 按钮配置
     * @param {Array} rowIds 当按钮为行数据/头部按钮为勾选行 id 数组
     * @return void
     ** Author: zhongxiaolong
    */
    handleSignFor(btn, row){
      // 检查勾选项是否都是 已开票状态 才能签收
      let isAllow = this.multipleSelection.every(item => {
        return (item.status == 1 )
      });
      if(isAllow){
        postAction(btn.url, row.id).then(res =>{
          if(res.data.code === 200){
            this.$message.success(res.data.message)
            this.loadData();
          }else{
            this.$message.error(res.data.message)
          }
        })
      } else {
        this.$message.warning("请选择状态为已开票的发票进行签收");
        return
      }
    },
    handleClose(){
      this.visible = false;
      this.loadData();
      this.$refs['listTable'].listLoading = true;
      this.$refs['listTable'].handleLoading(true);
    },
    /** 提交回填发票信息
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    submit(){
      const _this = this;
      let { row, form } = this;
      // 开票金额等于已对账金额
      row['invoiceAmount'] = row['statementAmount'];
      let data = [{...row,...form}];
      this.$refs['form'].validate((valid) => {
        if (valid) {
          postAction(_this.act.url, data).then(res =>{
            _this.formDialog = false;
            if(res.data.code === 200){
              this.$message.success(res.data.message)
              this.loadData();
            }else{
              this.$message.error(res.data.message)
            }
          })
        }else{
          _this.formDialog = true;
          _this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          return
        }
      })
    },
    /**
     * 编辑发票号取消
     * @param void
     * @return void
     */
    back () {
      this.formDialog = false;
    },
    /** 行编辑按钮
     * @param {Object} row 行数据
     * @return void
     */
    inlineEdit(row){
      let isAllowEdit = this.mate.mateList.btns.find(item => item.action === 'save');
      if(!isAllowEdit){
        this.$message.warning(this.$t('TIPS_WARNING.NO_PERMISSION'))
        return
      }else{
        row.edit = !row.edit;
      }
    },
    /** 行编辑Ok
     * @param {Object} row 行数据
     * @return void
     */
    editSubmit(row){
      let data = [];
      data.push(row);
      postAction(this.url.updateLine, data)
    },
    /** 刷新订单行数据
     * 操作过上传图片按钮后刷新加工单行列表数据
     * @param {Object} row 加工单行数据
     * @return void
     */
    refreshLine(row) {
      // 保存行的父级加工单的 id
      let id = row.id;
      // 获取加工单下行数据
      this.getLines(id)
    },
    /**
     * 请求当前操作行的查看详情中的列表行数据
     * 获取数据后渲染详情列表行
     * @param {Object} row 当前操作行的行数据
     * @param {Object} act 按钮配置信息
     * @return void
     */
    handleRowClick (row, act) {
      this.rowStatus = row.status;
      let id = row.id;
      // 获取行数据
      this.getLines(id);
      // this.lineTableFlag = true;
    },
    /** 获取行数据 
     * @param {String} id 列表行 id
     * @return void
     */
    getLines (id) {
      let url = this.mate.mateList.url;
      this.pid = id;
      SERVICES.BASE.getSelectOne(url, {id}).then(res =>{
        let data = res.data.data;
        if (data && data.length){
          this.$set(this.mate.mateList, "lineRows", data);
          if (this.mate.mateList.rowClick) {
            // 显示 行Table
            this.lineTableFlag = true;
            // 刷新数据
            this.mate.mateListLine.rows = data;
            // 初始化加单下行操作列按钮
            // this.initLineListOperations(this.rowStatus);
          }
        }
      })
    },
    /** 初始化加工单行的操作列
     * 只有加工单在生效状态操作行才渲染并且有上传图片按钮
     * @param {String} status 列表行状态
     * @return void
     */
    initLineListOperations(status) {
      // 生效状态下设置上传图片按钮配置
      if(status === "PASS"){
        this.mate.mateListLine.actions = []
      }else{
        // 清空操作行按钮配置
        this.mate.mateListLine.actions = [];
      }
    },
    /** 获取列表数据
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    loadData() {
      const { url, mate, pageNum, pageSize, isNeedPage } = this;
      let params = { isNeedPage, pageNum, pageSize };
      params = this.initParams(params);
      postAction(url.list, params).then( res =>{
        if (res.status === 200 && !!res.data) {
          const data = res.data.data; //! TODO 注意返回层级关系
          let { total, ...resData } = data;
          let rows = data.list;
          let page = data.pageNum;
          let size = data.size;
          mate.mateList = { ...mate.mateList, size, page, total, rows };
        }
      })
    },
    /**
     * 数据转换
     * 后台返回数据结构不统一做数据转换处理
     * @param {Object} data 数据
     * @return void
     ** Author: zhongxiaolong
     */
    convertData(data) {
      let { pageSize, total, pageNum, list, ...resData } = data.data
      let rows = list;
      let page = pageNum;
      let size = pageSize;
      this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
    },
    /** 初始化行操作列按钮的状态配置启用按钮 disabled 的状态
     * ......可以对相关按钮进行初始化
     * enableEdit 是否启用编辑
     * 默认启用编辑 通做行状态再修改启用状态
     * @param void
     * @return void
     ** Author: zhongxiaolong
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
     * 重新渲染列表页
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    reRenderList() {
      this.$root.monitor({ url: `${this.meta.list}${this.params}` });
    }
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
