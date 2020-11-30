<!-- created by zhongxiaolong on 2020/05/28 -->
<!-- 报表导出记录 ReportExportRecordList -->
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
      :checkType="'noCheck'"
      :rowClickSelected="rowClickSelected"
      @initOperations="initOperations"
      @initQueryData="convertData"
      @btnClick="handleButtons" 
      @action="handleActions"
    ></k-table-list>
  </div>
</template>

<script>
import { LANGS } from '../../i18n/lang';
import KTableList from '@/components/table/KTableList';
import { postAction } from '@/services/manage.js';

export default {
  components:{
    KTableList
  },
  props: {
    mate: Object
  },
  data () {
    return {
      isIndex: true,                     // Table 是否渲染序号列
      isIndexDialog: true,               // 详情 Dialog Table 是否渲染序号列
      multipleSelection: [],             // 勾选项数组
      word: true,                        // 按钮是否显示文字
      formModel: "dialog",               // 表单模式
      rowClickSelected: true,            // 列表点击行勾选中
      langs: LANGS,                      // 当前语言
      isNeedPage: true,                  // 请求列表数据是否需要分页
      pageNum: 1,                        // 默认第几页
      pageSize: 10,                      // 默认每页条数/查询默认每页条数
      pid: '',                           // 父级 id
      url:{
        meta: '/common/toList',          // 元数据接口
        list: '/purchase/report/record/search',  // 列表数据 查询分页
      },
      refresh: false                     //是否是刷新操作
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
      // 获取列表数据
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
        refresh: (btn, rowIds) => this.handleRefresh(btn, rowIds),             // 刷新列表
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
        customDetail: (act, row) => this.handleDetails(act, row),  // 打印
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /** 刷新列表
     * @param {Object} btn 按钮配置
     * @param {Array} rowIds 当按钮为行数据/头部按钮为勾选行 id 数组
     * @return void
     ** Author: zhongxiaolong
    */
    handleRefresh(btn, rowIds) {
      this.refresh = true;
      this.loadData();
    },
    /**
     * 查看详情
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    handleDetails(act, row, fromAdd) {
      
    },
    /** 获取列表数据
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    loadData() {
      const { url, mate, pageNum, pageSize, isNeedPage } = this;
      postAction(url.list, { isNeedPage, pageNum, pageSize }).then( res =>{
        if (res.data.status && !!res.data.data) {
          const data = res.data.data;
          let { total, ...resData } = data;
          let rows = data.list;
          let page = data.pageNum;
          let size = data.pageSize;
          mate.mateList = { ...mate.mateList, size, page, total, rows };
          if(this.refresh) {
            this.$message.success('操作成功');
            this.refresh = false;
          }
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
</style>
