<!-- created by zhongxiaolong on 2020/05/12 -->
<!-- 对账单 ReconciliationSlipsList -->
<template>
  <div>
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
    
    <!-- 新增行弹窗 Start -->
    <dialog-table :mate="dialogMate" ref="dialogTable"
      :dialogVisible="dialogFormVisible" 
      :target="mate.mateListLine.rows"
      tableTitle="新增对账单"
      :showClose="true"
      :maxHeight="maxHeight"
      :judgeBy="'id'"
      :isShowSearchBtn="false"
      :footerBtn="false"
      @btnClick="handleButtons" 
      @select-All="selectAll"
      @handleConfirm="closeDialogTable"></dialog-table>
    <!-- 新增行弹窗 End -->

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
import * as services from '@/services/JhwReconciliationSettlement/Reconciliation_Slips_List';
import { getAction, postAction, metaAction,deleteAction } from '@/services/manage.js';

// import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'

const BASEAPI = `${API_GATEWAY}/api`;

export default {
  // mixins: [ColumnFormatterMixin],
  components:{
    KTableList,
    MainTable,
    DialogTable: function index(resolve){
      require(["@/components/Dialog/DialogTable.vue"], resolve)
    }
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
      dialogFormVisible: false,          // 新增行弹窗是否显示
      maxHeight: 300,                    // 添加成员弹窗 table 的最大高度
      rowStatus: null,                   // 列表订单行状态
      multipleSelection: [],             // 勾选项数组
      word: true,                        // 按钮是否显示文字
      formModel: "dialog",               // 表单模式
      showClose: false,                  // 弹窗关闭按钮
      dictForm:{                         // 表单值
        name: '',
        code: '',
        description: '',
        id: ''
      },
      dictFormInline: false,             // 表单是否行内显示
      dictTitle: '',                     // 表单标题
      labelWidth: '120px',               // 表单字段宽度
      listUrl: '/common/toList',         // 元数据接口
      isEdit: false,                     // 当前是否在编辑
      isMaintain: false,                 // 是否是维护操作
      rowClickSelected: true,            // 列表点击行勾选中
      multipleSelection: [],             // 点击table前面的框框，获取到的内容
      langs: LANGS,                      // 当前语言
      isNeedPage: true,                  // 请求列表数据是否需要分页
      pageNum: 1,                        // 默认第几页
      pageSize: 10,                      // 默认每页条数/查询默认每页条数
      pid: '',                           // 父级 id
      params: '?listName=system_dict&listFormName=', // 元数据表名
      url:{
        meta: '/common/toList',  // 元数据接口
        list: '/agriculture/reconciliationController/list',  // 列表数据
        query: '/agriculture/reconciliationController/list', // 查询/分页
        updateLine: '/agriculture/reconciliationController/batchUpdateLine', // 编辑行保存接口
        lines: '/agriculture/reconciliationController/selectOne',         // 行
        status: '/agriculture/reconciliationController/batchUpdateStatus', // 状态改变
        printTimes: '/agriculture/reconciliationController/updatePrint'    // 记录打印次数
      },
      dialogMate: {
        mateList: {},
        mateSearch: {}
      },
      isSelectAll: false,
      customerList: [],  // 客户下拉值
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
      // 底部行列表默认不显示
      this.lineTableFlag = false;
      // 获取配置
      this.config = this.mate.mateList.config;
      // 获取列表数据
      this.loadData();
      // 初始化行列表参数
      this.initLineTable();
      // 初始化新增弹列表
      this.initDialogMate();
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
        add: (btn, rowIds) => this.handleCreate(btn, rowIds),             // 新增
        save: (btn, rowIds) => this.handleSave(btn, rowIds),              // 保存字段
        delete: (btn,rowIds) => this.handleDelete(btn,rowIds),            // 删除
        confirm: (btn, rowIds) => this.handleConfirm(btn, rowIds),        // 批量确认
        invoicing: (btn, rowIds) => this.handlePreInvoicing(btn, rowIds), // 预开票
        hurry: (btn, rowIds) => this.handleHurry(btn, rowIds),            // 批量催收
        print: (act, row) => this.handlePrint(btn, rowIds),               // 打印
        new: (act, row) => this.addConfirm(btn, rowIds),               // 打印
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
        print: (act, row) => this.handlePrint(act, row),  // 打印
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /** 弹窗新增
     * @param {Object} btn 按钮配置
     * @param {Array} rowIds 当按钮为行数据/头部按钮为勾选行 id 数组
     * @return void
     ** Author: zhongxiaolong
    */
    handleCreate(btn, rowIds) {
      this.dialogFormVisible = true;
      this.isSelectAll = false;
      this.getCustomerData();   // 获取客户下拉值
      this.$nextTick(() => {
        // 查询全部数据
        this.$refs['dialogTable'].$refs["listTable"].$refs["multipleQueryForm"].query();
      })
    },
    /** 编辑
     * @param {Object} btn 按钮配置
     * @param {Array} rowIds 当按钮为行数据/头部按钮为勾选行 id 数组
     * @return void
     ** Author: zhongxiaolong
    */
    handleSave(btn, rowIds) {
      if(this.multipleSelection.length !== 1){
        this.$message.warning(this.$t("seladata"));
        return
      }
      let data = this.mate.mateListLine.rows;
      let pid = this.multipleSelection[0].id;
      // TODO 状态判断
      postAction(btn.url, data).then(res =>{
        this.getLines(pid);
      }).catch((res) =>{
        this.$message.error(res.data.message)
      })
    },
    /** 批量确认
     * 1 新建
     * 2 对账中
     * 3 已对账
     * 状态为对账中允许确认，确认后状态为已对账
     * @param {Object} btn 按钮配置
     * @param {Array} rowIds 当按钮为行数据/头部按钮为勾选行 id 数组
     * @return void
     ** Author: zhongxiaolong
    */
    handleConfirm(btn, rowIds) {
      // 状态判断 只允许“对账中”（状态码为 2）状态进行催收
      let isAllow = this.multipleSelection.every(item => item.status ==='1');
      // 状态为对账中允许确认，确认后状态为已对账
      if(isAllow){
        let params = {
          status: '3',
          ids: rowIds.id.join(','),
        }
        this.changeStatus(btn.url, params);
        // getAction(btn.url, params).then(res =>{
        //   this.loadData();
        // }).catch((res) =>{
        //   this.$message.error(res.data.message)
        // })
      }else{ 
        this.$message.warning(this.$t('TIPS_WARNING.CANNOT_BE_OPERATED'));
        return
      }
    },
    /** 批量催收
     * 1 新建
     * 2 对账中
     * 3 已对账
     * 状态为已对账允许催收
     * @param {Object} btn 按钮配置
     * @param {Array} rowIds 当按钮为行数据/头部按钮为勾选行 id 数组
     * @return void
     ** Author: zhongxiaolong
    */
    handleHurry(btn, rowIds) {
       // 状态判断 只允许“已对账”已预开票”（状态码为 3/4）状态进行催收
      let isAllow = this.multipleSelection.every(item => item.status ==='3' || item.status ==='4');
      // 状态为已对账允许催收
      if(isAllow){
        let params = {
          ids: rowIds.id.join(',')
        }
        getAction(btn.url, params).then(res =>{
          if(res.data.code === 200){
            this.$message.success(res.data.message)
            this.loadData();
          }else{
            this.$message.error(res.data.message)
          }
        })
      }else{
        this.$message.warning(this.$t('TIPS_WARNING.CANNOT_BE_OPERATED'));
        return
      }
    },
    /** 预开票
     * @param {Object} btn 按钮配置
     * @param {Array} rowIds 当按钮为行数据/头部按钮为勾选行 id 数组
     * @return void
     ** Author: zhongxiaolong
    */
    handlePreInvoicing(btn, rowIds) {
       // 状态判断 只允许“已对账”（状态码为 3）状态进行预开票
      let isAllow = this.multipleSelection.every(item => item.status ==='3');
      // 状态为已对账允许预开票
      if(isAllow){
        let params = {
          ids: rowIds.id.join(',')
        }
        getAction(btn.url, params).then(res =>{
          if(res.data.code === 200){
            this.$message.success(res.data.message)
            this.loadData();
          }else{
            this.$message.error(res.data.message)
          }
        }).catch((res) =>{
          this.$message.error(res.data.message)
        })
      }else{
        this.$message.warning(this.$t('TIPS_WARNING.CANNOT_BE_OPERATED'));
        return
      }
    },
    /**
     * 打印
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    handlePrint(act, row, fromAdd) {
      const _this = this;
      if(this.multipleSelection.length > 1 && !fromAdd){
        this.$message.warning(this.$t("seladata"));
        return
      }
      // 打印接口请求地址和传参
      let url = `${act.url}?format=pdf&id=${row.id}`;
      SERVICES.BASE.handlePrinter(url).then(res =>{
        let params = {};
        let id = row.id.join(',');
        let printingTimes = _this.multipleSelection[0].printingTimes || row.printingTimes;
        if(printingTimes == 0 || printingTimes == '' || printingTimes == null){ 
          // 改变状态 新建 -> 对账中 status 2 取消改变状态
          // params = {
          //   status: '2',
          //   ids: id,
          // }
          // _this.changeStatus(_this.url.status, params);
          // getAction(_this.url.status, params).then(res =>{
          //   // this.loadData();
          // }).catch((res) =>{
          //   this.$message.error(res.data.message)
          // })
        }
        params = { id }
        getAction(this.url.printTimes, params).then(res =>{
          this.loadData();
        }).catch((res) =>{
          this.$message.error(res.data.message)
        })
        // this.loadData();
      }).catch(err =>{});
    },
    /** 状态改变
     * @param {String} url 接口
     * @param {Object} params 参数
     * @return void
     */
    changeStatus(url, params){
      getAction(url, params).then(res =>{
        if(res.data.code === 200){
          this.$message.success(res.data.message)
          this.loadData();
        }else{
          this.$message.error(res.data.message)
        }
      }).catch((res) =>{
        this.$message.error(res.data.message)
      })
    },
     /** 删除
     * 1 新建
     * 2 对账中
     * 3 已对账
     * 状态为新建允许删除
     * @param {Object} btn 按钮配置
     * @param {Array} rowIds 当按钮为行数据/头部按钮为勾选行 id 数组
     * @return void
     ** Author: fengjing
    */
    handleDelete(btn, rowIds){
       // 状态判断 只允许“新建”（状态码为 1）状态进行删除
      let isAllow = this.multipleSelection.every(item => item.status ==='1');
      // 状态为已对账允许预开票
      if(isAllow){
        let params = {
          ids: rowIds.id.join(',')
        }
        deleteAction(btn.url, params).then(res =>{
          if(res.data.code === 200){
            this.$message.success(res.data.message)
            this.loadData();
          }else{
            this.$message.error(res.data.message)
          }
        }).catch((res) =>{
          this.$message.error(res.data.message)
        })
      }else{
        this.$message.warning(this.$t('TIPS_WARNING.CANNOT_BE_OPERATED'));
        return
      }
    },
    /** 增加打印次数
     * @param {String} url 接口
     * @param {Object} params 参数
     * @return void
     */
    increaseTimes(url, params){
      url = url || this.url.printTimes; 
      getAction(url, params).then(res =>{
        // this.loadData();
      }).catch((res) =>{
        this.$message.error(res.data.message)
      })
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
      row['reconciliationAmount'] = row['reconciliationQuantity'] * row['unitPrice'];
      let data = [];
      data.push(row);
      let { url } = this;
      postAction(url.updateLine, data);
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
        let data = res.data.data; //! TODO 注意返回层级关系
        if (data && data.length){
          // 初始化行编辑装状态 行内编辑用
          this.initLineData(data);
          this.$set(this.mate.mateList, "lineRows", data);
          if (this.mate.mateList.rowClick) {
            // 显示 行Table
            this.lineTableFlag = true;
            // 刷新数据
            this.mate.mateListLine.rows = data;
          }
        }
      })
    },
    /** 获取列表数据
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    loadData() {
      const { url, mate, pageNum, pageSize, isNeedPage, initOperations } = this;
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
          initOperations();
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
      this.initOperations();
    },
    /**
     * 新增/编辑数据字典取消
     * @param void
     * @return void
     */
    back () {
      this.dictDialog = false;
      this.isMaintain = false;
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
      // 不是新建不允许修改 // TODO 暂时注释
      rows.forEach(item => {
        let status = item.status;
        if(status !== "1"){
          item.enableEdit = false;
        }
      });
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
          this.customerList.push({ 
            'label': item.name,
            'value': item.name,
            'id': item.code,
          })
        })
      });
    },
    /**
     * 弹窗列表初始化数据
     * 增加自定义列
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    initDialogMate(){
      let hasAdd = this.mate.mateList.btns.find(item => item.action === 'add');
      if(!hasAdd) return;
      let params = {
        listName: 'jhw_reconciliation_add'
      }
      let { dialogMate } = this;
      metaAction(params).then(res =>{
        let data = res.data;
        let { btns, size, page, total, columns, rows} = data.mate.mateList;
        let dataApi = '/agriculture/reconciliationController/queryStatementList';
        dialogMate.mateList = { ...dialogMate.mateList, btns, size, page, total, columns, rows, dataApi };
        dialogMate.mateSearch = {...data.mate.mateSearch};
        // dialogMate.mateSearch.url = this.url.query;
        dialogMate.mateSearch.values.state = '1';
        dialogMate.mateSearch.values = this.initParams(dialogMate.mateSearch.values);
        let cusObj = dialogMate.mateSearch.fields.find(item => item.name ==="customer");
        cusObj.options = this.customerList;
      });
    },
    /** 新增对账单确认 
     * @param {Object} btn 按钮配置
     * @param {Array} rowIds 当按钮为行数据/头部按钮为勾选行 id 数组
     * @return void
     ** Author: zhongxiaolong
    */
    addConfirm(btn, rowIds) {
      let multipleSelection = this.multipleSelection;
      let { customerName, taxRate } = multipleSelection[0];
      let isAllow = true;
      if(multipleSelection.length > 1){
        // isAllow = this.multipleSelection.every(item => (item.customerName === customerName && item.taxRate === taxRate));
        // 去除客户名称校验
        // isAllow = this.multipleSelection.every(item => (item.taxRate === taxRate));
      }
      // 检查勾选项是否都是 sing = true 才能进行对账 (账期)
      /**
       * 2020-07-16 去除by hzq
       * 后台返回数据已过滤无需判断
       */
      // let isPaymentAllow = this.multipleSelection.every(item => {
      //   return (item.sign === true )
      // });
      // 状态为对账中允许确认，确认后状态为已对账
      if(isAllow){
        // if(isPaymentAllow){
        let url = btn.url;
        let params = this.dialogMate.mateSearch.values
        params.ifNeedPage = false
        params.id = rowIds.id.join(',')
        params.pageSize = ''
        params.pageSize1 = ''
        params.pageNum = ''
        params.pageNum1 = ''
        params.isBatch = (!this.isSelectAll) ? false:true
        postAction(url, params).then(res =>{
          if(res.data.code === 200) {
            this.$message.success(res.data.message)
            if(res.data.data){
              this.$alert('是否打印对账单', {
                showCancelButton: true,
                showClose: false,
                confirmButtonText: this.$t('yes'),
                cancelButtonText: this.$t('no'),
                callback: action => {
                  if(action === 'confirm'){
                    let act = {
                      url: '/purchase/report/agriculture_statement'
                    }
                    let row = {
                      id: [res.data.data]
                    }
                    // 生成对账单后跳转打印页面
                    this.handlePrint(act, row, true);
                  }
                }
              });
            }
            this.init();
            this.closeDialogTable();
          } else {
            this.$message.warning(res.data.message)
          }
        })
        // } else {
        //   this.$message.warning('当前账单未到对账时间')
        // }
      }
      // else{
      //   this.$message.warning('只能选择相同的税率')
      //   // this.$message.warning('只能选择相同的客户和相同的税率') 去掉客户校验
      // }
      // if(ids){
      //   let data = [];
      //   rows.forEach(item => {
      //     let [reconciliationId,reconciliationNo,thisPayment,balance,remarks] = [item.id,item.statementNo,undefined,undefined,item.remark];
      //     let { billedAmount, amountPaid, amountPayable } = item;
      //     data.push({ reconciliationId,reconciliationNo, billedAmount, amountPaid, amountPayable, thisPayment, balance, remarks });
      //   })
      //   this.mate.mateListLine.rows = [...this.mate.mateListLine.rows,...data];
      //   this.initLineData(this.mate.mateListLine.rows);
      //   this.closeDialogTable();
      // }else{
      //   this.closeDialogTable();
      // }
    },
    /** 关闭新增对账弹窗 
     * @param void
     * @return void
     ** Author: zhongxiaolong
    */
    closeDialogTable(){
      this.dialogFormVisible = false;
    },
    /**
     * 全选导出
     */
    selectAll (selection) {
      this.isSelectAll = (selection.length > 0)? true : false
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
</style>
