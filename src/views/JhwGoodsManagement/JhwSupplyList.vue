<!-- created by hezhiqiang on 2020/06/20 -->
<!-- 供货列表 -->
<template>
  <div>
    <!-- headTable Start -->
    <KTableList
      :mate="mate"
      :mateSearch="mate.mateSearch"
      @btnClick="handleButtons"
      ref="listTable"
      :isIndex="isIndex"
      :isShowSearchBtn="isShowSearchBtn"
      :querySize="querySize"
      :formModel="formModel"
      @initQueryData="convertData"
    />
    <!-- headTable END -->
    <!-- 导入/上传文件 -->
    <input type="file" ref="excelFile" style="display:none" @change="fileUpload" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
  </div>
</template>
<script>
import { LANGS } from '../../i18n/lang';
import KTableList from '@/components/table/KTableList'
import MainTable from '@/components/table/MainTable'
import DynamicForm from '@/components/form/DynamicForm'
import SERVICES from '@/services'

export default {
  components: {
    KTableList,
    MainTable,
    DynamicForm,
    HBtn: function index(resolve){
      require(["@/components/Button/HBtn.vue"], resolve);
    },
  },
  data(){
    return {
      isIndex: true,               // table是否渲染序号
      showDetailTable: false,      // 是否渲染明细行表格
      headRowId: '',               // 头行id
      showSubmitButton: true,      // 提交按钮是否显示
      selectedLines: [],           // 勾选明细行
      isShowSearchBtn: false,      // 是否显示搜索展开按钮
      multipleSelection: [],       // 勾选头部列表获取数据               
      querySize: 15,                // 查询每页 size
      page: 1,
      formModel: 'page',           // page dialog
      isHiddenResetBtn: false,     // 是否隐藏搜索重置按钮
      costState: '',               // 判断实报实销是否已存在
      lineId: '',                  // 行id
      params: '?listName=jhw_supply_list&listFormName=jhw_supply_form&lineList=jhw_supply_line_list&lineForm=jhw_supply_line_form', // 元数据表名
      listUrl: '/common/toList',  // 元数据接口
      deleteUrl: '',              // 删除接口
      isEdit: false,              // 当前是否在编辑
      isMaintain: false,          // 是否是维护操作
      importUrl: '',              // 导入接口地址
    }
  },
  props: {
    mate: Object
  },
  created (){
    this.init();
  },
  mounted () {

  },
  watch: {
    mate: {
      handler(newMate, oldMate) {
      　 this.init();
  　　},
  　　immediate: true
    }
  },
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init () {
      // 获取列表数据
      this.getListData();
      // 获取商品分类
      this.getGoodsCategory();
      // 获取客户仓库
      this.getCustomerWarehouse();
    },
    /**
     * 获取列表数据
     */
    getListData () {
      const param = {
        ifNeedPage: true
      };
      SERVICES.JHW_SUPPLY.getList(param).then(res => {
        const data = res.data.data; // TODO 注意返回层级关系
        let { total, ...resData } = data;
        let rows = data.list;
        let page = data.pageNum;
        let size = data.size;
        this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
      })
    },
    /**
     * 数据转换
     * 后台返回数据结构不统一做数据转换处理
     * @param {Object} data 数据
     * @return void
     * 
     */
    convertData(data) {
      let { pageSize, total, pageNum, list, ...resData } = data.data
      let rows = list;
      let page = pageNum;
      let size = pageSize;
      this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
    },
    /**
     * 获取商品分类
     */
    getGoodsCategory () {
      SERVICES.JHW_SUPPLY.getGoodsCategory().then(res => {
        let data = res.data.data.list;
        let cateGory = [];
        if (data.length > 0) {
          data.forEach(item => {
            cateGory.push({
              label: item.name,
              value: item.name,
              key: item.id,
            })
          })
          // 商品分类数据保存到搜索表单配置中
          let Obj = this.mate.mateSearch.fields.find(item => item.name === "commodityCategory")
          Obj.options = cateGory
        }
      })
    },
    /** 获取客户仓库
     * @param void
     * @return void
     ** 
     */
    getCustomerWarehouse () {
      SERVICES.JHW_SUPPLY.getWarehouse().then(res => {
        let data = res.data.data;
        let warehouseOptions = [];
        if (data.length > 0) {
          data.forEach(item => {
            warehouseOptions.push({
              'label': item.warehouseName,
              'value': item.warehouseId,
              'key': item.warehouseId,
            })
          });
        };
        let warehouseObj = this.mate.mateSearch.fields.find(item => item.name==="warehouse") || {};
        warehouseObj.options = warehouseOptions;
      })
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @param {Array} selection 勾选行数据
     * @return void
     */
    handleButtons (btn, rowId, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const rowIds = (rowId && rowId.id) ? rowId : { id: selection && selection.map(r => r.id) };
      const btnEvents = {
        editDetail: () => this.updateDetail(btn,rowId),    // 修改
        delete: (btn) => this.handleDelete(btn,rowIds),   // 删除
        downloadTemplate: (btn) => this.handleDownload(btn,rowIds),   // 下载模板
        importSupply: (btn) => this.handleImport(btn,rowIds),   // 导入
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, rowId);
    },
    /** 下载模板 
     * @param void
     * @return void
     */
    handleDownload(btn) {
      // 下载模板接口
      let url = btn.url;
      // 下载模板命名
      let fileName = '供货列表模板';
      // 下载模板接口方法
      let methods = 'GET';
      // 下载模板
      SERVICES.BASE.downTemplateExcel(url, methods, fileName);
    },
    /** 导入行数据
     * @param void
     * @return void
     */
    handleImport(btn) {
      this.$refs.excelFile.click();
      this.importUrl = btn.url;
    },
    fileUpload(file) {
      // 导入模板接口
      let url = this.importUrl;
      // 下载模板接口方法
      let methods = 'POST';
      // 导入数据
      let formdata = new FormData();
      formdata.append('file', file.target.files[0]);
      SERVICES.BASE.uploadTemplateExcel(url, methods, formdata, this.uploadSuccess);
    },
    uploadSuccess(res){
      this.$refs.excelFile.value = '';
      this.getListData();
    },
    /**
     * 修改
     * @param {Object} act 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    updateDetail(act, id){
      this.$store.dispatch('Common/setRowId', this.multipleSelection[0].id);
      this.$root.monitor({ url: act.url})
    },
    /**
     * 删除
     *  @param {Object} btn 当前点击按钮配置
     *  @param {Object} ids 当前勾选id对象
     */
    handleDelete(btn,ids){
      let _this = this
      // if(this.multipleSelection.length > 1) {
      //   this.$message.warning("请选择一条数据进行删除");
      //   return
      // }
      SERVICES.JHW_SUPPLY.deleteDetail(ids.id).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            message: res.data.message,
            type: 'success'
          });
          this.reRenderList();
        } else {
          this.$message({
            message: res.data.message,
            type: 'warning'
          });
        }
      })
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
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
     /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: `${this.listUrl}${this.params}` });
      this.getListData()
    }
  }
}
</script>
