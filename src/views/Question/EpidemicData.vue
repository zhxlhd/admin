<!-- created by zhongxiaolong on 2020/02/29 -->
<!-- 疫情数据导入 EpidemicData -->
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
      :checkType="'noCheck'"></k-table-list>
    <!-- 列表 End -->
    <!-- 导入 -->
    <input 
      ref="excelFile"
      type="file" 
      style="display:none" 
      @change="fileUpload" 
      :accept="uploadType">
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
      uploadType: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
      listUrl: "/question/map/epidemicData/list", // 列表/查询/分页 接口
      importUrl: '/question/map/epidemicData/import', // 导入接口
      exportUrl: '/question/map/download/tpl', // 导入接口
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
      let action = btn.action;
      const btnEvents = {
        exportReport: (btn) => this.handleExport(btn),   // 导出
        importReport: (btn) => this.handleImport(btn),   // 导入
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn);
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
    /**
     * 下载导入模板
     */
    handleExport(btn){
      let url = `${API_GATEWAY}${this.exportUrl}`;
      let methods = 'GET';
      SERVICES.BASE.downTemplateExcel(url, methods, '疫情数据导入模板');
    },
    /**
     * 导入列表
     */
    handleImport(btn){
      this.$refs['excelFile'].click();
    },
    /**
     * 上传文件/导入模板excel 新增/编辑页面 导入行列表数据
     * 获取文件名称和后台所需参数 保存在 formData 中
     * 询问用户是否确认导入文件
     * 确认：调上传方法 uploadFile()
     * 取消：取消上传
     * @param {Object} file 上传文件参数
     * @return void
     */
    fileUpload(file) {
      let _this = this;
      let formData = new FormData();
      let fileData = file.target.files[0];
      let fileName = fileData.name || "所选文件";
      formData.append('file', fileData);
      this.uploadFile(formData);
    },
    uploadFile(data){
      let url = `${API_GATEWAY}${this.importUrl}`;
      let methods = "POST";
      SERVICES.BASE.uploadTemplateExcel(url, methods, data, this.clearUpload);
    },
    clearUpload(){
      this.$refs['excelFile'].value = '';
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
    mate: function (newMate) {
      this.init();
    }
  }
}
</script>
<style scoped>
</style>
