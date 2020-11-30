<!-- created by zhongxiaolong on 2019/11/12 -->
<!-- 生产计划 ProductionPlan -->
<template>
  <div>
    <k-table-list ref="listTable" 
      :mate="mate" 
      :mateSearch="mate.mateSearch" 
      :isIndex="isIndex"  
      @initOperations="initOperations"
      @btnClick="handleButtons" 
      @rowClick="handleRowClick" 
      @action="handleActions"></k-table-list>
  </div>
</template>
<script>
import SERVICES from '@/services';
import { PRODUCTION_MANAGEMENT_API } from "@/services/apis";

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
      isIndex: false,                    // Table 是否渲染序号列
      rowStatus: null,                   // 列表订单行状态
      multipleSelection: [],             // 勾选项数组
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
      this.multipleSelection = selection;
      let action = btn.action;
      const rowIds = rowId.id ? rowId : { id: selection.map(r => r.id) };
      const btnEvents = {
        update: (btn, rowIds) => this.handleUpdate(btn, rowIds),             // 编辑/修改
        delete: (btn, rowIds) => this.handleDelete(btn, rowIds),             // 删除
        submitApproval: (btn, rowIds) => this.submitApproval(btn, rowIds),   // 提交审批
        approval: (btn, rowIds) => this.approval(btn, rowIds),               // 审批
        rejectApproval: (btn, rowIds) => this.rejectApproval(btn, rowIds),   // 驳回
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
    /** 修改按钮
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    handleUpdate(btn, ids) {
      let status = this.multipleSelection[0].status;
      if (this.multipleSelectionLength != 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t("seladata"), // 请选择一行数据
          type: "warning"
        });
        return;
      }
      // 各模块不能修改的判断条件不一样 暂时不做公共方法
      // 允许修改逻辑
      if(status !== "SAVE" && status !== "REJECT"){
        this.$message({
          message: "只允许修改录入状态和驳回状态的加工单", // 不能修改
          type: "warning"
        });
        return;
      }
      this.$root.handleAction(btn, ids, function() {});
    },
    /** 删除按钮
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    handleDelete(btn, ids) {
      // 检查勾选项是否都是未启动状态 才能删除
      let isAllow = this.multipleSelection.every(item => {
        return (item.status === "SAVE") || (item.status === "REJECT");
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
    /** 提交审批按钮
     * 提交审批后状态为待审批
     * 待审批 -> SUBMIT
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    submitApproval(btn, ids) {
      let status = "SUBMIT";
      // 检查勾选项是否都是新增和驳回状态
      let isAllow = this.multipleSelection.every(item => item.status === "SAVE" || item.status === "REJECT");
      if (isAllow) {
        this.handleStatus(status, ids.id);
      } else {
        this.$message({
          message: this.$t("TIPS_WARNING.CANNOT_BE_OPERATED"),
          type: "warning"
        });
      }
    },
    /** 审批/批准按钮
     * 审批后状态为生效
     * 生效 -> PASS
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    approval(btn, ids) {
      let status = "PASS";
      // 检查勾选项是否都是待审批状态
      let isAllow = this.multipleSelection.every(item => item.status === "SUBMIT");
      if (isAllow) {
        this.handleStatus(status, ids.id)
      } else {
        this.$message({
          message: this.$t("TIPS_WARNING.CANNOT_BE_OPERATED"),
          type: "warning"
        });
      }
    },
    /** 驳回按钮
     * 驳回后状态为已驳回
     * 已驳回 -> REJECT
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    rejectApproval(btn, ids) {
      const _this = this;
      let status = "REJECT"; // TODO status公共化
      // 检查勾选项是否都是待审批状态
      let isAllow = this.multipleSelection.every(item => item.status === "SUBMIT"); // TODO status公共化
      if (isAllow) {
        this.$prompt(this.$t('LABEL_TEXT.REASONS_FOR_REJECTION'), this.$t('TITLE_TEXT.PLEASE_ENTER'), {
          confirmButtonText: this.$t('BUTTON_TEXT.OK'),
          cancelButtonText: this.$t('BUTTON_TEXT.CANCEL'),
          inputValidator(val){ // 输入项验证规则
            const value = val;
            if(value === null || !value.trim()){
              return _this.$t('FORM_VALIDATION_INFO.IS_REQUIRED')
            }else if(value.trim().length > 50){
              return _this.$t('FORM_VALIDATION_INFO.INPUT_LIMIT_50')
            }
          }
        }).then(({ value }) => {
          // 请求驳回
          this.handleStatus(status, ids.id, value); // TODO 请求公共化
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('TIPS_WARNING.CANCEL_OPERATION')
          });
        });
      } else {
        this.$message({
          message: this.$t("TIPS_WARNING.CANNOT_BE_OPERATED"),
          type: "warning"
        });
      }
    },
    /** 状态改变
     * 新建 -> SAVE
     * 待审批 -> PENDING
     * 生效 -> PASS
     * 已驳回 -> REJECT
     * 关闭 -> CLOSE
     * @param {String} status 状态
     * @param {Array} ids 勾选行 id 数组
     * @param {String} text 驳回原因
     * @return void
     * 
     */
    handleStatus(status, ids, text) {
      SERVICES.PRODUCTION_PLAN.handleStatus(status, ids, text).then((res) => this.reRenderList());
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
        // 当状态不等于新建和驳回,不允许编辑修改
        if (item.status != "SAVE" && item.status != "REJECT"){
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
      this.$root.monitor({ url: PRODUCTION_MANAGEMENT_API.PRODUCTION_PLAN_MAIN_LIST });
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
.my-form-item { 
  position: relative 
}
.my-form-item span.span-length { 
  position: absolute;
  right: 10px;
  bottom: -5px;
  color: #BEBEBE;
  font-size: 12px;
}
</style>
