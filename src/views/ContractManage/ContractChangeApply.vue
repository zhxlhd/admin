<!-- created by hezhiqiang on 2020/1/14-->
<!-- 合同变更申请 -->
<template>
  <div>
    <!--table Start -->
    <KTableList
      :mate="mate"
      :mateSearch="mate.mateSearch"
      ref="listTable"
      @btnClick="handleButtons"
      @action="handleActions"
    />
    <!--table End -->
    <!-- attachment Start -->
    <upload-dialog
      :uploadDialog="uploadDialog"
      :uploadParams="uploadAttachmentParams" 
      @closeDialog="closeDialog"
    />
    <!-- attachment End -->
  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList'
import uploadDialog from "@/components/upload/uploadDialog";
import SERVICES from '@/services'
import { CONTRACT_MANAGE_API } from "@/services/apis"

export default {
  components: {
    KTableList,
    uploadDialog
  },
  data(){
    return {
      multipleSelection: [],      // 多选
      uploadDialog: false,        // 上传附件弹窗与否
      uploadAttachmentParams: {   // 上传附件属性配置
        rowId:'',
        serviceModel:'CONTRACT_MANAGE',
        getMethod:'getContractChangeAttachMentList',
        uploadMethod:'uploadAttachMent',
        deleteMethod:'deleteAttachMent',
        busType:'contract_change'
      }
    }
  },
  props: {
    mate: Object
  },
  created (){
  },
  mounted (){
    // 获取合同类型
    this.getContractTypeList();
  },
  watch: {
    mate: function (newMate) {
      this.getContractTypeList();
    }
  },
  methods: {
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
        modify: (btn, row) => this.modify(btn, row),       // 修改
        delete: (btn, row) => this.delete(btn, row),       // 删除
        submitApprove: (btn, row) => this.submitApprove(btn, row),       // 提交审批
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, row);
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
        uploadAttachment: () => this.uploadAttachment(act, row),   // 上传附件
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 修改
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据 row.id
     * @return void
     */
    modify (btn, row) {
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
      if (multipleSelection[0].changeStatus !== 0) {
        this.$message({
          type: 'warning',
          message: '该状态不允许修改'
        });
        return;
      }
      this.$root.handleAction(btn, rowt, function() {});
    },
    /**
     * 删除
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据 row.id
     * @return void
     */
    delete (btn, row) {
      let multipleSelection = this.multipleSelection;
      // ids 存放删除多行的id
      let ids = [];
      multipleSelection.forEach(item => {
        // 检查勾选项是否可以删除
        if (item.changeStatus === 0) {
          ids.push(item.id)
        }
        return
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
          SERVICES.CONTRACT_MANAGE.deleteContractChange(ids).then((res) => {
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
     * 提交审批
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据 row.id
     * @return void
     */
    submitApprove (btn, row) {
      let multipleSelection = this.multipleSelection;
      if (multipleSelection.length !== 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t("seladata"), // 请选择一行数据
          type: "warning"
        });
        return;
      }
      if (multipleSelection[0].changeStatus !== 0) {
        this.$message({
          type: 'warning',
          message: '该状态不允许提交审批'
        });
        return;
      }
      SERVICES.CONTRACT_MANAGE.submitApproval(multipleSelection[0].id).then((res) => {
        if (res.data.statusCode === 200) {
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          this.reRenderList();
        }
      })
    },
    /**
     * 上传附件
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    uploadAttachment(act, row) {
      this.uploadAttachmentParams.rowId = row.id
      this.uploadDialog = true;
    },
    /**
     * 关闭上传附件弹窗
     * @param void
     * @return void
     */
    closeDialog (bool) {
      this.uploadDialog = false;
      this.reRenderList();
    },
    /**
     * checkbox 勾选计算 拿到勾选的数据
     * @return void
     */
    handleSelected(val) {
      this.selectedLines = val
    },
    /**
     * checkbox 全选 拿到勾选的数据
     * @return void
     */
    handleSelectedAll(val) {
      this.selectedLines = val
    },
    /**
   * 获取合同类型下拉列表
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
          this.mate.mateSearch.fields.map((item) => {
            if(item.name == 'contractTypeId') {
              item.options = contractTypeOptions;
            }
          });
        }
      }
    });
  },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: CONTRACT_MANAGE_API.CONTRACT_CHANGE_APPLY_LIST });
    },
  }
}
</script>
