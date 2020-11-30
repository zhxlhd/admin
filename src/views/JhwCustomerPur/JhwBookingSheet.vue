<!-- created by fengjing on 2020/05/20 -->
<!-- 预订单 供应商-->
<template>
  <div>
    <!-- headTable Start -->
    <KTableList
      :mate="mate"
      :mateSearch="mate.mateSearch"
      @btnClick="handleButtons"
      @action="handleActions"
      ref="listTable"
      :isIndex="isIndex"
      :isShowSearchBtn="isShowSearchBtn"
      :querySize="querySize"
      :formModel="formModel"
      :queryValues="prePruchaseValues" 
      @rowClick="rowClick"
      @initOperations="initOperations"
      @initQueryData="convertData"
      @resetLineTable="showDetailTable=false"
    />
    <!-- headTable END -->
    <!-- detailTable Start -->
    <KTableLine
      v-if="showDetailTable"
      :mate="mate.mateListLine"
      @action="handleDetailActions"
      :stripe="false"
      :checkType="'noCheck'"
    />
    <!-- detail End -->
    <!--查看附件-->
    <el-dialog :visible.sync="filesDialog" width="80%" title="查看附件">
      <el-row>
        <el-table :data="fileList"  max-height="300" border align="center" size="mini" ref="multipleTable"  show-overflow-tooltip  style="width: 100%" >
          <el-table-column show-overflow-tooltip label="序号"  prop="lineNo"></el-table-column>
          <el-table-column show-overflow-tooltip label="名字"  prop="fileName"></el-table-column>
          <el-table-column show-overflow-tooltip label="操作">
            <template slot-scope="scope">
              <el-button size="mini"  type="primary" @click="viewFile(scope.row.fileUrl)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { LANGS } from '../../i18n/lang';
import KTableList from '@/components/table/KTableList'
import KTableLine from '@/components/table/KTableLine'
import MainTable from '@/components/table/MainTable'
import DynamicForm from '@/components/form/DynamicForm'
import SERVICES from '@/services'

export default {
  components: {
    KTableList,
    KTableLine,
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
      querySize: 10,                // 查询每页 size
      page: 1,
      pageSize: 10,
      prePruchaseValues: {
        ifNeedPage: true,
        ifFromSupplier: true
      },
      formModel: 'page',           // page dialog
      isHiddenResetBtn: false,     // 是否隐藏搜索重置按钮
      costState: '',               // 判断实报实销是否已存在
      lineId: '',                  // 行id
      params: '?listName=jhw_booking_sheet_list&lineList=jhw_booking_sheet_list_line&listFormName=jhw_booking_sheet_form', // 元数据表名
      listUrl: '/common/toList',  // 元数据接口
      deleteUrl: '',              // 删除接口
      isEdit: false,              // 当前是否在编辑
      isMaintain: false,          // 是否是维护操作
      fileList: [],
      filesDialog: false
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
      this.showDetailTable = false;
      this.mate.mateList.rowClick = true;   // 允许单击列表行请求行数据
      this.mate.mateSearch.values.ifFromSupplier = true
      this.mate.mateSearch.values.ifNeedPage = true
      // 获取列表数据
      this.getListData();
    },
    /**
     * 获取列表数据
     */
    getListData () {
      const param = {
        ifNeedPage: true,
        ifFromSupplier: true
      };
      SERVICES.JHW_BOOKING_SHEET.getList(param).then(res => {
        const data = res.data.data; // TODO 注意返回层级关系
        let total = data.total
        let rows = data.list;
        let page = data.pageNum;
        let size = data.size;
        let pageSize = data.size
        // 如果没有行返回
        rows.forEach(item => {
          item.enableEdit = true;
        });
        rows.forEach(item => {
          let state = item.state;
          //  确认中  供应商才能修改
          if(state !== '2'){
            item.enableEdit = false;
          }
        });
        this.mate.mateList = { ...this.mate.mateList,size, pageSize, page, total, rows};
      })
    },
    /**
     * 数据转换 
     * 后台返回数据结构不统一做数据转换处理
     * @param {Object} data 数据
     * @return void
     */
    convertData({ pageSize, total, pageNum, list, ...resData}) {
      let rows = resData.data.list;
      let page = resData.data.pageNum;
      let size = resData.data.pageSize;
      total = resData.data.total;
       // 如果没有行返回
      rows.forEach(item => {
        item.enableEdit = true;
      });
      rows.forEach(item => {
        let state = item.state;
        //  确认中  供应商才能修改
        if(state !== '2'){
          item.enableEdit = false;
        }
      });
      this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
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
        sure: () => this.handleSure(btn,rowIds), //确认
        updateDetail: () => this.updateSheet(btn,rowIds), // 修改
        exportSheet: () => this.handleExport(btn,rowIds), //导出
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, rowIds);
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
     handleDetailActions(act, row) {
      let action = act.action;
      let rowId = { id: [row.id] };
      const btnEvents = {
        // 查看附件
        showFile: (act,row) => this.handleShowFile(act,row.files),
        // 默认
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(act, row);
    },
    /**
     * 展开明细行列表，并获取对应明细行数据
     * @param {Object} 当前点击行 id
     * @return void
     */
    rowClick (row) {
      this.mate.mateFormerHeader.values = row
      this.headRowId = row.id
      // 渲染明细行表格
      this.showDetailTable = true
      this.mate.mateListLine.actions = [
        {
          "action" : "showFile",
          "label" : "查看附件",
          "isApi" : false,
          "useId" : 0,
          "url" : "",
          "method" : "PUT"
        }
      ]
      this.mate.mateListLine.btns = []
      // 获取明细行数据
      this.getDetailList();
    },
    /**
     * 获取明细行数据
     * @param {object} 点击行的 id数据
     * @return void
     */
    getDetailList () {
      SERVICES.JHW_BOOKING_SHEET.getDetailList(this.headRowId).then((res) => {
        let data = res.data.data
        if (data.length) { 
          data.forEach(item=>{
            if(item.confirmQuantity){
              if(item.confirmQuantity !== item.quantity){
                item.isRowEdit = true
              }
            }
            if(item.confirmedDeliveryDate){
              if(item.confirmedDeliveryDate !== this.mate.mateFormerHeader.values.deliverDate) {
                item.isRowEdit = true
              }
            }
          })
          this.$set(this.mate.mateList, "lineRows", data);
          this.mate.mateListLine.rows = data
        }
      })
    },
    /**
     * 确认
     *  @param {Object} btn 当前点击按钮配置
     *  @param {Object} ids 当前勾选id对象
     */
    handleSure(btn,ids){
      let _this = this
      // 检查勾选项是否都是 确认中状态 才能推送确认
      let isAllow = this.multipleSelection.every(item => {
        return  item.state === '2';
      });
      let url = '/agriculture' + btn.url + '&ids=' + ids.id.join(',')
      if(isAllow){
        this.$root.ajaxData(url, {}, function (data) {
          if(data.code === 400){
            _this.$message.warning(data.message);
            return
          } else {
             _this.reRenderList();
             _this.$message.success('操作成功');
          }
        }, 'GET')
      } else {
        this.$message.warning("请选择状态为确认中状态的预订单进行确认");
        return
      }
    },
    /**
     * 导出
     * @param {Object} btn 按钮配置信息
     */
    handleExport(btn){
      this.mate.mateSearch.values.ifFromSupplier = false
      let [url, methods, fileName, type, data] = [ btn.url, 'POST', '预订单清单', 'xlsx', this.mate.mateSearch.values];
      SERVICES.BASE.downTemplateExcel(url, methods, fileName, type, data);
    },
    /**
     * 修改
     * @param {Object} act 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     * 需要权限控制移至头部按钮 -- hzq
     */
    updateSheet(btn,rowIds){
      if (this.multipleSelection.length > 1) {
        this.$message.warning("请选择一条数据修改");
        return
      };
      if (this.multipleSelection[0].state !== '2') {
        this.$message.warning("请选择一条确认中的数据修改");
        return
      };
      this.$store.commit("JHWShopping/setCarId", rowIds.id[0])
      this.$store.commit("JHWShopping/setIsEdit", true)
      this.$root.monitor({ url: btn.url})
    },
     /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: `${this.listUrl}${this.params}` });
      this.getListData()
    },
    /** 初始化行操作列按钮的状态配置启用按钮 disabled 的状态
     * ......可以对相关按钮进行初始化
     * enableEdit 是否启用编辑
     * 默认启用编辑 通做行状态再修改启用状态
     * @param void
     * @return void
     ** Author: fengjing
     */
    initOperations() {
      let rows = this.mate.mateList.rows;
        // 如果没有行返回
      rows.forEach(item => {
        item.enableEdit = true;
      });
      rows.forEach(item => {
        let state = item.state;
        //  确认中  供应商才能修改
        if(state !== '2'){
          item.enableEdit = false;
        }
      });
    },
    /**
     * 查看附件
     * @param {Object} act
     * @param {String} files 行文件
     */
    handleShowFile(act,files){
      if(files) {
        var fileArray = new Array()
        // JSON.parse(_this.mate.mateFormerHeader.values.files)
        fileArray = JSON.parse(files)
        this.fileList = this.initLineData(fileArray)
        this.filesDialog = true
      } else {
        this.$message.warning("未上传附件");
      }
    },
    /**
     * 查看
     * @param {String} val 
     * 附件路径
     */
    viewFile(val){
      window.open(val)
    },
    /**
     * 初始化行数据
     * 添加索引 从 1 开始
     * 已实施状态赋值
     * @params {Object} data 行数据
     * @return {Object} data 行数据
     ** 
     */
    initLineData (data) {
      data.forEach((item,index) =>{
        // 设置索引 从 1 开始
        item.lineNo = index + 1;
      })
      return data;
    },
  }
}
</script>
