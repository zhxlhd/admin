<!-- created by zhongxiaolong on 2019/11/12 -->
<!-- 生产工单 ProductionWorkOrder -->
<template>
  <div>
    <!-- 列表 Start -->
    <k-table-list ref="listTable" 
                  :mate="mate" 
                  :mateSearch="mate.mateSearch" 
                  :isIndex="isIndex" 
                  @initOperations="initOperations"
                  @btnClick="handleButtons" 
                  @rowClick="handleRowClick" 
                  @action="handleActions"></k-table-list>
    <!-- 列表 End -->
  </div>
</template>
<script>
import SERVICES from '@/services';
import { PRODUCTION_MANAGEMENT_API } from "@/services/apis";

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
      multipleSelection: [],             // 勾选项数组
      rejectReasonDialogVisible: false,  // 驳回原因弹窗是否显示
      maxLength: 50,                     // 原因长度限制
      reasonData: {
        reason: ""
      },
      reasonRules: {
        reason: [
          { required: true, message: "该输入项为必输项", trigger: "blur" }
        ]
      },
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
      this.initOperations();
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
        delete: (btn, rowIds) => this.handleDelete(btn, rowIds),   // 删除
        submit: (btn, rowIds) => this.handleSubmit(btn, rowIds),   // 提交
        cancel: (btn, rowIds) => this.handleCancel(btn, rowIds),   // 取消
        finish: (btn, rowIds) => this.handleFinish(btn, rowIds),   // 完成
        close: (btn, rowIds) => this.handleClose(btn, rowIds),     // 关闭
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
        status: (act, row) => this.statusChange(act, row),    // 发放/暂停
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /** 删除按钮
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    handleDelete(btn, ids) {
      // 检查勾选项是否都是新建状态 才能删除
      let isAllow = this.multipleSelection.every(item => {
        return (item.status === "SAVE");
      });
      if (isAllow) {
        this.$root.handleAction(btn, ids, () => {
          this.reRenderList();
        });
      } else {
        this.$message({
          type: "warning",
          message: this.$t("TIPS_WARNING.CANNOT_BE_OPERATED") // 不能删除
        });
      }
    },
    /** 提交按钮
     * 提交后状态为未发放
     * 未发放 -> UNISSUED
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    handleSubmit(btn, ids) {
      let status = "UNISSUED";
      // 检查勾选项是否都是新增和驳回状态
      let isAllow = this.multipleSelection.every(item => item.status === "SAVE");
      if (isAllow) {
        this.handleStatus(status, ids.id);
      } else {
        this.$message({
          message: this.$t("TIPS_WARNING.CANNOT_BE_OPERATED"),
          type: "warning"
        });
      }
    },
    /** 取消按钮
     * 取消后状态为取消
     * 取消 -> CANCEL
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    handleCancel(btn, ids) {
      let status = "CANCEL";
      // 检查勾选项是否都不是新建状态
      let isAllow = this.multipleSelection.every(item => item.status !== "SAVE");
      if (isAllow) {
        this.handleStatus(status, ids.id)
      } else {
        this.$message({
          message: this.$t("TIPS_WARNING.CANNOT_BE_OPERATED"),
          type: "warning"
        });
      }
    },
    /** 完成按钮
     * 关闭后状态为完成
     * 完成 -> FINISHED
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    handleFinish(btn, ids) {
      let status = "FINISHED";
      // 不对关闭做控制 任何状态都允许关闭
      // 检查勾选项是否都是已发放状态
      let isAllow = this.multipleSelection.every(item => item.status === "ISSUED");
       if (isAllow) {
        this.handleStatus(status, ids.id)
       } else {
        this.$message({
          message: this.$t("TIPS_WARNING.CANNOT_BE_OPERATED"),
          type: "warning"
        });
      }
    },
    /** 关闭按钮
     * 关闭后状态为关闭
     * 关闭 -> CLOSE
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    handleClose(btn, ids) {
      let status = "CLOSE";
      // 不对关闭做控制 任何状态都允许关闭
      // 检查勾选项是否都是已发放状态
      let isAllow = this.multipleSelection.every(item => item.status === "ISSUED");
       if (isAllow) {
        this.handleStatus(status, ids.id)
       } else {
        this.$message({
          message: this.$t("TIPS_WARNING.CANNOT_BE_OPERATED"),
          type: "warning"
        });
      }
    },
    /**
     *  发放工单/暂停工单
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
    */
    statusChange (act, row) {
      let issuedFlag = row.issuedFlag;
      if(issuedFlag=="0"){
        // 启动订单
        this.handleIssued(act, row);
      }else if(issuedFlag=="1"){
        // 恢复订单
        this.handleUnIssued(act, row);
      }
    },
    /**
     * 发放工单
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
    */
    handleIssued (act, row) {
      let status = "ISSUED";
      this.handleStatus(status, row.id);
    },
    /**
     * 暂停工单
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
    */
    handleUnIssued (act, row) {
      let status = "UNISSUED";
      this.handleStatus(status, row.id);
    },
    /** 状态改变
     * 1.新建 -> SAVE       工单新建为 新建状态 SAVE  还未开工，可删除可修改（只有在新建状态可以修改）
     * 2.已发放 -> ISSUED   点提交后为 未发放状态 UNISSUED 不能删除，只能关闭
     * 3.未发放 -> UNISSUED 点发放后为 己发放状态 ISSUED 己发放与未发放可以切换
     * 4.完成 -> FINISHED   点完成后为 完成状态 FINISHED 生产完成，但仍可以工单发料和退料；可关闭
     * 5.关闭 -> CLOSE      点关闭后为 关闭状态 CLOSE 不在允许发料、退料和完工入库、完工退回等操作
     * 6.取消 -> CANCEL     点取消后为 取消状态 CANCEL 不允许发料、退料和完工入库、完工退回等操作
     * @param {String} status 状态
     * @param {Array} ids 勾选行 id 数组
     * @return void
     * 
     */
    handleStatus(status, ids) {
      SERVICES.PRODUCTION_WORK_ORDER.handleStatus(status, ids).then((res) => this.reRenderList());
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
            // 刷新数据
            this.mate.mateListLine.rows = data;
          }
        }
      })
    },
    /** 初始化行操作列按钮的状态
     * 只有加工单在生效状态操作行才渲染并且有上传图片按钮
     * enableEdit 是否允许编辑
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
        // 当状态不等于新建,不允许编辑修改
        if (item.status != "SAVE"){
          item.enableEdit = false;
        }
      })
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: PRODUCTION_MANAGEMENT_API.PRODUCTION_WORK_ORDER_MAIN_LIST });
    },
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
