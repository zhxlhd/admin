<!-- created by zhongxiaolong on 2019/11/12 -->
<!-- 日产日清 ProductionDailySettlement -->
<template>
  <div>
    <k-table-list ref="listTable"
                  :mate="mate" 
                  :mateSearch="mate.mateSearch" 
                  :isIndex="isIndex" 
                  :isSearchValuesEmpty="isSearchValuesEmpty"
                  :queryBtnText="queryBtnText"
                  @initOperations="initOperations"
                  @btnClick="handleButtons" 
                  @rowClick="handleRowClick" 
                  @action="handleActions" 
                  @resetLineTable="lineTableFlag=false"></k-table-list>
    <!-- 底部 lineList Start -->
    <!-- 配置 MainTable 不渲染勾选列配置的是 checkType -->
    <main-table ref="lineTable" 
                v-if="lineTableFlag" 
                :mateList="mate.mateListLine" 
                @refreshLine="refreshLine" 
                @action="handleActions" 
                :checkType="'noCheck'"></main-table>
    <!-- 底部 lineList End -->
    <!-- 领料记录弹窗 Start -->
    <el-dialog title="领料记录" :visible.sync="dialogVisible" width="80%" center :showClose="showClose">
      <!-- 列表 Start -->
      <!-- 配置 KTableList 不渲染勾选列配置的是 checkType -->
      <k-table-list ref="dialogTable" 
                    v-if="recordData.mateList" 
                    :mate="recordData" 
                    :checkType="'noCheck'"></k-table-list>
      <div v-else style="margin: 20px; color: red;">列表请求失败，请联系管理员。</div>
      <!-- 列表 End -->
      <!-- 按钮组 Start -->
      <el-row type="flex" justify="center" style="margin-top: 10px;">
        <el-button size="mini" @click="dialogVisible = false">{{$t('BUTTON_TEXT.CLOSE')}}</el-button>
      </el-row>
      <!-- 按钮组 End -->
    </el-dialog>
    <!-- 领料记录弹窗 End -->
  </div>
</template>
<script>
import SERVICES from '@/services';
import { PRODUCTION_MANAGEMENT_API } from '@/services/apis';

export default {
  components: {
    KTableList: function index(resolve) {
      require(["@/components/table/KTableList.vue"], resolve);
    },
    MainTable: function index(resolve) {
      require(["@/components/table/MainTable.vue"], resolve);
    }
  },
  props: {
    mate: Object
  },
  data(){
    return {
      queryBtnText: true,                // 查询按钮文字
      isSearchValuesEmpty: false,        // 查询字段是否允许为空
      isIndex: false,                    // Table 是否渲染序号列
      lineTableFlag: false,              // 行Table 是否渲染
      dialogVisible: false,              // 领料记录弹窗是否显示
      showClose: false,                  // 领料记录弹窗是否显示
      rowStatus: null,                   // 列表订单行状态
      multipleSelection: [],             // 勾选项数组
      recordData:{
        mateList: null
      }
    }
  },
  computed: {
		multipleSelectionLength: function () {
			return this.multipleSelection.length;
    }
  },
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
      this.lineTableFlag = false;
      this.mate.mateListLine.btns = [];
      this.mate.mateList.rowClick = true; // 允许单击列表行请求行数据
      // 操作按钮初始化
      // this.initOperations(this.mate.mateList.rows);
      this.recordData["mateList"] = this.mate.mateOtherListLine;
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
      this.multipleSelection = selection;
      let action = btn.action;
      const rowIds = rowId.id ? rowId : { id: selection.map(r => r.id) };
      const btnEvents = {
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
        record: (act, row) => this.handleReord(act, row),
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /** 领料记录事件
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    handleReord(act, row){
      let {id,componentCode} = row;
      SERVICES.PRODUCTION_DAILY_SETTLEMENT.getRecord(id, componentCode).then(res =>{
        if(res.data && res.data.mate){
          let {rows, page, size, total} = res.data.mate.mate.mateOtherListLine;
          this.recordData.mateList = {...this.recordData.mateList,rows, page, size, total,};
        }
      })
      this.dialogVisible = true;
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
      SERVICES.BASE.getLines(url, id).then(res =>{
        let data = res.data.lineList;
        if (data && data.length){
          this.$set(this.mate.mateList, "lineRows", data);
          if (this.mate.mateList.rowClick) {
            // 显示 行Table
            this.lineTableFlag = true;
            // 操作按钮初始化
            this.initOperations(data);
            // 刷新数据
            this.mate.mateListLine.rows = data;
          }
        }
      }).catch(err => { // TODO
        // 操作按钮初始化
        this.initOperations(data);
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
     * 只有加工单在生效状态操作行才渲染并且有上传图片按钮
     * enableEdit 按钮是否禁用
     * hiddened 按钮是否渲染
     * ......可以对相关按钮进行初始化
     * @param {Array} rows 列表行数据
     * @return void
     */
    initOperations(rows) {
      if (!rows.length) return;
      else rows.forEach(item => {
        this.$set(item, 'hiddened', true);
      });
      rows.forEach(item =>{
        // 当状态不等于新建,不允许编辑修改
        if ( (item.nissanNissanFlag && item.nissanNissanFlag === "1") || 
        ((item.excessCount != undefined) && (item.excessCount === 0))){
          item.hiddened = false;
        }
        
      })
    },

    /** 刷新订单行数据
     * 操作过上传图片按钮后刷新加工单行列表数据
     * @param {Object} row 加工单行数据
     * @return void
     */
    refreshLine(row) {
      // 保存行的父级加工单的 id
      let id = row.processingOrderId;
      // 获取加工单下行数据
      this.getLines(id)
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: PRODUCTION_MANAGEMENT_API.PRODUCTION_DAILY_SETTLEMENT_MAIN_LIST });
    },
  },
  watch: {
    mate: function (newMate) {
      this.init();
    }
  }
}
</script>
