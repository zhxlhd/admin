<!-- created by zhongxiaolong on 2020/04/14 -->
<!-- 数据字典 DictList -->
<template>
  <div id="dict_list">
    <k-table-list ref="listTable" 
      :mate="mate" 
      :mateSearch="mate.mateSearch" 
      :isIndex="isIndex"
      :isIndexDialog="isIndexDialog"
      :formModel="formModel"
      :word="word"
      :querySize="querySize"
      :isShowSearchBtn="false"
      @initOperations="initOperations"
      @btnClick="handleButtons" 
      @action="handleActions"
    ></k-table-list>

    <dict-item-list ref="dictItemList" :mate="mate"></dict-item-list>
    
    <el-dialog :title="dictTitle" :visible.sync="dictDialog" width="30%" :show-close="false" :close-on-click-modal="false">
      <el-form size="mini" :model="dictForm" :inline="dictFormInline" label-position="right" ref="dictForm" :rules="rules" :label-width="labelWidth">
        <el-form-item :label="$t('LABEL_TEXT.DICT_NAME')" prop="name">
          <el-input v-model.trim="dictForm['name']" placeholder="请输入字典名称"></el-input>
        </el-form-item>
        <el-form-item :label="$t('LABEL_TEXT.DICT_CODE')" prop="code">
          <el-input v-model.trim="dictForm['code']" placeholder="请输入字典编码"></el-input>
        </el-form-item>
        <el-form-item :label="$t('LABEL_TEXT.DICT_DESC')" prop="description" placeholder="请输入字典描述">
          <el-input v-model="dictForm['description']" :maxlength="50"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-divider></el-divider>
        <el-button @click="back">{{ $t('BUTTON_TEXT.CANCEL') }}</el-button>
        <el-button type="primary" @click="submit">{{ $t('BUTTON_TEXT.OK') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { LANGS } from '../../i18n/lang';
import { API_GATEWAY } from '@/config/index.js';
import axios from '@/utils/http';
import KTableList from '@/components/table/KTableList';
import DictItemList from './DictItemList';
import DictStore from '@/store/dict-store.js'
// import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'

const BASEAPI = `${API_GATEWAY}/api`;

export default {
  // mixins: [ColumnFormatterMixin],
  components:{
    DictItemList,
    KTableList,
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
      querySize: 15,  // 查询默认每页条数
      params: '?listName=system_dict&listFormName=', // 元数据表名
      listUrl: '/common/toList', // 元数据接口
      dataUrl: '/dic/catg/all/list-q?search=',  // 列表数据接口
      queryUrl: '/dic/catg/all/list/new',  // 查询分页接口
      categoryUrl: 'dic/cg', // 字典分类接口
      deleteUrl: '/dic/catg/delete?ids=', // 字典删除接口
      saveUrl: '/dic/catg',
      isEdit: false,             // 当前是否在编辑
      isMaintain: false, // 是否是维护操作
      pageSize: 15,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      langs: LANGS,
      hasSelected: false,
      page: 1,
      dictDialog: false,
      rules: {
        name: [
          { required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED') }
        ],
        code: [
          { required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED') }
        ],
        description: [
          { required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED') }
        ]
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
      this.getListData();
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
      let action = act && act.action;
      let rowId = { id: [row.id] };
      const actions = {
        update: (act, row) => this.handleUpdate(act, row), // 编辑
        configure: (act, row) => this.handleDictItem(row, this.handleUpdate),  // 配置字典
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
      this.dictDialog = true;
      // 当前新增 设置编辑状态为 false
      this.isEdit = false;
      this.dictTitle = this.$t('TITLE_TEXT.ADD');
      // 重置表单
      this.dictForm['name'] = "";
      this.dictForm['code'] = "";
      this.dictForm['description'] = "";
      this.dictForm['id'] = "";
      this.$nextTick(() => {
        this.$refs['dictForm'].clearValidate();
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
      this.$alert(`功能在开发中...请移步到企业审核操作`,{
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
      this.dictDialog = true;
      // 当前编辑 设置编辑状态为 true
      this.isEdit = true;
      this.dictTitle = this.$t('TITLE_TEXT.MODIFY');
      this.dictForm = {...row};
    },
    /**
     * 编辑
     * @param {Object} row 当前行信息
     * @return void
     ** Author: zhongxiaolong
    */
    handleDictItem(row,callback) {
      const _this = this;
      if(!row['description']){
        this.$alert(this.$t('TIPS_WARNING.ENTER_REQUIRED'),{
          showClose: false,
          confirmButtonText: this.$t('yes'),
          cancelButtonText: this.$t('no'),
          callback: action => {
            if(action === 'confirm'){
              _this.isMaintain = true;
              callback({}, row);
            }else{
              return
            }
          }
        });
        return
      }
      this.$refs.dictItemList.edit(row);
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
      this.$root.handleAction(btn, ids, () => _this.getListData(), btn.method);
    },
    /** 获取列表
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    getListData() {
      const _this = this;
      let url = `${this.queryUrl}`;
      axios.post(url, {}).then(res => {
        if (res.status === 200 && !!res.data) {
          const data = res.data.mate
          let { total, ...resData } =data;
          let rows = data.rows;
          let page = data.page;
          let size = data.size;
          let dataApi = url;
          _this.mate.mateList = { ..._this.mate.mateList, size, page, total, rows, dataApi };
          if(_this.isMaintain){ // 维护完必填字段显示字典配置弹窗并恢复维护状态
            _this.handleDictItem(rows[0]);
            _this.isMaintain = false;
          }
        }
      });
    },
    /** 
     * 新增/编辑 数据字典确认
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    submit () {
      // 描述字段
      let desc = this.dictForm['description'];
      if(desc && desc.trim() === ''){
        this.$message.warning('描述不能为空');
        return
      }
      const mate = this.dictForm;
      const _this = this;
      this.$refs['dictForm'].validate((valid) => {
        if (valid) {
          this.dictDialog = false;
          if (!this.isEdit) {
            this.$root.ajaxData(this.saveUrl, mate, () => _this.getListData(), 'POST');
          } else {
            this.$root.ajaxData(`${this.saveUrl}/${this.dictForm.id}`, mate, () => _this.getListData() , 'PUT');
          }
        } else {
          this.dictDialog = true;
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          return
        }
      })
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
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    reRenderList() {
      this.$root.monitor({ url: `${this.listUrl}${this.params}` });
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
