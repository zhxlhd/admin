<!-- created by yxj on 2020/01/09 -->
<!-- 合同模板起草 -->
<template>
  <div>
    <k-table-list ref="listTable"
                  :mate="mate"
                  :mateSearch="mate.mateSearch"
                  @rowClick="getRowData"
                  @action="handleActions"
                  @initOperations="initOperations"
                  @btnClick="handleButtons"></k-table-list>
    <upload-dialog :uploadDialog="uploadDialog" :uploadParams="uploadAttachmentParams"  @closeDialog="closeDialog"></upload-dialog>
  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList'
import SERVICES from "@/services"
import uploadDialog from "@/components/upload/uploadDialog";

export default {
  components: {
    KTableList, uploadDialog
  },
  data(){
    return {
      uploadDialog: false,    // 上传附件弹窗与否
      uploadAttachmentParams: { rowId:'', serviceModel:'CONTRACT_MANAGE', getMethod:'getAttachMentListWithContractTemplateDraft', uploadMethod:'uploadAttachMent', deleteMethod:'deleteAttachMent', busType:'contract_template_draft' } // 上传附件属性配置
    }
  },
  props: {
    mate: Object
  },
  mounted() {
    this.initOperations();
    this.getContractTypeList();
  },
  methods: {
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
        // 起草状态(approvalStatus=1)的可以提交审批(type=2)
        submitApprove: () => this.approval('2',['1','4'],'TIPS_WARNING.FAILURE_TO_SUBMIT_FRO_APPROVAL'),
        // 已审批状态(approvalStatus=3)的可以发布(type=5)
        publish: () => this.approval('5',['3'],'TIPS_WARNING.FAILURE_TO_PUBLISH'),
        // 待审批状态(status=2)的可以驳回(type=4)
        reject: () => this.approval('4',['2'],'TIPS_WARNING.CANNOT_BE_REJECTED'),
        delete: (btn, row) => this.delete(btn, row),
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, row);
    },
    /**
     * 删除物流线路定价
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    delete (btn, row) {
      let multipleSelection = this.multipleSelection;
      if(multipleSelection.length !== 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
            message: this.$t("seladata"), // 请选择一行数据
            type: "warning"
        });
        return;
      }
      // ids 存放删除多行的id
      let ids = [];
      // 检查勾选项是否都是1起草 才能取消 1起草
      multipleSelection.forEach(item => {
        if(item.approvalStatus == "1") {
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
          SERVICES.CONTRACT_MANAGE.deleteContractTemplate(ids).then((res) => {
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
     * 审批\提交审
     * @param {Object} type 按钮的审批类型，分为审批按钮、提交审批按钮
     * @param {Array} status 允许审批的状态，录入状态(status=1)、已驳回状态（status=4）的可以提交审批(type=2)；待审批状态(status=2)的可以审批(type=3)
     * @param {Object} tips 不符合操作的提示语
     * @return void
     */
    approval (type,status,tips) {
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
      multipleSelection.forEach(item => {
        if(status.includes(item.approvalStatus.toString())){
          ids.push(item.id);
        }
      });
      if(ids.length>0) {
        SERVICES.CONTRACT_MANAGE.approveWithContractTemplate({ businessId:ids[0], operationType:type, businessType:'contract_template' }).then(res => {
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
     * actions 操作
     * 点击 action 根据按钮配置的 action 做对应操作
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    handleActions (act, row) {
      let action = act && act.action;
      const actions = {
        uploadAttachment: () => this.showUploadAttachment(act, row), // 上传附件
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
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
        if(status !== '1' && status !== '4'){
          item.enableEdit = false;
        }
      });
    },
    /**
     * 关闭上传附件弹窗
     * @param void
     * @return void
     * ***/
    closeDialog (bool) {
      this.uploadDialog = false;
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
     * 获取合同类型
     * @param void
     * @return void
     */
    getContractTypeList() {
      SERVICES.CONTRACT_MANAGE.getContractTypeList().then(res => {
        if(res.data.length>0){
          let contractTypeOptions = [];
          let data = res.data;
          if(data.length){
              data.forEach(item => {
                contractTypeOptions.push({
                  label: item.contractTypeName,
                  value: item.id,
                  id: item.id
                });
              });
              // 合同类型保存到表单配置中
              // 物流商名称保存到表单配置中
              let mate = this.mate;
              mate.mateSearch.fields.map((item) => {
                if(item.name == 'contractTypeId') {
                  item.options = contractTypeOptions;
                }
              });
          }
        }
      });
    }
  },
  watch: {
    mate: function (newMate) {
      this.initOperations();
      this.getContractTypeList();
    }
  }
}
</script>
