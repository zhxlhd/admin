<!-- created by zhongxiaolong on 2020/54/12 -->
<!-- 付款单 PaymentSlipsList -->
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
      @initOperations="initOperations"
      @initQueryData="convertData"
      @btnClick="handleButtons"  
      @rowClick="handleRowClick"
      @action="handleActions"
    ></k-table-list>

    <payment-slips-item-list v-if="formModel ==='dialog'" ref="paymentSlipsItemList" :mate="mate" :direction="'btt'" :drawerWidth="'50%'">
      <!-- 默认插槽置空 -->
      <span slot></span>
      <!-- 使用具名插槽 -->
      <div slot="table" slot-scope="tableDate">
        <k-table-list ref="lineTable" 
          v-bind="$attrs" 
          :mate="tableDate.mate" 
          :isIndex="isIndex" 
          :formModel="formModel" 
          :word="word" 
          :mateSearch="tableDate.mateSearch" 
          @btnClick="tableDate.handleButtons" 
          @action="tableDate.handleActions"
        >
          <span slot="moreBtn">
            <el-select label="对账单" v-model="statement" placeholder="请选择对账单" size='mini'>
              <el-option
                v-for="(item,index) in statementOptions"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </span>
        </k-table-list>
      </div>
    </payment-slips-item-list>
    
    <el-dialog v-if="formModel ==='dialog'" :title="dialogTitle" :visible.sync="headerDialog" width="80%" :show-close="false" :close-on-click-modal="false">
      <dynamic-form ref="modalForm" 
        :mate="mate.mateFormerHeader" 
        :rules="formRules" 
        :eventCfg="fromEventConfig" 
        @events="handleEvents"></dynamic-form>
      <span slot="footer" class="dialog-footer">
        <el-divider></el-divider>
        <h-btn :btns="['提交','保存','取消','重置']" @click="handleBtns">
          <span slot="moreButtons">
            <el-button type="primary" size="mini" style="margin-left: 10px" @click="handleItem({})">新增对账单</el-button>
          </span>
        </h-btn>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { LANGS } from '../../i18n/lang';
import { API_GATEWAY } from '@/config/index.js';
import axios from '@/utils/http';
import KTableList from '@/components/table/KTableList';
import PaymentSlipsItemList from './components/PaymentSlipsItemList';
import DynamicForm from '@/components/form/DynamicForm'
import DictStore from '@/store/dict-store.js';
import FormMixin from '@/mixins/FormMixin';
import SERVICES from '@/services';
import { getAction, postAction } from '@/services/manage.js';

const BASEAPI = `${API_GATEWAY}/api`;

export default {
  mixins: [FormMixin],
  components:{
    PaymentSlipsItemList,
    KTableList,
    DynamicForm,
    HBtn: function index(resolve){
      require(["@/components/Button/HBtn.vue"], resolve);
    },
  },
  props: {
    mate: Object
  },
  data () {
    return {
      config: {},                        // 根据元数据区分角色
      isIndex: true,                     // Table 是否渲染序号列
      isIndexDialog: true,               // 详情 Dialog Table 是否渲染序号列
      lineTableFlag: false,              // 行Table 是否渲染
      rowStatus: null,                   // 列表订单行状态
      multipleSelection: [],             // 勾选项数组
      word: true,                        // 按钮是否显示文字
      formModel: "page",                 // 表单模式 page dialog
      showClose: false,                  // 弹窗关闭按钮
      dictForm:{                         // 表单值
        name: '',
        code: '',
        description: '',
        id: ''
      },
      dictFormInline: false,             // 表单是否行内显示
      dialogTitle: '',                   // 表单标题
      labelWidth: '120px',               // 表单字段宽度
      isEdit: false,                     // 当前是否在编辑
      isMaintain: false,                 // 是否是维护操作
      multipleSelection: [],             // 点击table前面的框框，获取到的内容
      langs: LANGS,                      // 当前语言
      isNeedPage: true,                  // 请求列表数据是否需要分页
      pageNum: 1,                        // 默认第几页
      pageSize: 10,                      // 默认每页条数/查询默认每页条数
      pid: '',                           // 父级 id
      statement: '',        // 对账单
      statementOptions: [], // 对账单下拉
      headerDialog: false,
      formRules: {
        serialNumber: [
          { required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED') }
        ],
        code: [
          { required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED') }
        ],
        description: [
          { required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED') }
        ]
      },
      fromEventConfig: {},
      formLayout: [ // 渲染表单字段和字段布局
        ['orgId'],
        ['planCode','planName'],
        ['startDateStr','endDateStr'],
        ['remarks']
      ],
      params: '?listName=jhw_payment&listFormName=', // 元数据表名
      url:{
        meta: '/common/toList',  
        list: '/agriculture/payment/list',  // 列表数据
        query: '/agriculture/payment/list', // 查询/分页
        new: '', // 新增
        update: '', // 编辑
        delete: '', // 删除
        deleteBatch: '', // 批量删除
        detail: '/agriculture/payment/selectLineOne', // 详情
        lines: '/agriculture/payment/selectLineOne', // 行
        exportXlsUrl: "", // 导出excel
        importExcelUrl: "", // 导入excel
      }
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
      if(this.config.ifPayment){
        // 收款确认功能  根据元数据判断
        this.url = {
          meta: '/common/toList',  
          list: '/agriculture/payment/confirmationList',  // 列表数据
          query: '/agriculture/payment/confirmationList', // 查询/分页
          new: '', // 新增
          update: '', // 编辑
          delete: '', // 删除
          deleteBatch: '', // 批量删除
          detail: '/agriculture/payment/selectLineOne', // 详情
          lines: '/agriculture/payment/selectLineOne', // 行
          exportXlsUrl: "", // 导出excel
          importExcelUrl: "", // 导入excel
        }
      } else {
        this.url = {
          meta: '/common/toList',  
          list: '/agriculture/payment/list',  // 列表数据
          query: '/agriculture/payment/list', // 查询/分页
          new: '', // 新增
          update: '', // 编辑
          delete: '', // 删除
          deleteBatch: '', // 批量删除
          detail: '/agriculture/payment/selectLineOne', // 详情
          lines: '/agriculture/payment/selectLineOne', // 行
          exportXlsUrl: "", // 导出excel
          importExcelUrl: "", // 导入excel
        }
      }
      this.loadData();
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
        add: (btn) => this.handleCreate(btn),                     // 弹窗新增 dialog
        delete: (btn, rowIds) => this.handleBatchDelete(btn, rowIds),  // 删除
        submit: (btn) => this.submitApproval(btn, rowIds),                // 提交审批
        receivedSure: (btn) => this.receivedSure(btn,rowIds),             // 收款确认
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
        update: (act, row) => this.handleUpdate(act, row), // 编辑
        print: (act, row) => this.handlePrint(act, row),   // 打印
        delete: (act, row) => this.handleDelete(act, row),  // 配置字典
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 新增
     * @param {Object} btn 按钮配置信息
     * @return void
     ** Author: zhongxiaolong
    */
    handleCreate(btn) {
      this.headerDialog = true;
      // 当前新增 设置编辑状态为 false
      this.isEdit = false;
      this.dialogTitle = this.$t('TITLE_TEXT.ADD');
      this.$nextTick(() => {
        this.$refs['modalForm'].clearForm();
      })
    },
    /**
     * 打印
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    handlePrint(act, row) {
      // 打印接口请求地址和传参
      let url = `${act.url}?format=pdf&id=${row.id}`;
      SERVICES.BASE.handlePrinter(url).then(ren =>{}).catch(err =>{});
    },
    /** 提交审批
     * 新建 -> 1
     * 审核中 -> 2
     * 已驳回 -> 3
     * 已通过 -> 4
     * @param {Object} btn 按钮配置信息
     * @return void
     ** Author: zhongxiaolong
     */
    submitApproval(btn, rowIds){
      let state = '2';
      let multipleSelection = this.multipleSelection;

      // 检查勾选项是否都是新建和驳回状态
      let isAllow = multipleSelection.every(item => (item.state ==='1' || item.state ==='3'));
      if(isAllow) {
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
        this.$message.warning(this.$t('TIPS_WARNING.FAILURE_TO_SUBMIT_FRO_APPROVAL'))
      }
    },
    /**
     * 编辑
     * @param {Object} btn 按钮配置信息
     * @return void
     ** Author: zhongxiaolong
    */
    handleUpdate(btn,row) {
      this.headerDialog = true;
      // 当前编辑 设置编辑状态为 true
      this.isEdit = true;
      this.dialogTitle = this.$t('TITLE_TEXT.MODIFY');
      this.dictForm = {...row};
    },
    /**
     * 编辑
     * @param {Object} row 当前行信息
     * @return void
     ** Author: zhongxiaolong
    */
    handleItem(row,callback) {
      // const _this = this;
      // if(!row['description']){
      //   this.$alert(this.$t('TIPS_WARNING.ENTER_REQUIRED'),{
      //     showClose: false,
      //     confirmButtonText: this.$t('yes'),
      //     cancelButtonText: this.$t('no'),
      //     callback: action => {
      //       if(action === 'confirm'){
      //         _this.isMaintain = true;
      //         callback({}, row);
      //       }else{
      //         return
      //       }
      //     }
      //   });
      //   return
      // }
      row.name = "?lineForm=jhw_reconciliation_line_form"
      this.$refs.paymentSlipsItemList.edit(row);
    },
    /**
     * 批量删除
     * @param {Object} btn 按钮配置
     * @param {Array} rowIds 当按钮为行数据/头部按钮为勾选行 id 数组
     * @return void
     ** Author: zhongxiaolong
    */
    handleBatchDelete(btn, rowIds) {
      // obj.id 为行删除 || rowIds.id 为批量删除
      const _this = this;
      const ids = rowIds;
      // 检查勾选项是否都是新建或者驳回状态
      let isAllow = this.multipleSelection.every(item => (item.state ==='1' || item.state ==='3'));
      if(isAllow) {
        let params = {
          ids: rowIds.id.join(',')
        }
        getAction(btn.url, params).then(res => {
          if(res.data.code === 200){
            this.$message.success(res.data.message)
            this.loadData();
          }else{
            this.$message.error(res.data.message)
          }
        })
      }else{
        this.$message.warning(this.$t('TIPS_WARNING.CANNOT_BE_DELETED'))
      }
    },
    /**
     * 函数
     * @param {Object} act 按钮配置
     * @param {Array} row 当前行数据 
     * @return void
     ** Author: zhongxiaolong
    */
    handleDelete(act, row) {
      // obj.id 为行删除 || rowIds.id 为批量删除
      const _this = this;
      if(row.state ==='1' || row.state ==='3') {
        let params = {
          ids: row.id
        }
        getAction(act.url, params).then(res => {
          if(res.data.code === 200){
            this.$message.success(res.data.message)
            this.loadData();
          }else{
            this.$message.error(res.data.message)
          }
        })
      }else{
        this.$message.warning(this.$t('TIPS_WARNING.CANNOT_BE_DELETED'))
      }
    },
    /**
     * 收款确认
     * @param {Object} btn 按钮配置
     * @param {Array} rowIds 当按钮为行数据/头部按钮为勾选行 id 数组
     * @return void
     ** Author: fengjing
     */
    receivedSure(btn, rowIds){
      if(rowIds.length > 0){
        this.$message.warning('请选择一条数据')
        return
      }
      let array = []
      rowIds.id.forEach(item=>{
        let params = {id: item, state: 5}
        array.push(params)
      })
      postAction(btn.url, array).then(res => {
          if(res.data.code === 200){
            this.$message.success(res.data.message)
            this.loadData();
          }else{
            this.$message.error(res.data.message)
          }
        })
    },
    /** 获取列表
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    loadData() {
      const { url, mate, pageNum, pageSize, isNeedPage, initOperations } = this;
      let params = { isNeedPage, pageNum, pageSize };
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
        let status = item.state;
        if(status !== "1"){
          item.enableEdit = false;
        }
      });
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
    },
    /** 获取行数据 
     * @param {String} id 列表行 id
     * @return void
     */
    getLines (id) {
      let url = this.mate.mateList.url;
      this.pid = id;
      SERVICES.BASE.getSelectOne(url, {ids: id}).then(res =>{
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
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    reRenderList() {
      this.$root.monitor({ url: `${this.url.meta}${this.params}` });
    },
    
    /** 新增弹窗按钮事件
     * @param {String} name 按钮名称
     * @return {Function} 按钮事件
     */
    handleBtns(name) {
      const btnEvents = {
        // 提交按钮
        submit: () => this.handleSubmit(),
        // 提交按钮
        save: () => this.handleSave(),
        // 取消按钮
        cancel: () => this.back(),
        // 重置按钮
        reset: () => this.handleReset(),
        // 默认
        default: () => { return }
      }
      return (btnEvents[name] || btnEvents.default)();
    },
    /** 新增/编辑 数据字典确认
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    handleSubmit () {
      // 描述字段
      let desc = this.dictForm['description'];
      if(desc && desc.trim() === ''){
        this.$message.warning('描述不能为空');
        return
      }
      const mate = this.dictForm;
      const _this = this;
      this.$refs['modalForm'].$refs["form"].validate((valid) => {
        if (valid) {
          this.headerDialog = false;
          if (!this.isEdit) {
            this.$root.ajaxData(this.saveUrl, mate, () => _this.loadData(), 'POST');
          } else {
            this.$root.ajaxData(`${this.saveUrl}/${this.dictForm.id}`, mate, () => _this.loadData() , 'PUT');
          }
        } else {
          this.headerDialog = true;
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          return
        }
      })
    },
    /** 新增/编辑 数据字典确认
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    handleSave () {
      // 描述字段
      let desc = this.dictForm['description'];
      if(desc && desc.trim() === ''){
        this.$message.warning('描述不能为空');
        return
      }
      const mate = this.dictForm;
      const _this = this;
      this.$refs['modalForm'].$refs["form"].validate((valid) => {
        if (valid) {
          this.headerDialog = false;
          if (!this.isEdit) {
            this.$root.ajaxData(this.saveUrl, mate, () => _this.loadData(), 'POST');
          } else {
            this.$root.ajaxData(`${this.saveUrl}/${this.dictForm.id}`, mate, () => _this.loadData() , 'PUT');
          }
        } else {
          this.headerDialog = true;
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          return
        }
      })
    },
    /** 新增/编辑数据字典取消
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    back () {
      this.headerDialog = false;
      this.isMaintain = false;
    },
    /** 重置按钮
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
		handleReset() {
			this.$refs['modalForm'].$refs["form"].resetFields();
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
