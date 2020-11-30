<!-- created by zhongxiaolong on 2020/02/06 -->
<!-- 各部门人员填写明细 DepartmentDetails -->
<template>
  <div>
    <!-- 列表 Start -->
    <k-table-list
      ref="listTable"
      :mate="mate"
      :mateSearch="mate.mateSearch"
      :isIndex="isIndex"
      @initQueryData="convertData"
      @btnClick="handleButtons"
      @action="handleActions"
      :checkType="'noCheck'"
    ></k-table-list>
    <!-- 列表 End -->
  </div>
</template>
<script>
import SERVICES from "@/services";
import { API_GATEWAY } from "@/config/index.js";
import axios from "@/utils/http";

export default {
  components: {
    KTableList: function index(resolve) {
      require(["@/components/table/KTableList.vue"], resolve);
    }
  },
  props: {
    mate: Object
  },
  data() {
    return {
      isIndex: true, // Table 是否渲染序号列
      rowStatus: null, // 列表订单行状态
      multipleSelection: [], // 勾选项数组
      listUrl: "/question/app/report/list", // 列表/查询/分页 接口
      listExport: "/question/app/report/export/dept/detail", // 导出列表接口
      listExportEach: "/question/app/report/export/one/person" // 导出列表一人一档接口
    };
  },
  computed: {
    multipleSelectionLength: function() {
      return this.multipleSelection.length;
    }
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init() {
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
    handleButtons(btn, rowId, selection) {
      // 勾选行数据
      this.multipleSelection = selection;
      // 当前操作
      let action = btn.action;
      // 行 id 对象
      const rowIds = rowId.id ? rowId : { id: selection.map(r => r.id) };
      const btnEvents = {
        refresh: (btn, rowIds) => this.handleRefresh(btn, rowIds), // 刷新页面
        exportReport: (btn, rowIds) => this.handleExport(btn, rowIds), // 导出
        exportEach: (btn, rowIds) => this.handleExportEach(btn, rowIds), // 导出一人一档
        default: () => {
          return;
        }
      };
      return (btnEvents[action] || btnEvents.default)(btn, rowIds);
    },
    /**
     * actions 操作
     * 点击 action 根据按钮配置的 action 做对应操作
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return {Function} 执行操作的方法
     */
    handleActions(act, row) {
      let action = act && act.action;
      const actions = {
        default: () => {
          return;
        }
      };
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
      this.$refs["listTable"].handleLoading(true);
    },
    /**
     * 导出列表
     * @param void
     * @return void
     */
    handleExport() {
      let url = `${API_GATEWAY}${this.listExport}`;
      let methods = "GET";
      SERVICES.BASE.downTemplateExcel(url, methods, "各部门人员明细报表");
    },
    /**
     * 导出列表一人一档
     * @param void
     * @return void
     */
    handleExportEach() {
      let url = `${API_GATEWAY}${this.listExportEach}`;
      let methods = "GET";
      SERVICES.BASE.downTemplateExcel(url, methods, "各部门人员一人一档明细报表", "zip");
    },
    /** 获取列表
     * @param void
     * @return void
     */
    getList() {
      let url = `${API_GATEWAY}${this.listUrl}`;
      axios.post(url, {}).then(res => {
        if (res.status === 200 && !!res.data) {
          let { total, ...resData } = res.data;
          let rows = res.data.list;
          let page = res.data.pageNum;
          let size = res.data.pageSize;
          let dataApi = url;
          this.mate.mateList = { ...this.mate.mateList, size, page, total, rows, dataApi };
        }
      });
    },
    /**
     * 数据转换
     * 后台返回数据结构不统一做数据转换处理
     * @param {Object} data 数据
     * @return void
     */
    convertData({ pageSize, total, pageNum, list, ...resData }) {
      let rows = list;
      let page = pageNum;
      let size = pageSize;
      this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
    }
  },
  watch: {
    mate: function(newMate) {
      this.init();
    }
  }
};
</script>
<style scoped></style>
