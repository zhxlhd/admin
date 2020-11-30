<template>
  <div>
    <k-table-list ref="listTable" 
      :mate="mate" 
      :mateSearch="mate.mateSearch" 
      :isIndex="isIndex" 
      @btnClick="handleButtons" 
      @rowClick="handleRowClick" 
      @action="handleActions"></k-table-list>
  </div>
</template>

<script>
import { BASE_API } from "@/services/apis"
import ProductionMixins from "./mixins/productionMixins"
import QueryMixins from '@/mixins/QueryMixins'
import KTableList from '@/components/table/KTableList'
import SERVICES from '@/services'

export default {
  mixins: [ProductionMixins, QueryMixins],
  components: {
    KTableList
  },
  props: {
    mate: Object
  },
  data() {
    return {
      isIndex: false,        // Table 是否渲染序号列
      page: 1,               // 默认显示第1页
      pageSize: 10,          // 默认10条/页
      multipleSelection: [], // 点击table前面的框框，获取到的内容
      hasSelected: false,
      showOverflow: true,
      sortValues: {},
      action: null,
      object: {},            // 放columns
      dialogVisible: false,
      rowsContent: [],       // 获取到明细行中的数据
      formorHeaderId: "",
      selectedLines: [],
      msgBoxButton: true,
      sysUser: {},
      queryObject:{ // 本地配置查询配置
        multipleConditions: true, // 是否多条件查询
        fields: [
          {holder: "text", name: "ecnCode", label: "ECN单号", lg: 4, md: 6, placeholder: "ECN单号", sm: 8},
          {holder: "text", name: "materialsCode", label: "物料编码", lg: 4, md: 6, placeholder: "产品料号", sm: 8},
          {holder: "text", name: "version", label: "版本", lg: 4, md: 6, placeholder: "版本号", sm: 8},
          {holder: "select", name: "statusStr", label: "状态", lg: 4, md: 6,placeholder: "请选择状态",sm: 8,options:[]},
          {holder: "datePicker", name: "fromDateStr", label: "生效日期从", lg: 4, md: 6, placeholder: "生效日期从", sm: 8},
          {holder: "datePicker", name: "toDateStr", label: "生效日期至", lg: 4, md: 6, placeholder: "生效日期至", sm: 8}
        ],
        values:{
          ecnCode: "",       // Ecn编号
          materialsCode: "", // 物料编码
          version: "",       // 版本
          statusStr: "",     // 状态
          fromDateStr: "",   // 开始日期
          toDateStr: ""      // 结束日期
        }
      }
    };
  },
  computed: {
		multipleSelectionLength: function () {
			return this.multipleSelection.length;
    }
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init () {
      // this.initOperations();
    },
    /**
     * 关闭详情弹窗
     */
    closeDialog (bool) {
      this.dialogVisible = false;
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
        editEcn: (btn, rowIds) => this.editEcn(btn, rowIds),                 // 编辑/修改
        submitApproval: (btn, rowIds) => this.submitApproval(btn, rowIds),   // 提交审批
        approval: (btn, rowIds) => this.approval(btn, rowIds),               // 审批
        rejectApproval: (btn, rowIds) => this.rejectApproval(btn, rowIds),   // 驳回
        implement: (btn, rowIds) => this.implementEcn(btn, rowIds),          // 实施
        deleteEcn: (btn, rowIds) => this.delEcn(btn, rowIds),                // 删除
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
    /**
     * 新增Ecn 新增Ecn
     * @param {Object} btn 按钮信息
     * @param {Object} row 行信息
     * @return void
     */
    addEcn(btn, row) {
      this.$root.handleAction(btn, row, () => {
        this.getData();
      });
    },
    stateChange(state, id) {
      let _this = this;
      SERVICES.ECN.stateChange(state, id).then(res => {
        this.reRenderList();
      });
    },
    /**
     * 提交审批
     * @param {Object} btn 按钮信息
     * @param {Object} row 行信息
     * @return void
     */
    submitApproval(btn, row) {
      let status = "SUBMIT";
      let multipleSelection = this.multipleSelection;
      const rowt = row.id ? row : { id: multipleSelection.map(r => r.id) };

      // 检查勾选项是否都是新增和驳回状态
      let isAllow = multipleSelection.every(
        item => item.status === "SAVE" || item.status === "REJECT"
      );
      if (isAllow) {
        this.stateChange(status, rowt.id);
      } else {
        this.$message({
          message: this.$t("TIPS_WARNING.FAILURE_TO_SUBMIT_FRO_APPROVAL"),
          type: "warning"
        });
      }
    },
    /**
     * Ecn审批 审批已提交审批的Ecn
     * @param {Object} btn 按钮信息
     * @param {Object} row 行信息
     * @return void
     */
    approval(btn, row) {
      let _this = this;
      let status = "PASS";
      let multipleSelection = this.multipleSelection;
      const rowt = row.id ? row : { id: multipleSelection.map(r => r.id) };
      btn.status = status;

      // 检查勾选项是否都是待审批状态
      let isAllow = multipleSelection.every(item => item.status === "SUBMIT");
      if (isAllow) {
        this.stateChange(status, rowt.id);
      } else {
        this.$message({
          message: this.$t("TIPS_WARNING.FAILURE_TO_APPROVAL"),
          type: "warning"
        });
      }
    },
    /**
     * 驳回审批
     * @param {Object} btn 按钮信息
     * @param {Object} row 行信息
     * @return void
     */
    rejectApproval(btn, row) {
      const _this = this;
      let status = "REJECT"; // TODO status公共化
      let multipleSelection = this.multipleSelection;
      const rowt = row.id ? row : { id: multipleSelection.map(r => r.id) };

      // 检查勾选项是否都是待审批状态
      let isAllow = multipleSelection.every(item => item.status === "SUBMIT"); // TODO status公共化
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
          SERVICES.ECN.stateChange(status, rowt.id, value).then(() => this.reRenderList());// TODO 请求公共化
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('TIPS_WARNING.CANCEL_OPERATION')
          });
        });
      } else {
        this.$message({
          message: this.$t("TIPS_WARNING.CANNOT_BE_REJECTED"),
          type: "warning"
        });
      }
    },
    /**
     * 编辑Ecn
     * 新建Ecn和驳回状态Ecn可以修改  （状态：提交，驳回）
     * 已提交审批和已审批Ecn不能修改 （状态：提交审批，审批）
     * @param {Object} btn 按钮信息
     * @param {Object} row 行信息
     * @return void
     */
    editEcn(btn, row) {
      let multipleSelection = this.multipleSelection;
      let rowt = row.id ? row : { id: multipleSelection.map(r => r.id) };
      if (multipleSelection.length !== 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t("seladata"), // 请选择一行数据
          type: "warning"
        });
        return;
      }
      for (var i = 0; i < multipleSelection.length; i++) {
        if (multipleSelection[i].status === "PASS") {
          this.$message({
            message: this.$t("alreadyAgree"), // 已审批，不能修改
            type: "warning"
          });
          return;
        }
        if (
          multipleSelection[i].status === "SUBMIT" ||
          multipleSelection[i].status === "PASS" ||
          multipleSelection[i].status === "DEPLOY"
        ) {
          this.$message({
            message: this.$t("cannotChange"), // 不能修改
            type: "warning"
          });
          return;
        }
      }
      this.$root.handleAction(btn, rowt, function() {});
    },
    /**
     * 删除Ecn
     * @param {Object} btn 按钮信息
     * @param {Object} row 行信息
     * @return void
     */
    delEcn(btn, row) {
      let _this = this;
      let multipleSelection = this.multipleSelection;
      const rowt = { id: this.multipleSelection.map(r => r.id) };

      // 检查勾选项是否都是新增和驳回状态 才能删除
      let isAllow = multipleSelection.every(item => {
        return item.status === "SAVE" || item.status === "REJECT";
      });
      if (isAllow) {
        this.$confirm(
          this.$t("TIPS_WARNING.IRREVERSIBLE_DELETION"),
          this.$t("TITLE_TEXT.TIPS"),
          {
            confirmButtonText: this.$t("BUTTON_TEXT.CONFIRM"), // 确认
            cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
            type: "warning"
          }
        )
          .then(() => {
            SERVICES.ECN.deleteEcn(rowt.id).then(() => {
              this.reRenderList();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t("TIPS_WARNING.CANCEL_DELETION") // 已取消删除
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: this.$t("TIPS_WARNING.CANNOT_BE_DELETED") // 不能删除
        });
      }
    },
    /**
     * 实施Ecn
     * @param {Object} btn 按钮信息
     * @param {Object} row 行信息
     * @return void
     */
    implementEcn(btn, row) {
      let status = "DEPLOY";
      let multipleSelection = this.multipleSelection;

      const rowt = { id: this.multipleSelection.map(r => r.id) };

      // 检查勾选项是否都是新增和驳回状态 才能删除
      let isAllow = multipleSelection.every(item => {
        return item.status === "PASS";
      });
      if (isAllow) {
        SERVICES.ECN.stateChange(status, rowt.id).then(() => {
          this.reRenderList();
        });
      } else {
        this.$message({
          type: "warning",
          message: "只能对已审批状态进行实施"
        });
      }
    },
    handleAction(act, row) {
      var vm = this;
      this.$root.handleAction(act, row, function() {
        vm.getData();
      });
    },
    /**
     * 重新跳转到列表页
     */
    reRenderList() {
      this.$root.monitor({ url: BASE_API.ECN_LIST });
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
      this.getLines(row, act);
    },
    /**
     * 点击行请求行数据
     * @param {Object} row 行信息
     * @param {Object} act 按钮信息
     * @return void
     */
    getLines(row, act) {
      // 请求行数据
      var _this = this;
      this.formorHeaderId = row.id; // 当前行 ecn id
      SERVICES.ECN.getEcnDetail(row.id).then(res => {
        let ecnLineList = res.data.ecnLineList || [];
        if (!ecnLineList.length > 0) return;
        ecnLineList.forEach(item => {
          item.checkState = item.deployFlag === 1 ? true : false;
        });
        row.orgName = res.data.ecnHeader.orgName;
        _this.$set(_this.mate.mateList, "lineRows", ecnLineList);
        // _this.mate.mateList.lineRows = ecnLineList;
      });
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
    }
  },
  watch: {
    mate: function(newMate) {
      this.init();
    }
  }
};
</script>

<style scoped>
.el-form-item {
  margin: 0px 20px 2px 0px;
}
.el-select,.date-picker {
  width: 100%;
}
</style>
