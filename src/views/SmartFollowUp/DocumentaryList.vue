<!-- created by zhongxiaolong on 2019/08/15 -->
<!-- 跟单列表 DocumentaryList -->
<template>
  <div>
    <k-table-list
      :mate="mate"
      :mateSearch="mate.mateSearch"
      ref="listTable"
      :isIndex="isIndex"
      @btnClick="handleButtons"
      @uploadSuccess="uploadSuccess"
      @rowClick="getRowData"
      @initOperations="initOperations"
      @action="handleActions"></k-table-list>

    <!-- 暂停备注 -->
    <el-dialog
      title="请填写暂停原因"
      :visible.sync="rejectReasonDialogVisible"
      width="30%"
      :before-close="closeReasonDialog">
      <el-form
        v-if="reRenderReason"
        :rules="reasonRules"
        ref="ReasonForm"
        :model="reasonData">
        <el-form-item label="暂停备注" prop="reason">
          <el-input v-model="reasonData.reason"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="DialogClickOK()">{{$t("BUTTON_TEXT.CONFIRM")}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import KTableList from "@/components/table/KTableList";
import SERVICES from "@/services";
import { LANGS } from "@/i18n/lang";
import { SMART_ORDER_API } from "@/services/apis";

export default {
  components: {
    KTableList
  },
  props: {
    mate: Object
  },
  data() {
    return {
      isIndex: true, // table是否渲染序号
      title: "",
      pauseState: false,
      multipleSelection: [], // 多选
      rejectReasonDialogVisible: false, // 暂停原因弹窗显示与否
      reRenderReason: true, // 用于重新渲染暂停原因弹窗
      reasonData: {
        reason: ""
      },
      reasonRules: {
        reason: [
          { required: true, message: "该输入项为必输项", trigger: "blur" }
        ]
      },
      status: "",
      rowId: ""
    };
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init() {
      this.initOperations();
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @param {Array} selection 勾选行数据
     * @return void
     */
    handleButtons(btn, row, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const btnEvents = {
        // update: (btn, row) => this.updateOrder(btn, row), 
        delete: (btn, row) => this.deleteLine(btn, row),
        cancel: (btn, row) => this.cancelOrder(btn, row),
        transferOrder: (btn, row) => this.transferOrder(btn, row),
        default: () => {
          return;
        }
      };
      return (btnEvents[action] || btnEvents.default)(btn, row);
    },
    /**
     * actions 操作
     * 点击 action 根据按钮配置的 action 做对应操作
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    handleActions(act, row) {
      let action = act && act.action;
      const actions = {
        stateChange: (act, row) => this.statusChange(act, row), // 启动订单,暂停订单,恢复订单
        print: (act, row) => this.printOrder(act, row), // 打印
        default: () => {
          return;
        }
      };
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 请求当前操作行的查看详情中的列表行数据
     * 获取数据后渲染详情列表行
     * @param {Object} row 当前操作行的行数据
     * @param {Object} act 当前操作按钮的配置信息
     * @return void
     */
    getRowData(row, act) {
      SERVICES.DOCUMENTARY_LIST.getDetail(row.id).then(res => {
        let data = res.data;
        this.headFormData = data.smartOrder ? data.smartOrder : {};
        this.listLineData = data.taskList ? data.taskList : [];
        if (this.listLineData.length > 0) {
          this.$set(this.mate.mateList, "lineRows", this.listLineData);
        }
      });
    },
    /**
     *  启动订单,暂停订单,恢复订单
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    statusChange(act, row) {
      let pauseFlag = row.pauseFlag;
      if (pauseFlag == "0") {
        // 启动订单
        this.startOrder(act, row);
      } else if (pauseFlag == "1") {
        // 暂停订单
        this.pauseOrder(act, row);
      } else if (pauseFlag == "2") {
        // 恢复订单
        this.reSumeOrder(act, row);
      }
    },
    /**
     * 启动订单
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    startOrder(act, row) {
      let status = "STARTING";
      this.stateChange(status, row.id);
    },
    /**
     * 暂停订单
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    pauseOrder(act, row) {
      // 填暂停原因
      this.rowId = row.id;
      this.reasonDialogShow();
    },
    /**
     * 恢复订单
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    reSumeOrder(act, row) {
      let status = "RESUME";
      this.stateChange(status, row.id);
    },
    /**
     * 关闭暂停原因弹窗
     * 提示用户关闭确认
     * 清空暂停原因、重置表单验证
     * @param void
     * @return void
     */
    closeReasonDialog() {
      // 暂停原因
      let rejectReason = this.reasonData.reason;
      if (rejectReason) {
        this.$confirm(this.$t("TIPS_WARNING.UN_SAVE_TIPS"))
          .then(() => {
            this.reasonDialogHide();
            this.reRenderReasonDialog();
          })
          .catch(() => {});
      } else {
        this.reasonDialogHide();
        this.$refs.ReasonForm.resetFields();
      }
    },
    /**
     * 暂停原因弹窗显示
     * @param void
     * @return void
     */
    reasonDialogShow() {
      this.rejectReasonDialogVisible = true;
    },
    /**
     * 暂停原因弹窗关闭
     * @param void
     * @return void
     */
    reasonDialogHide() {
      this.rejectReasonDialogVisible = false;
    },
    /**
     * 暂停原因确认
     * 验证暂停原因必填 提交暂停原因 重置暂停原因弹窗
     * @param void
     * @return void
     */
    DialogClickOK() {
      let _this = this;
      let status = "PAUSE";
      this.$refs.ReasonForm.validate(valid => {
        if (valid) {
          // 暂停原因
          let rejectReason = this.reasonData.reason;
          const rowt = { id: this.multipleSelection.map(r => r.id) };
          this.stateChange(status, this.rowId, rejectReason);
          this.reasonDialogHide();
          this.reRenderReasonDialog();
        }
      });
    },
    /**
     * 重新渲染暂停原因弹窗
     * 清空暂停原因、重置表单验证
     * @param void
     * @return void
     */
    reRenderReasonDialog() {
      this.reasonData.reason = "";
      this.reRenderReason = false;
      this.$refs.ReasonForm.resetFields();
      this.$nextTick(() => {
        this.reRenderReason = true;
      });
    },
    /**
     * 打印订单
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    printOrder(act, row) {
      let gateway = this.BASEAPI;
      this.$http({
        url: `${gateway}${act.url}?format=pdf&ID=${row.id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
          Accept: "application/json",
          "X-TenantId": JSON.parse(window.sessionStorage.getItem("user"))
            .tenantId,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf8"
        },
        responseType: "arraybuffer"
      }).then(function(response) {
        // new Blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
        let blob = new Blob([response.data], { type: "application/pdf" });
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute("style", "display:none");
        a.setAttribute("href", objectUrl);
        let windowOpen = window.open(objectUrl);
        if (windowOpen == null || typeof windowOpen === "undefined") {
          this.$message({
            message: `${act.modular}预览界面被拦截,请检查浏览器设置`,
            type: "warning"
          });
        }
      });
    },
    /**
     * 修改订单
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    updateOrder(btn, row) {
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
      // 各模块不能修改的判断条件不一样 暂时不做公共方法
      // for (var i = 0; i < multipleSelection.length; i++) {
      //   if (multipleSelection[i].status !== "NOT_STARTED") {
      //     this.$message({
      //       message: this.$t("cannotChange"), // 不能修改
      //       type: "warning"
      //     });
      //     return;
      //   }
      // }
      // 修改逻辑 未完成可以修改 启动后任务行不允许修改
      // if(multipleSelection[0].status === "FINISHED"){
      //   this.$message({
      //     message: "订单已完成，不允许修改", // 不能修改
      //     type: "warning"
      //   });
      //   return;
      // }
      this.$root.handleAction(btn, rowt, function() {});
    },
    /**
     * 删除订单
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    deleteLine(btn, row) {
      let multipleSelection = this.multipleSelection;
      const rowt = row.id ? row : { id: this.multipleSelection.map(r => r.id) };
      // 检查勾选项是否都是未启动状态 才能删除
      let isAllow = multipleSelection.every(item => {
        return item.status === "NOT_STARTED";
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
            SERVICES.DOCUMENTARY_LIST.deleteOrder(rowt.id).then(() => {
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
     * 取消订单
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    cancelOrder(btn, row) {
      let status = btn.status;
      let multipleSelection = this.multipleSelection;
      const rowt = row.id ? row : { id: this.multipleSelection.map(r => r.id) };
      // 检查勾选项是否都是未启动和完成状态 才能取消
      let isAllow = multipleSelection.every(item => {
        return (
          item.status != "TRANSFER_ORDER" &&
          item.status != "FINISHED" &&
          item.status != "CANCEL"
        );
      });
      if (isAllow) {
        this.$confirm(
          this.$t("TIPS_WARNING.CANCEL_ORDER"),
          this.$t("TITLE_TEXT.TIPS"),
          {
            confirmButtonText: this.$t("BUTTON_TEXT.CONFIRM"), // 确认
            cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
            type: "warning"
          }
        )
          .then(() => {
            this.stateChange(status, rowt.id);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t("TIPS_WARNING.CANCEL_OPERATION") // 已取消操作
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: this.$t("TIPS_WARNING.CANNOT_BE_OPERATED") // 不能执行操作
        });
      }
    },
    /**
     * 转单
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    transferOrder(btn, row) {
      let status = btn.status;
      let multipleSelection = this.multipleSelection;
      const rowt = row.id ? row : { id: this.multipleSelection.map(r => r.id) };
      // 检查勾选项是否都是未启动和完成状态 才能取消
      let isAllow = multipleSelection.every(item => {
        return (
          item.status != "NOT_STARTED" &&
          item.status != "FINISHED" &&
          item.status != "CANCEL" &&
          item.status != "TRANSFER_ORDER"
        );
      });
      if (isAllow) {
        this.$confirm(
          // this.$t("TIPS_WARNING.IRREVERSIBLE_DELETION"),
          "此操作将永久转单, 是否继续?",
          this.$t("TITLE_TEXT.TIPS"),
          {
            confirmButtonText: this.$t("BUTTON_TEXT.CONFIRM"), // 确认
            cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
            type: "warning"
          }
        )
          .then(() => {
            this.stateChange(status, rowt.id);
          })
          .catch(() => {
            this.$message({
              type: "info",
              // message: this.$t("TIPS_WARNING.CANCEL_DELETION") // 已取消删除
              message: this.$t("已取消转单") // 已取消取消
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: this.$t("TIPS_WARNING.CANNOT_BE_OPERATED") // 不能执行操作
        });
      }
    },
    /**
     * 状态改变
     * 未启动:NOT_STARTED;
     * 进行中:STARTING;
     * 暂停:PAUSE;
     * 恢复:RESUME;
     * 完成:FINISHED;
     * 转单:TRANSFER_ORDER;
     * 取消:CANCEL
     * @param {String} state 状态
     * @param {String} id 选中行 id
     * @param {String} reason 暂停原因
     * @return void
     */
    stateChange(state, id, reason) {
      SERVICES.DOCUMENTARY_LIST.stateChange(state, id, reason).then(() => {
        this.reRenderList();
      });
    },
    /**
     * 上传成功
     *
     */
    uploadSuccess(data) {
      let msg = "导入成功";
      if (data && data.length) {
        msg = `成功导入“ ${data.length} ”条任务`;
      }
      this.reRenderList();
      this.$message({
        type: "success",
        message: msg
      });
    },
    /** 初始化行操作列按钮的状态配置启用按钮 disabled 的状态
     * ......可以对相关按钮进行初始化
     * enableEdit 是否启用编辑
     * 默认启用编辑 通做行状态再修改启用状态
     * @param void
     * @return void
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
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: SMART_ORDER_API.DOCUMENTDARYLIST_MAIN_LIST });
    }
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
};
</script>
