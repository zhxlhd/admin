<!-- created by hezhiqiang on 2020/1/6-->
<!-- 提货人管理列表 -->
<template>
  <div>
    <!--table Start -->
    <KTableList
      :mate="mate"
      :mateSearch="mate.mateSearch"
      ref="listTable"
      :isIndex="isIndex"
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
    <!-- logisticsRecordsDialog Start -->
    <el-dialog title="选择物流商备案" width="80%" :visible.sync="dialogVisible">
      <div style="margin-bottom: 10px;">
        <el-button size="mini" @click="submitSelect()">确定</el-button>
      </div>
      <!-- 表格 -->
      <el-table size="mini" :data="tableData" border @select="handleSelected" @select-all="handleSelectedAll">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="registrationCode" label="备案编号"></el-table-column>
        <el-table-column prop="customerName" label="客户名称"></el-table-column>
        <el-table-column prop="isSelfMention" label="是否自提">
          <template slot-scope="scope">
            <span v-if="scope.row.isSelfMention == 0">否</span>
            <span v-if="scope.row.isSelfMention == 1">是</span>
          </template>
        </el-table-column>
        <el-table-column prop="validityStart" label="备案开始时间"></el-table-column>
        <el-table-column prop="validityEnd" label="备案结束时间"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">无效</span>
            <span v-if="scope.row.status == 1">有效</span>
          </template>
        </el-table-column>
        <el-table-column prop="registrationName" label="备案人"></el-table-column>
        <el-table-column prop="updateAt" label="操作日期"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- logisticsRecordsDialog End -->
  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList'
import uploadDialog from "@/components/upload/uploadDialog";
import SERVICES from '@/services'
import { LOGISTICS_ORDER_API } from "@/services/apis"

export default {
  components: {
    KTableList,
    uploadDialog
  },
  data(){
    return {
      isIndex: true,              // table是否渲染序号
      multipleSelection: [],      // 多选
      dialogVisible: false,       // 物流商备案弹框显示
      tableData: [],              // 弹出框列表数据
      selectedLines: [],          // 勾选行
      uploadDialog: false,        // 上传附件弹窗与否
      uploadAttachmentParams: {   // 上传附件属性配置
        rowId:'',
        serviceModel:'CONSIGNEE_MANAGEMENT',
        getMethod:'getAttachMentList',
        uploadMethod:'attachMentUpload',
        deleteMethod:'deleteAttachMent',
        busType:'logistics_consignee'
      }
    }
  },
  props: {
    mate: Object
  },
  created (){
  },
  mounted (){
  },
  watch: {
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
        delete: (btn, row) => this.delete(btn, row),       // 删除
        sendRecords: (btn, row) => this.sendRecords(btn, row),   // 发送备案
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
        uploadAttachment: () => this.uploadAttachment(act, row),
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
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
      multipleSelection.forEach(item => {ids.push(item.id)});
      if (ids.length > 0) {
        this.$confirm(
          this.$t("TIPS_WARNING.IRREVERSIBLE_DELETION"),
          this.$t("TITLE_TEXT.TIPS"),
          {
            confirmButtonText: this.$t("BUTTON_TEXT.CONFIRM"), // 确认
            cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
            type: "warning"
          }
        ).then(() => {
            SERVICES.CONSIGNEE_MANAGEMENT.deleteConsigneeInfo(ids).then((res) => {
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
     * 发送备案
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据 row.id
     * @return void
     */
    sendRecords (btn, row) {
      let multipleSelection = this.multipleSelection;
      const listStatus = multipleSelection.map((r) => r.state)
      var isSend = false
      for(let i = 0; i < listStatus.length; i++) {
        let listState = listStatus[i]
        if (listState === '0') {
          isSend = true
        }
      }
      if (isSend === true) {
        this.$message({
          message: '状态为无效的数据不允许发送备案',
          type: 'warning'
        })
        return;
      } else {
        // 获取物流商备案弹数据
        SERVICES.CONSIGNEE_MANAGEMENT.getLogisticsRecordList().then(res => {
          if (res.status == 200) {
            this.dialogVisible = true
            this.tableData = res.data.list
          }
        })
      }
    },
    /**
     * actions 操作
     * 点击 action 根据按钮配置的 action 做对应操作
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
     * 物流商备案弹框 确认
     * @param void
     * @return void
     */
    submitSelect () {
       if (this.selectedLines.length !== 1) {
        this.$message({
          message: this.$t("seladata"),
          type: "warning"
        });
        return;
      }
      const param = {
        'consigneeList' : this.multipleSelection,
        'registrationId' : this.selectedLines[0].id
      }
      SERVICES.CONSIGNEE_MANAGEMENT.createConsigneeRecords(param).then(res => {
        if (res.data.statusCode == 200) {
          this.$message({
            message: '备案成功',
            type: 'success'
          })
          this.dialogVisible = false
          this.reRenderList();
        }
      })
     },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: LOGISTICS_ORDER_API.CONSIGNEE_MANAGEMENT_LIST });
    },
  }
}
</script>
