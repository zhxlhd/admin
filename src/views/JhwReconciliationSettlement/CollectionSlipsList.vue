<!-- created by zhongxiaolong on 2020/05/12 -->
<!-- 收款单 CollectionSlipsList -->
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

    <collection-slips-item-list ref="collectionSlipsItemList" :mate="mate" :direction="'btt'" :drawerWidth="'50%'">
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
    </collection-slips-item-list>
    
    <el-dialog :title="dialogTitle" :visible.sync="headerDialog" width="80%" :show-close="false" :close-on-click-modal="false">
      <dynamic-form ref="modalForm" 
        :mate="mate.mateFormerHeader" 
        :rules="formRules" 
        :eventCfg="fromEventConfig" 
        @events="handleEvents"></dynamic-form>
      <span slot="footer" class="dialog-footer">
        <el-divider></el-divider>
        <!-- <el-button @click="back">{{ $t('BUTTON_TEXT.CANCEL') }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{ $t('BUTTON_TEXT.OK') }}</el-button> -->
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
import CollectionSlipsItemList from './components/CollectionSlipsItemList'
import DynamicForm from '@/components/form/DynamicForm'
import DictStore from '@/store/dict-store.js';
import FormMixin from '@/mixins/FormMixin';
import SERVICES from '@/services';
import { getAction, postAction } from '@/services/manage.js';

const BASEAPI = `${API_GATEWAY}/api`;

export default {
  mixins: [FormMixin],
  components:{
    CollectionSlipsItemList,
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
      isIndex: true,                     // Table 是否渲染序号列
      isIndexDialog: true,               // 详情 Dialog Table 是否渲染序号列
      lineTableFlag: false,              // 行Table 是否渲染
      rowStatus: null,                   // 列表订单行状态
      multipleSelection: [],             // 勾选项数组
      word: true,                        // 按钮是否显示文字
      formModel: "page",                 // 表单模式
      showClose: false,                  // 弹窗关闭按钮
      dictForm:{                         // 表单值
        name: '',
        code: '',
        description: '',
        id: ''
      },
      dictFormInline: false,             // 表单是否行内显示
      dialogTitle: '',                     // 表单标题
      labelWidth: '120px',               // 表单字段宽度
      params: '?listName=jhw_payment&listFormName=', // 元数据表名
      listUrl: '/common/toList', // 元数据接口
      dataUrl: '',  // 列表数据接口
      queryUrl: '',  // 查询分页接口
      deleteUrl: '', // 删除接口
      saveUrl: '',
      isEdit: false,             // 当前是否在编辑
      isMaintain: false, // 是否是维护操作
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      langs: LANGS,
      hasSelected: false,
      isNeedPage: true,                  // 请求列表数据是否需要分页
      pageNum: 1,                        // 默认第几页
      pageSize: 10,                      // 默认每页条数/查询默认每页条数
      pid: '',                           // 父级 id
      statement: '', // 对账单
      statementOptions: [], // 对账单下拉
      headerDialog: false,
      url: {
        detail: '', // 详情接口
      },
      formRules: {
        name: [
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
      headerFormLayout: [ // 渲染表单字段和字段布局
        ['orgId'],
        ['planCode','planName'],
        ['startDateStr','endDateStr'],
        ['remarks']
      ],
      url:{
        meta: '/common/toList',  
        list: '/agriculture/collection/list',  // 列表数据
        query: '/agriculture/collection/list', // 查询/分页
        detail: '/agriculture/collection/selectLineOne', // 详情
        lines: '/agriculture/collection/selectLineOne', // 行
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
        add: (btn) => this.handleCreate(btn),                     // 弹窗新增
        delete: (btn, rowIds) => this.handleDelete(btn, rowIds),  // 删除
        refresh: (btn) => this.handleRefresh(btn),                // 刷新缓存
        sync: (btn) => this.handleSync(btn),                      // 同步字典
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
        configure: (act, row) => this.handleItem(row, this.handleUpdate),  // 配置字典
        delete: (act, row) => this.handleDelete(act, rowId),  // 配置字典
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
      
      // this.$refs.collectionSlipsItemList.edit({});

      this.dialogTitle = this.$t('TITLE_TEXT.ADD');
      // 重置表单
      // this.dictForm['name'] = "";
      // this.dictForm['code'] = "";
      // this.dictForm['description'] = "";
      // this.dictForm['id'] = "";
      this.$nextTick(() => {
        this.$refs['modalForm'].clearForm();
      })
    },
    /**
     * 刷新缓存
     * @param {Object} btn 按钮配置信息
     * @return void
     ** Author: zhongxiaolong
     */
    handleRefresh(btn){
      DictStore.fetch();
    },
    /**
     * 同步字典
     * @param {Object} btn 按钮配置信息
     * @return void
     ** Author: zhongxiaolong
     */
    handleSync(btn){
      this.$alert(`功能在开发中...请稍后再尝试`,{
        showClose: false,
      });
      // this.$root.handleAction(btn)
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
      this.$refs.collectionSlipsItemList.edit(row);
    },
    /**
     * 编辑
     * @param {Object} btn 按钮配置
     * @param {Array} rowIds 当按钮为行数据/头部按钮为勾选行 id 数组
     * @return void
     ** Author: zhongxiaolong
    */
    handleDelete(btn, rowIds) {
      // obj.id 为行删除 || rowIds.id 为批量删除
      const _this = this;
      const ids = rowIds;
      this.$root.handleAction(btn, ids, (res) => {
        if(res.code === 200){
            _this.$message.success(res.message)
            _this.loadData();
          }else{
            _this.$message.error(res.message)
          }
      }, btn.method);
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
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    reRenderList() {
      this.$root.monitor({ url: `${this.listUrl}${this.params}` });
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
      this.$refs['modalForm'].validate((valid) => {
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
      this.$refs['modalForm'].validate((valid) => {
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
        let data = res.data.data.lineList;
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
  #dict_list{
    /deep/ .el-dialog__body{
      padding-bottom: 0;
    }
    /deep/ .el-divider--horizontal{
      margin-top: 0;
    }
  }
</style>
