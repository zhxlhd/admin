<!-- 模块首页列表组件 -->
<template>
  <div>
    <!-- 头部按钮组件 Start -->
    <boxer ref="Boxer" 
           :mate="mate.mateList" 
           :hasSelected="hasSelected" 
           @action="handleButtons"
           @actionDropdown="handleButtonsDropdown"
           >
      <!-- 搜索按钮插槽 Start -->
      <div slot="searchForm" style="float: left;">
        <slot>
          <!-- 搜索按钮 Start -->
          <el-button size="mini" 
                    type="primary" 
                    :class="{'el-icon-search':!queryBtnText}" 
                    v-if="mateSearch" 
                    v-show="isShowSearchBtn"
                    @click="showSearchPopover">
                    {{!queryBtnText ? $t("BUTTON_TEXT.SEARCH") : $t("BUTTON_TEXT.STATISTICS")}}
          </el-button>
          <!-- 搜索按钮 End -->
        </slot>
        <slot name="moreBtn"></slot>
      </div>
      <div v-if="showConfigureBtn" slot="configure">
         <el-popover
          placement="bottom-end"
          title="标题"
          width="200"
          trigger="click">
          <div>
            <el-checkbox-group v-model="configure.configureList">
                <template v-for="(item,index) in configure.configureOptions">
                  <el-row :key="index">
                    <el-checkbox :label="item.label"></el-checkbox>
                  </el-row>
                </template>
            </el-checkbox-group>
          </div>
          <i slot="reference" class="el-icon-setting" style="font-size:20px; cursor: pointer;"></i>
        </el-popover>
      </div>
      <!-- 搜索按钮插槽 End -->
      <!-- main 插槽 Start -->
      <div slot="main">
        <!-- 单条件查询组件 Start -->
        <simple-query :mate="mate" 
                      v-if="mateSearch && !mateSearch.multipleConditions" 
                      v-show="displayQueryModule" 
                      @queryData="queryData"></simple-query>
        <!-- 单条件查询组件 End -->
        <!-- 多条件查询组件 Start -->
        <multiple-query ref="multipleQueryForm" 
          v-bind="$attrs" 
          v-on="$listeners"
          :mate="mate"  
          :queryBtnText="queryBtnText" 
          :pageSize="querySize"
          :isResetBtn="isResetBtn"
          :tableCheckType="checkType" 
          v-if="mateSearch && mateSearch.multipleConditions" 
          v-show="displayQueryModule" 
          @queryData="queryData"
          @loading="handleLoading">
           <!-- 扩展按钮插槽 -->
          <span slot="extensionButton">
            <slot name="extensionBtn"></slot>
          </span>
        </multiple-query>
        <!-- 多条件查询组件 End -->
      </div>
      <!-- main 插槽 End -->
      <!-- 提示语插槽 Start -->
      <div slot="main" style="position: relative;">
        <slot name="tips"></slot>
      </div>
      <!-- 提示语插槽 End -->
    </boxer>
    <!-- 头部按钮组件 End -->
    <slot name='table'>
      <main-table ref="table" 
        v-bind="$attrs" 
        v-on="$listeners" 
        :loading="listLoading"
        :mate="mate" 
        :formModel="formModel"
        :mateList="mate.mateList" 
        :checkType="checkType"
        @action="handleActions" 
        @isSelected="handleSelected">
          <div slot="detailsHeader" slot-scope="action"><slot name="detailsHeaderSlot" :action="action"></slot></div>
        </main-table>
    </slot>
    <!-- 列表 table 组件 End -->
    <!-- 分页器组件 Start -->
    <pagination :mate="mate.mateList || mate.mateListLine" 
                :total="mate.mateList && mate.mateList.total" 
                :page.sync="page" 
                :size.sync="pageSize" 
                :background="background"
                @pagination="handlePagination"
                v-bind="$attrs" 
                v-on="$listeners"></pagination>
    <!-- 分页器组件 End -->

  </div>
</template>

<script scope>
import { API_GATEWAY } from '@/config/index.js';              // 引入环境变量
import QueryMixins from '../../mixins/QueryMixins';           // 引入搜索混合函数
import Boxer from '../Boxer.vue';                             // 引入头部按钮组件
import MultipleQuery from '../query/MultipleQueryForm';       // 引入多条件查询组件
import SimpleQuery from '../query/SimpleQueryForm';           // 引入单条件查询组件
import MainTable from './MainTable';                          // 引入列表组件
import Pagination from '../Pagination/Pagination';            // 引入分页器组件
import SERVICES from '../../services';                        // 引入服务模块
import { downFile } from '@/services/manage.js';              // 引入公共方法
import { BaseConstant } from '@/constant/BaseConstant';       // 引入常量配置

export default {
  // inheritAttrs: false,  // 默认值为true,true的意思是将父组件中除了props外的属性添加到子组件的根节点
  mixins: [QueryMixins],   // 混合语法
  components: {            // 注册逐渐
    Boxer,
    MultipleQuery,
    SimpleQuery,
    MainTable,
    Pagination
  },
  props: { // 父组件传参
    mate: Object,       // 基础数据
    mateSearch: Object, // 搜索数据
    queryBtnText: {     // 搜索按钮文字 boolean 于条件判断
      type:Boolean, 
      default: false
    },
    checkType: {  // 列表勾选类型渲染用
      type: String,
      default: ''
    },
    loading: {      // 列表 loading 动画
      type: Boolean,
      default: true
    },
    loadingTime: {  // loading 动画时间
      type: Number,
      default: () => 0.5
    },
    background: {
      type: Boolean,
      default: true
    },
    queryValues: { // 查询字段的值 (外部查询组件传进来)
      type: Object,
      default: () => { return {} }
    },
    isShowSearchBtn: {
      type: Boolean,
      default: true
    },
    showConfigureBtn: {
      type: Boolean,
      default: false
    },
    configure: {
      type: Object,
      default: () => { return {} }
    },
    querySize: {
      type: Number,
      default:10
    },
    isResetBtn:{
      type: Boolean,
      default: false
    },
    formModel: {
      type: String,
      default: "page" // page or dialog
    }
  },
  data () {
    return {
      multipleSelection: [],          // 勾选项
      hasSelected: false,             // 是否勾选
      searchValues: this.queryValues, // 查询数据
      page: 1,                        // 页数
      pageSize: 10,                   // 每页条数
      displayQueryModule: !this.isShowSearchBtn,      // 查询模块是否显示
      sortValues: {},                 // 排序数据
      uploadUrl: "",                  // 上传地址
      listLoading: this.loading,      // 页面 loading 动
      mimeType: BaseConstant.MIME_TYPE || {},
    }
  },
  computed: {},
  created () {
    // 数据初始化
    this.init();
  },
  mounted () {},
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init (){
      // 条数控制 默认为10
      this.pageSize = this.mate.mateList && this.mate.mateList.size || 15 ;
      this.page = this.mate.mateList && this.mate.mateList.page || 1;
      // loading 动画
      this.handleLoading();
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @return void
     */
    handleButtons (btn) {
      let _this = this;
      // 勾选行的 id 对象 isApi: 是否拼接id（true自动拼接）
      let rowId = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {};
      // 勾选行数组
      let multipleSelection = this.multipleSelection;
      // 当前按钮操作
      let action = btn.action;
      const btnEvents = {
        add: (btn, rowId) => this.handleCreate(btn),              // 新建
        update: (btn, rowId) => this.handleUpdate(btn, rowId),    // 修改/更新/编辑
        export: (btn, rowId) => this.handleExport(btn),           // 导出
        import: (btn, rowId) => this.handleImport(btn),           // 导入
        cancelRadio: (btn, rowId) => this.handleRadio(),          // 取消radio选择
        default: (btn, rowId) => this.$emit('btnClick', btn , rowId, multipleSelection)
      }
      return (btnEvents[action] || btnEvents.default)(btn, rowId);
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * 具有下拉选项的按钮
     * @param {Object} btn 当前点击的按钮配置信息
     * @return void
     */
    handleButtonsDropdown (btn) {
      let _this = this;
      // 勾选行的 id 对象 isApi: 是否拼接id（true自动拼接）
      let rowId = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {};
      // 勾选行数组
      let multipleSelection = this.multipleSelection;
      // 当前按钮操作
      let action = btn.action;
      const btnEvents = {
        default: (btn, rowId) => this.$emit('btnClick', btn , rowId, multipleSelection)
      }
      return (btnEvents[action] || btnEvents.default)(btn, rowId);
    },
    /**
     * actions 操作
     * 点击 action 根据按钮配置的 action 做对应操作
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    handleActions (act, row) {
      let action = act && act.action;
      const actions = {
        default: (act, row) => this.$emit('action', act , row)
      }
      return (actions[action] || actions.default)(act, row);
    },
     /**
     * actions 下拉选操作
     * 点击 action 根据按钮配置的 action 做对应操作
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    handleActionsSelect(act, row){
      let action = act && act.action;
      const actions = {
        default: (act, row) => this.$emit('actionSelect', act , row)
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 多选控制
     * @param {Boolean} bool 是否有勾选
     * @param {Array} selectedArr 勾选行数据数组
     * @return void
     */
    handleSelected (bool,selectedArr) {
      this.hasSelected = bool;
      this.multipleSelection = selectedArr;
      this.$emit('handleSelected',this.hasSelected,this.multipleSelection);
    },
    /**
     * 新建行
     * @param {Object} btn 按钮配置信息
     * @return void
    */
    handleCreate (btn) {
      if (this.formModel === "page") {
        this.$store.dispatch('Common/setRowId', '');
        this.$root.handleAction(btn, {}, () => {});
      }else if(this.formModel === "dialog"){
        this.$emit('btnClick', btn);
      }
    },
    /**
     * 头部按钮修改
     * 限制勾选一条数据
     * 判断勾选数据是否允许修改 通过 initOperations 设置
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} rowId 勾选行 id rowId.id
     * @return void
     */
    handleUpdate(btn, rowId) {
      let multipleSelection = this.multipleSelection;
      let rowt = rowId.id ? rowId : { id: multipleSelection.map(r => r.id) };
      if (multipleSelection.length !== 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t("seladata"), // 请选择一行数据
          type: "warning"
        });
        return;
      }
      if(!multipleSelection[0].enableEdit){ // 不能修改
        this.$message({
          message: this.$t("cannotChange"),
          type: "warning"
        });
        return
      }
      this.$store.dispatch('Common/setRowId', multipleSelection[0].id);
      this.$root.handleAction(btn, rowt, function() {});
    },
    /**
     * 导出整个列表 
     * 导出列表 可根据查询条件导出列表
     * 默认导出 xlsx 请求方法默认为 get 
     * 导出类型和方法可配置
     * @param {Object} btn 当前点击的按钮配置信息
     * @return void
     */
    handleExport (btn) {
      let { url, method } = btn;
      if (!url) {
        alert('导出功能尚未完成,请稍后再试。');
        return;
      }
      // TODO传参
      let params = this.searchValues || {};
      // 类型默认 xlsx
      let type = this.mimeType[btn.mimeType] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      downFile(url, params, method).then(res => {
        let blob = new Blob([res.data], {type: type});
        // new Blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.setAttribute('style', 'display:none');
        a.setAttribute('id', 'download');
        a.setAttribute('href', objectUrl);
        a.setAttribute('download', btn.fileName);
        // 防止反复添加a
        if (document.getElementById('download')) {
          document.body.removeChild(document.getElementById('download'));
        }
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(objectUrl);
        this.$message.success(this.$t('Successful operation'));
      }).catch(res => {
        this.$notify.error('导出失败，请联系管理员。');
      })
    },
    /** 导入处理
     * @param {Object} btn 按钮配置信息
     * @param {Object} row 行数据
     * @return void
     */
    handleImport(btn, row) {
      let url = this.uploadUrl || btn.url;
      let method = this.uploadMethod || "POST";
      this.$refs['table'].uploadBtnClick(url, method);
    },
    /** 取消 radio 选择
     * 取消单选列表的选中状态
     * @param void
     * @return void
     */
    handleRadio() {
      this.$refs['table'].cancelCurrentRow();
    },
    /**
     * 查询模块显示隐藏切换
     * @param void
     * @return void
     */
    showSearchPopover () {
      this.displayQueryModule = !this.displayQueryModule;
    },
    /**
     * 分页器控制 每页行数、第几页
     * @param {Object} pager 分页信息 size:每页行数、page: 第几页
     * @param {Boolean} changePage 是否点击第几页
     * @return void
     */
    handlePagination (pager, change) {
      this.pageSize = pager.size;
      this.page = pager.page;
      this.changePage = change;
      this.getData('paging');
    },
    /**
     * 获取查询数、分页数据
     * @param {String} flag 查询、分页、排序标识
     * @return void
     */
    getData (flag) {
      let url = this.mate.mateList.dataApi; // 分页查询接口 mongoDB 配置
      let config = this.mate.mateList.config
      let searchValues = this.searchValues || {};
      // 某些模块后台需要传分页参数 ifNeedPage
      if( config && config.ifNeedPage) searchValues.ifNeedPage = true;
      if( config && config.ifFromCustomer) searchValues.ifFromCustomer = true;
      // 查询后分页
      if (this.allowSearch && this.changePage) {
        // 分页参数 为兼容后台查询分页接口，多用一个pageNum1，pageSize1
        searchValues.pageNum1 = this.page;
        searchValues.pageSize1 = this.pageSize;
        searchValues.pageNum = this.page;
        searchValues.pageSize = this.pageSize;
        this._queryData(url, searchValues);
        return;
      }
      // 直接分页请求 为兼容后台查询分页接口，多用一个pageNum1，pageSize1
      searchValues.pageNum1 = this.page;
      searchValues.pageSize1 = this.pageSize;
      searchValues.pageNum = this.page;
      searchValues.pageSize = this.pageSize;
      // TODO 后期公共化优化 [this.mate.modules]
      if(this.$store && this.$store.state.RegistrationInfo['registrationId'] && this.$store.state.RegistrationInfo['registrationId'] !==''){
        searchValues.registrationId = this.$store.state.RegistrationInfo['registrationId'];
      }
      this._queryData(url, searchValues);
    },
    /**
     * 查询和分页请求接口 
     * 请求后刷新页面数据
     * @param {String} url 分页查询接口 this.mate.mateList.dataApi mongoDB 配置
     * @param {Object} searchValues 搜索字段数据
     * @return void
     */
    _queryData (url, searchValues){
      this.listLoading = true;
      SERVICES.BASE.paging(url, searchValues).then(res =>{
        if(!res.data.mate){ // 兼容调查问卷模块后台返回数据格式
          this.$emit('initQueryData', res.data);
        }else{ // 一般模块后台返回数据处理方法
          this.mate.mateList.rows = res.data.mate.rows;
          this.mate.mateList.total = res.data.mate.total;
          this.mate.mateList.size = res.data.mate.size;
          this.mate.mateList.page = res.data.mate.page;
          this.$emit('initOperations', this.mate.mateList.rows);
        }
        this.handleLoading();
      }).catch(res =>{
        // loading 动画
        this.handleLoading();
      })
    },
    /** 设置 listLoading 动画
     * @param {Boolean} resetPage 是否重置分页器
     * @return void
     */
    handleLoading(resetPage, page, size) {
      if (this.mate.mateList.rowClick) this.$emit('resetLineTable');
      // 点击查询的时候 传参进来 重置分页器
      if (resetPage){
        this.page = page || 1;
        this.pageSize = size || this.pageSize;
      }
      setTimeout(() => {
        this.listLoading = false;
      }, this.loadingTime * 1000)
    },
    /**
     * 刷新页面数据
     * @param {Object} data 需要刷新当前的数据
     * @return void
     */
    updateData (data) {
      if (data.mate.rows) {
        this.mate.rows = data.mate.rows
      }
      if (data.mate.total) {
        this.mate.total = data.mate.total
      } else {
        this.mate.total = 0
      }
      if (data.mate.selected) {
        this.mate.selected = data.mate.selected
      }
    }
  },
  watch: {
    // 监听 mate 数据 发生变化的时候做初始化
    mate: function (newMate) {
      this.listLoading = true;
      this.init();
    },
    configure: {
      handler(newValArr, oldValArr) {
        this.$emit('reSetColumns', newValArr)
      },
      deep: true
    }
  }
}
</script>
