
<!-- created by zhongxiaolong on 2020/04/14 -->
<!-- 交货单 SmartInvoice -->
<template>
  <div>
    <k-table-list ref="listTable" 
      :mate="mate" 
      :mateSearch="mate.mateSearch" 
      :isIndex="isIndex"
      :isIndexDialog="isIndexDialog"
      @initOperations="initOperations"
      @btnClick="handleButtons" 
      @rowClick="handleRowClick" 
      @action="handleActions" ></k-table-list>
    <!-- 底部 lineList Start -->
  </div>
</template>
<script>
import SERVICES from '@/services';
import { SMART_ORDER_API, BASE_API } from "@/services/apis";

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
      isIndexDialog: true,               // 详情 Dialog Table 是否渲染序号列
      lineTableFlag: false,              // 行Table 是否渲染
      rowStatus: null,                   // 列表订单行状态
      multipleSelection: [],             // 勾选项数组
    }
  },
  computed: {
		multipleSelectionLength: function () {
			return this.multipleSelection.length;
    }
  },
  created (){
    // this.init();
  },
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    init () {
      // this.lineTableFlag = false;
      this.mate.mateListLine.btns = [];
      this.mate.mateList.rowClick = true; // 允许单击列表行请求行数据
      this.initOperations();
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} rowId 勾选行 id数据  rowId.id
     * @param {Array} selection 勾选行数据
     * @return {Function} 执行操作的方法
     ** Author: zhongxiaolong
     */
    handleButtons (btn, rowId, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const rowIds = rowId.id ? rowId : { id: selection.map(r => r.id) };
      const btnEvents = {
        delete: (btn, rowIds) => this.handleDelete(btn, rowIds),             // 删除
        close: (btn, rowIds) => this.handleClose(btn, rowIds),               // 关闭
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
     ** Author: zhongxiaolong
     */
    handleActions (act, row) {
      let action = act && act.action;
      const actions = {
        print: (act, row) => this.handlePrint(act, row), // 打印
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 打印订单
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     ** Author: zhongxiaolong
     */
    handlePrint(act, row) {
      // 打印接口请求地址和传参
      let url = `${act.url}?format=pdf&ID=${row.id}`;
      SERVICES.BASE.handlePrinter(url).then(ren =>{}).catch(err =>{});
    },
    /** 修改按钮
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     ** Author: zhongxiaolong
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
     ** Author: zhongxiaolong
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
     ** Author: zhongxiaolong
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
     * @param {Object} ids 勾选行 id数据 ids.id
     * @return void
     ** Author: zhongxiaolong
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
     ** Author: zhongxiaolong
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
    /** 关闭按钮
     * 关闭后状态为关闭
     * 关闭 -> CLOSE
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     ** Author: zhongxiaolong
     */
    handleClose(btn, ids) {
      let status = "CLOSE";
      // 不对关闭做控制 任何状态都允许关闭
      // 检查勾选项是否都不是关闭状态
      let isAllow = this.multipleSelection.every(item => item.status != "CLOSE");
       if (isAllow) {
        this.handleStatus(status, ids.id)
       } else {
        this.$message({
          message: this.$t("TIPS_WARNING.CANNOT_BE_OPERATED"),
          type: "warning"
        });
      }
    },
    /** 状态改变
     * 新建 -> SAVE
     * 待审批 -> SUBMIT
     * 生效 -> PASS
     * 已驳回 -> REJECT
     * 关闭 -> CLOSE
     * @param {String} status 状态
     * @param {Array} ids 勾选行 id 数组
     * @param {String} text 驳回原因
     * @return void
     ** Author: zhongxiaolong
     * 
     */
    handleStatus(status, ids, text) {
      SERVICES.SMART_INVOICE.handleStatus(status, ids, text).then((res) => {
        if(!res.data.data){
          this.$message.error(res.data.message)
        }
        this.reRenderList()
      }).catch(res => {
        // TODO 数量不通过审批提示
      });
    },
    /**
     * 请求当前操作行的查看详情中的列表行数据
     * 获取数据后渲染详情列表行
     * @param {Object} row 当前操作行的行数据
     * @param {Object} act 按钮配置信息
     * @return void
     ** Author: zhongxiaolong
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
     ** Author: zhongxiaolong
     */
    getLines (id) {
      let url = this.mate.mateList.url;
      SERVICES.BASE.getLines(url, id).then(res =>{
        let data = res.data.lineList;
        if (data && data.length){
          this.$set(this.mate.mateList, "lineRows", data);
          if (this.mate.mateList.rowClick) {
            // 显示 行Table
            // this.lineTableFlag = true;
            // 刷新数据
            this.mate.mateListLine.rows = data;
          }
        }
      })
    },
    /** 初始化行操作列按钮的状态配置启用按钮 disabled 的状态
     * ......可以对相关按钮进行初始化
     * enableEdit 是否启用编辑
     * 默认启用编辑 通做行状态再修改启用状态
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    initOperations() {
      let rows = this.mate.mateList.rows;
      // 如果没有行返回
      if (!rows.length) {
        return
      }else {
        // 默认启用编辑/修改
        rows.forEach(item => {
          item.enableEdit = true;
        });
      }
      rows.forEach(item => {
        let status = item.status;
        // 当状态不是是新建和驳回的时候 不启用编辑/修改
        if(status !== "SAVE" && status !== "REJECT"){ 
          item.enableEdit = false;
        }
      });
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    reRenderList() {
      this.$root.monitor({ url: SMART_ORDER_API.SMART_INVOICE_MAIN_LIST });
    },
  },
  watch: {
    // mate: function (newMate) {
    //   this.init();
    // },
    mate: {
      handler(newMate, oldMate) {
      　 this.init();
  　　},
  　　immediate: true
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
