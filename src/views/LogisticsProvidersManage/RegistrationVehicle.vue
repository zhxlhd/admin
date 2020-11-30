<!-- created by yxj on 2019/12/03 -->
<!-- 物流供应商备案信息 下的车辆备案-->
<template>
  <div>
    <k-table-list :mate="mate" ref="listTable" :mateSearch="mate.mateSearch" :isIndex="isIndex" @rowClick="getRowData" @action="handleActions" @initOperations="initOperations" @btnClick="handleButtons"></k-table-list>
    <upload-dialog :uploadDialog="uploadDialog" :uploadParams="uploadAttachmentParams"  @closeDialog="closeDialog"></upload-dialog>
  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList'
import SERVICES from "@/services"
import uploadDialog from "@/components/upload/uploadDialog";

export default {
  components: { KTableList,uploadDialog },
  data(){
    return {
      isIndex: true,          // table是否渲染序号
      uploadDialog: false,    // 上传附件弹窗与否
      uploadAttachmentParams: { rowId:'', serviceModel:'LOGISTICS_BASE_DATA', getMethod:'getAttachMentListWithRegistrationVehicle', uploadMethod:'uploadAttachMent', deleteMethod:'deleteAttachMent', busType:'registration_vehicle' } // 上传附件属性配置
    }
  },
  props: {
    mate: Object
  },
  created (){
  },
  mounted (){
    this.initOperations();
  },
  methods: {
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
        uploadAttachment: () => this.showUploadAttachment(act, row), // 上传附件
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * showUploadAttachment 点击“上传附件”按钮 弹窗提交附件
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    showUploadAttachment(act, row) {
      this.uploadAttachmentParams.rowId = row.id;
      this.uploadDialog = true;
    },
    /**
     * enableOrInvalid 状态失效
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    enableOrInvalid(act, row) {
      let multipleSelection = this.multipleSelection;
      if (multipleSelection.length !== 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
            message: this.$t("seladata"), // 请选择一行数据
            type: "warning"
        });
        return;
      }else{
        if(multipleSelection[0].status == 0 || multipleSelection[0].status == null) {
          this.$message({
              message: '当前状态无效，不能失效',
              type: "warning"
          });
          return;
        }
        SERVICES.LOGISTICS_BASE_DATA.loseEffectWithVehicle(multipleSelection[0].id, multipleSelection[0].status).then(res => {
          if(res.status == 200) {
            this.$message({
                type: "success",
                message: '修改状态成功'
            });
            this.reRenderList();
          }else{
            this.$message({
                type: "warning",
                message: '修改状态失败'
            });
          }
        });
      }
    },
    /**
     * 请求当前操作行的查看详情中的列表行数据
     * 获取数据后渲染详情列表行
     * @param {Object} row 当前操作行的行数据
     * @param {Object} act 当前操作按钮的配置信息
     * @return void
     */
    getRowData(row, act) {
      this.$set(this.mate.mateList, "lineRows", []);
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$refs.listTable.$refs.multipleQueryForm.query();
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @param {Array} selection 勾选行数据
     * @return void
     */
    handleButtons (btn, row, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const btnEvents = {
        modify: (btn, row) => this.modify(btn, row),
        delete: (btn, row) => this.delete(btn, row),
        enableOrInvalid: () => this.enableOrInvalid(btn, row),       // 状态失效
        submitApproval: () => this.approval('1',['0','3'],'TIPS_WARNING.FAILURE_TO_SUBMIT_FRO_APPROVAL'),  // 提交审批（状态值：新建0,驳回3 可以提交审批）
        approval: () => this.approval('2',['1'],'TIPS_WARNING.FAILURE_TO_APPROVAL'),                   // 审批（状态值：待审批1 可以审批）
        reject: () => this.approval('3',['1'],'TIPS_WARNING.CANNOT_BE_REJECTED'),                      // 驳回（状态值：待审批1 可以驳回）
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, row);
    },
    /**
     * 审批\提交审批\驳回
     * @param {Object} type 按钮的审批类型，分为审批按钮、提交审批按钮、驳回按钮
     * @param {Array} status 允许审批的状态，待审批状态(status=0)、已驳回状态（status=2）的可以提交审批(type=1)；待审批状态(status=0)的可以审批(type=1)
     * @param {Object} tips 不符合操作的提示语
     * @return void
     */
    approval (type,approvalStatus,tips) {
      let multipleSelection = this.multipleSelection;
      if (multipleSelection.length !== 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
            message: this.$t("seladata"), // 请选择一行数据
            type: "warning"
        });
        return;
      }
      let ids = [];
      // 检查勾选项是否符合状态
      multipleSelection.forEach(item => {
        if(approvalStatus.includes(item.approvalStatus.toString())){
          ids.push(item.id);
        }
      });
      if(ids.length == multipleSelection.length) {
        SERVICES.LOGISTICS_BASE_DATA.approveWithVehicle(ids,type).then(res => {
          if(res.status == 200) {
            this.$message({
                type: "success",
                message: '提交操作成功'
            });
            this.reRenderList();
          }else{
            this.$message({
                type: "warning",
                message: '提交操作失败'
            });
          }
        });
      } else {
        this.$message({
            type: "warning",
            message: this.$t(tips) // 不能审批/提交审批
        });
      }
    },
    /**
     * 修改
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    modify(btn, row) {
      let multipleSelection = this.multipleSelection;
      if (multipleSelection.length !== 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
            message: this.$t("seladata"), // 请选择一行数据
            type: "warning"
        });
        return;
      }
      let rowt = row.id ? row : { id: multipleSelection.map(r => r.id) };
      this.$root.handleAction(btn, rowt, function() {});
    },
    /**
     * 删除
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    delete (btn, row) {
      let multipleSelection = this.multipleSelection;
      // ids 存放删除多行的id
      let ids = [];
      // 校验只能删除新增和驳回状态数据
      multipleSelection.forEach(item => {
        if(item.approvalStatus == '0' || item.approvalStatus == '3'){
          ids.push(item.id);
        }
      });
      if (ids.length == multipleSelection.length) {
        this.$confirm(
          this.$t("TIPS_WARNING.IRREVERSIBLE_DELETION"),
          this.$t("TITLE_TEXT.TIPS"),
          {
              confirmButtonText: this.$t("BUTTON_TEXT.CONFIRM"), // 确认
              cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
              type: "warning"
          }
        ).then(() => {
          SERVICES.LOGISTICS_BASE_DATA.deleteRegistrationVehicle(ids).then((res) => {
            if(res.status == 200) {
              this.$message({
                  type: "success",
                  message: this.$t("TIPS_WARNING.DELETE_SUCCESS")
              });
              this.reRenderList();
            }else{
              this.$message({
                  type: "warning",
                  message: this.$t("TIPS_WARNING.DELETE_FAIL")
              });
            }
          });
        }).catch(() => {
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
     * 关闭上传附件弹窗
     * @param void
     * @return void
     * ***/
    closeDialog (bool) {
      this.uploadDialog = false;
    },
    /** 初始化行操作列按钮的状态
     * 只允许修改录入状态和驳回状态的加工单
     * enableEdit 是否允许编辑
     * ......可以对相关按钮进行初始化
     * @param void
     * @return void
     */
    initOperations() {
      let rows = this.mate.mateList.rows;
      // 如果没有行返回
      if (!rows.length) {
        return
      }else {
        rows.forEach(item => {
          item.enableEdit = true;
        });
      }
      rows.forEach(item => {
        let status = item.approvalStatus;
        if(status !== 0 && status !== 3){
          item.enableEdit = false;
        }
      });
    },
}
}
</script>
