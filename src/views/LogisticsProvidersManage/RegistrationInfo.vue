<!-- created by yxj on 2019/11/28 -->
<!-- 物流供应商备案信息 -->
<template>
  <div>
    <k-table-list :mate="mate" ref="listTable" :mateSearch="mate.mateSearch" :isIndex="isIndex" @rowClick="getRowData" @action="handleActions" @btnClick="handleButtons"></k-table-list>
    <upload-dialog :uploadDialog="uploadDialog" :uploadParams="uploadAttachmentParams"  @closeDialog="closeDialog"></upload-dialog>
  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList'
import { BE_ENTRUST_PROCESSING_API,BASE_API } from "@/services/apis"
import SERVICES from "@/services"
import uploadDialog from "@/components/upload/uploadDialog";
import TYPES from '@/store/mutations-types'
export default {
  components: { KTableList,uploadDialog },
  data(){
    return {
      isIndex: true,          // table是否渲染序号
      uploadDialog: false,    // 上传附件弹窗与否
      uploadAttachmentParams: { rowId:'', serviceModel:'LOGISTICS_BASE_DATA', getMethod:'getAttachMentListWithRegistration', uploadMethod:'uploadAttachMent', deleteMethod:'deleteAttachMent', busType:'registration' } // 上传附件属性配置
    }
  },
  props: {
    mate: Object
  },
  created (){
  },
  mounted (){
    this.getLogisticsProvidersList();
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
        delete: (btn, row) => this.delete(btn, row),
        update: (btn, row) => this.update(btn, row),
        consignee: (btn, row) => this.newTab(btn, row),   // 提货人备案
        vehicle: (btn, row) => this.newTab(btn, row),     // 车辆备案
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, row);
    },
    /**
     * 修改
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    update (btn, row) {
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
      multipleSelection.forEach(item => { ids.push(item.id) });
      if (ids.length >0 ) {
          this.$confirm(
              this.$t("TIPS_WARNING.IRREVERSIBLE_DELETION"),
              this.$t("TITLE_TEXT.TIPS"),
              {
                confirmButtonText: this.$t("BUTTON_TEXT.CONFIRM"), // 确认
                cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
                type: "warning"
              }
          ).then(() => {
            SERVICES.LOGISTICS_BASE_DATA.deleteRegistrationInfo(ids).then((res) => {
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
    /*
     * 提货人备案/车辆备案 统一共用方法 新增一个新的tab
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
    */
    newTab(btn, row) {
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
      this.$store.dispatch('RegistrationInfo/setRegistrationId',rowt.id.toString());
      this.$root.monitor({ url: '/purchase/registration/' + btn.action + '/to-list?registrationId=' + rowt.id })
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
     * 获取物流商名称列表
     * @param void
     * @return void
     */
    getLogisticsProvidersList() {
      SERVICES.LOGISTICS_BASE_DATA.getLogisticsProvidersList().then(res => {
        if(res.data.length>0){
          let logisticsProviderIdOptions = [];
          let data = res.data;
          if(data.length){
              data.forEach(item => {
                logisticsProviderIdOptions.push({
                    label: item.providerName,
                    value: item.id,
                    id: item.id
                });
              });
              // 物流商名称保存到表单配置中
              let mate = this.mate;
              mate.mateSearch.fields.map((item) => {
                if(item.name == 'logisticsProviderId') {
                    item.options = logisticsProviderIdOptions;
                }
              });
          }
        }
      });
    }
  }
}
</script>
