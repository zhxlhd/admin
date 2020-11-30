<!-- created by zhongxiaolong on 2020/02/25 -->
<!-- 发运通知 SupplierPortalAsnDblTable -->
<template>
  <div>
    <k-table-list ref="listTable"
      :mate="mate" 
      :mateSearch="mate.mateSearch" 
      :isIndex="isIndex" 
      :page="page"
      :size="size"
      :isShowSearchBtn="isShowSearchBtn"
      :isResetBtn="isHiddenResetBtn"
      :pageSizes="pageSizes"
      @btnClick="handleButtons" 
      @rowClick="handleRowClick" 
      @action="handleActions" 
      @initOperations="initOperations"
      @resetLineTable="lineTableFlag=false"></k-table-list>
    <!-- 底部 lineList Start -->
    <!-- 配置 MainTable 不渲染勾选列配置的是 checkType -->
    <main-table ref="lineTable" 
      v-if="lineTableFlag" 
      :mateList="lineList" 
      @action="handleActions" 
      :checkType="'noCheck'"></main-table>
    <!-- 底部 lineList End -->
    <!-- 查看详情 Start -->
    <el-dialog title="查看详情" :visible.sync="dialogVisible" v-if="mate.mateFormerHeader" width="80%">
      <el-row>
        <el-row>
          <DialogForm :mate="mate.mateFormerHeader" formModel="dialog"></DialogForm>
        </el-row>
        <el-row>
          <template>
            <el-table max-height="300" size="mini" :data="mate.mateList.lineRows" border style="width: 100%;" class="detailTable">
              <el-table-column show-overflow-tooltip :formatter="col.formatter" v-for="(col,index) of mate.mateList.lineColumns" :key="index" :label="col.label" :prop="col.name"></el-table-column>
            </el-table>
          </template>
        </el-row>
      </el-row>
    </el-dialog>
    <!-- 查看详情 End -->
  </div>
</template>
<script>
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {API_GATEWAY} from '@/config/index.js';
import SERVICES from '@/services';
import { dateFormatter } from "@/utils/DateUtils";

export default {
  components: {
    KTableList: function index(resolve) {
      require(["@/components/table/KTableList.vue"], resolve);
    },
    MainTable: function index(resolve) {
      require(["@/components/table/MainTable.vue"], resolve);
    },
		DialogForm: function index(resolve) {
			require(['@/components/DialogForm.vue'], resolve)
    },
		MaterielLabelPrint: function index(resolve) {
			require(['@/components/MaterielLabelPrint.vue'], resolve)
		},
  },
  props: {
    mate: Object
  },
  data(){
    return {
      isIndex: false,                    // Table 是否渲染序号列
      lineTableFlag: false,              // 行Table 是否渲染
      dialogVisible: false,              // 查看详情
      multipleSelection: [],             // 勾选项数组
      page: 1,
      size: 5,
      pageSizes: [5,10,15,20,30],        // 自定义分页器分页条数
			lineList: {                        // 行列表
				columns: [],
				action: [],
				btns: [],
				rows: [],
				lineRows: []
      },
      isShowSearchBtn: false,       // 是否显示搜索展开按钮
      isHiddenResetBtn: false,       // 是否隐藏搜索重置按钮
		}
  },
  computed: {
		multipleSelectionLength: function () {
			return this.multipleSelection.length;
    }
  },
  created (){},
  mounted (){},
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init () {
      this.lineTableFlag = false;
			this.lineList.columns = this.mate.mateList.lineColumns;
      this.mate.mateList.rowClick = true; // 允许单击列表行请求行数据
      // 预计送货时间至至默认当前日期
      let date = new Date();
      let mateSearchValues = this.mate.mateSearch.values;
      let endDate = mateSearchValues.endDate || '';
      let startDate = dateFormatter("YYYY-MM-DD", date.getTime() - 7 * 24 * 3600 * 1000);
      mateSearchValues.endDate = endDate || dateFormatter("YYYY-MM-DD");
      mateSearchValues.startDate = startDate;
      this.initOperations();
    },
    /**
     * 头部按钮控制
     * MongoDB配置 btns 元数据 
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} rowId 勾选行 id数据  rowId.id
     * @param {Array} selection 勾选行数据
     * @return {Function} 执行操作的方法
     */
    handleButtons (btn, rowId, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const rowIds = rowId.id ? rowId : { id: selection.map(r => r.asnCode) }; // TODO 以 ansCode 做为唯一标识
      const btnEvents = {
        cancelAsn: (btn, rowIds) => this.handleCancel(btn, rowIds), // 取消
        refreshAsn: (btn, rowIds) => this.handleRefresh(btn, rowIds), // 刷新
        exportAsn: (btn, rowIds) => this.handleExport(btn, rowIds), // 导出
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, rowIds);
    },
    /** 取消按钮
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    handleCancel(btn, rowIds) {
      const _this = this;
      if (this.multipleSelection.length !== 1) {
          this.$message({
              message: this.$t('seladata'),
              type: 'warning'
          })
          return
      }
      let rowLine = this.multipleSelection;
      if(rowLine.processStatusCode && rowLine.processStatusCode == 'ERROR'){
        this.$message({
            message: '该记录暂未生成，不可取消',
            type: 'warning'
        })
        return
      }
      this.$confirm(this.$t('confirmAsn'), this.$t('toast.prompt'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
      }).then(() => {
          let data = {
            shipmentHeaderId: rowLine[0].shipmentHeaderId,
            asnCode: rowLine[0].asnCode,
            orgId: rowLine[0].orgId,
            state: 0
          }
          axios.put(btn.url, data).then(res =>{
            if (res.data.state === 200){
              _this.$notify({
                title: '提示',
                message: res.data.message
              });
              _this.$root.monitor({ url: "/supplier-portal/asn/head/list" });
            }else{
              _this.$message({
                type: 'warning',
                message: res.data.message,
              });
            }
          }).catch(err =>{})
      }).catch(() => {
          this.$message({
              type: 'info',
              message: this.$t('cancelConfirm')
          })
      })
    },
    /** 刷新按钮
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    handleRefresh(btn, rowIds) {
      const _this = this;
      _this.$refs['listTable'].listLoading = true;
      axios.get(btn.url).then(res =>{
        _this.page = res.data.mate.mateList.page;
        _this.size = res.data.mate.mateList.size;
        _this.mate.mateList.rows = res.data.mate.mateList.rows;
        _this.mate.mateList.total = res.data.mate.mateList.total;
        let bool = true;
        _this.$refs['listTable'].handleLoading(bool, _this.page, _this.size);
      })
    },
    /** 导出按钮
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    handleExport(btn, rowIds) {
      let [url, methods, fileName, type, data] = [ btn.url, 'POST', '送货通知信息', 'xlsx', rowIds.id];
      SERVICES.BASE.downTemplateExcel(url, methods, fileName, type, data);
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
        showAsn: (act, row) => this.handleDetails(act, row), // 详情
        printerAsn: (act, row) => this.handlePrint(act, row),// 打印
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /** 查看详情
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    handleDetails(act, row) {
      this.mate.mateFormerHeader.values = row;
      //查看asn只展示机构、asn号、客户、预约送货时间、预约到达时间
      // this.mate.mateFormerHeader.fields.splice(6, 19);
      this.handleRowClick(row, act);
      this.dialogVisible = true
    },
    /** 打印 */
    handlePrint(act, row) {
      // 打印接口请求地址和传参
      if(row.cancelStatus === '已取消') return
      let url = `${act.url}?reportName=asn_report&ID=${row.shipmentHeaderId}`;
      SERVICES.BASE.handlePrinter(url).then(ren =>{}).catch(err =>{});
    },
    /**
     * 请求当前操作行的查看详情中的列表行数据
     * 获取数据后渲染详情列表行
     * @param {Object} row 当前操作行的行数据
     * @param {Object} act 按钮配置信息
     * @return void
     */
    handleRowClick (row, act) {
      let id = row.shipmentHeaderId;
      // 获取行数据
      this.getLines(id);
    },
    /** 获取行数据 
     * @param {String} id 列表行 id
     * @return void
     */
    getLines (id) {
      let url = `${this.mate.mateList.url}?headId=${id}`;
      axios.get(url).then(res =>{
        let data = res.data;
        if (data && data.length){
          this.$set(this.mate.mateList, "lineRows", data);
          if (this.mate.mateList.rowClick) {
            // 显示 行Table
            this.lineTableFlag = true;
            // 刷新数据
            this.$set(this.lineList, 'rows', data);
          }
        }
      }).catch(err => { // TODO
        this.$set(this.mate.mateList, "lineRows", data);
        if (this.mate.mateList.rowClick) {
            // 显示 行Table
            this.lineTableFlag = true;
            // 刷新数据
            this.mate.mateListLine.rows = data;
          }
      })
    },
    /** 初始化行操作列按钮的状态
     * 只有对的状态才允许点击按钮
     * enableEdit 是否允许点击按钮 按钮是否禁用
     * ......可以对相关按钮进行初始化
     * @param void
     * @return void
     */
    initOperations() {
      let rows = this.mate.mateList.rows;
      if (!rows.length) return;
      else rows.forEach(item => {
        item.enableEdit = true;
      });
      rows.forEach(item =>{
        // 当状态等于已取消,不允许打印
        if (item.cancelStatus === "已取消"){
          item.enableEdit = false;
        }
      })
    },
  },
  watch: {
    mate: {
      handler(newMate, oldMate) {
      　 this.init();
  　　},
  　　immediate: true
    }
  }
}
</script>
