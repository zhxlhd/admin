<!-- created by zhongxiaolong on 2020/02/12 -->
<!-- 行程信息 TravelInformation -->
<template>
  <div>
    <!-- 列表 Start -->
    <k-table-list ref="listTable" 
                  :mate="mate" 
                  :mateSearch="mate.mateSearch" 
                  :isIndex="isIndex" 
                  @initQueryData="convertData"
                  @btnClick="handleButtons" 
                  @action="handleActions"
                  :checkType="'noCheck'"></k-table-list>
    <!-- 列表 End -->
  </div>
</template>
<script>
import SERVICES from '@/services';
import { API_GATEWAY } from '@/config/index.js';
import axios from '@/utils/http';

export default {
  components: {
    KTableList: function index(resolve) {
      require(["@/components/table/KTableList.vue"], resolve);
    }
  },
  props: {
    mate: Object
  },
  data(){
    return {
      isIndex: true,                     // Table 是否渲染序号列
      rowStatus: null,                   // 列表订单行状态
      multilevelTable: true,             // 多级表头表格
      multipleSelection: [],             // 勾选项数组
      dialogVisible: false,
      listUrl: '/question/app/report/personal/itinerary/list', // 列表/查询/分页接口
      exportUrl: '/question/app/report/export/personal/itinerary' // 导出接口
    }
  },
  computed: {},
  created (){
    this.init();
  },
  mounted (){},
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init () {
      this.getList();
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} rowId 勾选行 id数据  rowId.id
     * @param {Array} selection 勾选行数据
     * @return {Function} 执行操作的方法
     */
    handleButtons (btn, rowId, selection) {
      // 勾选行数据
      this.multipleSelection = selection;
      // 当前操作
      let action = btn.action;
      // 行 id 对象
      const rowIds = rowId.id ? rowId : { id: selection.map(r => r.id) };
      const btnEvents = {
        refresh: (btn, rowIds) => this.handleRefresh(btn, rowIds), // 刷新页面
        exportReport: (btn, rowIds) => this.handleExport(btn, rowIds),   // 导出
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
     */
    handleActions (act, row) {
      let action = act && act.action;
      const actions = {
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /** 刷新列表按钮
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    handleRefresh(btn, ids) {
      this.getList();
      this.$refs['listTable'].listLoading = true;
      this.$refs['listTable'].handleLoading(true);
    },
    dialogBeforeClose(){
      this.dialogVisible = false;
    },
    /**
     * 导出列表
     */
    handleExport(){
      let { dept2, userNo, uName } = this.mate.mateSearch.values;
      let url = `${API_GATEWAY}${this.exportUrl}?dept2=${dept2}&userNo=${userNo}&uName=${uName}`;
      let methods = 'GET';
      SERVICES.BASE.downTemplateExcel(url, methods, '参与填写人员统计报表');
    },
    getList(){
      let _this = this;
      let url = `${API_GATEWAY}${this.listUrl}`;
      axios.post(url,{}).then(res =>{
        if(res.status === 200 && !!res.data){
          let { total, ...resData } = res.data;
          let rows = res.data.list;
          let page = res.data.pageNum;
          let size = res.data.pageSize;
          let dataApi = url;
          _this.mate.mateList = { ..._this.mate.mateList, size, page, total, rows, dataApi };
        }
      })
    },
    /**
     * 数据转换 
     * 后台返回数据结构不统一做数据转换处理
     * @param {Object} data 数据
     * @return void
     */
    convertData({ pageSize, total, pageNum, list, ...resData}) {
      let rows = list;
      let page = pageNum;
      let size = pageSize;
      this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
    }
  },
  watch: {
    mate: function (newMate) {
      this.init();
    }
  }
}
</script>
<style scoped>
</style>
